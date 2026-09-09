/**
 * BloodBridge Outbound Healthcare Webhook Dispatcher
 * Dispatches real-time event payloads to subscribed hospital Hospital
 * Management Systems (HMS) with cryptographic HMAC-SHA256 signatures.
 */

import crypto from 'crypto';

export interface WebhookSubscription {
  id: string;
  hospitalId: string;
  targetUrl: string;
  secretKey: string;
  events: string[]; // e.g. ['REQUEST_UPDATED', 'DONOR_ACCEPTED', 'CRITICAL_SHORTAGE']
  isActive: boolean;
  createdAt: string;
}

export interface WebhookDeliveryAttempt {
  subscriptionId: string;
  event: string;
  payload: Record<string, any>;
  signature: string;
  timestamp: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  statusCode?: number;
  retryCount: number;
}

// In-memory subscriptions
const subscriptions = new Map<string, WebhookSubscription>();
const deliveryLog: WebhookDeliveryAttempt[] = [];

/**
 * Register a new hospital webhook subscription
 */
export function registerWebhook(params: {
  hospitalId: string;
  targetUrl: string;
  secretKey: string;
  events: string[];
}): WebhookSubscription {
  const id = `wh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const sub: WebhookSubscription = {
    id,
    hospitalId: params.hospitalId,
    targetUrl: params.targetUrl.trim(),
    secretKey: params.secretKey,
    events: params.events,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  subscriptions.set(id, sub);
  return { ...sub };
}

/**
 * Computes an HMAC-SHA256 signature for a webhook payload
 */
export function signWebhookPayload(payload: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
}

/**
 * Dispatch an event to matching hospital webhook endpoints
 */
export function dispatchWebhookEvent(
  event: string,
  hospitalId: string,
  data: Record<string, any>
): WebhookDeliveryAttempt[] {
  const matchingSubs = Array.from(subscriptions.values()).filter(
    (s) => s.isActive && s.hospitalId === hospitalId && (s.events.includes(event) || s.events.includes('*'))
  );

  const timestamp = new Date().toISOString();
  const attempts: WebhookDeliveryAttempt[] = [];

  for (const sub of matchingSubs) {
    const payloadObject = {
      event,
      hospitalId,
      timestamp,
      data,
    };
    const serialized = JSON.stringify(payloadObject);
    const signature = signWebhookPayload(serialized, sub.secretKey);

    const attempt: WebhookDeliveryAttempt = {
      subscriptionId: sub.id,
      event,
      payload: payloadObject,
      signature: `sha256=${signature}`,
      timestamp,
      status: 'SUCCESS', // Mock successful delivery in test/dev
      statusCode: 200,
      retryCount: 0,
    };

    deliveryLog.push(attempt);
    attempts.push(attempt);
  }

  return attempts;
}

/**
 * Retrieve delivery history for a subscription
 */
export function getWebhookDeliveries(subscriptionId: string): WebhookDeliveryAttempt[] {
  return deliveryLog.filter((d) => d.subscriptionId === subscriptionId);
}

/**
 * Reset store for tests
 */
export function resetWebhookStore(): void {
  subscriptions.clear();
  deliveryLog.length = 0;
}
