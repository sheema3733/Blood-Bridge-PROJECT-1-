/**
 * BloodBridge Tiered Regional Emergency Broadcast Dispatcher
 * Coordinates high-priority mass casualty emergency alerts across cities
 * and hospital networks when routine matching is insufficient.
 */

export type BroadcastLevel =
  | 'LEVEL_1_FACILITY_URGENT'    // Specific facility critical deficit
  | 'LEVEL_2_METRO_ALERT'        // Multi-casualty incident across metro district
  | 'LEVEL_3_REGIONAL_DISASTER'  // Natural catastrophe or major disaster event
  | 'LEVEL_4_NATIONAL_RESERVE';  // Critical state / national blood shortage

export interface EmergencyBroadcast {
  id: string;
  level: BroadcastLevel;
  title: string;
  incidentDescription: string;
  affectedRegion: string;
  targetBloodGroups: string[]; // ['O-', 'A-', 'ALL']
  authorAdminId: string;
  isActive: boolean;
  issuedAt: string;
  expiresAt: string;
  channelsDispatched: string[];
  totalDonorsAlerted: number;
}

// In-memory active broadcast store
const broadcastStore = new Map<string, EmergencyBroadcast>();

/**
 * Issue a new regional emergency broadcast alert
 */
export function issueEmergencyBroadcast(params: {
  level: BroadcastLevel;
  title: string;
  incidentDescription: string;
  affectedRegion: string;
  targetBloodGroups: string[];
  authorAdminId: string;
  durationHours?: number;
}): EmergencyBroadcast {
  const id = `bcast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date();
  const hours = params.durationHours || (params.level === 'LEVEL_3_REGIONAL_DISASTER' ? 48 : 24);
  const expires = new Date(now.getTime() + hours * 60 * 60 * 1000);

  const channels = ['PUSH', 'SMS', 'IN_APP_BANNER'];
  if (params.level === 'LEVEL_3_REGIONAL_DISASTER' || params.level === 'LEVEL_4_NATIONAL_RESERVE') {
    channels.push('PUBLIC_API', 'PARTNER_HOSPITALS');
  }

  const broadcast: EmergencyBroadcast = {
    id,
    level: params.level,
    title: params.title.trim(),
    incidentDescription: params.incidentDescription.trim(),
    affectedRegion: params.affectedRegion.trim(),
    targetBloodGroups: params.targetBloodGroups.length > 0 ? params.targetBloodGroups : ['ALL'],
    authorAdminId: params.authorAdminId,
    isActive: true,
    issuedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    channelsDispatched: channels,
    totalDonorsAlerted: 0,
  };

  broadcastStore.set(id, broadcast);
  return { ...broadcast };
}

/**
 * Get all active broadcasts
 */
export function getActiveBroadcasts(now: Date = new Date()): EmergencyBroadcast[] {
  const active: EmergencyBroadcast[] = [];

  for (const b of broadcastStore.values()) {
    if (b.isActive && new Date(b.expiresAt) > now) {
      active.push({ ...b });
    } else if (b.isActive && new Date(b.expiresAt) <= now) {
      b.isActive = false; // expire automatically
    }
  }

  return active.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
}

/**
 * Manually deactivate/retire an emergency broadcast
 */
export function revokeEmergencyBroadcast(broadcastId: string): boolean {
  const b = broadcastStore.get(broadcastId);
  if (!b) return false;

  b.isActive = false;
  broadcastStore.set(broadcastId, b);
  return true;
}

/**
 * Increment alerted donor counter for a broadcast
 */
export function recordBroadcastAudience(broadcastId: string, recipientCount: number): void {
  const b = broadcastStore.get(broadcastId);
  if (b) {
    b.totalDonorsAlerted += recipientCount;
  }
}

/**
 * Reset store for tests
 */
export function resetBroadcastStore(): void {
  broadcastStore.clear();
}
