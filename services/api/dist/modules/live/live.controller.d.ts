import { Request, Response, NextFunction } from 'express';
export declare const getStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
