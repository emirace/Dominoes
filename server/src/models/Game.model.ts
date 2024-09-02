import mongoose, { Types, Document, Model, SchemaTypes } from 'mongoose';
import { User } from './User.model';
import { numberPair, TileClassSpec } from '../types';

export interface Game {
  gameId: string;
  isPrivate: boolean;
  active: boolean;
  players: User[];
  gameData: {
    player1Ready: boolean;
    player2Ready: boolean;
    boneyard: numberPair[];
    gameboard: {
      currentTile: TileClassSpec;
      tileConnectedTo: TileClassSpec;
    }[];
  };
  turn: 0 | 1;
}

export interface GameDocument extends Game, Document {
  id: any;
}

const gameSchema = new mongoose.Schema<Game>(
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
    turn: {
      type: Number,
    },
    gameData: {
      boneyard: {
        type: [[Number, Number]],
        default: [],
      },
      player1Ready: {
        type: Boolean,
        default: false,
      },
      player2Ready: {
        type: Boolean,
        default: false,
      },
      gameboard: [{}],
    },
  },
  { timestamps: true }
);

export default mongoose.model<Game>('Game', gameSchema);
