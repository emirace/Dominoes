import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (
  req: any,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  try {
    const isHandshake = req._query.sid === undefined;
    if (!isHandshake) {
      return next();
    }

    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('You are not authenticated'));
    }

    req.token = token;
    next();
  } catch (err) {
    console.error(err);
    return next(new Error('You are not authenticated'));
  }
};
