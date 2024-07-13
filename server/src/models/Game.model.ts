import mongoose, { Types, Document, Model, SchemaTypes } from 'mongoose';

export interface Game {
  Gamename?: string;
  email: string;
  password: string;
}

export interface GameDocument extends Game, Document {
  id: any;
}

const gameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
    },
    players: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<Game>('Game', gameSchema);
