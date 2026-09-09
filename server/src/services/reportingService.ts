import { prisma } from '../prisma';

export interface EmergencyReportSummary {
  period: string;
  totalRequests: number;
  completedRequests: number;
  verifiedRequests: number;
  rejectedRequests: number;
  criticalUrgencyCount: number;
  averageUnitsPerRequest: number;
  topRequestedBloodGroups: { bloodGroup: string; count: number }[];
}

/**
 * Operational Reporting and Analytics Export Service
 */
export async function generateEmergencyReport(
  startDate?: Date,
  endDate?: Date
): Promise<EmergencyReportSummary> {
  const whereClause: any = {};
  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) whereClause.createdAt.gte = startDate;
    if (endDate) whereClause.createdAt.lte = endDate;
  }

  const [
    totalRequests,
    completedRequests,
    verifiedRequests,
    rejectedRequests,
    criticalUrgencyCount,
    groupStats,
    unitSum,
  ] = await Promise.all([
    prisma.bloodRequest.count({ where: whereClause }),
    prisma.bloodRequest.count({ where: { ...whereClause, status: 'COMPLETED' } }),
    prisma.bloodRequest.count({
      where: {
        ...whereClause,
        status: { in: ['HOSPITAL_VERIFIED', 'DONORS_NOTIFIED', 'DONOR_CONFIRMED', 'COMPLETED'] },
      },
    }),
    prisma.bloodRequest.count({ where: { ...whereClause, status: 'REJECTED' } }),
    prisma.bloodRequest.count({ where: { ...whereClause, urgency: 'CRITICAL' } }),
    prisma.bloodRequest.groupBy({
      by: ['bloodGroup'],
      where: whereClause,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.bloodRequest.aggregate({
      where: whereClause,
      _sum: { unitsRequired: true },
    }),
  ]);

  const totalUnits = unitSum._sum.unitsRequired || 0;
  const averageUnits = totalRequests > 0 ? Math.round((totalUnits / totalRequests) * 10) / 10 : 1;

  const topRequested = groupStats.map((g) => ({
    bloodGroup: g.bloodGroup,
    count: g._count.id,
  }));

  return {
    period: `${startDate ? startDate.toISOString().split('T')[0] : 'All-time'} to ${
      endDate ? endDate.toISOString().split('T')[0] : 'Present'
    }`,
    totalRequests,
    completedRequests,
    verifiedRequests,
    rejectedRequests,
    criticalUrgencyCount,
    averageUnitsPerRequest: averageUnits,
    topRequestedBloodGroups: topRequested,
  };
}

/**
 * Export Emergency Data as CSV string for administrative audits
 */
export async function exportRequestsAsCSV(): Promise<string> {
  const requests = await prisma.bloodRequest.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { hospital: true },
  });

  const headers = [
    'Request ID',
    'Blood Group',
    'Units',
    'Urgency',
    'Status',
    'Hospital',
    'Escalation Stage',
    'Created At',
  ];

  const rows = requests.map((r) => [
    r.id,
    r.bloodGroup,
    r.unitsRequired,
    r.urgency,
    r.status,
    `"${r.hospital?.hospitalName || 'N/A'}"`,
    r.currentEscalationStage,
    r.createdAt.toISOString(),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
