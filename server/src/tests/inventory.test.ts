import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHospitalInventory,
  restockBloodBatch,
  reserveUnits,
  releaseReservedUnits,
  dispenseUnits,
  purgeExpiredUnits,
  getLowInventoryAlerts,
  resetInventoryStore,
} from '../services/inventoryService';

describe('Hospital Blood Inventory Management Service', () => {
  beforeEach(() => {
    resetInventoryStore();
  });

  it('should initialize hospital inventory categories with zero balances', () => {
    const inv = getHospitalInventory('hosp_metro');
    expect(inv.length).toBe(8); // all 8 blood groups
    const oNeg = inv.find((i) => i.bloodGroup === 'O-');
    expect(oNeg).toBeDefined();
    expect(oNeg?.totalAvailable).toBe(0);
    expect(oNeg?.criticalThreshold).toBe(5);
    expect(oNeg?.isBelowThreshold).toBe(true);
  });

  it('should restock a blood batch and adjust available units', () => {
    const result = restockBloodBatch({
      hospitalId: 'hosp_metro',
      bloodGroup: 'O-',
      units: 8,
    });

    expect(result.success).toBe(true);
    expect(result.newTotal).toBe(8);
    expect(result.batch.batchNumber).toContain('O-');

    const inv = getHospitalInventory('hosp_metro');
    const oNeg = inv.find((i) => i.bloodGroup === 'O-');
    expect(oNeg?.totalAvailable).toBe(8);
    expect(oNeg?.isBelowThreshold).toBe(false);
  });

  it('should reserve available units and fail if requested units exceed stock', () => {
    restockBloodBatch({
      hospitalId: 'hosp_metro',
      bloodGroup: 'A+',
      units: 4,
    });

    const resValid = reserveUnits('hosp_metro', 'A+', 3);
    expect(resValid.success).toBe(true);
    expect(resValid.remainingAvailable).toBe(1);

    const resExcess = reserveUnits('hosp_metro', 'A+', 2);
    expect(resExcess.success).toBe(false);
    expect(resExcess.remainingAvailable).toBe(1);
  });

  it('should release reserved units back to available stock upon request cancellation', () => {
    restockBloodBatch({
      hospitalId: 'hosp_metro',
      bloodGroup: 'B+',
      units: 5,
    });

    reserveUnits('hosp_metro', 'B+', 3);
    releaseReservedUnits('hosp_metro', 'B+', 2);

    const inv = getHospitalInventory('hosp_metro');
    const bPos = inv.find((i) => i.bloodGroup === 'B+');
    expect(bPos?.totalAvailable).toBe(4);
    expect(bPos?.totalReserved).toBe(1);
  });

  it('should dispense reserved blood for patient transfusion', () => {
    restockBloodBatch({
      hospitalId: 'hosp_metro',
      bloodGroup: 'AB+',
      units: 3,
    });

    reserveUnits('hosp_metro', 'AB+', 2);
    const dispensed = dispenseUnits('hosp_metro', 'AB+', 2);
    expect(dispensed).toBe(true);

    const inv = getHospitalInventory('hosp_metro');
    const abPos = inv.find((i) => i.bloodGroup === 'AB+');
    expect(abPos?.totalReserved).toBe(0);
    expect(abPos?.totalAvailable).toBe(1);
  });

  it('should automatically purge expired blood batches beyond shelf-life', () => {
    // Restock with old collection date
    const pastDate = new Date('2026-01-01T00:00:00Z');
    restockBloodBatch({
      hospitalId: 'hosp_metro',
      bloodGroup: 'O+',
      units: 6,
      collectedAt: pastDate.toISOString(),
      shelfLifeDays: 42,
    });

    const currentDate = new Date('2026-03-01T00:00:00Z'); // well past 42 days
    const purgedCount = purgeExpiredUnits('hosp_metro', currentDate);
    expect(purgedCount).toBe(6);

    const inv = getHospitalInventory('hosp_metro');
    const oPos = inv.find((i) => i.bloodGroup === 'O+');
    expect(oPos?.totalAvailable).toBe(0);
    expect(oPos?.totalExpired).toBe(6);
  });

  it('should trigger low inventory alerts for all categories below critical threshold', () => {
    const alerts = getLowInventoryAlerts('hosp_metro');
    expect(alerts.length).toBe(8); // initially all 8 groups are at 0
  });
});
