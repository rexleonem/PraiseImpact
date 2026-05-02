import { Router } from 'express';
import * as prayerController from './prayer.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, prayerController.submit);
router.get('/', authenticate, isAdmin, prayerController.getAll);
router.patch('/:id', authenticate, isAdmin, prayerController.update);

export default router;
