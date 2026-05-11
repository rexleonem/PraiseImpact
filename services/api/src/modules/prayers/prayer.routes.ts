import { Router } from 'express';
import * as prayerController from './prayer.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public unauthenticated prayer submit (anonymous mode)
router.post('/anonymous', prayerController.createAnonymous);

// Authenticated routes
router.use(protect);

router.post('/', prayerController.create);
router.get('/me', prayerController.getMe);

// Admin only
router.get('/', restrictTo('ADMIN'), prayerController.getAll);
router.patch('/:id', restrictTo('ADMIN'), prayerController.updateStatus);
router.put('/:id', restrictTo('ADMIN'), prayerController.updateStatus);

export default router;
