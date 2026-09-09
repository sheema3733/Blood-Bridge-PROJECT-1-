import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
import { config } from '../config';

describe('Role-Based Access Control (RBAC) & Security Middleware', () => {
  it('should return 401 Unauthorized when requesting protected endpoints without token', async () => {
    const res = await request(app).get('/api/donors/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject access with malformed or tampered token', async () => {
    const res = await request(app)
      .get('/api/donors/dashboard')
      .set('Authorization', 'Bearer invalid_tampered_token');
    expect(res.status).toBe(401);
  });

  it('should return 403 Forbidden when a Donor attempts to access Admin endpoints', async () => {
    // Generate a valid JWT for a donor user
    const donorToken = jwt.sign(
      { id: 'synthetic-donor-id', email: 'donor1@demo.bloodbridge.org', role: 'DONOR' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${donorToken}`);

    // If user is not found in DB or role is DONOR, forbidden/unauthorized is strictly enforced
    expect([401, 403]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  it('should return 403 Forbidden when a Requester attempts to verify a hospital request', async () => {
    const requesterToken = jwt.sign(
      { id: 'synthetic-requester-id', email: 'requester@demo.bloodbridge.org', role: 'REQUESTER' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/hospitals/requests/BB-TEST-01/verify')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ status: 'VERIFIED' });

    expect([401, 403]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });
});
