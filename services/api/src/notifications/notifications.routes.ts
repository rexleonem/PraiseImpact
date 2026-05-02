import { Router } from 'express';
import * as notificationsController from './notifications.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Only admins can trigger push notifications manually
router.post('/', authenticate, isAdmin, notificationsController.triggerNotification);

export default router;
