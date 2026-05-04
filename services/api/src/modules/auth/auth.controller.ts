import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { loginSchema } from '../../utils/validation';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    
    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};
