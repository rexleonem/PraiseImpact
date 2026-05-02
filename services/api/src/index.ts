import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/auth.routes';
import sermonsRoutes from './sermons/sermons.routes';
import liveRoutes from './live/live.routes';
import eventsRoutes from './events/events.routes';
import prayerRoutes from './prayer/prayer.routes';
import notificationsRoutes from './notifications/notifications.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/sermons', sermonsRoutes);
app.use('/live', liveRoutes);
app.use('/events', eventsRoutes);
app.use('/prayer', prayerRoutes);
app.use('/notify', notificationsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Praise Impact API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
