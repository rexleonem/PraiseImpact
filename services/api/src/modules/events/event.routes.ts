import { Router } from 'express';
import * as eventController from './event.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/', eventController.getAll);

// Authenticated
router.use(protect);
router.post('/:id/rsvp', eventController.rsvp);
router.get('/me', eventController.getMyEvents);

// Admin only
router.post('/', restrictTo('ADMIN'), eventController.create);
router.patch('/:id', restrictTo('ADMIN'), eventController.update);
router.put('/:id', restrictTo('ADMIN'), eventController.update);
router.delete('/:id', restrictTo('ADMIN'), eventController.remove);

export default router;
