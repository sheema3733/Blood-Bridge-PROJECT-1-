import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDonorPreferences,
  updateDonorPreferences,
  isDonorEligibleForAlert,
  resetPreferencesStore,
} from '../services/donorPreferences';

describe('Donor Preferences & Alert Eligibility Service', () => {
  beforeEach(() => {
    resetPreferencesStore();
  });

  it('should return sensible default preferences for a new donor', () => {
    const prefs = getDonorPreferences('donor_101');
    expect(prefs.donorId).toBe('donor_101');
    expect(prefs.maxTravelDistanceKm).toBe(25);
    expect(prefs.channels).toContain('PUSH');
    expect(prefs.channels).toContain('SMS');
    expect(prefs.emergencyOnly).toBe(false);
  });

  it('should clamp travel distance within safe bounds (1 - 150 km)', () => {
    const updatedLow = updateDonorPreferences('donor_102', { maxTravelDistanceKm: -10 });
    expect(updatedLow.maxTravelDistanceKm).toBe(1);

    const updatedHigh = updateDonorPreferences('donor_102', { maxTravelDistanceKm: 999 });
    expect(updatedHigh.maxTravelDistanceKm).toBe(150);
  });

  it('should filter out alert when distance exceeds preferred travel radius', () => {
    updateDonorPreferences('donor_103', { maxTravelDistanceKm: 15 });

    const withinRange = isDonorEligibleForAlert('donor_103', 'URGENT', 10);
    expect(withinRange.eligible).toBe(true);

    const beyondRange = isDonorEligibleForAlert('donor_103', 'URGENT', 20);
    expect(beyondRange.eligible).toBe(false);
    expect(beyondRange.reason).toContain('exceeds preferred maximum');
  });

  it('should suppress routine alerts during quiet hours but allow critical emergencies', () => {
    updateDonorPreferences('donor_104', {
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
    });

    // Mock time at 23:30 (11:30 PM)
    const nightTime = new Date('2026-09-09T23:30:00');

    const routineAlert = isDonorEligibleForAlert('donor_104', 'ROUTINE', 5, nightTime);
    expect(routineAlert.eligible).toBe(false);
    expect(routineAlert.reason).toContain('quiet hours');

    const criticalAlert = isDonorEligibleForAlert('donor_104', 'CRITICAL', 5, nightTime);
    expect(criticalAlert.eligible).toBe(true);
  });

  it('should filter non-critical alerts if emergencyOnly is configured', () => {
    updateDonorPreferences('donor_105', { emergencyOnly: true });

    const urgentAlert = isDonorEligibleForAlert('donor_105', 'URGENT', 5);
    expect(urgentAlert.eligible).toBe(false);

    const criticalAlert = isDonorEligibleForAlert('donor_105', 'CRITICAL', 5);
    expect(criticalAlert.eligible).toBe(true);
  });
});
