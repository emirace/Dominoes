import type { ExtendedRequest } from '../types/index.d.ts';
import { NextFunction, Request, Response } from 'express';

export const asyncHandler = (
  fn: (req: ExtendedRequest, res: Response, next: NextFunction) => any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as ExtendedRequest, res, next)).catch(next);
  };
};
