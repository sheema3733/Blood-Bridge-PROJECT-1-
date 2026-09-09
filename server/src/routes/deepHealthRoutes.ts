/**
 * BloodBridge Deep System Diagnostics & Healthcheck Route
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTelemetrySnapshot } from '../services/telemetryService';

export const deepHealthRoutes = Router();

deepHealthRoutes.get('/deep', async (_req: Request, res: Response) => {
  const startTime = Date.now();
  let dbStatus = 'HEALTHY';
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (err: any) {
    dbStatus = 'DEGRADED';
  }

  const memoryUsage = process.memoryUsage();
  const telemetry = getTelemetrySnapshot();

  const isHealthy = dbStatus === 'HEALTHY';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    process: {
      uptimeSeconds: Math.floor(process.uptime()),
      pid: process.pid,
      nodeVersion: process.version,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
    },
    services: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      telemetry: {
        activeSockets: telemetry.activeSocketConnections,
        totalRequestsDispatched: telemetry.totalEmergencyRequestsDispatched,
        fulfillmentRatePercent: telemetry.fulfillmentSuccessRatePercent,
      },
    },
    totalDiagnosticTimeMs: Date.now() - startTime,
  });
});
