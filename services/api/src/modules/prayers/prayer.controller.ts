import { Request, Response, NextFunction } from 'express';
import * as prayerService from './prayer.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Accept both 'content' and 'message' field names for compatibility
    const content = req.body.content || req.body.message;
    if (!content) return res.status(400).json({ message: 'Prayer content is required' });

    const prayer = await prayerService.createPrayer(req.user!.userId, content);
    res.status(201).json(prayer);
  } catch (error) {
    next(error);
  }
};

export const createAnonymous = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const content = req.body.content || req.body.message;
    if (!content) return res.status(400).json({ message: 'Prayer content is required' });

    const prayer = await prayerService.createAnonymousPrayer(content);
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
