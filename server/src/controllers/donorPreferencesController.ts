/**
 * BloodBridge Donor Preferences Controller
 */

import { Request, Response } from 'express';
import {
  getDonorPreferences,
  updateDonorPreferences,
  isDonorEligibleForAlert,
} from '../services/donorPreferences';

export function getPreferencesHandler(req: Request, res: Response): void {
  try {
    const donorId = req.user?.donorProfileId || req.user?.id;
    if (!donorId) {
      res.status(401).json({ success: false, error: 'Donor profile identification required' });
      return;
    }

    const preferences = getDonorPreferences(donorId);
    res.json({
      success: true,
      data: preferences,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export function updatePreferencesHandler(req: Request, res: Response): void {
  try {
    const donorId = req.user?.donorProfileId || req.user?.id;
    if (!donorId) {
      res.status(401).json({ success: false, error: 'Donor profile identification required' });
      return;
    }

    const {
      maxTravelDistanceKm,
      channels,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      emergencyOnly,
      autoAcceptRadiusKm,
    } = req.body;

    const updated = updateDonorPreferences(donorId, {
      maxTravelDistanceKm,
      channels,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      emergencyOnly,
      autoAcceptRadiusKm,
    });

    res.json({
      success: true,
      data: updated,
      message: 'Donor preferences saved successfully',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export function testAlertEligibilityHandler(req: Request, res: Response): void {
  try {
    const donorId = req.user?.donorProfileId || req.user?.id;
    const { urgency, distanceKm } = req.body;

    if (!donorId || !urgency || distanceKm === undefined) {
      res.status(400).json({ success: false, error: 'Missing urgency or distanceKm parameter' });
      return;
    }

    const result = isDonorEligibleForAlert(donorId, urgency, Number(distanceKm));
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
