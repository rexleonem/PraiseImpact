import { Router } from 'express';
import * as sermonsController from './sermons.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', sermonsController.getAll);
router.get('/:id', sermonsController.getOne);
router.post('/', authenticate, isAdmin, sermonsController.create);
router.patch('/:id', authenticate, isAdmin, sermonsController.update);
router.delete('/:id', authenticate, isAdmin, sermonsController.remove);

export default router;
