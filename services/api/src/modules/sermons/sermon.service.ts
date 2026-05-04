import prisma from '../../config/database';

export const createSermon = async (data: any) => {
  return prisma.sermon.create({ data });
};

export const getSermons = async () => {
  return prisma.sermon.findMany({
    orderBy: { created_at: 'desc' },
  });
};

export const getSermonById = async (id: string) => {
  return prisma.sermon.findUnique({ where: { id } });
};

export const updateSermon = async (id: string, data: any) => {
  return prisma.sermon.update({ where: { id }, data });
};

export const deleteSermon = async (id: string) => {
  return prisma.sermon.delete({ where: { id } });
};
