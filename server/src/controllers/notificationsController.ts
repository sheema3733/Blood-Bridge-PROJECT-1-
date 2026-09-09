import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function getMyNotifications(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const [unreadCount, notifications] = await Promise.all([
      prisma.notification.count({
        where: {
          userId: req.user.id,
          isRead: false,
        },
      }),
      prisma.notification.findMany({
        where: { userId: req.user.id },
        take: 30,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error('getMyNotifications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
}

export async function markAsRead(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json({ success: true, notification: updated });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
}

export async function markAllAsRead(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark all as read.' });
  }
}
