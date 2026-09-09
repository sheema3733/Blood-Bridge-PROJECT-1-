import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordMatchingLatency,
  recordRequestDispatched,
  recordDonationFulfilled,
  updateActiveSockets,
  getTelemetrySnapshot,
  resetTelemetry,
} from '../services/telemetryService';

describe('Operational Telemetry & Performance Metrics Service', () => {
  beforeEach(() => {
    resetTelemetry();
  });

  it('should initialize telemetry snapshot with zero counters', () => {
    const snap = getTelemetrySnapshot();
    expect(snap.totalEmergencyRequestsDispatched).toBe(0);
    expect(snap.totalDonationsFulfilled).toBe(0);
    expect(snap.averageMatchingLatencyMs).toBe(0);
    expect(snap.activeSocketConnections).toBe(0);
  });

  it('should accurately compute moving average of matching latencies', () => {
    recordMatchingLatency(12);
    recordMatchingLatency(24);
    recordMatchingLatency(18);

    const snap = getTelemetrySnapshot();
    expect(snap.averageMatchingLatencyMs).toBe(18); // (12 + 24 + 18) / 3 = 18
  });

  it('should calculate fulfillment rate percentages accurately', () => {
    recordRequestDispatched(false, 5);
    recordRequestDispatched(true, 8);
    recordRequestDispatched(true, 4);

    recordDonationFulfilled(false, 35);
    recordDonationFulfilled(true, 22);

    const snap = getTelemetrySnapshot();
    expect(snap.totalEmergencyRequestsDispatched).toBe(3);
    expect(snap.totalDonationsFulfilled).toBe(2);
    expect(snap.totalDonorsAlerted).toBe(17);
    expect(snap.fulfillmentSuccessRatePercent).toBe(66.7);
    expect(snap.criticalUrgencyFulfillmentRatePercent).toBe(50.0);
    expect(snap.averageResponseTimeMinutes).toBe(28.5); // (35 + 22) / 2 = 28.5
  });

  it('should track active socket connection gauge', () => {
    updateActiveSockets(42);
    expect(getTelemetrySnapshot().activeSocketConnections).toBe(42);

    updateActiveSockets(38);
    expect(getTelemetrySnapshot().activeSocketConnections).toBe(38);
  });
});
