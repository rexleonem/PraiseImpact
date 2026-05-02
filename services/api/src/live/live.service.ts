import prisma from '../config/prisma';

export const getLiveStatus = async () => {
  return await prisma.liveSession.findFirst({
    orderBy: { started_at: 'desc' },
  });
};

export const updateLiveStatus = async (data: any) => {
  const { is_live, youtube_video_id } = data;
  
  // Find active session or create new one
  let session = await prisma.liveSession.findFirst({
    where: { ended_at: null },
  });

  if (is_live) {
    if (session) {
      return await prisma.liveSession.update({
        where: { id: session.id },
        data: { youtube_video_id },
      });
    } else {
      return await prisma.liveSession.create({
        data: {
          is_live: true,
          youtube_video_id,
          started_at: new Date(),
        },
      });
    }
  } else {
    if (session) {
      return await prisma.liveSession.update({
        where: { id: session.id },
        data: {
          is_live: false,
          ended_at: new Date(),
        },
      });
    }
  }
  
  return session;
};
