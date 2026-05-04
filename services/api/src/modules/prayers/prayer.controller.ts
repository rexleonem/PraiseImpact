import { Request, Response, NextFunction } from 'express';
import * as prayerService from './prayer.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const prayer = await prayerService.createPrayer(req.user!.userId, req.body.content);
    res.status(201).json(prayer);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const prayers = await prayerService.getUserPrayers(req.user!.userId);
    res.json(prayers);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prayers = await prayerService.getAllPrayers();
    res.json(prayers);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prayer = await prayerService.updatePrayerStatus(req.params.id as string, req.body.status);
    res.json(prayer);
  } catch (error) {
    next(error);
  }
};
