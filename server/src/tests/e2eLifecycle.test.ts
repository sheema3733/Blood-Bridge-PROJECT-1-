import { describe, it, expect, beforeEach } from 'vitest';
import { isBloodCompatible, getBloodGroupScore } from '../../../shared/bloodRules';
import { calculateDistanceKm } from '../utils/geoDistance';
import { getDonorPreferences, updateDonorPreferences, isDonorEligibleForAlert } from '../services/donorPreferences';
import { evaluateHealthScreening } from '../services/healthScreeningService';
import { recordVerifiedDonation, getDonorProfile } from '../services/badgeService';
import { submitDonationFeedback, getDonorFeedbackSummary } from '../services/feedbackService';
import { restockBloodBatch, reserveUnits, dispenseUnits, getHospitalInventory } from '../services/inventoryService';
import { recordMatchingLatency, recordRequestDispatched, recordDonationFulfilled, getTelemetrySnapshot } from '../services/telemetryService';
import { recordAuditEvent, verifyAuditLedgerIntegrity } from '../services/auditTrailService';

describe('BloodBridge Complete Lifecyle End-to-End Orchestration Scenario', () => {
  beforeEach(() => {
    // Clean environment
  });

  it('orchestrates complete blood coordination from incident trauma to donor honor milestone', () => {
    // STEP 1: Emergency Trauma Admission & Hospital Stock Check
    // Hospital checks O- units
    const hospId = 'hosp_trauma_center';
    restockBloodBatch({
      hospitalId: hospId,
      bloodGroup: 'O-',
      units: 2,
    });

    // Patient requires 4 units O-
    const reservation = reserveUnits(hospId, 'O-', 4);
    expect(reservation.success).toBe(false); // Only 2 in stock, shortage of 2 units

    // Record audit event
    recordAuditEvent({
      action: 'REQUEST_CREATED',
      actorRole: 'HOSPITAL',
      resourceType: 'BLOOD_REQUEST',
      resourceId: 'req_emergency_trauma_01',
      details: { requiredUnits: 4, stockAvailable: 2, deficit: 2 },
    });

    // STEP 2: Emergency Request Dispatched via Smart Matching
    const patientLocation = { lat: 17.385044, lng: 78.486671 }; // Hyderabad Center
    const donorLocation = { lat: 17.4399, lng: 78.4983 };      // ~6.2 km away

    const distance = calculateDistanceKm(
      patientLocation.lat,
      patientLocation.lng,
      donorLocation.lat,
      donorLocation.lng
    );
    expect(distance).toBeLessThan(10); // Close proximity

    const isCompatible = isBloodCompatible('O-', 'O-');
    expect(isCompatible).toBe(true);

    const matchScore = getBloodGroupScore('O-', 'O-');
    expect(matchScore).toBe(40); // Maximum compatibility score

    // STEP 3: Donor Preferences & Quiet Hours Filter
    const donorId = 'donor_arjun';
    updateDonorPreferences(donorId, {
      maxTravelDistanceKm: 15,
      channels: ['PUSH', 'SMS'],
      quietHoursEnabled: false,
    });

    const alertCheck = isDonorEligibleForAlert(donorId, 'CRITICAL', distance);
    expect(alertCheck.eligible).toBe(true);
    expect(alertCheck.matchedChannels).toContain('PUSH');

    recordRequestDispatched(true, 5);
    recordMatchingLatency(14);

    // STEP 4: Donor Pre-Screening & Acceptance
    const screening = evaluateHealthScreening({
      donorId,
      weightKg: 72,
      ageYears: 27,
      feelsHealthyToday: true,
      hasActiveFeverOrInfection: false,
      isTakingAntibiotics: false,
      lastDonationDaysAgo: 75,
    });
    expect(screening.isEligible).toBe(true);

    // STEP 5: Hospital Transfusion Verification & Fulfillment
    // Donor donates 2 units, hospital restocks and dispenses to patient
    restockBloodBatch({
      hospitalId: hospId,
      bloodGroup: 'O-',
      units: 2,
    });
    const finalReserve = reserveUnits(hospId, 'O-', 4);
    expect(finalReserve.success).toBe(true);

    const dispensed = dispenseUnits(hospId, 'O-', 4);
    expect(dispensed).toBe(true);

    recordDonationFulfilled(true, 45); // 45 minutes SLA

    // STEP 6: Gamification Badge Award
    const gamification = recordVerifiedDonation({
      donorId,
      bloodGroup: 'O-',
      responseTimeMinutes: 12, // fast response
    });
    expect(gamification.profile.totalDonations).toBe(1);
    expect(gamification.profile.livesSavedEstimated).toBe(3);
    expect(gamification.newlyAwarded.some((b) => b.badgeId === 'FIRST_DROP')).toBe(true);
    expect(gamification.newlyAwarded.some((b) => b.badgeId === 'RARE_BLOOD_DEFENDER')).toBe(true);
    expect(gamification.newlyAwarded.some((b) => b.badgeId === 'LIGHTNING_RESPONDER')).toBe(true);

    // STEP 7: Requester Appreciation Feedback
    const fb = submitDonationFeedback({
      requestId: 'req_emergency_trauma_01',
      authorUserId: 'usr_family_member',
      authorRole: 'REQUESTER',
      donorId,
      ratingStars: 5,
      punctualityScore: 5,
      gratitudeMessage: 'Arrived at the trauma center in 30 minutes! Truly a lifesaver.',
    });
    expect(fb.success).toBe(true);

    const feedbackSummary = getDonorFeedbackSummary(donorId);
    expect(feedbackSummary.averageRating).toBe(5.0);
    expect(feedbackSummary.totalReviews).toBe(1);

    // STEP 8: Cryptographic Audit Trail Verification
    recordAuditEvent({
      action: 'BLOOD_TRANSFUSION_COMPLETED',
      actorRole: 'HOSPITAL',
      resourceType: 'BLOOD_REQUEST',
      resourceId: 'req_emergency_trauma_01',
      details: { status: 'COMPLETED', donorId, unitsTransfused: 4 },
    });

    const auditIntegrity = verifyAuditLedgerIntegrity();
    expect(auditIntegrity.isValid).toBe(true);

    // Telemetry check
    const telemetry = getTelemetrySnapshot();
    expect(telemetry.totalDonationsFulfilled).toBeGreaterThanOrEqual(1);
    expect(telemetry.fulfillmentSuccessRatePercent).toBeGreaterThan(0);
  });
});
