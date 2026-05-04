import { Router } from 'express';
import * as eventController from './event.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', eventController.getAll);

// Protected routes
router.use(protect);
router.post('/:id/rsvp', eventController.rsvp);
router.get('/me', eventController.getMyEvents);

// Admin only
router.post('/', restrictTo('ADMIN'), eventController.create);

export default router;
