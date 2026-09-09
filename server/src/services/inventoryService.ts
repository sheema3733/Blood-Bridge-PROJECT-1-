/**
 * BloodBridge Hospital Blood Inventory Management Service
 * Tracks on-site blood reserves, batch shelf-life / expiration dates,
 * emergency reservations, and low-inventory threshold alerting.
 */

import { BloodGroup } from '../../../shared/types';

export interface BloodBatch {
  batchNumber: string;
  units: number;
  collectedAt: string;
  expiresAt: string; // Typically 35 to 42 days for whole blood
  isExpired: boolean;
}

export interface InventoryCategorySummary {
  bloodGroup: BloodGroup;
  totalAvailable: number;
  totalReserved: number;
  totalExpired: number;
  criticalThreshold: number;
  isBelowThreshold: boolean;
  batches: BloodBatch[];
}

export interface HospitalInventoryRecord {
  hospitalId: string;
  categories: Map<BloodGroup, InventoryCategorySummary>;
  lastAuditedAt: string;
}

// In-memory inventory store
const inventoryStore = new Map<string, HospitalInventoryRecord>();

const ALL_BLOOD_GROUPS: BloodGroup[] = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];

/**
 * Initializes hospital inventory with zero counts if not already present
 */
function ensureHospitalInventory(hospitalId: string): HospitalInventoryRecord {
  let record = inventoryStore.get(hospitalId);
  if (!record) {
    const categories = new Map<BloodGroup, InventoryCategorySummary>();
    for (const bg of ALL_BLOOD_GROUPS) {
      categories.set(bg, {
        bloodGroup: bg,
        totalAvailable: 0,
        totalReserved: 0,
        totalExpired: 0,
        criticalThreshold: bg === 'O_NEG' ? 5 : 3, // O-Neg has higher threshold due to universal donor status
        isBelowThreshold: true,
        batches: [],
      });
    }
    record = {
      hospitalId,
      categories,
      lastAuditedAt: new Date().toISOString(),
    };
    inventoryStore.set(hospitalId, record);
  }
  return record;
}

/**
 * Get full inventory breakdown for a hospital
 */
export function getHospitalInventory(hospitalId: string): InventoryCategorySummary[] {
  const record = ensureHospitalInventory(hospitalId);
  purgeExpiredUnits(hospitalId);
  return Array.from(record.categories.values());
}

/**
 * Restock or add a new blood batch to hospital inventory
 */
export function restockBloodBatch(params: {
  hospitalId: string;
  bloodGroup: BloodGroup;
  units: number;
  collectedAt?: string;
  shelfLifeDays?: number;
}): { success: boolean; batch: BloodBatch; newTotal: number } {
  if (params.units <= 0) {
    throw new Error('Units to restock must be greater than zero');
  }

  const record = ensureHospitalInventory(params.hospitalId);
  const cat = record.categories.get(params.bloodGroup)!;

  const collectedDate = params.collectedAt ? new Date(params.collectedAt) : new Date();
  const shelfLife = params.shelfLifeDays || 42; // standard whole blood 42 days
  const expiresDate = new Date(collectedDate.getTime() + shelfLife * 24 * 60 * 60 * 1000);

  const batch: BloodBatch = {
    batchNumber: `BAT_${Date.now().toString(36).toUpperCase()}_${params.bloodGroup}`,
    units: params.units,
    collectedAt: collectedDate.toISOString(),
    expiresAt: expiresDate.toISOString(),
    isExpired: false,
  };

  cat.batches.push(batch);
  cat.totalAvailable += params.units;
  cat.isBelowThreshold = cat.totalAvailable < cat.criticalThreshold;
  record.lastAuditedAt = new Date().toISOString();

  return {
    success: true,
    batch,
    newTotal: cat.totalAvailable,
  };
}

/**
 * Reserve blood units for a confirmed emergency request
 */
export function reserveUnits(
  hospitalId: string,
  bloodGroup: BloodGroup,
  unitsNeeded: number
): { success: boolean; unitsReserved: number; remainingAvailable: number } {
  const record = ensureHospitalInventory(hospitalId);
  purgeExpiredUnits(hospitalId);
  const cat = record.categories.get(bloodGroup)!;

  if (cat.totalAvailable < unitsNeeded) {
    return {
      success: false,
      unitsReserved: 0,
      remainingAvailable: cat.totalAvailable,
    };
  }

  cat.totalAvailable -= unitsNeeded;
  cat.totalReserved += unitsNeeded;
  cat.isBelowThreshold = cat.totalAvailable < cat.criticalThreshold;
  record.lastAuditedAt = new Date().toISOString();

  return {
    success: true,
    unitsReserved: unitsNeeded,
    remainingAvailable: cat.totalAvailable,
  };
}

/**
 * Release reserved blood back to available stock if request is cancelled
 */
export function releaseReservedUnits(
  hospitalId: string,
  bloodGroup: BloodGroup,
  unitsToRelease: number
): boolean {
  const record = ensureHospitalInventory(hospitalId);
  const cat = record.categories.get(bloodGroup)!;

  const actualRelease = Math.min(unitsToRelease, cat.totalReserved);
  cat.totalReserved -= actualRelease;
  cat.totalAvailable += actualRelease;
  cat.isBelowThreshold = cat.totalAvailable < cat.criticalThreshold;
  record.lastAuditedAt = new Date().toISOString();
  return true;
}

/**
 * Dispense blood units for patient transfusion (reduces reserved units)
 */
export function dispenseUnits(
  hospitalId: string,
  bloodGroup: BloodGroup,
  unitsToDispense: number
): boolean {
  const record = ensureHospitalInventory(hospitalId);
  const cat = record.categories.get(bloodGroup)!;

  if (cat.totalReserved >= unitsToDispense) {
    cat.totalReserved -= unitsToDispense;
    record.lastAuditedAt = new Date().toISOString();
    return true;
  }
  return false;
}

/**
 * Purges expired units from available count
 */
export function purgeExpiredUnits(hospitalId: string, now: Date = new Date()): number {
  const record = ensureHospitalInventory(hospitalId);
  let totalPurged = 0;

  for (const cat of record.categories.values()) {
    for (const batch of cat.batches) {
      if (!batch.isExpired && new Date(batch.expiresAt) <= now) {
        batch.isExpired = true;
        cat.totalAvailable = Math.max(0, cat.totalAvailable - batch.units);
        cat.totalExpired += batch.units;
        totalPurged += batch.units;
      }
    }
    cat.isBelowThreshold = cat.totalAvailable < cat.criticalThreshold;
  }

  return totalPurged;
}

/**
 * Get critical low-inventory blood groups for hospital
 */
export function getLowInventoryAlerts(hospitalId: string): InventoryCategorySummary[] {
  const inventory = getHospitalInventory(hospitalId);
  return inventory.filter((item) => item.isBelowThreshold);
}

/**
 * Reset inventory for testing
 */
export function resetInventoryStore(): void {
  inventoryStore.clear();
}
