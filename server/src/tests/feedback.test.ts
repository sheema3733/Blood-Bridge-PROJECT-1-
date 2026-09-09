import { describe, it, expect, beforeEach } from 'vitest';
import {
  submitDonationFeedback,
  getDonorFeedbackSummary,
  resetFeedbackStore,
} from '../services/feedbackService';

describe('Donor Appreciation & Fulfillment Feedback Service', () => {
  beforeEach(() => {
    resetFeedbackStore();
  });

  it('should allow requesters to submit ratings and gratitude testimonials', () => {
    const res = submitDonationFeedback({
      requestId: 'req_fb_1',
      authorUserId: 'usr_req_1',
      authorRole: 'REQUESTER',
      donorId: 'donor_lifesaver_1',
      ratingStars: 5,
      punctualityScore: 5,
      gratitudeMessage: 'Arrived at the trauma center in 20 minutes and saved my mother!',
      anonymous: false,
    });

    expect(res.success).toBe(true);
    expect(res.feedback?.ratingStars).toBe(5);
    expect(res.feedback?.donorId).toBe('donor_lifesaver_1');
  });

  it('should prevent duplicate reviews by the same user on the same request', () => {
    submitDonationFeedback({
      requestId: 'req_fb_2',
      authorUserId: 'usr_req_2',
      authorRole: 'REQUESTER',
      donorId: 'donor_2',
      ratingStars: 4,
    });

    const dup = submitDonationFeedback({
      requestId: 'req_fb_2',
      authorUserId: 'usr_req_2',
      authorRole: 'REQUESTER',
      donorId: 'donor_2',
      ratingStars: 5,
    });

    expect(dup.success).toBe(false);
    expect(dup.error).toContain('already been submitted');
  });

  it('should compute aggregated rating statistics and return recent testimonials', () => {
    submitDonationFeedback({
      requestId: 'req_1',
      authorUserId: 'u1',
      authorRole: 'REQUESTER',
      donorId: 'donor_multi',
      ratingStars: 5,
      gratitudeMessage: 'Heroic support!',
    });

    submitDonationFeedback({
      requestId: 'req_2',
      authorUserId: 'u2',
      authorRole: 'HOSPITAL',
      donorId: 'donor_multi',
      ratingStars: 4,
      gratitudeMessage: 'Great cooperation with blood bank staff.',
    });

    const summary = getDonorFeedbackSummary('donor_multi');
    expect(summary.totalReviews).toBe(2);
    expect(summary.averageRating).toBe(4.5); // (5 + 4) / 2 = 4.5
    expect(summary.fiveStarCount).toBe(1);
    expect(summary.recentTestimonials.length).toBe(2);
  });
});
