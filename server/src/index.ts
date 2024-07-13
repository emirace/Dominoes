import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { errorHandler } from './helpers/ResponseHelpers';
import { connectDB } from './db';
import cors from 'cors';
import { config } from 'dotenv';

import AuthRoutes from './routes/User.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
config();
connectDB();

app.use('/api/user', AuthRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on('connection', (socket) => {
  console.log(socket.id + 'has connected');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
