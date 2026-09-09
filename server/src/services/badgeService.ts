/**
 * BloodBridge Donor Recognition & Gamification Service
 * Evaluates donor milestones, awards achievement badges, calculates
 * community rankings, and generates donation certificates.
 */

export type BadgeId =
  | 'FIRST_DROP'           // Awarded on 1st verified donation
  | 'LIFE_GUARDIAN_BRONZE' // Awarded on 3 donations
  | 'LIFE_GUARDIAN_SILVER' // Awarded on 5 donations
  | 'LIFE_GUARDIAN_GOLD'   // Awarded on 10 donations
  | 'CENTURION_HERO'       // Awarded on 25+ donations
  | 'RARE_BLOOD_DEFENDER'  // Awarded to rare blood donors (Rh-, AB-)
  | 'MIDNIGHT_SAVIOR'      // Awarded for responding to emergency requests during night hours
  | 'LIGHTNING_RESPONDER'; // Awarded for responding within 15 minutes of alert

export interface BadgeDefinition {
  id: BadgeId;
  title: string;
  description: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  icon: string;
  points: number;
}

export interface DonorAwardedBadge {
  badgeId: BadgeId;
  title: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  awardedAt: string;
  pointsAwarded: number;
}

export interface DonorGamificationProfile {
  donorId: string;
  totalDonations: number;
  livesSavedEstimated: number; // totalDonations * 3
  reputationPoints: number;
  currentStreak: number;
  badges: DonorAwardedBadge[];
  rankingTier: 'VOLUNTEER' | 'SILVER_HERO' | 'GOLD_CHAMPION' | 'LEGENDARY_GUARDIAN';
}

export const BADGE_CATALOG: Record<BadgeId, BadgeDefinition> = {
  FIRST_DROP: {
    id: 'FIRST_DROP',
    title: 'First Drop',
    description: 'Completed your very first lifesaving blood donation.',
    tier: 'BRONZE',
    icon: 'droplet',
    points: 100,
  },
  LIFE_GUARDIAN_BRONZE: {
    id: 'LIFE_GUARDIAN_BRONZE',
    title: 'Life Guardian (Bronze)',
    description: 'Completed 3 successful blood donations.',
    tier: 'BRONZE',
    icon: 'shield',
    points: 250,
  },
  LIFE_GUARDIAN_SILVER: {
    id: 'LIFE_GUARDIAN_SILVER',
    title: 'Life Guardian (Silver)',
    description: 'Completed 5 successful blood donations.',
    tier: 'SILVER',
    icon: 'award',
    points: 500,
  },
  LIFE_GUARDIAN_GOLD: {
    id: 'LIFE_GUARDIAN_GOLD',
    title: 'Life Guardian (Gold)',
    description: 'Completed 10 successful blood donations.',
    tier: 'GOLD',
    icon: 'star',
    points: 1200,
  },
  CENTURION_HERO: {
    id: 'CENTURION_HERO',
    title: 'Centurion Lifesaver',
    description: 'Achieved an extraordinary milestone of 25+ verified blood donations.',
    tier: 'PLATINUM',
    icon: 'crown',
    points: 3500,
  },
  RARE_BLOOD_DEFENDER: {
    id: 'RARE_BLOOD_DEFENDER',
    title: 'Rare Blood Defender',
    description: 'Responded to critical shortage for a rare negative blood group.',
    tier: 'GOLD',
    icon: 'heart',
    points: 800,
  },
  MIDNIGHT_SAVIOR: {
    id: 'MIDNIGHT_SAVIOR',
    title: 'Midnight Savior',
    description: 'Answered an emergency call between 10 PM and 6 AM.',
    tier: 'SILVER',
    icon: 'moon',
    points: 400,
  },
  LIGHTNING_RESPONDER: {
    id: 'LIGHTNING_RESPONDER',
    title: 'Lightning Responder',
    description: 'Accepted an emergency dispatch within 15 minutes of notification.',
    tier: 'BRONZE',
    icon: 'zap',
    points: 150,
  },
};

const donorProfiles = new Map<string, DonorGamificationProfile>();

function computeRankingTier(points: number): DonorGamificationProfile['rankingTier'] {
  if (points >= 3000) return 'LEGENDARY_GUARDIAN';
  if (points >= 1500) return 'GOLD_CHAMPION';
  if (points >= 500) return 'SILVER_HERO';
  return 'VOLUNTEER';
}

