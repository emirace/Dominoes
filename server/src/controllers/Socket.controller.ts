import axios, { AxiosResponse } from 'axios';
import { Server, Socket } from 'socket.io';
import { generateRandomCharacters } from '../utils';

const SocketController = {
  createGame: async (socket: Socket, io: Server, token?: string) => {
    try {
      console.log('called');
      const gameId = generateRandomCharacters();

      const res = await axios
        .post(
          `${process.env.BASE_URL}/api/game/create`,
          { gameId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch((err) => socket.emit('createGameError'));
      if (typeof res === 'boolean') {
        return;
      }

      console.log(socket.rooms, '1000');
      await socket.join(gameId);
      console.log(socket.rooms, '20001');
      socket.emit('gameCreated', { gameId });
      io.emit('newGameCreated', { game: res.data.data });
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
        console.log(err);
        if (err.response.status === 400) {
          return;
        }
        socket.emit('joinGameError');
      }

      console.log(res, 'ressss');
      // Check if res is defined before accessing its properties
      if (!res) {
        console.log('Request failed, no response data');
        // Do something with the game data
        return;
      }

      const game = res.data.data;
      console.log(socket.rooms, '1111');
      await socket.join(gameId);
      console.log(socket.rooms, '2221');

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
