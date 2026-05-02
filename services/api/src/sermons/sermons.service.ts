import prisma from '../config/prisma';

export const getSermons = async (filters: any) => {
  const { series, speaker, topic } = filters;
  const where: any = {};

  if (series) where.series = series;
  if (speaker) where.speaker = speaker;
  if (topic) where.tags = { has: topic };

  return await prisma.sermon.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
};

export const getSermonById = async (id: string) => {
  return await prisma.sermon.findUnique({ where: { id } });
};

export const createSermon = async (data: any) => {
  return await prisma.sermon.create({ data });
};

export const updateSermon = async (id: string, data: any) => {
  return await prisma.sermon.update({
    where: { id },
    data,
  });
};

export const deleteSermon = async (id: string) => {
  return await prisma.sermon.delete({ where: { id } });
};
