import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (
  req: any,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  try {
    const isHandshake = req._query.sid === undefined;
    // console.log(isHandshake);
    if (!isHandshake) {
      return next();
    }

    const { authorization } = req.headers;
    // console.log(req.headers, 'kk');
    const token = authorization?.split(' ')[1];
    // console.log(token);
    if (!token) {
      return next(new Error('You are not authenticated'));
    }

    const verifiedJwt: any = jwt.verify(token, process.env.JWT_SECRET || '');
    // // console.log(verifiedJwt);
    // const { password, ...user } = verifiedJwt;

    // req.user = user;
    req.token = token;
    // console.log(res.socket, res.emit);
    next();
  } catch (err) {
    console.error(err);
    return next(new Error('You are not authenticated'));
  }
};
