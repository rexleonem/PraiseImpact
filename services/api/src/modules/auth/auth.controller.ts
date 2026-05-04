import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.validateUser(req.body);
    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
