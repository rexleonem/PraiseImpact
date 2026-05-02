import { Router } from 'express';
import * as eventsController from './events.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', eventsController.getAll);
router.post('/', authenticate, isAdmin, eventsController.create);
router.patch('/:id', authenticate, isAdmin, eventsController.update);
router.delete('/:id', authenticate, isAdmin, eventsController.remove);

export default router;
