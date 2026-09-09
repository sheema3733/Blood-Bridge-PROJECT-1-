import { describe, it, expect } from 'vitest';
import {
  isBloodCompatible,
  getBloodGroupScore,
  getCompatibleDonorGroups,
} from './bloodCompatibility';
import { BloodGroup } from '../../../shared/types';

describe('Blood Compatibility Matrix Rules', () => {
  it('should verify O- is the universal donor for all 8 blood groups', () => {
    const allGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    allGroups.forEach((recipient) => {
      expect(isBloodCompatible('O-', recipient)).toBe(true);
    });
  });

  it('should verify AB+ is the universal recipient able to receive from all groups', () => {
    const allGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    allGroups.forEach((donor) => {
      expect(isBloodCompatible(donor, 'AB+')).toBe(true);
    });
  });

  it('should reject incompatible transfusions strictly', () => {
    // A+ cannot donate to O-
    expect(isBloodCompatible('A+', 'O-')).toBe(false);
    // B+ cannot donate to A+
    expect(isBloodCompatible('B+', 'A+')).toBe(false);
    // AB+ cannot donate to B-
    expect(isBloodCompatible('AB+', 'B-')).toBe(false);
    // O+ cannot donate to O-
    expect(isBloodCompatible('O+', 'O-')).toBe(false);
  });

  it('should award highest score (40 pts) for exact matches', () => {
    expect(getBloodGroupScore('A+', 'A+')).toBe(40);
    expect(getBloodGroupScore('O-', 'O-')).toBe(40);
    expect(getBloodGroupScore('B+', 'B+')).toBe(40);
  });

  it('should award 30 pts for compatible alternative matches', () => {
    // O- donating to A+
    expect(getBloodGroupScore('O-', 'A+')).toBe(30);
    // A- donating to AB+
    expect(getBloodGroupScore('A-', 'AB+')).toBe(30);
  });

  it('should award 0 pts for incompatible matches', () => {
    expect(getBloodGroupScore('AB+', 'O-')).toBe(0);
    expect(getBloodGroupScore('B+', 'A+')).toBe(0);
  });

  it('should correctly list compatible donor groups for A+', () => {
    const donors = getCompatibleDonorGroups('A+');
    expect(donors).toEqual(expect.arrayContaining(['O-', 'O+', 'A-', 'A+']));
    expect(donors).not.toContain('B+');
    expect(donors).not.toContain('AB+');
  });
});
