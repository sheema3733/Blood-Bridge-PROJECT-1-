import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDonorProfile,
  awardBadge,
  recordVerifiedDonation,
  getCommunityLeaderboard,
  resetBadgeStore,
} from '../services/badgeService';

describe('Donor Recognition & Gamification Service', () => {
  beforeEach(() => {
    resetBadgeStore();
  });

  it('should initialize a donor profile with volunteer status and zero badges', () => {
    const profile = getDonorProfile('donor_hero_1');
    expect(profile.donorId).toBe('donor_hero_1');
    expect(profile.totalDonations).toBe(0);
    expect(profile.rankingTier).toBe('VOLUNTEER');
    expect(profile.badges.length).toBe(0);
  });

  it('should award FIRST_DROP badge and increment saved lives on first donation', () => {
    const result = recordVerifiedDonation({
      donorId: 'donor_hero_1',
      bloodGroup: 'O+',
    });

    expect(result.profile.totalDonations).toBe(1);
    expect(result.profile.livesSavedEstimated).toBe(3);
    expect(result.newlyAwarded.some((b) => b.badgeId === 'FIRST_DROP')).toBe(true);
  });

  it('should award RARE_BLOOD_DEFENDER badge for negative blood groups', () => {
    const result = recordVerifiedDonation({
      donorId: 'donor_hero_rare',
      bloodGroup: 'O-',
    });

    expect(result.newlyAwarded.some((b) => b.badgeId === 'RARE_BLOOD_DEFENDER')).toBe(true);
  });

  it('should award LIGHTNING_RESPONDER badge for fast responses <= 15 mins', () => {
    const result = recordVerifiedDonation({
      donorId: 'donor_speedy',
      bloodGroup: 'A+',
      responseTimeMinutes: 12,
    });

    expect(result.newlyAwarded.some((b) => b.badgeId === 'LIGHTNING_RESPONDER')).toBe(true);
  });

  it('should prevent duplicate badge awards to the same donor', () => {
    const first = awardBadge('donor_unique', 'FIRST_DROP');
    expect(first.awarded).toBe(true);

    const second = awardBadge('donor_unique', 'FIRST_DROP');
    expect(second.awarded).toBe(false);
  });

  it('should promote ranking tiers as reputation points accumulate', () => {
    // Record multiple donations
    for (let i = 0; i < 10; i++) {
      recordVerifiedDonation({
        donorId: 'donor_veteran',
        bloodGroup: 'B+',
      });
    }

    const profile = getDonorProfile('donor_veteran');
    expect(profile.totalDonations).toBe(10);
    expect(profile.badges.some((b) => b.badgeId === 'LIFE_GUARDIAN_GOLD')).toBe(true);
    expect(['GOLD_CHAMPION', 'LEGENDARY_GUARDIAN']).toContain(profile.rankingTier);
  });

  it('should sort community leaderboard by total reputation points', () => {
    recordVerifiedDonation({ donorId: 'donor_alpha', bloodGroup: 'O+' });
    recordVerifiedDonation({ donorId: 'donor_beta', bloodGroup: 'O-' }); // rare gets more points
    recordVerifiedDonation({ donorId: 'donor_beta', bloodGroup: 'O-' });

    const leaderboard = getCommunityLeaderboard();
    expect(leaderboard.length).toBeGreaterThanOrEqual(2);
    expect(leaderboard[0].donorId).toBe('donor_beta');
  });
});
