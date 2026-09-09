/**
 * BloodBridge Fulfillment Feedback & Appreciation Controller
 */

import { Request, Response } from 'express';
import {
  submitDonationFeedback,
  getDonorFeedbackSummary,
} from '../services/feedbackService';

export function submitFeedbackHandler(req: Request, res: Response): void {
  try {
    const authorUserId = req.user?.id;
    const authorRole = (req.user?.role === 'HOSPITAL' ? 'HOSPITAL' : 'REQUESTER') as 'REQUESTER' | 'HOSPITAL';
    const { requestId, donorId, ratingStars, punctualityScore, gratitudeMessage, anonymous } = req.body;

    if (!authorUserId || !requestId || !donorId || ratingStars === undefined) {
      res.status(400).json({
        success: false,
        error: 'Missing required feedback fields (requestId, donorId, ratingStars)',
      });
      return;
    }

    const result = submitDonationFeedback({
      requestId,
      authorUserId,
      authorRole,
      donorId,
      ratingStars: Number(ratingStars),
      punctualityScore: punctualityScore !== undefined ? Number(punctualityScore) : undefined,
      gratitudeMessage,
      anonymous: Boolean(anonymous),
    });

    if (!result.success) {
      res.status(409).json({
        success: false,
        error: result.error,
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: result.feedback,
      message: 'Thank you for submitting feedback for the lifesaving donor!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export function getDonorFeedbackHandler(req: Request, res: Response): void {
  try {
    const donorId = req.params.donorId || req.query.donorId as string;
    if (!donorId) {
      res.status(400).json({ success: false, error: 'Donor identifier is required' });
      return;
    }

    const summary = getDonorFeedbackSummary(donorId);
    res.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
