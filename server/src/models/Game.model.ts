import mongoose, { Types, Document, Model, SchemaTypes } from 'mongoose';
import { User } from './User.model';

export interface Game {
  gameId: string;
  isPrivate: boolean;
  active: boolean;
  players: User[];
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
    isPrivate: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    // isRe: {
    //   type: Boolean,
    //   default: false,
    // }
    // isPrivate: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  { timestamps: true }
);

export default mongoose.model<Game>('Game', gameSchema);
