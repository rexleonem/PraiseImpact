import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import sermonRoutes from './modules/sermons/sermon.routes';
import liveRoutes from './modules/live/live.routes';
import userRoutes from './modules/users/user.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/sermons', sermonRoutes);
app.use('/live', liveRoutes);
app.use('/users', userRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Praise Impact API is running' });
});

// Error handling
app.use(errorHandler);

export default app;
