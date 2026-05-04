import { Request, Response, NextFunction } from 'express';
import * as eventService from './event.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await eventService.getEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const rsvp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const rsvp = await eventService.rsvpEvent(req.user!.userId, req.params.id as string);
    res.status(201).json(rsvp);
  } catch (error) {
    next(error);
  }
};

export const getMyEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const events = await eventService.getUserEvents(req.user!.userId);
    res.json(events);
  } catch (error) {
    next(error);
  }
};
