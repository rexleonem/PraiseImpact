import { Router } from 'express';
import * as liveController from './live.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', liveController.getStatus);
router.patch('/', authenticate, isAdmin, liveController.updateStatus);

export default router;
