import { prisma } from '../prisma';
import { BloodGroup } from '../../../shared/types';
import { getCompatibleDonorGroups, getBloodGroupScore } from '../utils/bloodCompatibility';
import { calculateDistanceKm } from '../utils/geoDistance';
import { createNotification } from './notificationService';
import { emitToUser, emitToRequest, emitToRole, broadcastGlobal } from '../realtime/socketHandler';
import { SOCKET_EVENTS } from '../realtime/events';
import { config } from '../config';

export async function runDonorMatching(requestId: string, radiusKm?: number) {
  const request = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
    include: {
      hospital: true,
      requester: {
        select: {
          fullName: true,
        },
      },
    },
  });

  if (!request) {
    throw new Error(`Blood request ${requestId} not found.`);
  }

  const effectiveRadius = radiusKm || config.escalation.stage1RadiusKm;
  const compatibleGroups = getCompatibleDonorGroups(request.bloodGroup as BloodGroup);

  // Retrieve eligible active donors with compatible blood types
  const eligibleDonors = await prisma.donorProfile.findMany({
    where: {
      bloodGroup: {
        in: compatibleGroups,
      },
      availabilityStatus: {
        in: ['AVAILABLE', 'AVAILABLE_LATER'],
      },
      user: {
        status: 'ACTIVE',
      },
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  const hospitalLat = request.hospital?.latitude || request.latitude || 0;
  const hospitalLon = request.hospital?.longitude || request.longitude || 0;

  const matchesToProcess = [];

  for (const donor of eligibleDonors) {
    const distance = calculateDistanceKm(
      hospitalLat,
      hospitalLon,
      donor.latitude,
      donor.longitude
    );

    // Filter within current stage radius limit
    if (distance > effectiveRadius) {
      continue;
    }

    // 1. Blood Compatibility Score (Max 40)
    const bloodScore = getBloodGroupScore(
      donor.bloodGroup as BloodGroup,
      request.bloodGroup as BloodGroup
    );

    // 2. Availability Score (Max 25)
    let availabilityScore = 0;
    if (donor.availabilityStatus === 'AVAILABLE') {
      availabilityScore = 25;
    } else if (donor.availabilityStatus === 'AVAILABLE_LATER') {
      availabilityScore = 10;
    }

    // 3. Proximity / Distance Score (Max 20)
    // Closer donors get higher score
    const proximityRatio = Math.max(0, 1 - distance / effectiveRadius);
    const distanceScore = Math.round(proximityRatio * 20);

    // 4. Historical Reliability Score (Max 15)
    const reliabilityScore = Math.round((donor.reliabilityScore / 100) * 15);

    // Composite platform coordination score
    const totalScore = Math.min(
      100,
      Math.max(1, bloodScore + availabilityScore + distanceScore + reliabilityScore)
    );

    matchesToProcess.push({
      donor,
      distanceKm: distance,
      matchScore: totalScore,
    });
  }

  // Sort descending by match score
  matchesToProcess.sort((a, b) => b.matchScore - a.matchScore);

  const createdMatches = [];

  for (const item of matchesToProcess) {
    // Check if match record already exists
    const existing = await prisma.donorMatch.findFirst({
      where: {
        requestId: request.id,
        donorId: item.donor.id,
      },
    });

    let matchRecord;
    if (!existing) {
      matchRecord = await prisma.donorMatch.create({
        data: {
          requestId: request.id,
          donorId: item.donor.id,
          matchScore: item.matchScore,
          distanceKm: item.distanceKm,
          status: 'NOTIFIED',
          notifiedAt: new Date(),
        },
      });

      // Send In-App notification & Real-time push to donor
      await createNotification({
        userId: item.donor.userId,
        category: 'EMERGENCY_REQUEST',
        title: `🚨 Blood Emergency: ${request.bloodGroup} Needed`,
        message: `Urgent request at ${request.hospital.hospitalName} (${item.distanceKm} km away). Can you donate?`,
        linkUrl: `/donor/dashboard?request=${request.id}`,
      });

      emitToUser(item.donor.userId, SOCKET_EVENTS.DONOR_NOTIFIED, {
        matchId: matchRecord.id,
        requestId: request.id,
        bloodGroup: request.bloodGroup,
        unitsRequired: request.unitsRequired,
        urgency: request.urgency,
        hospitalName: request.hospital.hospitalName,
        distanceKm: item.distanceKm,
        matchScore: item.matchScore,
        requiredBy: request.requiredBy,
      });

      createdMatches.push(matchRecord);
    } else {
      createdMatches.push(existing);
    }
  }

  // Update request status to DONORS_NOTIFIED if matching in progress
  if (createdMatches.length > 0 && request.status === 'MATCHING_IN_PROGRESS') {
    await prisma.bloodRequest.update({
      where: { id: request.id },
      data: { status: 'DONORS_NOTIFIED' },
    });

    await prisma.requestStatusHistory.create({
      data: {
        requestId: request.id,
        fromStatus: 'MATCHING_IN_PROGRESS',
        toStatus: 'DONORS_NOTIFIED',
        changedByUserId: request.requesterId,
        reason: `${createdMatches.length} compatible donors matched within ${effectiveRadius} km`,
      },
    });
  }

  // Broadcast real-time matching update
  const payload = {
    requestId: request.id,
    matchesCount: createdMatches.length,
    radiusKm: effectiveRadius,
    status: createdMatches.length > 0 ? 'DONORS_NOTIFIED' : request.status,
  };

  emitToRequest(request.id, SOCKET_EVENTS.DONOR_MATCHED, payload);
  emitToRole('ADMIN', SOCKET_EVENTS.DONOR_MATCHED, payload);
  emitToRole('HOSPITAL', SOCKET_EVENTS.DONOR_MATCHED, payload);

  return {
    matchedCount: createdMatches.length,
    radiusKm: effectiveRadius,
    matches: createdMatches,
  };
}
