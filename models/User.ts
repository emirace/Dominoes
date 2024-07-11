import mongoose, { Types, Document, Model } from "mongoose";

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
  },
  { timestamps: true }
);

export default (mongoose.models?.User as unknown as Model<UserDocument>) ||
  mongoose.model<User>("User", userSchema);
