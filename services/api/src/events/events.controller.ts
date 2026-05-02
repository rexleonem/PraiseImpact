import { Request, Response } from 'express';
import * as eventsService from './events.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const events = await eventsService.getEvents();
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const event = await eventsService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const event = await eventsService.updateEvent(req.params.id as string, req.body);
    res.json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await eventsService.deleteEvent(req.params.id as string);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
