"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DONOR_COMPATIBILITY_MAP = exports.RECIPIENT_COMPATIBILITY_MAP = exports.CLINICAL_DISCLAIMER = void 0;
exports.isBloodCompatible = isBloodCompatible;
exports.getBloodGroupScore = getBloodGroupScore;
/**
 * Coordination Platform Disclaimer:
 * BloodBridge is an emergency coordination and matching platform.
 * It is NOT a medical diagnosis or medical eligibility authority.
 * Clinical donor eligibility, pre-donation screening, cross-matching,
 * and blood safety tests must always be conducted by certified clinical
 * blood bank professionals and hospital staff before transfusion.
 */
exports.CLINICAL_DISCLAIMER = 'BloodBridge is an emergency coordination tool. Blood compatibility matching scores are used exclusively for prioritization. Clinical eligibility, infectious disease screening, and serological cross-matching must be performed by authorized medical personnel.';
/**
 * Standard Red Blood Cell (RBC) Compatibility Matrix
 * Key: Recipient Blood Group
 * Value: Array of compatible Donor Blood Groups
 */
exports.RECIPIENT_COMPATIBILITY_MAP = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] // Universal Recipient
};
/**
 * Donor Compatibility Map
 * Key: Donor Blood Group
 * Value: Array of compatible Recipient Blood Groups
 */
exports.DONOR_COMPATIBILITY_MAP = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal Donor
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
};
/**
 * Check if a donor's blood group is compatible for a recipient's blood group
 */
function isBloodCompatible(donorGroup, recipientGroup) {
    const compatibleDonors = exports.RECIPIENT_COMPATIBILITY_MAP[recipientGroup];
    return compatibleDonors ? compatibleDonors.includes(donorGroup) : false;
}
/**
 * Calculate blood group compatibility score (out of 40 points)
 * Exact match = 40 points, Compatible alternative = 30 points, Incompatible = 0 points
 */
function getBloodGroupScore(donorGroup, recipientGroup) {
    if (donorGroup === recipientGroup) {
        return 40; // Exact type match preferred
    }
    if (isBloodCompatible(donorGroup, recipientGroup)) {
        return 30; // Compatible alternative
    }
    return 0; // Incompatible
}
