import { Router } from 'express';
import * as liveController from './live.controller';
import { validate } from '../../middlewares/validate.middleware';
import { updateLiveSchema } from './live.schema';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', liveController.getStatus);

// Admin only — support both PATCH and PUT for compatibility
const adminMiddleware = [protect, restrictTo('ADMIN'), validate(updateLiveSchema), liveController.updateStatus];
router.patch('/', ...adminMiddleware);
router.put('/', ...adminMiddleware);

export default router;
