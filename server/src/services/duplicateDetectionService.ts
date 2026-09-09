import { prisma } from '../prisma';
import { BloodGroup } from '../../../shared/types';
import { config } from '../config';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarityScore: number;
  matchedRequestId?: string;
  reasons: string[];
}

/**
 * Platform-level Duplicate Request Detection Service
 * Evaluates active or recently submitted requests within the past 24 hours
 * against the new request submission.
 */
export async function detectDuplicateRequest(params: {
  hospitalId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  requiredBy: Date;
  excludeRequestId?: string;
}): Promise<DuplicateCheckResult> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find non-completed/non-rejected requests from the last 24 hours
  const recentRequests = await prisma.bloodRequest.findMany({
    where: {
      status: {
        in: [
          'PENDING_VERIFICATION',
          'HOSPITAL_VERIFIED',
          'MATCHING_IN_PROGRESS',
          'DONORS_NOTIFIED',
          'DONOR_CONFIRMED',
        ],
      },
      createdAt: {
        gte: twentyFourHoursAgo,
      },
      ...(params.excludeRequestId ? { id: { not: params.excludeRequestId } } : {}),
    },
  });

  let maxSimilarityScore = 0;
  let mostSimilarRequestId: string | undefined;
  let detectedReasons: string[] = [];

  for (const req of recentRequests) {
    let score = 0;
    const reasons: string[] = [];

    // Factor 1: Same Hospital (+40%)
    if (req.hospitalId === params.hospitalId) {
      score += 40;
      reasons.push('Identical hospital location');
    }

    // Factor 2: Same Blood Group (+30%)
    if (req.bloodGroup === params.bloodGroup) {
      score += 30;
      reasons.push(`Identical blood group (${params.bloodGroup})`);
    }

    // Factor 3: Similar Unit Count (within +/- 1 unit) (+15%)
    const unitDiff = Math.abs(req.unitsRequired - params.unitsRequired);
    if (unitDiff === 0) {
      score += 15;
      reasons.push('Exact unit count requirement');
    } else if (unitDiff <= 1) {
      score += 10;
      reasons.push('Near identical unit count requirement');
    }

    // Factor 4: Overlapping Required-By Window (within 12 hours) (+15%)
    const timeDiffHours =
      Math.abs(new Date(req.requiredBy).getTime() - new Date(params.requiredBy).getTime()) /
      (1000 * 60 * 60);

    if (timeDiffHours <= 6) {
      score += 15;
      reasons.push('Very close required-by time window (<6h)');
    } else if (timeDiffHours <= 12) {
      score += 10;
      reasons.push('Overlapping required-by time window (<12h)');
    }

    if (score > maxSimilarityScore) {
      maxSimilarityScore = score;
      mostSimilarRequestId = req.id;
      detectedReasons = reasons;
    }
  }

  const isDuplicate = maxSimilarityScore >= config.duplicateThreshold;

  return {
    isDuplicate,
    similarityScore: maxSimilarityScore,
    matchedRequestId: mostSimilarRequestId,
    reasons: detectedReasons,
  };
}
