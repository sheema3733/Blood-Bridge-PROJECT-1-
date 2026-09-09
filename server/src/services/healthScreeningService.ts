/**
 * BloodBridge Pre-Donation Health Screening Service
 * Evaluates clinical self-assessment criteria prior to donor travel,
 * filtering ineligible donors to protect patient and donor safety.
 */

export interface HealthScreeningAnswers {
  donorId: string;
  weightKg: number;
  ageYears: number;
  hadRecentTattooOrPiercingMonths?: number;
  hasActiveFeverOrInfection: boolean;
  isTakingAntibiotics: boolean;
  hasMajorSurgeryPastMonths?: number;
  isPregnantOrNursing?: boolean;
  lastDonationDaysAgo?: number;
  feelsHealthyToday: boolean;
}

export interface HealthScreeningVerdict {
  isEligible: boolean;
  disqualifyingReasons: string[];
  advisories: string[];
  screenedAt: string;
  nextEligibleDate?: string;
}

/**
 * Standard WHO / Red Cross blood donation safety criteria evaluation
 */
export function evaluateHealthScreening(answers: HealthScreeningAnswers): HealthScreeningVerdict {
  const disqualifyingReasons: string[] = [];
  const advisories: string[] = [];
  let deferralDays = 0;

  // 1. Age criteria (Must be 18 - 65)
  if (answers.ageYears < 18) {
    disqualifyingReasons.push('Donor must be at least 18 years of age.');
  } else if (answers.ageYears > 65) {
    disqualifyingReasons.push('First-time or routine donors over 65 require explicit physician clearance.');
  }

  // 2. Weight criteria (Must be >= 50 kg for standard 450ml whole blood)
  if (answers.weightKg < 50) {
    disqualifyingReasons.push('Minimum weight for whole blood donation is 50 kg (110 lbs).');
  }

  // 3. General feeling today
  if (!answers.feelsHealthyToday) {
    disqualifyingReasons.push('Donors must feel healthy and well on the day of donation.');
    deferralDays = Math.max(deferralDays, 3);
  }

  // 4. Active infection or fever
  if (answers.hasActiveFeverOrInfection) {
    disqualifyingReasons.push('Cannot donate while experiencing fever, cold, flu, or active infection.');
    deferralDays = Math.max(deferralDays, 14);
  }

  // 5. Antibiotics
  if (answers.isTakingAntibiotics) {
    disqualifyingReasons.push('Must complete full course of antibiotics and be symptom-free before donating.');
    deferralDays = Math.max(deferralDays, 7);
  }

  // 6. Recent tattoo or piercing (within past 6 months)
  if (answers.hadRecentTattooOrPiercingMonths !== undefined && answers.hadRecentTattooOrPiercingMonths < 6) {
    disqualifyingReasons.push(
      `Recent tattoo or body piercing deferral period is 6 months (reported: ${answers.hadRecentTattooOrPiercingMonths} months).`
    );
    const remainingDays = Math.round((6 - answers.hadRecentTattooOrPiercingMonths) * 30.5);
    deferralDays = Math.max(deferralDays, remainingDays);
  }

  // 7. Major surgery (within past 6 months)
  if (answers.hasMajorSurgeryPastMonths !== undefined && answers.hasMajorSurgeryPastMonths < 6) {
    disqualifyingReasons.push('Major surgery requires a minimum 6-month recovery window.');
    const remainingDays = Math.round((6 - answers.hasMajorSurgeryPastMonths) * 30.5);
    deferralDays = Math.max(deferralDays, remainingDays);
  }

  // 8. Pregnancy or nursing
  if (answers.isPregnantOrNursing) {
    disqualifyingReasons.push('Deferral applies during pregnancy and until 6 months after delivery/nursing.');
    deferralDays = Math.max(deferralDays, 180);
  }

  // 9. Minimum donation interval (56 days / 8 weeks for whole blood)
  if (answers.lastDonationDaysAgo !== undefined && answers.lastDonationDaysAgo < 56) {
    const remainingWait = 56 - answers.lastDonationDaysAgo;
    disqualifyingReasons.push(
      `Minimum interval between whole blood donations is 56 days. Please wait ${remainingWait} more days.`
    );
    deferralDays = Math.max(deferralDays, remainingWait);
  }

  // Advisories for eligible donors
  if (disqualifyingReasons.length === 0) {
    advisories.push('Drink plenty of water (16 oz) 1-2 hours prior to donation.');
    advisories.push('Eat a healthy meal high in iron; avoid fatty foods before donating.');
    advisories.push('Bring government-issued photo ID to the donation center.');
  }

  const isEligible = disqualifyingReasons.length === 0;
  let nextEligibleDate: string | undefined;

  if (!isEligible && deferralDays > 0) {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + deferralDays);
    nextEligibleDate = nextDate.toISOString().split('T')[0];
  }

  return {
    isEligible,
    disqualifyingReasons,
    advisories,
    screenedAt: new Date().toISOString(),
    nextEligibleDate,
  };
}
