import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  normalizePhoneNumber,
  normalizeEmail,
  sanitizeObject,
} from '../middleware/sanitizer';

describe('Input Sanitization & Security Normalization Service', () => {
  it('should strip malicious script tags and inline event handlers', () => {
    const malicious = '<script>alert("hacked")</script>Hello <img src="x" onerror="alert(1)">World';
    const cleaned = sanitizeString(malicious);
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('onerror=');
    expect(cleaned).toBe('Hello World');
  });

  it('should neutralize javascript: URI attack vectors', () => {
    const payload = 'javascript:document.cookie';
    const cleaned = sanitizeString(payload);
    expect(cleaned).not.toContain('javascript:');
  });

  it('should normalize international and local phone numbers', () => {
    expect(normalizePhoneNumber('+1 (555) 234-5678')).toBe('+15552345678');
    expect(normalizePhoneNumber('+91 98765-43210')).toBe('+919876543210');
    expect(normalizePhoneNumber('invalid-chars!@#')).toBe('');
  });

  it('should normalize and lowercase email addresses', () => {
    expect(normalizeEmail('  Doctor.Smith@Hospital.ORG  ')).toBe('doctor.smith@hospital.org');
    expect(normalizeEmail('')).toBe('');
  });

  it('should recursively sanitize deeply nested request payloads', () => {
    const payload = {
      user: {
        name: '  <b>Alice</b>  ',
        notes: '<script>steal()</script>Critical blood needed',
      },
      tags: ['<iframe src="evil.com"></iframe>tag1', 'tag2'],
    };

    const cleaned = sanitizeObject(payload);
    expect(cleaned.user.name).toBe('Alice');
    expect(cleaned.user.notes).toBe('Critical blood needed');
    expect(cleaned.tags[0]).toBe('tag1');
  });
});
