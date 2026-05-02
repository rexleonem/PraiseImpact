import { Request, Response } from 'express';
import * as notificationsService from './notifications.service';

export const triggerNotification = async (req: Request, res: Response) => {
  try {
    const { title, body, topic } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const result = await notificationsService.sendNotification(title, body, topic);
    res.status(200).json({ message: 'Notification sent successfully', result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
