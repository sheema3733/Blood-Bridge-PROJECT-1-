import { prisma } from '../prisma';
import { emitToUser } from '../realtime/socketHandler';
import { SOCKET_EVENTS } from '../realtime/events';
import { NotificationCategory } from '../../../shared/types';

export async function createNotification(params: {
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  linkUrl?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        category: params.category,
        title: params.title,
        message: params.message,
        linkUrl: params.linkUrl || null,
      },
    });

    // Real-time push to the user's socket room
    emitToUser(params.userId, SOCKET_EVENTS.NOTIFICATION_NEW, notification);

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}
