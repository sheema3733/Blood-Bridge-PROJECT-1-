/**
 * BloodBridge Donor Gamification & Badges Controller
 */

import { Request, Response } from 'express';
import {
  getDonorProfile,
  getCommunityLeaderboard,
  BADGE_CATALOG,
} from '../services/badgeService';

export function getDonorBadgesHandler(req: Request, res: Response): void {
  try {
    const donorId = (req.query.donorId as string) || req.user?.donorProfileId || req.user?.id;
    if (!donorId) {
      res.status(400).json({ success: false, error: 'Donor identifier is required' });
      return;
    }

    const profile = getDonorProfile(donorId);
    res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export function getLeaderboardHandler(req: Request, res: Response): void {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const leaderboard = getCommunityLeaderboard(limit);
    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export function getBadgeCatalogHandler(_req: Request, res: Response): void {
  try {
    res.json({
      success: true,
      data: Object.values(BADGE_CATALOG),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
