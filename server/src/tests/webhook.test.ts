import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerWebhook,
  signWebhookPayload,
  dispatchWebhookEvent,
  getWebhookDeliveries,
  resetWebhookStore,
} from '../services/webhookService';

describe('Hospital HMS Outbound Webhook Service', () => {
  beforeEach(() => {
    resetWebhookStore();
  });

  it('should register a hospital webhook subscription', () => {
    const sub = registerWebhook({
      hospitalId: 'hosp_apollo',
      targetUrl: 'https://hms.apollo.org/api/webhooks/bloodbridge',
      secretKey: 'super-secret-hmac-key',
      events: ['REQUEST_UPDATED', 'DONOR_ACCEPTED'],
    });

    expect(sub.id).toBeDefined();
    expect(sub.hospitalId).toBe('hosp_apollo');
    expect(sub.isActive).toBe(true);
    expect(sub.events).toContain('DONOR_ACCEPTED');
  });

  it('should generate valid HMAC-SHA256 signatures for payloads', () => {
    const payload = JSON.stringify({ event: 'TEST', timestamp: '2026-09-09' });
    const secret = 'test-secret';
    const sig1 = signWebhookPayload(payload, secret);
    const sig2 = signWebhookPayload(payload, secret);

    expect(sig1).toBe(sig2);
    expect(sig1.length).toBe(64); // SHA-256 hex length
  });

  it('should dispatch events to matching hospital webhook subscriptions and record delivery history', () => {
    const sub = registerWebhook({
      hospitalId: 'hosp_general',
      targetUrl: 'https://hms.general.org/hooks',
      secretKey: 'gen-secret',
      events: ['DONOR_CONFIRMED'],
    });

    const attempts = dispatchWebhookEvent('DONOR_CONFIRMED', 'hosp_general', {
      requestId: 'req_88',
      donorGroup: 'O-',
    });

    expect(attempts.length).toBe(1);
    expect(attempts[0].status).toBe('SUCCESS');
    expect(attempts[0].signature).toContain('sha256=');

    const history = getWebhookDeliveries(sub.id);
    expect(history.length).toBe(1);
    expect(history[0].event).toBe('DONOR_CONFIRMED');
  });
});
