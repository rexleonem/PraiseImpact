import { Router } from 'express';
import prisma from '../../config/database';
import { protect, AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/push-token', protect, async (req: AuthRequest, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { pushToken: token },
    });

    res.json({ message: 'Push token saved' });
  } catch (error) {
    next(error);
  }
});

export default router;
