import { describe, it, expect } from 'vitest';
import { validateEnvironment } from '../config/envValidator';

describe('Environment Configuration Validator', () => {
  it('should validate development environment without hard errors', () => {
    const report = validateEnvironment();
    expect(report.isValid).toBe(true);
    expect(Array.isArray(report.warnings)).toBe(true);
    expect(Array.isArray(report.errors)).toBe(true);
  });
});
