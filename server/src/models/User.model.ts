import mongoose, { Types, Document, Model, SchemaTypes } from 'mongoose';

export interface User {
  username?: string;
  address: string;
  password: string;
  games: Types.ObjectId[];
}

export interface UserDocument extends User, Document {
  id: any;
}

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    games: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'Game',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<User>('User', userSchema);
