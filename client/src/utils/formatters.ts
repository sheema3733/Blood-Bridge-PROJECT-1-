/**
 * Client UI formatting utilities for BloodBridge
 */

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatRelativeTime(dateStringOrObj: string | Date): string {
  const date = typeof dateStringOrObj === 'string' ? new Date(dateStringOrObj) : dateStringOrObj;
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / (60 * 1000));

  if (diffMin > 0) {
    if (diffMin < 60) return `in ${diffMin} min`;
    const hours = Math.round(diffMin / 60);
    if (hours < 24) return `in ${hours} hr`;
    return `in ${Math.round(hours / 24)} days`;
  } else {
    const absMin = Math.abs(diffMin);
    if (absMin < 1) return 'just now';
    if (absMin < 60) return `${absMin}m ago`;
    const hours = Math.round(absMin / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  }
}

export function getUrgencyBadgeClasses(urgency: 'NORMAL' | 'URGENT' | 'CRITICAL'): string {
  switch (urgency) {
    case 'CRITICAL':
      return 'bg-red-600 text-white font-black animate-pulse';
    case 'URGENT':
      return 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
    default:
      return 'bg-slate-100 text-slate-700 font-medium';
  }
}
