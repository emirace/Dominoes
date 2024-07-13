import { Request } from 'express';
import { UserDocument } from '../models/User.model';

export interface ExtendedRequest extends Request {
  user: UserDocument | null;
}
