/**
 * BloodBridge Hospital Staff Delegation Service
 * Manages healthcare facility personnel roles, delegated permissions,
 * and authorization checks for clinical blood coordination tasks.
 */

export type HospitalStaffRole = 'CHIEF_MEDICAL_OFFICER' | 'DOCTOR' | 'NURSE' | 'LAB_TECH' | 'DESK_COORDINATOR';

export type StaffPermission =
  | 'CREATE_REQUEST'
  | 'CANCEL_REQUEST'
  | 'VERIFY_PATIENT_MATCH'
  | 'DISPENSE_BLOOD'
  | 'MANAGE_INVENTORY'
  | 'VERIFY_DONOR_ARRIVAL'
  | 'EXPORT_CLINICAL_AUDIT'
  | 'MANAGE_STAFF_ROSTER';

export interface HospitalStaffMember {
  id: string;
  hospitalId: string;
  fullName: string;
  email: string;
  role: HospitalStaffRole;
  licenseNumber?: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ROLE_PERMISSIONS_MAP: Record<HospitalStaffRole, StaffPermission[]> = {
  CHIEF_MEDICAL_OFFICER: [
    'CREATE_REQUEST',
    'CANCEL_REQUEST',
    'VERIFY_PATIENT_MATCH',
    'DISPENSE_BLOOD',
    'MANAGE_INVENTORY',
    'VERIFY_DONOR_ARRIVAL',
    'EXPORT_CLINICAL_AUDIT',
    'MANAGE_STAFF_ROSTER',
  ],
  DOCTOR: [
    'CREATE_REQUEST',
    'CANCEL_REQUEST',
    'VERIFY_PATIENT_MATCH',
    'DISPENSE_BLOOD',
    'VERIFY_DONOR_ARRIVAL',
    'EXPORT_CLINICAL_AUDIT',
  ],
  NURSE: [
    'CREATE_REQUEST',
    'VERIFY_DONOR_ARRIVAL',
    'DISPENSE_BLOOD',
  ],
  LAB_TECH: [
    'VERIFY_PATIENT_MATCH',
    'DISPENSE_BLOOD',
    'MANAGE_INVENTORY',
    'VERIFY_DONOR_ARRIVAL',
  ],
  DESK_COORDINATOR: [
    'CREATE_REQUEST',
    'VERIFY_DONOR_ARRIVAL',
  ],
};

// In-memory staff repository
const staffStore = new Map<string, HospitalStaffMember>();

/**
 * Add or register a new staff member under a verified hospital
 */
export function addHospitalStaff(params: {
  hospitalId: string;
  fullName: string;
  email: string;
  role: HospitalStaffRole;
  licenseNumber?: string;
  department: string;
}): HospitalStaffMember {
  const id = `staff_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newStaff: HospitalStaffMember = {
    id,
    hospitalId: params.hospitalId,
    fullName: params.fullName.trim(),
    email: params.email.toLowerCase().trim(),
    role: params.role,
    licenseNumber: params.licenseNumber?.trim(),
    department: params.department.trim(),
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  staffStore.set(id, newStaff);
  return { ...newStaff };
}

/**
 * Retrieve all staff members belonging to a given hospital
 */
export function getHospitalStaff(hospitalId: string): HospitalStaffMember[] {
  return Array.from(staffStore.values())
    .filter((s) => s.hospitalId === hospitalId && s.isActive)
    .map((s) => ({ ...s }));
}

/**
 * Find staff member by ID
 */
export function getStaffById(staffId: string): HospitalStaffMember | null {
  const staff = staffStore.get(staffId);
  return staff ? { ...staff } : null;
}

/**
 * Deactivate or remove a staff member
 */
export function deactivateStaff(staffId: string): boolean {
  const staff = staffStore.get(staffId);
  if (!staff) return false;

  staff.isActive = false;
  staff.updatedAt = new Date().toISOString();
  staffStore.set(staffId, staff);
  return true;
}

/**
 * Check if a staff member has a specific permission
 */
export function staffHasPermission(staffId: string, permission: StaffPermission): boolean {
  const staff = staffStore.get(staffId);
  if (!staff || !staff.isActive) return false;

  const permissions = ROLE_PERMISSIONS_MAP[staff.role] || [];
  return permissions.includes(permission);
}

/**
 * Get all granted permissions for a given role
 */
export function getPermissionsForRole(role: HospitalStaffRole): StaffPermission[] {
  return [...(ROLE_PERMISSIONS_MAP[role] || [])];
}

/**
 * Clear store (for unit tests)
 */
export function resetStaffStore(): void {
  staffStore.clear();
}
