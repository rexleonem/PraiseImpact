import prisma from '../../config/database';
import { notifyAllUsers } from '../notifications/notification.service';

export const getLiveSession = async () => {
  return prisma.liveSession.findFirst();
};

export const updateLiveSession = async (data: any) => {
  const session = await prisma.liveSession.findFirst();
  let result;

  if (session) {
    result = await prisma.liveSession.update({
      where: { id: session.id },
      data: {
        is_live: data.isLive,
        video_id: data.videoId,
        started_at: data.isLive ? new Date() : null,
      },
    });
  } else {
    result = await prisma.liveSession.create({
      data: {
        is_live: data.isLive,
        video_id: data.videoId,
        started_at: data.isLive ? new Date() : null,
      },
    });
  }

  if (data.isLive) {
    await notifyAllUsers("🔴 We are LIVE!", "Join our Sunday Service now", { type: 'live' });
  }

  return result;
};
