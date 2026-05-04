import prisma from '../../config/database';
import { notifyAllUsers } from '../notifications/notification.service';

export const createEvent = async (data: any) => {
  const event = await prisma.event.create({ data });
  
  await notifyAllUsers(
    "🎉 New Event: " + event.title,
    `Join us on ${new Date(event.event_date).toLocaleDateString()}. Tap to view details.`,
    { type: 'event', id: event.id }
  );

  return event;
};

export const getEvents = async () => {
  return prisma.event.findMany({
    orderBy: { event_date: 'asc' },
    include: { _count: { select: { rsvps: true } } },
  });
};

export const rsvpEvent = async (userId: string, eventId: string) => {
  // @ts-ignore - Prisma 7 casing issue with RSVP model
  return prisma.rSVP.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: {},
    create: { userId, eventId },
  });
};

export const getUserEvents = async (userId: string) => {
  // @ts-ignore - Prisma 7 casing issue with RSVP model
  const rsvps = await prisma.rSVP.findMany({
    where: { userId },
    include: { event: true },
  });
  return rsvps.map((r: any) => r.event);
};
