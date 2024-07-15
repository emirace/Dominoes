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
app.use(cors());
config();
connectDB();

app.use('/api/user', UserRoutes);
app.use('/api/game', GameRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
  },
});

io.engine.use(socketMiddleware);

io.on('connection', (socket) => {
  // console.log('up');
  console.log(socket.id + socket.request.user + 'has connected');
  console.log(socket.rooms);
  socket.on('createGame', () => {
    console.log('createGame', socket.rooms);
    SocketController.createGame(socket, io, socket.request.token);
  });
  socket.on('joinGame', ({ gameId }) => {
    console.log('joinGame', socket.rooms);
    SocketController.joinGame(gameId, socket, io, socket.request.token);
  });
  socket.on('disconnect', () => {
    console.log(socket.id + 'has disconnected');
  });
  socket.on('leave', (room) => {
    console.log('leave', room);
    socket.leave(room);
  });
});

io.on('error', (err) => {
  console.log(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
