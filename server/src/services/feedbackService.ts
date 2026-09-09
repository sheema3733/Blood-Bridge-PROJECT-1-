/**
 * BloodBridge Fulfillment Feedback & Appreciation Service
 * Collects donor ratings, feedback comments, and gratitude messages
 * following successful emergency blood donations.
 */

export interface DonationFeedbackEntry {
  id: string;
  requestId: string;
  authorUserId: string;
  authorRole: 'REQUESTER' | 'HOSPITAL';
  donorId: string;
  ratingStars: number; // 1 to 5
  punctualityScore: number; // 1 to 5
  gratitudeMessage?: string;
  anonymous: boolean;
  createdAt: string;
}

export interface DonorFeedbackSummary {
  donorId: string;
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  recentTestimonials: {
    message: string;
    date: string;
    authorRole: string;
  }[];
}

// In-memory feedback store
const feedbackStore = new Map<string, DonationFeedbackEntry>();

/**
 * Submit post-donation review/rating
 */
export function submitDonationFeedback(params: {
  requestId: string;
  authorUserId: string;
  authorRole: 'REQUESTER' | 'HOSPITAL';
  donorId: string;
  ratingStars: number;
  punctualityScore?: number;
  gratitudeMessage?: string;
  anonymous?: boolean;
}): { success: boolean; feedback?: DonationFeedbackEntry; error?: string } {
  // Validate star rating
  const stars = Math.max(1, Math.min(5, Math.round(params.ratingStars)));
  const punctuality = params.punctualityScore !== undefined
    ? Math.max(1, Math.min(5, Math.round(params.punctualityScore)))
    : 5;

  // Prevent duplicate feedback from the same author on the same request
  for (const item of feedbackStore.values()) {
    if (item.requestId === params.requestId && item.authorUserId === params.authorUserId) {
      return {
        success: false,
        error: 'Feedback has already been submitted for this blood coordination request.',
      };
    }
  }

  const id = `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const entry: DonationFeedbackEntry = {
    id,
    requestId: params.requestId,
    authorUserId: params.authorUserId,
    authorRole: params.authorRole,
    donorId: params.donorId,
    ratingStars: stars,
    punctualityScore: punctuality,
    gratitudeMessage: params.gratitudeMessage?.trim(),
    anonymous: Boolean(params.anonymous),
    createdAt: new Date().toISOString(),
  };

  feedbackStore.set(id, entry);

  return {
    success: true,
    feedback: entry,
  };
}

/**
 * Get aggregated feedback summary and testimonials for a donor
 */
export function getDonorFeedbackSummary(donorId: string): DonorFeedbackSummary {
  const donorEntries = Array.from(feedbackStore.values()).filter((e) => e.donorId === donorId);

  if (donorEntries.length === 0) {
    return {
      donorId,
      averageRating: 5.0, // clean default
      totalReviews: 0,
      fiveStarCount: 0,
      recentTestimonials: [],
    };
  }

  const totalRating = donorEntries.reduce((sum, item) => sum + item.ratingStars, 0);
  const avg = Number((totalRating / donorEntries.length).toFixed(1));
  const fiveStars = donorEntries.filter((e) => e.ratingStars === 5).length;

  const testimonials = donorEntries
    .filter((e) => e.gratitudeMessage && e.gratitudeMessage.length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((e) => ({
      message: e.gratitudeMessage!,
      date: e.createdAt,
      authorRole: e.anonymous ? 'Anonymous Community Member' : e.authorRole,
    }));

  return {
    donorId,
    averageRating: avg,
    totalReviews: donorEntries.length,
    fiveStarCount: fiveStars,
    recentTestimonials: testimonials,
  };
}

/**
 * Reset feedback store for testing
 */
export function resetFeedbackStore(): void {
  feedbackStore.clear();
}
