import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import prisma from '../../config/database';
import logger from '../../utils/logger';

const expo = new Expo();

export const sendPushNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data?: any
) => {
  const messages: ExpoPushMessage[] = [];
  
  for (const token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      logger.error(`Push token ${token} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: token,
      sound: 'default',
      title,
      body,
      data,
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error: any) {
      logger.error(error, 'Error sending push notification chunk');
    }
  }
};

export const notifyAllUsers = async (title: string, body: string, data?: any) => {
  const users = await prisma.user.findMany({
    where: { pushToken: { not: null } },
    select: { pushToken: true },
  });

  const tokens = users.map(u => u.pushToken as string);
  if (tokens.length > 0) {
    await sendPushNotification(tokens, title, body, data);
  }
};
