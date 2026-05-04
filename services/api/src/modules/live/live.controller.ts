import { Request, Response, NextFunction } from 'express';
import * as liveService from './live.service';

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await liveService.getLiveSession();
    res.json(session || { is_live: false, video_id: null });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await liveService.updateLiveSession(req.body);
    res.json(session);
  } catch (error) {
    next(error);
  }
};
