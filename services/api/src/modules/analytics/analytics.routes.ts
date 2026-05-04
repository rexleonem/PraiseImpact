import { Router } from 'express';
import * as analyticsController from './analytics.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Publicly accessible for app tracking
router.post('/event', analyticsController.track);

// Admin only stats
router.get('/stats', protect, restrictTo('ADMIN'), analyticsController.getStats);
router.get('/performance', protect, restrictTo('ADMIN'), analyticsController.getPerformance);

export default router;
