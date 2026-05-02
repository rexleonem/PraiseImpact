import { Request, Response } from 'express';
import * as prayerService from './prayer.service';

export const submit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || null;
    const request = await prayerService.createRequest(userId, req.body);
    res.status(201).json(request);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const requests = await prayerService.getRequests();
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const request = await prayerService.updateStatus(req.params.id as string, status);
    res.json(request);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
