import { Request } from 'express';
import { UserDocument } from '../models/User.model';

export interface ExtendedRequest extends Request {
  user: UserDocument | null;
}

export interface TileClassSpec {
  id: number;
  root: boolean;
  _tilt: 0 | 90 | -90 | 180;
  scale: number;
  tile: numberPair;
  isDouble: boolean;
  _coordinates: numberPair;
  _connectedAt: number[];
  _orientationSpec: {
    '0deg': ['top', 'bottom', 'left', 'right'];
    '90deg': ['right', 'left', 'top', 'bottom'];
    '-90deg': ['left', 'right', 'bottom', 'top'];
    '180deg': ['bottom', 'top', 'right', 'left'];
  };
}

export type numberPair = [number, number];

declare module 'node:http' {
  interface IncomingMessage {
    user: User;
    token?: string;
  }
}
