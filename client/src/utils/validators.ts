import { BloodGroup } from '@shared/types';

export const VALID_BLOOD_GROUPS: BloodGroup[] = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export function isValidBloodGroup(bg: string): bg is BloodGroup {
  return VALID_BLOOD_GROUPS.includes(bg as BloodGroup);
}

export function isValidUnits(units: number): boolean {
  return Number.isInteger(units) && units >= 1 && units <= 10;
}

export function isFutureDeadline(deadline: string | Date): boolean {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline;
  return !isNaN(d.getTime()) && d.getTime() > Date.now();
}
