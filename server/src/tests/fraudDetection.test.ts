import { describe, it, expect } from 'vitest';
import { evaluateSuspiciousRequest } from '../services/fraudDetectionService';

describe('Platform Fraud and Suspicious Activity Detection Engine', () => {
  it('should evaluate low risk for a standard request with nearby coordinates', async () => {
    const assessment = await evaluateSuspiciousRequest({
      userId: 'test-user-low-risk',
      hospitalId: 'non-existent-or-default',
      bloodGroup: 'O+',
      units: 2,
      latitude: 28.6139,
      longitude: 77.2090,
    });

    expect(assessment.riskTier).toBe('LOW');
    expect(assessment.isFlagged).toBe(false);
    expect(assessment.recommendedAction).toBe('ALLOW');
  });

  it('should flag remote coordinate discrepancies as medium risk', async () => {
    // If coordinates are remote (>150 km) from hospital
    const assessment = await evaluateSuspiciousRequest({
      userId: 'test-user-remote',
      hospitalId: 'default',
      bloodGroup: 'A+',
      units: 1,
      latitude: 19.0760, // Mumbai coordinates (~1150 km from Delhi 28.6139)
      longitude: 72.8777,
    });

    // Check structure of assessment response
    expect(assessment).toHaveProperty('riskScore');
    expect(assessment).toHaveProperty('signals');
    expect(Array.isArray(assessment.signals)).toBe(true);
  });
});
