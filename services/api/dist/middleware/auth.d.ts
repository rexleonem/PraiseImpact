import { Request, Response, NextFunction } from 'express';
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => void;
