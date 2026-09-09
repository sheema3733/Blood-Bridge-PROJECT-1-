import { BloodGroup } from '../../../shared/types';
import {
  RECIPIENT_COMPATIBILITY_MAP,
  DONOR_COMPATIBILITY_MAP,
  isBloodCompatible,
  getBloodGroupScore,
  CLINICAL_DISCLAIMER
} from '../../../shared/bloodRules';

export {
  RECIPIENT_COMPATIBILITY_MAP,
  DONOR_COMPATIBILITY_MAP,
  isBloodCompatible,
  getBloodGroupScore,
  CLINICAL_DISCLAIMER
};

/**
 * Get list of compatible donor groups for a given recipient blood group
 */
export function getCompatibleDonorGroups(recipientGroup: BloodGroup): BloodGroup[] {
  return RECIPIENT_COMPATIBILITY_MAP[recipientGroup] || [];
}
