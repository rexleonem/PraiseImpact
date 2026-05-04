import { Request, Response, NextFunction } from 'express';
export declare const track: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPerformance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
