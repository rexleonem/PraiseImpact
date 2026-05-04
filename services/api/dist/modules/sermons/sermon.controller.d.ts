import { Request, Response, NextFunction } from 'express';
export declare const create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getOne: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const remove: (req: Request, res: Response, next: NextFunction) => Promise<void>;
