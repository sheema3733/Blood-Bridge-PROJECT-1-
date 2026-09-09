import { prisma } from '../prisma';

export interface NotificationThrottlingPolicy {
  maxHourlyPerUser: number;
  quietHoursStart: number; // 24-hour format, e.g. 22 (10 PM)
  quietHoursEnd: number; // 24-hour format, e.g. 7 (7 AM)
  deduplicationWindowMinutes: number;
}

const DEFAULT_POLICY: NotificationThrottlingPolicy = {
  maxHourlyPerUser: 5,
  quietHoursStart: 22,
  quietHoursEnd: 7,
  deduplicationWindowMinutes: 15,
};

/**
 * Intelligent Notification Throttling & Spam Prevention Engine
 */
export async function shouldThrottleNotification(params: {
  userId: string;
  category: string;
  urgency?: 'NORMAL' | 'URGENT' | 'CRITICAL';
  policy?: Partial<NotificationThrottlingPolicy>;
}): Promise<{ throttle: boolean; reason?: string }> {
  const activePolicy = { ...DEFAULT_POLICY, ...params.policy };
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const dedupWindow = new Date(Date.now() - activePolicy.deduplicationWindowMinutes * 60 * 1000);

  // Critical emergencies always bypass throttling and quiet hours
  if (params.urgency === 'CRITICAL') {
    return { throttle: false };
  }

  // 1. Deduplication check: Has a notification of this category been sent in the last 15 min?
  const recentDuplicate = await prisma.notification.findFirst({
    where: {
      userId: params.userId,
      category: params.category,
      createdAt: { gte: dedupWindow },
    },
  });

  if (recentDuplicate) {
    return {
      throttle: true,
      reason: `Throttled: A ${params.category} notification was already dispatched to this user within the last ${activePolicy.deduplicationWindowMinutes} minutes.`,
    };
  }

  // 2. Hourly Rate Cap
  const hourlyCount = await prisma.notification.count({
    where: {
      userId: params.userId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (hourlyCount >= activePolicy.maxHourlyPerUser) {
    return {
      throttle: true,
      reason: `Throttled: Maximum hourly notification limit (${activePolicy.maxHourlyPerUser}) reached for user.`,
    };
  }

  // 3. Quiet Hours Check (for non-urgent notifications)
  const currentHour = new Date().getHours();
  const inQuietHours =
    activePolicy.quietHoursStart > activePolicy.quietHoursEnd
      ? currentHour >= activePolicy.quietHoursStart || currentHour < activePolicy.quietHoursEnd
      : currentHour >= activePolicy.quietHoursStart && currentHour < activePolicy.quietHoursEnd;

  if (inQuietHours && params.urgency !== 'URGENT') {
    return {
      throttle: true,
      reason: 'Throttled: Non-critical notifications deferred during local quiet hours window (10 PM - 7 AM).',
    };
  }

  return { throttle: false };
}
