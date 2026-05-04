import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes';
import sermonRoutes from './modules/sermons/sermon.routes';
import liveRoutes from './modules/live/live.routes';
import userRoutes from './modules/users/user.routes';
import prayerRoutes from './modules/prayers/prayer.routes';
import eventRoutes from './modules/events/event.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/sermons', sermonRoutes);
app.use('/live', liveRoutes);
app.use('/users', userRoutes);
app.use('/prayers', prayerRoutes);
app.use('/events', eventRoutes);
app.use('/analytics', analyticsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Praise Impact API is running' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
