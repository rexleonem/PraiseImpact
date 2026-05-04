import prisma from '../../config/database';

export const logEvent = async (data: any) => {
  return prisma.analyticsEvent.create({ data });
};

export const getOverviewStats = async () => {
  const [totalUsers, totalViews, totalSermons, totalEvents] = await Promise.all([
    prisma.user.count(),
    prisma.analyticsEvent.count({ where: { type: 'view_sermon' } }),
    prisma.sermon.count(),
    prisma.event.count(),
  ]);

  return { totalUsers, totalViews, totalSermons, totalEvents };
};

export const getSermonPerformance = async () => {
  const sermons = await prisma.sermon.findMany({
    select: {
      id: true,
      title: true,
    }
  });

  const performance = await Promise.all(sermons.map(async (sermon) => {
    const views = await prisma.analyticsEvent.count({
      where: { sermonId: sermon.id, type: 'view_sermon' }
    });
    
    const completions = await prisma.analyticsEvent.count({
      where: { sermonId: sermon.id, type: 'complete' }
    });

    return {
      id: sermon.id,
      title: sermon.title,
      views,
      completions,
      completionRate: views > 0 ? (completions / views) * 100 : 0
    };
  }));

  return performance.sort((a, b) => b.views - a.views);
};
