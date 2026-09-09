/**
 * BloodBridge Donor Preferences Service
 * Handles donor travel boundaries, notification channels, quiet hour windows,
 * and smart alert dispatch filtering.
 */

export type NotificationChannel = 'SMS' | 'PUSH' | 'EMAIL' | 'WHATSAPP';

export interface DonorPreferences {
  donorId: string;
  maxTravelDistanceKm: number;
  channels: NotificationChannel[];
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm format, e.g. "22:00"
  quietHoursEnd: string;   // HH:mm format, e.g. "07:00"
  emergencyOnly: boolean;  // Only notify if request urgency is CRITICAL
  autoAcceptRadiusKm: number; // Suggested instant response zone
  updatedAt: string;
}

const DEFAULT_PREFERENCES: Omit<DonorPreferences, 'donorId' | 'updatedAt'> = {
  maxTravelDistanceKm: 25,
  channels: ['PUSH', 'SMS'],
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  emergencyOnly: false,
  autoAcceptRadiusKm: 5,
};

// In-memory preference store with persistence interface
const preferenceStore = new Map<string, DonorPreferences>();

/**
 * Retrieve donor preferences with safe defaults fallback
 */
export function getDonorPreferences(donorId: string): DonorPreferences {
  const existing = preferenceStore.get(donorId);
  if (existing) {
    return { ...existing };
  }

  const defaultPref: DonorPreferences = {
    donorId,
    ...DEFAULT_PREFERENCES,
    updatedAt: new Date().toISOString(),
  };

  preferenceStore.set(donorId, defaultPref);
  return { ...defaultPref };
}

/**
 * Validate and update donor preferences with boundary clamping
 */
export function updateDonorPreferences(
  donorId: string,
  partial: Partial<Omit<DonorPreferences, 'donorId' | 'updatedAt'>>
): DonorPreferences {
  const current = getDonorPreferences(donorId);

  // Validate and clamp maxTravelDistanceKm between 1 and 150 km
  let maxTravelDistanceKm = current.maxTravelDistanceKm;
  if (partial.maxTravelDistanceKm !== undefined) {
    maxTravelDistanceKm = Math.max(1, Math.min(150, Number(partial.maxTravelDistanceKm) || 25));
  }

  // Validate autoAcceptRadiusKm between 1 and 50 km
  let autoAcceptRadiusKm = current.autoAcceptRadiusKm;
  if (partial.autoAcceptRadiusKm !== undefined) {
    autoAcceptRadiusKm = Math.max(1, Math.min(50, Number(partial.autoAcceptRadiusKm) || 5));
  }

  // Validate channels
  let channels = current.channels;
  if (Array.isArray(partial.channels)) {
    const validChannels: NotificationChannel[] = ['SMS', 'PUSH', 'EMAIL', 'WHATSAPP'];
    const filtered = partial.channels.filter((ch) => validChannels.includes(ch));
    if (filtered.length > 0) {
      channels = Array.from(new Set(filtered));
    }
  }

  // Validate time format (HH:mm)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const quietHoursStart = (partial.quietHoursStart && timeRegex.test(partial.quietHoursStart))
    ? partial.quietHoursStart
    : current.quietHoursStart;

  const quietHoursEnd = (partial.quietHoursEnd && timeRegex.test(partial.quietHoursEnd))
    ? partial.quietHoursEnd
    : current.quietHoursEnd;

  const updated: DonorPreferences = {
    donorId,
    maxTravelDistanceKm,
    autoAcceptRadiusKm,
    channels,
    quietHoursEnabled: partial.quietHoursEnabled !== undefined ? Boolean(partial.quietHoursEnabled) : current.quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
    emergencyOnly: partial.emergencyOnly !== undefined ? Boolean(partial.emergencyOnly) : current.emergencyOnly,
    updatedAt: new Date().toISOString(),
  };

  preferenceStore.set(donorId, updated);
  return { ...updated };
}

/**
 * Helper to check if a specific time is within quiet hours
 */
function isWithinQuietHours(currentTime: Date, startStr: string, endStr: string): boolean {
  const [startHour, startMinute] = startStr.split(':').map(Number);
  const [endHour, endMinute] = endStr.split(':').map(Number);

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes < endMinutes) {
    // Normal window e.g. 01:00 to 06:00
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Overnight window e.g. 22:00 to 07:00
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  matchedChannels: NotificationChannel[];
}

/**
 * Evaluates whether an incoming blood dispatch alert should be delivered
 * to a donor based on their configured preferences, distance, and time.
 */
export function isDonorEligibleForAlert(
  donorId: string,
  urgency: 'ROUTINE' | 'URGENT' | 'CRITICAL',
  distanceKm: number,
  now: Date = new Date()
): EligibilityResult {
  const prefs = getDonorPreferences(donorId);

  // 1. Distance check
  if (distanceKm > prefs.maxTravelDistanceKm) {
    return {
      eligible: false,
      reason: `Distance ${distanceKm.toFixed(1)} km exceeds preferred maximum of ${prefs.maxTravelDistanceKm} km`,
      matchedChannels: [],
    };
  }

  // 2. Emergency only check
  if (prefs.emergencyOnly && urgency !== 'CRITICAL') {
    return {
      eligible: false,
      reason: `Donor has emergency-only alerts enabled; request urgency is ${urgency}`,
      matchedChannels: [],
    };
  }

  // 3. Quiet hours check (Critical emergencies bypass quiet hours)
  if (prefs.quietHoursEnabled && urgency !== 'CRITICAL') {
    if (isWithinQuietHours(now, prefs.quietHoursStart, prefs.quietHoursEnd)) {
      return {
        eligible: false,
        reason: `Current time is within donor quiet hours window (${prefs.quietHoursStart} - ${prefs.quietHoursEnd})`,
        matchedChannels: [],
      };
    }
  }

  return {
    eligible: true,
    matchedChannels: prefs.channels,
  };
}

/**
 * Resets preferences (primarily for test harnesses)
 */
export function resetPreferencesStore(): void {
  preferenceStore.clear();
}
