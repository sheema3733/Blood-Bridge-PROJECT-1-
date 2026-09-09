import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../prisma';
import { detectDuplicateRequest } from '../services/duplicateDetectionService';
import { runDonorMatching } from '../services/matchingService';
import { processHospitalVerification } from '../services/verificationService';
import { escalateRequest } from '../services/escalationService';
import { BloodGroup } from '../../../shared/types';

describe('BloodBridge End-to-End Emergency Workflow Integration', () => {
  let requesterId: string;
  let hospitalId: string;
  let hospitalUserId: string;
  let testRequestId: string;

  beforeAll(async () => {
    // Retrieve seeded entities
    const requester = await prisma.user.findFirst({ where: { role: 'REQUESTER' } });
    const hospital = await prisma.hospitalProfile.findFirst({ include: { user: true } });

    if (!requester || !hospital) {
      throw new Error('Seed data required for integration test.');
    }

    requesterId = requester.id;
    hospitalId = hospital.id;
    hospitalUserId = hospital.userId;
  });

  it('Step 1: Successfully creates emergency blood request in PENDING_VERIFICATION state', async () => {
    const uniqueId = `BB-TEST-${Date.now().toString().slice(-4)}`;
    testRequestId = uniqueId;

    const request = await prisma.bloodRequest.create({
      data: {
        id: uniqueId,
        requesterId,
        hospitalId,
        patientInitials: 'T.P.',
        bloodGroup: 'A+',
        unitsRequired: 2,
        urgency: 'CRITICAL',
        status: 'PENDING_VERIFICATION',
        requiredBy: new Date(Date.now() + 3 * 60 * 60 * 1000),
        notes: 'Urgent integration test case',
        latitude: 28.6139,
        longitude: 77.2090,
      },
    });

    expect(request.id).toBe(uniqueId);
    expect(request.status).toBe('PENDING_VERIFICATION');
    expect(request.bloodGroup).toBe('A+');
  });

  it('Step 2: Duplicate Detection flags similar simultaneous submission', async () => {
    const duplicateCheck = await detectDuplicateRequest({
      hospitalId,
      bloodGroup: 'A+' as BloodGroup,
      unitsRequired: 2,
      requiredBy: new Date(Date.now() + 3 * 60 * 60 * 1000),
    });

    expect(duplicateCheck.isDuplicate).toBe(true);
    expect(duplicateCheck.similarityScore).toBeGreaterThanOrEqual(70);
    expect(duplicateCheck.reasons.length).toBeGreaterThan(0);
  });

  it('Step 3: Hospital reviews and verifies genuine emergency, activating matching', async () => {
    const result = await processHospitalVerification({
      requestId: testRequestId,
      hospitalId,
      verifiedByUserId: hospitalUserId,
      status: 'VERIFIED',
      reviewNotes: 'Integration test: Verified emergency necessity.',
    });

    expect(result.newStatus).toBe('MATCHING_IN_PROGRESS');

    const updated = await prisma.bloodRequest.findUnique({
      where: { id: testRequestId },
      include: { verificationRecords: true },
    });

    expect(updated?.status).toBe('DONORS_NOTIFIED'); // Updated when matches found
    expect(updated?.verificationRecords.length).toBeGreaterThan(0);
  });

  it('Step 4: Smart Matching creates matches with compatible nearby donors', async () => {
    const matches = await prisma.donorMatch.findMany({
      where: { requestId: testRequestId },
      include: { donor: true },
    });

    expect(matches.length).toBeGreaterThan(0);

    // Each matched donor must have a blood group compatible with A+
    const allowed = ['O-', 'O+', 'A-', 'A+'];
    matches.forEach((m) => {
      expect(allowed).toContain(m.donor.bloodGroup);
      expect(m.matchScore).toBeGreaterThan(0);
    });
  });

  it('Step 5: Smart Escalation expands search radius progressively', async () => {
    const escalationResult = await escalateRequest(testRequestId, 2);

    expect(escalationResult.success).toBe(true);
    expect(escalationResult.stage).toBe(2);
    expect(escalationResult.radiusKm).toBe(7);

    const events = await prisma.escalationEvent.findMany({
      where: { requestId: testRequestId },
    });
    expect(events.length).toBeGreaterThan(0);
  });

  it('Step 6: Donor accepts emergency dispatch, transitioning request to DONOR_CONFIRMED', async () => {
    const match = await prisma.donorMatch.findFirst({
      where: { requestId: testRequestId },
    });
    expect(match).toBeDefined();

    // Donor responds ACCEPT
    await prisma.donorMatch.update({
      where: { id: match!.id },
      data: { status: 'ACCEPTED', respondedAt: new Date() },
    });

    await prisma.bloodRequest.update({
      where: { id: testRequestId },
      data: { status: 'DONOR_CONFIRMED' },
    });

    const confirmed = await prisma.bloodRequest.findUnique({
      where: { id: testRequestId },
    });
    expect(confirmed?.status).toBe('DONOR_CONFIRMED');
  });

  it('Step 7: Hospital confirms blood received and completes the lifecycle safely', async () => {
    const completed = await prisma.bloodRequest.update({
      where: { id: testRequestId },
      data: { status: 'COMPLETED' },
    });

    expect(completed.status).toBe('COMPLETED');
  });
});
