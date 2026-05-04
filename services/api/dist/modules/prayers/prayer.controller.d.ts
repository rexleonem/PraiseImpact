import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare const create: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
