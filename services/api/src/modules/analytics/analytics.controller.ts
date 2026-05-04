import { Request, Response, NextFunction } from 'express';
import * as analyticsService from './analytics.service';

export const track = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await analyticsService.logEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.getOverviewStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const performance = await analyticsService.getSermonPerformance();
    res.json(performance);
  } catch (error) {
    next(error);
  }
};
