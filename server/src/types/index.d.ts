import { Request } from 'express';
import { UserDocument } from '../models/User.model';

export interface ExtendedRequest extends Request {
  user: UserDocument | null;
}

export type numberPair = [number, number];

declare module 'node:http' {
  interface IncomingMessage {
    user: User;
    token?: string;
  }
}
