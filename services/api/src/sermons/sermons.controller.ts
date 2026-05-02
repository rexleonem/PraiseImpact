import { Request, Response } from 'express';
import * as sermonsService from './sermons.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const sermons = await sermonsService.getSermons(req.query);
    res.json(sermons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const sermon = await sermonsService.getSermonById(req.params.id as string);
    if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
    res.json(sermon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const sermon = await sermonsService.createSermon(req.body);
    res.status(201).json(sermon);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const sermon = await sermonsService.updateSermon(req.params.id as string, req.body);
    res.json(sermon);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await sermonsService.deleteSermon(req.params.id as string);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
