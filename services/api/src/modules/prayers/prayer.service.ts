import prisma from '../../config/database';
import { sendPushNotification } from '../notifications/notification.service';

export const createPrayer = async (userId: string, content: string) => {
  return prisma.prayerRequest.create({
    data: { userId, content },
  });
};

export const createAnonymousPrayer = async (content: string) => {
  // Anonymous prayers stored with a system user ID or without userId
  // We'll store with content only — userId is required in schema, 
  // so we use the first admin user as a placeholder for anonymous submissions
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('No admin user found to associate anonymous prayer');

  return prisma.prayerRequest.create({
    data: {
      userId: admin.id,
      content,
      // Mark as anonymous via status note — actual anonymous flag would need schema update
    },
  });
};

export const getUserPrayers = async (userId: string) => {
  return prisma.prayerRequest.findMany({
    where: { userId },
    orderBy: { created_at: 'desc' },
  });
};

export const getAllPrayers = async () => {
  return prisma.prayerRequest.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: { email: true, id: true },
      },
    },
  });
};

export const updatePrayerStatus = async (id: string, status: string) => {
  const prayer = await prisma.prayerRequest.update({
    where: { id },
    data: { status },
    include: { user: true },
  });

  if (prayer.user.pushToken) {
    let message = 'Your prayer request status has been updated.';
    if (status === 'praying') message = 'Someone is praying for your request! 🙏';
    if (status === 'answered') message = 'Your prayer request has been marked as answered! ✨';

    await sendPushNotification(
      [prayer.user.pushToken],
      'Prayer Update',
      message,
      { type: 'prayer', id }
    );
  }

  return prayer;
};
