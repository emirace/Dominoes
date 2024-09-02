import User from './../models/User.model';
import { NextFunction, Request, Response } from 'express';
import { ServerError } from '../helpers/ResponseHelpers';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from '../types';

export default async (
  req: Request,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if (!token) {
      return ServerError(res, 'You are not authenticated', 401);
    }

    const verifiedJwt: any = jwt.verify(token, process.env.JWT_SECRET || '');
    const user: any = await User.findOne({
      address: verifiedJwt.address,
      username: verifiedJwt.username,
    });
    // console.log(user);
    if (!user) {
      return ServerError(res, 'You are not authenticated', 401);
    }

    (req as ExtendedRequest).user = user;
    next();
  } catch (err) {
    // console.error(err);
    return next(new Error('You are not authenticated'));
  }
};
