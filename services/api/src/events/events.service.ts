import prisma from '../config/prisma';

export const getEvents = async () => {
  return await prisma.event.findMany({
    orderBy: { date: 'asc' },
  });
};

export const createEvent = async (data: any) => {
  return await prisma.event.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
};

export const updateEvent = async (id: string, data: any) => {
  return await prisma.event.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
};

export const deleteEvent = async (id: string) => {
  return await prisma.event.delete({ where: { id } });
};
