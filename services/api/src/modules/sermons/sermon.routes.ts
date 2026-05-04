import { Router } from 'express';
import * as sermonController from './sermon.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createSermonSchema, updateSermonSchema } from './sermon.schema';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', sermonController.getAll);
router.get('/:id', sermonController.getOne);

// Protected routes
router.use(protect, restrictTo('ADMIN'));
router.post('/', validate(createSermonSchema), sermonController.create);
router.put('/:id', validate(updateSermonSchema), sermonController.update);
router.delete('/:id', sermonController.remove);

export default router;
