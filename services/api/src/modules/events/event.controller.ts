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

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.updateEvent(req.params.id as string, req.body);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.deleteEvent(req.params.id as string);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const rsvp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await eventService.rsvpEvent(req.user!.userId, req.params.id as string);
    res.status(201).json(result);
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
