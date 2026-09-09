/**
 * BloodBridge Operational Telemetry & System Metrics Service
 * Collects high-resolution platform performance metrics, dispatch latency,
 * emergency response SLA timings, and operational health counters.
 */

export interface LatencyMetric {
  operation: string;
  durationMs: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PlatformHealthTelemetry {
  uptimeSeconds: number;
  totalEmergencyRequestsDispatched: number;
  totalDonationsFulfilled: number;
  totalDonorsAlerted: number;
  averageMatchingLatencyMs: number;
  averageResponseTimeMinutes: number;
  fulfillmentSuccessRatePercent: number;
  criticalUrgencyFulfillmentRatePercent: number;
  activeSocketConnections: number;
}

// In-memory telemetry accumulator
let systemStartTime = Date.now();
const matchingLatencies: number[] = [];
const responseTimesMinutes: number[] = [];
let totalDispatched = 0;
let totalFulfilled = 0;
let totalCriticalDispatched = 0;
let totalCriticalFulfilled = 0;
let totalAlertedDonors = 0;
let activeSockets = 0;

/**
 * Record duration of a matching algorithm execution
 */
export function recordMatchingLatency(durationMs: number): void {
  matchingLatencies.push(durationMs);
  if (matchingLatencies.length > 500) {
    matchingLatencies.shift(); // sliding window of 500 samples
  }
}

/**
 * Record a new request dispatch
 */
export function recordRequestDispatched(isCritical: boolean, donorCount: number): void {
  totalDispatched++;
  totalAlertedDonors += donorCount;
  if (isCritical) {
    totalCriticalDispatched++;
  }
}

/**
 * Record a fulfilled donation and how long it took from request creation
 */
export function recordDonationFulfilled(isCritical: boolean, elapsedMinutes: number): void {
  totalFulfilled++;
  if (isCritical) {
    totalCriticalFulfilled++;
  }
  responseTimesMinutes.push(elapsedMinutes);
  if (responseTimesMinutes.length > 500) {
    responseTimesMinutes.shift();
  }
}

/**
 * Update current active socket connections
 */
export function updateActiveSockets(count: number): void {
  activeSockets = Math.max(0, count);
}

/**
 * Compute snapshot of platform operational telemetry
 */
export function getTelemetrySnapshot(): PlatformHealthTelemetry {
  const avgMatching = matchingLatencies.length > 0
    ? Math.round(matchingLatencies.reduce((a, b) => a + b, 0) / matchingLatencies.length)
    : 0;

  const avgResponse = responseTimesMinutes.length > 0
    ? Number((responseTimesMinutes.reduce((a, b) => a + b, 0) / responseTimesMinutes.length).toFixed(1))
    : 0;

  const fulfillmentRate = totalDispatched > 0
    ? Number(((totalFulfilled / totalDispatched) * 100).toFixed(1))
    : 100;

  const criticalRate = totalCriticalDispatched > 0
    ? Number(((totalCriticalFulfilled / totalCriticalDispatched) * 100).toFixed(1))
    : 100;

  return {
    uptimeSeconds: Math.floor((Date.now() - systemStartTime) / 1000),
    totalEmergencyRequestsDispatched: totalDispatched,
    totalDonationsFulfilled: totalFulfilled,
    totalDonorsAlerted: totalAlertedDonors,
    averageMatchingLatencyMs: avgMatching,
    averageResponseTimeMinutes: avgResponse,
    fulfillmentSuccessRatePercent: fulfillmentRate,
    criticalUrgencyFulfillmentRatePercent: criticalRate,
    activeSocketConnections: activeSockets,
  };
}

/**
 * Reset telemetry counters (for unit testing)
 */
export function resetTelemetry(): void {
  systemStartTime = Date.now();
  matchingLatencies.length = 0;
  responseTimesMinutes.length = 0;
  totalDispatched = 0;
  totalFulfilled = 0;
  totalCriticalDispatched = 0;
  totalCriticalFulfilled = 0;
  totalAlertedDonors = 0;
  activeSockets = 0;
}
