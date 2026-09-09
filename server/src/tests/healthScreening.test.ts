import { describe, it, expect } from 'vitest';
import { evaluateHealthScreening } from '../services/healthScreeningService';

describe('Pre-Donation Clinical Health Screening Service', () => {
  it('should clear healthy adult donors meeting all eligibility criteria', () => {
    const verdict = evaluateHealthScreening({
      donorId: 'd_healthy',
      weightKg: 68,
      ageYears: 28,
      feelsHealthyToday: true,
      hasActiveFeverOrInfection: false,
      isTakingAntibiotics: false,
      lastDonationDaysAgo: 90,
    });

    expect(verdict.isEligible).toBe(true);
    expect(verdict.disqualifyingReasons.length).toBe(0);
    expect(verdict.advisories.length).toBeGreaterThan(0);
    expect(verdict.nextEligibleDate).toBeUndefined();
  });

  it('should disqualify donors under 18 years of age', () => {
    const verdict = evaluateHealthScreening({
      donorId: 'd_minor',
      weightKg: 55,
      ageYears: 16,
      feelsHealthyToday: true,
      hasActiveFeverOrInfection: false,
      isTakingAntibiotics: false,
    });

    expect(verdict.isEligible).toBe(false);
    expect(verdict.disqualifyingReasons.some((r) => r.includes('18 years'))).toBe(true);
  });

  it('should disqualify donors weighing under 50 kg', () => {
    const verdict = evaluateHealthScreening({
      donorId: 'd_underweight',
      weightKg: 46,
      ageYears: 24,
      feelsHealthyToday: true,
      hasActiveFeverOrInfection: false,
      isTakingAntibiotics: false,
    });

    expect(verdict.isEligible).toBe(false);
    expect(verdict.disqualifyingReasons.some((r) => r.includes('50 kg'))).toBe(true);
  });

  it('should enforce 6-month deferral following recent tattoo or body piercing', () => {
    const verdict = evaluateHealthScreening({
      donorId: 'd_tattoo',
      weightKg: 70,
      ageYears: 22,
      feelsHealthyToday: true,
      hasActiveFeverOrInfection: false,
      isTakingAntibiotics: false,
      hadRecentTattooOrPiercingMonths: 2, // only 2 months ago
    });

    expect(verdict.isEligible).toBe(false);
    expect(verdict.disqualifyingReasons.some((r) => r.includes('tattoo'))).toBe(true);
    expect(verdict.nextEligibleDate).toBeDefined();
  });

  it('should enforce minimum 56-day inter-donation recovery window', () => {
    const verdict = evaluateHealthScreening({
      donorId: 'd_frequent',
      weightKg: 75,
      ageYears: 32,
      feelsHealthyToday: true,
      hasActiveFeverOrInfection: false,
      isTakingAntibiotics: false,
      lastDonationDaysAgo: 30, // only 30 days ago
    });

    expect(verdict.isEligible).toBe(false);
    expect(verdict.disqualifyingReasons.some((r) => r.includes('56 days'))).toBe(true);
  });

  it('should disqualify donors with active infection or antibiotic regimen', () => {
    const verdict = evaluateHealthScreening({
      donorId: 'd_sick',
      weightKg: 62,
      ageYears: 29,
      feelsHealthyToday: false,
      hasActiveFeverOrInfection: true,
      isTakingAntibiotics: true,
    });

    expect(verdict.isEligible).toBe(false);
    expect(verdict.disqualifyingReasons.length).toBeGreaterThanOrEqual(2);
  });
});
