import { describe, it, expect, beforeEach } from 'vitest';
import { createRateLimiter, resetRateLimiters } from '../middleware/rateLimiter';
import { Request, Response, NextFunction } from 'express';

describe('Token Bucket Rate Limiting Middleware', () => {
  beforeEach(() => {
    resetRateLimiters();
  });

  function createMockContext(ip = '192.168.1.10') {
    const req = {
      ip,
      socket: { remoteAddress: ip },
    } as unknown as Request;

    const headers: Record<string, any> = {};
    let statusCode = 200;
    let jsonBody: any = null;

    const res = {
      setHeader: (name: string, value: any) => {
        headers[name] = value;
      },
      status: (code: number) => {
        statusCode = code;
        return {
          json: (body: any) => {
            jsonBody = body;
          },
        };
      },
    } as unknown as Response;

    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    return { req, res, next, getHeaders: () => headers, getStatusCode: () => statusCode, getJsonBody: () => jsonBody, isNextCalled: () => nextCalled };
  }

  it('should allow requests within configured capacity and set rate limit headers', () => {
    const limiter = createRateLimiter({
      capacity: 3,
      refillRatePerSec: 1,
      categoryName: 'test-bucket',
    });

    const ctx = createMockContext();
    limiter(ctx.req, ctx.res, ctx.next);

    expect(ctx.isNextCalled()).toBe(true);
    expect(ctx.getHeaders()['X-RateLimit-Limit']).toBe(3);
    expect(ctx.getHeaders()['X-RateLimit-Remaining']).toBe(2);
  });

  it('should reject requests with 429 when capacity is exhausted and provide Retry-After header', () => {
    const limiter = createRateLimiter({
      capacity: 2,
      refillRatePerSec: 0.5,
      categoryName: 'test-exhaust',
    });

    // Request 1
    const ctx1 = createMockContext();
    limiter(ctx1.req, ctx1.res, ctx1.next);
    expect(ctx1.isNextCalled()).toBe(true);

    // Request 2
    const ctx2 = createMockContext();
    limiter(ctx2.req, ctx2.res, ctx2.next);
    expect(ctx2.isNextCalled()).toBe(true);

    // Request 3 (Exceeds capacity)
    const ctx3 = createMockContext();
    limiter(ctx3.req, ctx3.res, ctx3.next);
    expect(ctx3.isNextCalled()).toBe(false);
    expect(ctx3.getStatusCode()).toBe(429);
    expect(ctx3.getHeaders()['Retry-After']).toBeDefined();
    expect(ctx3.getJsonBody().success).toBe(false);
  });

  it('should isolate token buckets across distinct IP addresses', () => {
    const limiter = createRateLimiter({
      capacity: 1,
      refillRatePerSec: 0.1,
      categoryName: 'test-ip-isolation',
    });

    const ctxA1 = createMockContext('10.0.0.1');
    limiter(ctxA1.req, ctxA1.res, ctxA1.next);
    expect(ctxA1.isNextCalled()).toBe(true);

    // Second request from IP A fails
    const ctxA2 = createMockContext('10.0.0.1');
    limiter(ctxA2.req, ctxA2.res, ctxA2.next);
    expect(ctxA2.isNextCalled()).toBe(false);

    // First request from IP B succeeds
    const ctxB1 = createMockContext('10.0.0.2');
    limiter(ctxB1.req, ctxB1.res, ctxB1.next);
    expect(ctxB1.isNextCalled()).toBe(true);
  });
});
