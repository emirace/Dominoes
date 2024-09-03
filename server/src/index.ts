import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { errorHandler } from './helpers/ResponseHelpers';
import { connectDB } from './db';
import cors from 'cors';
import { config } from 'dotenv';
import * as types from './types';
import socketMiddleware from './middlewares/socketMiddleware';

import UserRoutes from './routes/User.route';
import GameRoutes from './routes/Game.route';
import SocketController from './controllers/Socket.controller';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['https://dominoes-six.vercel.app', 'http://localhost:3000'],
  })
);
config();
connectDB();

app.use('/api/user', UserRoutes);
app.use('/api/game', GameRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['https://dominoes-six.vercel.app', 'http://localhost:3000'],
  },
});

io.engine.use(socketMiddleware);

io.on('connection', (socket) => {
  socket.on('createGame', () => {
    SocketController.createGame(socket, io, socket.request.token);
  });
  socket.on('joinGame', ({ gameId }) => {
    SocketController.joinGame(gameId, socket, io, socket.request.token);
  });
  socket.on('initialTiles', ({ gameId, initialTiles }) => {
    SocketController.joinGame(gameId, socket, io, socket.request.token);
  });
  socket.on('ready', ({ gameId, player }) => {
    console.log('ready', socket.rooms);
    SocketController.handleReady(gameId, socket, io, player);
  });
  socket.on('startGame', ({ gameId, playerId }) => {
    console.log('start', socket.rooms, socket.id);
    SocketController.startGame(socket, gameId, playerId);
  });
  socket.on(
    'tilePlayed',
    ({ gameId, playerId, droppedTile, triggeredTile }) => {
      console.log('start', socket.rooms);
      SocketController.tilePlayed(
        socket,
        gameId,
        playerId,
        droppedTile,
        triggeredTile
      );
    }
  );
  socket.on('disconnect', () => {
    console.log(socket.id + 'has disconnected');
  });
  socket.on('leave', (room) => {
    console.log('leave', room);
    socket.leave(room);
  });
  socket.on('error', (err) => {
    console.log(err);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
