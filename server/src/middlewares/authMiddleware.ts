import { NextFunction, Request, Response } from 'express';
import { ServerError } from '../helpers/ResponseHelpers';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from '../types';

export default (
  req: Request,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const token = authorization?.split(' ')[1];
  if (!token) {
    return ServerError(res, 'You are not authenticated', 401);
  }

  const verifiedJwt: any = jwt.verify(token, process.env.JWT_SECRET || '');

  (req as ExtendedRequest).user = verifiedJwt;
  next();
};
