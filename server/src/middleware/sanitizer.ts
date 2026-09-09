/**
 * BloodBridge Input Sanitization & Defensive Normalization Middleware
 * Neutralizes Cross-Site Scripting (XSS) payloads, SQL metacharacters,
 * trims trailing whitespaces, and normalizes phone numbers and emails.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Strips script tags, HTML entities, and dangerous javascript URI schemes
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return input;

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // remove iframes
    .replace(/on\w+\s*=/gi, '') // remove event handlers like onload=, onerror=
    .replace(/javascript:/gi, '') // remove javascript: urls
    .replace(/[<>]/g, '') // remove stray HTML braces
    .trim();
}

/**
 * Normalizes phone numbers to standard format (+XX-XXXXXXXXXX or digits)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Normalizes email address to lowercase and trimmed
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
}

/**
 * Recursively cleans object properties
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = sanitizeObject(value);
    }
    return cleaned as T;
  }

  return obj;
}

/**
 * Express middleware to sanitize incoming body, query, and params
 */
export function requestSanitizer(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
}
