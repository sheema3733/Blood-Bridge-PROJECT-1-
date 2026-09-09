import { describe, it, expect } from 'vitest';
import { generateEmergencyReport, exportRequestsAsCSV } from '../services/reportingService';

describe('Operational Reporting & Data Export Service', () => {
  it('should generate emergency report summary with realistic aggregates', async () => {
    const report = await generateEmergencyReport();

    expect(report).toBeDefined();
    expect(report.totalRequests).toBeGreaterThanOrEqual(0);
    expect(report.completedRequests).toBeGreaterThanOrEqual(0);
    expect(typeof report.averageUnitsPerRequest).toBe('number');
    expect(Array.isArray(report.topRequestedBloodGroups)).toBe(true);
  });

  it('should export valid CSV header and rows', async () => {
    const csv = await exportRequestsAsCSV();

    expect(typeof csv).toBe('string');
    expect(csv).toContain('Request ID,Blood Group,Units,Urgency,Status,Hospital');
  });
});
