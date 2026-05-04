import { Router } from 'express';
import * as prayerController from './prayer.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', prayerController.create);
router.get('/me', prayerController.getMe);

// Admin only
router.get('/', restrictTo('ADMIN'), prayerController.getAll);
router.put('/:id', restrictTo('ADMIN'), prayerController.updateStatus);

export default router;
