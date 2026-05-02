import { Request, Response } from 'express';
import * as liveService from './live.service';

export const getStatus = async (req: Request, res: Response) => {
  try {
    const status = await liveService.getLiveStatus();
    res.json(status || { is_live: false });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const status = await liveService.updateLiveStatus(req.body);
    res.json(status);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
