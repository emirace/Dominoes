import { NextFunction, Request, Response } from 'express';

export const ServerError = (
  res: Response<any, Record<string, any>>,
  message: string,
  status = 400
) => {
  return res.status(status).json({ success: false, message });
};

export const SuccessResponse = (
  res: Response<any, Record<string, any>>,
  data: any,
  message: string,
  status = 200
) => {
  return res.status(status).json({ success: true, message, data });
};

export const errorHandler = (
  err: any,
  req: Request<any, Record<string, any>>,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';

  console.error(err);
  res.status(status).json({ success: false, message });
};
