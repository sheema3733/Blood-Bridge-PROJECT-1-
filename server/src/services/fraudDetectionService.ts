import { prisma } from '../prisma';
import { calculateDistanceKm } from '../utils/geoDistance';

export interface FraudSignal {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  weight: number;
}

export interface FraudAssessment {
  riskScore: number; // 0 to 100
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  isFlagged: boolean;
  signals: FraudSignal[];
  recommendedAction: 'ALLOW' | 'TRIAGE_REVIEW' | 'REQUIRE_HOSPITAL_ESCALATION';
}

/**
 * Platform-Level Non-Medical Fraud and Suspicious Activity Service
 * Protects emergency response lines and donors from alarm fatigue and abusive patterns.
 */
export async function evaluateSuspiciousRequest(params: {
  userId: string;
  hospitalId: string;
  bloodGroup: string;
  units: number;
  latitude: number;
  longitude: number;
  ipAddress?: string;
}): Promise<FraudAssessment> {
  const signals: FraudSignal[] = [];
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 1. High Velocity Check: Check request count from this user in past hour
  const recentUserRequests = await prisma.bloodRequest.count({
    where: {
      requesterId: params.userId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentUserRequests >= 3) {
    signals.push({
      type: 'RAPID_SUBMISSION_BURST',
      severity: 'HIGH',
      description: `User initiated ${recentUserRequests} requests within the past 60 minutes.`,
      weight: 40,
    });
  } else if (recentUserRequests >= 2) {
    signals.push({
      type: 'ELEVATED_SUBMISSION_RATE',
      severity: 'MEDIUM',
      description: 'Multiple requests created in short succession.',
      weight: 20,
    });
  }

  // 2. Geolocation Mismatch: Compare requester coordinates with hospital coordinates
  const hospital = await prisma.hospitalProfile.findUnique({
    where: { id: params.hospitalId },
  });

  if (hospital && params.latitude && params.longitude) {
    const distKm = calculateDistanceKm(
      hospital.latitude,
      hospital.longitude,
      params.latitude,
      params.longitude
    );

    if (distKm > 150) {
      signals.push({
        type: 'REMOTE_COORDINATES_DISCREPANCY',
        severity: 'MEDIUM',
        description: `Submission coordinates are ${distKm} km away from the destination hospital.`,
        weight: 25,
      });
    }
  }

  // 3. Inconsistent Blood Group Check: Multiple different blood groups requested in 24 hours
  const pastDayRequests = await prisma.bloodRequest.findMany({
    where: {
      requesterId: params.userId,
      createdAt: { gte: twentyFourHoursAgo },
    },
    select: { bloodGroup: true },
  });

  const uniqueGroups = new Set(pastDayRequests.map((r) => r.bloodGroup));
  uniqueGroups.add(params.bloodGroup);

  if (uniqueGroups.size >= 3) {
    signals.push({
      type: 'MULTIPLE_DIVERGENT_BLOOD_GROUPS',
      severity: 'HIGH',
      description: `Requester has submitted appeals for ${uniqueGroups.size} different blood types in 24 hours.`,
      weight: 35,
    });
  }

  // Calculate composite risk score
  const totalScore = Math.min(100, signals.reduce((sum, s) => sum + s.weight, 0));

  let riskTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let recommendedAction: 'ALLOW' | 'TRIAGE_REVIEW' | 'REQUIRE_HOSPITAL_ESCALATION' = 'ALLOW';

  if (totalScore >= 60) {
    riskTier = 'HIGH';
    recommendedAction = 'REQUIRE_HOSPITAL_ESCALATION';
  } else if (totalScore >= 25) {
    riskTier = 'MEDIUM';
    recommendedAction = 'TRIAGE_REVIEW';
  }

  return {
    riskScore: totalScore,
    riskTier,
    isFlagged: totalScore >= 25,
    signals,
    recommendedAction,
  };
}