/**
 * Get or initialize donor gamification profile
 */
export function getDonorProfile(donorId: string): DonorGamificationProfile {
  let profile = donorProfiles.get(donorId);
  if (!profile) {
    profile = {
      donorId,
      totalDonations: 0,
      livesSavedEstimated: 0,
      reputationPoints: 0,
      currentStreak: 0,
      badges: [],
      rankingTier: 'VOLUNTEER',
    };
    donorProfiles.set(donorId, profile);
  }
  return { ...profile, badges: [...profile.badges] };
}

/**
 * Award a specific badge to a donor if not already owned
 */
export function awardBadge(donorId: string, badgeId: BadgeId): { awarded: boolean; badge?: DonorAwardedBadge } {
  const profile = getDonorProfile(donorId);
  const catalogEntry = BADGE_CATALOG[badgeId];

  if (!catalogEntry) return { awarded: false };

  // Check duplicate badge
  if (profile.badges.some((b) => b.badgeId === badgeId)) {
    return { awarded: false };
  }

  const newBadge: DonorAwardedBadge = {
    badgeId,
    title: catalogEntry.title,
    tier: catalogEntry.tier,
    awardedAt: new Date().toISOString(),
    pointsAwarded: catalogEntry.points,
  };

  profile.badges.push(newBadge);
  profile.reputationPoints += catalogEntry.points;
  profile.rankingTier = computeRankingTier(profile.reputationPoints);

  donorProfiles.set(donorId, profile);
  return { awarded: true, badge: newBadge };
}

/**
 * Record a verified donation and evaluate milestone badges
 */
export function recordVerifiedDonation(params: {
  donorId: string;
  bloodGroup: string;
  isNightEmergency?: boolean;
  responseTimeMinutes?: number;
}): { profile: DonorGamificationProfile; newlyAwarded: DonorAwardedBadge[] } {
  const profile = getDonorProfile(params.donorId);
  profile.totalDonations += 1;
  profile.livesSavedEstimated = profile.totalDonations * 3;
  profile.reputationPoints += 50; // base points per donation
  profile.currentStreak += 1;
  profile.rankingTier = computeRankingTier(profile.reputationPoints);
  donorProfiles.set(params.donorId, profile);

  const newlyAwarded: DonorAwardedBadge[] = [];

  // Milestone 1: First donation
  if (profile.totalDonations === 1) {
    const res = awardBadge(params.donorId, 'FIRST_DROP');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  // Milestone 3
  if (profile.totalDonations >= 3) {
    const res = awardBadge(params.donorId, 'LIFE_GUARDIAN_BRONZE');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  // Milestone 5
  if (profile.totalDonations >= 5) {
    const res = awardBadge(params.donorId, 'LIFE_GUARDIAN_SILVER');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  // Milestone 10
  if (profile.totalDonations >= 10) {
    const res = awardBadge(params.donorId, 'LIFE_GUARDIAN_GOLD');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  // Milestone 25
  if (profile.totalDonations >= 25) {
    const res = awardBadge(params.donorId, 'CENTURION_HERO');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  // Rare blood check (Rh- or AB)
  if (params.bloodGroup.includes('-') || params.bloodGroup.includes('NEG') || params.bloodGroup.startsWith('AB')) {
    const res = awardBadge(params.donorId, 'RARE_BLOOD_DEFENDER');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  // Night emergency check
  if (params.isNightEmergency) {
    const res = awardBadge(params.donorId, 'MIDNIGHT_SAVIOR');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  // Fast response check (< 15 mins)
  if (params.responseTimeMinutes !== undefined && params.responseTimeMinutes <= 15) {
    const res = awardBadge(params.donorId, 'LIGHTNING_RESPONDER');
    if (res.awarded && res.badge) newlyAwarded.push(res.badge);
  }

  const updatedProfile = getDonorProfile(params.donorId);
  return {
    profile: updatedProfile,
    newlyAwarded,
  };
}

/**
 * Get top donors community leaderboard
 */
export function getCommunityLeaderboard(limit = 10): DonorGamificationProfile[] {
  return Array.from(donorProfiles.values())
    .sort((a, b) => b.reputationPoints - a.reputationPoints)
    .slice(0, limit);
}

/**
 * Reset store for testing
 */
export function resetBadgeStore(): void {
  donorProfiles.clear();
}
