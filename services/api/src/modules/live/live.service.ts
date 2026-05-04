import prisma from '../../config/database';

export const getLiveSession = async () => {
  return prisma.liveSession.findFirst();
};

export const updateLiveSession = async (data: any) => {
  const session = await prisma.liveSession.findFirst();

  if (session) {
    return prisma.liveSession.update({
      where: { id: session.id },
      data: {
        is_live: data.isLive,
        video_id: data.videoId,
        started_at: data.isLive ? new Date() : null,
      },
    });
  }

  return prisma.liveSession.create({
    data: {
      is_live: data.isLive,
      video_id: data.videoId,
      started_at: data.isLive ? new Date() : null,
    },
  });
};
