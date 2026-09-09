import { describe, it, expect } from 'vitest';
import { shouldThrottleNotification } from '../services/notificationThrottlingService';

describe('Notification Throttling & Spam Prevention Engine', () => {
  it('should NEVER throttle a CRITICAL urgency emergency call', async () => {
    const result = await shouldThrottleNotification({
      userId: 'test-user-critical',
      category: 'EMERGENCY_REQUEST',
      urgency: 'CRITICAL',
    });

    expect(result.throttle).toBe(false);
  });

  it('should allow initial notifications within rate limits', async () => {
    const result = await shouldThrottleNotification({
      userId: 'test-user-new',
      category: 'SYSTEM',
      urgency: 'URGENT',
    });

    expect(result.throttle).toBe(false);
  });
});
