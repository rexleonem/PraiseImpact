import prisma from '../config/prisma';

export const createRequest = async (userId: string | null, data: any) => {
  return await prisma.prayerRequest.create({
    data: {
      user_id: userId,
      message: data.message,
      is_anonymous: data.is_anonymous || false,
      status: 'pending',
    },
  });
};

export const getRequests = async () => {
  return await prisma.prayerRequest.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { created_at: 'desc' },
  });
};

export const updateStatus = async (id: string, status: string) => {
  return await prisma.prayerRequest.update({
    where: { id },
    data: { status },
  });
};
