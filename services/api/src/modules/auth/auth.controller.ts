import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { loginSchema } from '../../utils/validation';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    
    if (!result) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
