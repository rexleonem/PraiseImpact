import prisma from '../../config/database';

export const createSermon = async (data: any) => {
  return prisma.sermon.create({ data });
};

export const getSermons = async (options: { page?: number; limit?: number }) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  return prisma.sermon.findMany({
    skip,
    take: limit,
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
