import axios, { AxiosResponse } from 'axios';
import { Server, Socket } from 'socket.io';
import {
  findLargestDouble,
  generateBoneyard,
  generateRandomCharacters,
} from '../utils';
import { encrypt } from '../utils/encrypt';
import GameModel from '../models/Game.model';
import { numberPair, TileClassSpec } from '../types';

const SocketController = {
  createGame: async (socket: Socket, io: Server, token?: string) => {
    try {
      // console.log('called');
      const gameId = generateRandomCharacters();

      const res = await axios
        .post(
          `${process.env.BASE_URL}/api/game/create`,
          { gameId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch((err) => socket.emit('createGameError', err));
      if (typeof res === 'boolean') {
        return;
      }

      // console.log(socket.rooms, '1000');
      await socket.join(gameId);
      // console.log(socket.rooms, '20001');
      socket.emit('gameCreated', { gameId });
      io.emit('newGameCreated', { game: res.data.data });
      return true;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },

  startGame: async (socket: Socket, gameId: string, playerId: number) => {
    try {
      console.log('called');
      const game = await GameModel.findOne({ gameId });
      let boneyard = generateBoneyard();
      const encryptedBoneyard = encrypt(JSON.stringify(boneyard));
      const player1Choices: number[] = [];
      const player2Choices: number[] = [];
      while (player1Choices.length < 7 || player2Choices.length < 7) {
        const random = Math.floor(Math.random() * 28);
        if (
          player1Choices.length < 7 &&
          !player2Choices.includes(random) &&
          !player1Choices.includes(random)
        ) {
          player1Choices.push(random);
        } else if (
          player2Choices.length < 7 &&
          !player1Choices.includes(random) &&
          !player2Choices.includes(random)
        ) {
          player2Choices.push(random);
        }
      }
      const max1 = findLargestDouble(player1Choices.map((i) => boneyard[i]));
      const max2 = findLargestDouble(player2Choices.map((i) => boneyard[i]));
      let turn =
        max1 < 0 && max2 < 0 ? -1 : max1 > max2 ? 0 : max2 > max1 ? 1 : -1;
      console.log({ turn, max1, max2 });

      setTimeout(() => {
        // Emit to the current player
        socket.emit('boneyard', {
          encryptedBoneyard: boneyard,
          choices:
            playerId === 0
              ? player1Choices
              : playerId === 1
              ? player2Choices
              : null,
          isTurn: turn === playerId, // Check if it's the current player's turn
        });

        // Broadcast to the other player
        socket.broadcast.emit('boneyard', {
          encryptedBoneyard: boneyard,
          choices:
            playerId === 0
              ? player2Choices
              : playerId === 1
              ? player1Choices
              : null,
          isTurn: turn !== playerId && turn !== -1, // It's the other player's turn if turn !== -1
        });
      }, 500);

      if (game) {
        game.gameData = { ...game.gameData, boneyard };
        game.turn = turn === 0 ? 0 : 1;
        await game.save();
      }
      return true;
    } catch (err: any) {
      // console.log(err);
      throw new Error(err.message);
    }
  },

  tilePlayed: async (
    socket: Socket,
    gameId: string,
    playerId: number,
    droppedTile: TileClassSpec,
    triggeredTile: TileClassSpec
  ) => {
    try {
      console.log('called', droppedTile);
      const game = await GameModel.findOne({ gameId });
      if (!game) {
        return socket.emit('tileError');
      }

      const gameboard = game.gameData.gameboard;
      if (
        game?.turn !== playerId ||
        gameboard.some((i) => i.currentTile.id === droppedTile.id)
      ) {
        return socket.emit('tileError');
      }

      gameboard.push({
        currentTile: droppedTile,
        tileConnectedTo: triggeredTile,
      });
      game.gameData.gameboard = gameboard;
      game.turn = playerId === 0 ? 1 : 0;
      game.gameData.boneyard = game.gameData.boneyard.map((tile) =>
        tile === droppedTile.tile ? [-1, -1] : tile
      );

      // Broadcast to the other player
      socket.broadcast.emit('opponentPlayed', {
        tile: droppedTile,
        gameboard,
        isTurn: true,
      });

      await game.save();
      return true;
    } catch (err: any) {
      // console.log(err);
      throw new Error(err.message);
    }
  },

  handleReady: async (
    gameId: string,
    socket: Socket,
    io: Server,
    playerId: number
  ) => {
    try {
      const game = await GameModel.findOne({ gameId });
      const isOtherPlayerReady =
        playerId === 0
          ? game?.gameData.player2Ready
          : playerId === 1
          ? game?.gameData.player2Ready
          : undefined;
      playerId > -1 && io.to(gameId).emit('playerReady', playerId);

      if (isOtherPlayerReady) {
        SocketController.startGame(socket, gameId, playerId);
      }

      return true;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },

  joinGame: async (
    gameId: string,
    socket: Socket,
    io: Server,
    token?: string
  ) => {
    try {
      let res: AxiosResponse<any, any> | undefined;

      try {
        res = await axios.post(
          `${process.env.BASE_URL}/api/game/join`,
          { gameId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err: any) {
        // console.log(err);
        if (err.response.status === 400) {
          return;
        }
        socket.emit('joinGameError');
      }

      // console.log(res, 'ressss');
      // Check if res is defined before accessing its properties
      if (!res) {
        // console.log('Request failed, no response data');
        // Do something with the game data
        return;
      }

      const game = res.data.data;
      // console.log(socket.rooms, '1111');
      await socket.join(gameId);
      // console.log(socket.rooms, '2221');

      io.to(gameId).emit('gameJoined', { game });
      // socket.emit('gameJoined', { game });
      io.emit('gameUpdated', { game });

      return true;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
};

export default SocketController;
