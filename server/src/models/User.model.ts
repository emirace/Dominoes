import mongoose, { Types, Document, Model, SchemaTypes } from 'mongoose';

export interface User {
  username?: string;
  email: string;
  password: string;
}

export interface UserDocument extends User, Document {
  id: any;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
