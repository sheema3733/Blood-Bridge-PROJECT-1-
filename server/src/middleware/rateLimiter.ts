/**
 * BloodBridge Adaptive Rate Limiting Middleware
 * Protects critical emergency endpoints against denial-of-service,
 * credential stuffing, and brute-force flooding using token bucket algorithms.
 */

import { Request, Response, NextFunction } from 'express';

interface TokenBucket {
  tokens: number;
  lastRefillTime: number;
}

export interface RateLimitOptions {
  capacity: number;         // Maximum tokens allowed in bucket
  refillRatePerSec: number; // Tokens added per second
  categoryName?: string;
}

const buckets = new Map<string, TokenBucket>();

/**
 * Creates an Express middleware applying a token-bucket rate limit
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { capacity, refillRatePerSec, categoryName = 'global' } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${categoryName}:${ip}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = {
        tokens: capacity,
        lastRefillTime: now,
      };
      buckets.set(key, bucket);
    } else {
      // Calculate token refill based on elapsed time
      const elapsedSeconds = (now - bucket.lastRefillTime) / 1000;
      const tokensToAdd = elapsedSeconds * refillRatePerSec;
      bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefillTime = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      res.setHeader('X-RateLimit-Limit', capacity);
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
      return next();
    }

    // Bucket empty: Rate limit exceeded
    const waitSeconds = Math.ceil((1 - bucket.tokens) / refillRatePerSec);
    res.setHeader('Retry-After', waitSeconds);
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please retry after the specified window.',
      retryAfterSeconds: waitSeconds,
    });
  };
}

/**
 * Pre-configured rate limiters for typical application tiers
 */
export const authRateLimiter = createRateLimiter({
  capacity: 10,
  refillRatePerSec: 0.2, // 1 token every 5 seconds (12 requests/min max)
  categoryName: 'auth',
});

export const apiRateLimiter = createRateLimiter({
  capacity: 60,
  refillRatePerSec: 1.0, // 60 requests/min
  categoryName: 'api',
});

export const emergencyDispatchLimiter = createRateLimiter({
  capacity: 30,
  refillRatePerSec: 0.5,
  categoryName: 'dispatch',
});

/**
 * Reset all rate limit buckets (for testing)
 */
export function resetRateLimiters(): void {
  buckets.clear();
}
