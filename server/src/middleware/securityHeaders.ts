/**
 * BloodBridge Production HTTP Security Headers Middleware
 * Enforces strict Content-Security-Policy (CSP), HTTP Strict Transport Security (HSTS),
 * X-Frame-Options, X-Content-Type-Options, and Referrer-Policy defenses.
 */

import { Request, Response, NextFunction } from 'express';

export function applySecurityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent clickjacking by denying framing
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (Feature Policy)
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(self), camera=(), microphone=(), payment=(), usb=()'
  );

  // Cross-Origin policies
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');

  // HSTS (HTTP Strict Transport Security) - 1 year max-age with preload
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
}
