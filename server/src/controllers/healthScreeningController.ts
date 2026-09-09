/**
 * BloodBridge Pre-Donation Health Screening Controller
 */

import { Request, Response } from 'express';
import { evaluateHealthScreening } from '../services/healthScreeningService';

export function evaluateScreeningHandler(req: Request, res: Response): void {
  try {
    const donorId = req.user?.donorProfileId || req.user?.id || req.body.donorId;
    const {
      weightKg,
      ageYears,
      hadRecentTattooOrPiercingMonths,
      hasActiveFeverOrInfection,
      isTakingAntibiotics,
      hasMajorSurgeryPastMonths,
      isPregnantOrNursing,
      lastDonationDaysAgo,
      feelsHealthyToday,
    } = req.body;

    if (weightKg === undefined || ageYears === undefined || feelsHealthyToday === undefined) {
      res.status(400).json({
        success: false,
        error: 'weightKg, ageYears, and feelsHealthyToday are required screening fields',
      });
      return;
    }

    const verdict = evaluateHealthScreening({
      donorId,
      weightKg: Number(weightKg),
      ageYears: Number(ageYears),
      hadRecentTattooOrPiercingMonths: hadRecentTattooOrPiercingMonths !== undefined
        ? Number(hadRecentTattooOrPiercingMonths)
        : undefined,
      hasActiveFeverOrInfection: Boolean(hasActiveFeverOrInfection),
      isTakingAntibiotics: Boolean(isTakingAntibiotics),
      hasMajorSurgeryPastMonths: hasMajorSurgeryPastMonths !== undefined
        ? Number(hasMajorSurgeryPastMonths)
        : undefined,
      isPregnantOrNursing: Boolean(isPregnantOrNursing),
      lastDonationDaysAgo: lastDonationDaysAgo !== undefined
        ? Number(lastDonationDaysAgo)
        : undefined,
      feelsHealthyToday: Boolean(feelsHealthyToday),
    });

    res.json({
      success: true,
      data: verdict,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
