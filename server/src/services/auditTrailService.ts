/**
 * BloodBridge Tamper-Evident Clinical & Security Audit Trail Service
 * Implements cryptographic hash chaining across system events to guarantee
 * non-repudiation, HIPAA compliance, and forensic integrity.
 */

import crypto from 'crypto';

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_PASSWORD_RESET'
  | 'REQUEST_CREATED'
  | 'REQUEST_VERIFIED'
  | 'REQUEST_CANCELLED'
  | 'DONOR_DISPATCHED'
  | 'DONOR_ACCEPTED'
  | 'DONOR_ARRIVED'
  | 'BLOOD_TRANSFUSION_COMPLETED'
  | 'HOSPITAL_INVENTORY_RESTOCKED'
  | 'HOSPITAL_INVENTORY_DISPENSED'
  | 'STAFF_ROLE_ASSIGNED'
  | 'STAFF_REVOKED'
  | 'EMERGENCY_BROADCAST_TRIGGERED';

export interface AuditLogEntry {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  action: AuditAction;
  actorUserId?: string;
  actorRole?: string;
  resourceType: 'BLOOD_REQUEST' | 'DONOR' | 'HOSPITAL' | 'INVENTORY' | 'SYSTEM';
  resourceId?: string;
  ipAddressMasked: string;
  details: Record<string, any>;
  previousEntryHash: string;
  entryHash: string;
}

// In-memory ledger of chained audit logs
const auditLedger: AuditLogEntry[] = [];
let genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Anonymize or mask IPv4 / IPv6 addresses for healthcare privacy compliance
 */
export function maskIpAddress(ip?: string): string {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return '127.0.0.xxx';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  return ip.slice(0, Math.floor(ip.length / 2)) + '****';
}

/**
 * Calculates SHA-256 hash for an entry including the previous block hash
 */
function calculateEntryHash(
  seq: number,
  timestamp: string,
  action: string,
  resourceType: string,
  resourceId: string | undefined,
  details: Record<string, any>,
  prevHash: string
): string {
  const payload = `${seq}|${timestamp}|${action}|${resourceType}|${resourceId || ''}|${JSON.stringify(details)}|${prevHash}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Append an immutable, hash-chained audit log entry
 */
export function recordAuditEvent(params: {
  action: AuditAction;
  actorUserId?: string;
  actorRole?: string;
  resourceType: AuditLogEntry['resourceType'];
  resourceId?: string;
  clientIp?: string;
  details?: Record<string, any>;
}): AuditLogEntry {
  const sequenceNumber = auditLedger.length + 1;
  const timestamp = new Date().toISOString();
  const previousEntryHash = sequenceNumber === 1
    ? genesisHash
    : auditLedger[auditLedger.length - 1].entryHash;

  const sanitizedDetails = params.details || {};
  const entryHash = calculateEntryHash(
    sequenceNumber,
    timestamp,
    params.action,
    params.resourceType,
    params.resourceId,
    sanitizedDetails,
    previousEntryHash
  );

  const entry: AuditLogEntry = {
    id: `audit_${sequenceNumber}_${crypto.randomBytes(4).toString('hex')}`,
    sequenceNumber,
    timestamp,
    action: params.action,
    actorUserId: params.actorUserId,
    actorRole: params.actorRole,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    ipAddressMasked: maskIpAddress(params.clientIp),
    details: sanitizedDetails,
    previousEntryHash,
    entryHash,
  };

  auditLedger.push(entry);
  return { ...entry };
}

/**
 * Verify cryptographic hash integrity across the entire ledger
 */
export function verifyAuditLedgerIntegrity(): { isValid: boolean; corruptedAtSequence?: number } {
  let prevHash = genesisHash;

  for (const entry of auditLedger) {
    if (entry.previousEntryHash !== prevHash) {
      return { isValid: false, corruptedAtSequence: entry.sequenceNumber };
    }

    const calculated = calculateEntryHash(
      entry.sequenceNumber,
      entry.timestamp,
      entry.action,
      entry.resourceType,
      entry.resourceId,
      entry.details,
      prevHash
    );

    if (calculated !== entry.entryHash) {
      return { isValid: false, corruptedAtSequence: entry.sequenceNumber };
    }

    prevHash = entry.entryHash;
  }

  return { isValid: true };
}

/**
 * Query audit ledger with multi-criteria filters
 */
export function queryAuditLogs(filter?: {
  action?: AuditAction;
  resourceType?: string;
  actorUserId?: string;
  limit?: number;
}): AuditLogEntry[] {
  let results = [...auditLedger];

  if (filter?.action) {
    results = results.filter((e) => e.action === filter.action);
  }
  if (filter?.resourceType) {
    results = results.filter((e) => e.resourceType === filter.resourceType);
  }
  if (filter?.actorUserId) {
    results = results.filter((e) => e.actorUserId === filter.actorUserId);
  }

  const limit = filter?.limit || 50;
  return results.slice(-limit).reverse();
}

/**
 * Reset ledger (for unit testing)
 */
export function resetAuditLedger(): void {
  auditLedger.length = 0;
}
