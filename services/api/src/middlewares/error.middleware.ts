import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error({
    msg: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      })),
      code: 'VALIDATION_ERROR'
    });
  }

  // Handle Prisma Known Request Errors (e.g. Unique constraint)
  if (err.code?.startsWith('P')) {
     return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      code: 'DB_ERROR'
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
