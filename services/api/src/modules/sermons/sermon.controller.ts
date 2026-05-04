import { Request, Response, NextFunction } from 'express';
import * as sermonService from './sermon.service';
import { sermonSchema } from '../../utils/validation';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = sermonSchema.parse(req.body);
    const sermon = await sermonService.createSermon(validatedData);
    res.status(201).json(sermon);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sermons = await sermonService.getSermons({ page, limit });
    res.json(sermons);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sermon = await sermonService.getSermonById(req.params.id);
    if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
    res.json(sermon);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = sermonSchema.partial().parse(req.body);
    const sermon = await sermonService.updateSermon(req.params.id, validatedData);
    res.json(sermon);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sermonService.deleteSermon(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
