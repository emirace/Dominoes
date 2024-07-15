import Game from './../models/Game.model';
import { asyncHandler } from '../helpers/AsyncHelper';
import { ServerError, SuccessResponse } from '../helpers/ResponseHelpers';

const GameController = {
  createRoom: asyncHandler(async (req, res) => {
    const { gameId } = req.body;

    const newGame = await Game.create({
      gameId,
      players: [req.user?._id],
    });
    const game = await newGame.populate('players');

    return SuccessResponse(res, game, 'Room created successfully', 201);
  }),

  joinRoom: asyncHandler(async (req, res) => {
    const { gameId } = req.body;
    const userId: any = req.user?._id;

    let game = await Game.findOne({ gameId });
    if (!game || game.players.length === 0) {
      return ServerError(res, 'Game not found');
    }

    if (game.players.includes(userId)) {
      return ServerError(res, 'Already in this game', 400);
    }

    if (game.players.length > 1) {
      return ServerError(res, 'Room is already full');
    }

    if (game.players[0] === userId.toString()) {
      return ServerError(res, 'Already in this room');
    }

    game.players.push(userId);
    game.active = true;
    await game.save();

    game = await game.populate('players');

    return SuccessResponse(res, game, 'Room join successfully');
  }),

  getGame: asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const game = await Game.findOne({ gameId: slug }).populate('players');
    if (!game) {
      return ServerError(res, 'Game not found', 400);
    }

    return SuccessResponse(res, game, 'Room retrieved successfully');
  }),

  getAllGames: asyncHandler(async (req, res) => {
    const games = await Game.find({
      'players.0': { $exists: true },
      active: false,
    }).populate('players');

    return SuccessResponse(res, games, 'Rooms retrieved successfully');
  }),
};

export default GameController;
