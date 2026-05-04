import { Router } from 'express';
import * as liveController from './live.controller';
import { validate } from '../../middlewares/validate.middleware';
import { updateLiveSchema } from './live.schema';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', liveController.getStatus);

// Admin only
router.put('/', protect, restrictTo('ADMIN'), validate(updateLiveSchema), liveController.updateStatus);

export default router;
