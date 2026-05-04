import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      next(error);
    }
  };
};
