import { Router } from 'express';
import prisma from '../../config/database';
import { protect, restrictTo, AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();

// Save push token (authenticated user)
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

// List all users (admin only)
router.get('/', protect, restrictTo('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: { id: true, email: true, role: true, created_at: true, pushToken: false },
      }),
      prisma.user.count(),
    ]);

    res.json({ users, total, page, limit });
  } catch (error) {
    next(error);
  }
});

// Update user role (admin only)
router.patch('/:id/role', protect, restrictTo('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const role = String(req.body.role);
    if (!['ADMIN', 'USER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await prisma.user.update({
      where: { id: String(req.params.id) },
      data: { role: role as 'ADMIN' | 'USER' },
      select: { id: true, email: true, role: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
