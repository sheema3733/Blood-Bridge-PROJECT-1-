/**
 * BloodBridge Streaming CSV Exporter Service
 * Generates standards-compliant CSV data streams with proper RFC 4180 escaping,
 * BOM prefix for Microsoft Excel UTF-8 compatibility, and memory efficiency.
 */

export interface CsvColumnMapping<T> {
  header: string;
  accessor: (item: T) => string | number | boolean | null | undefined;
}

/**
 * Escapes values in compliance with RFC 4180
 */
export function escapeCsvField(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }

  const stringVal = String(value);

  // If the value contains commas, quotes, or newlines, enclose in quotes and escape internal quotes
  if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }

  return stringVal;
}

/**
 * Converts an array of objects to a CSV string with standard UTF-8 BOM
 */
export function generateCsv<T>(
  data: T[],
  columns: CsvColumnMapping<T>[],
  includeBom = true
): string {
  const headerRow = columns.map((col) => escapeCsvField(col.header)).join(',');
  const rows = data.map((item) => {
    return columns.map((col) => escapeCsvField(col.accessor(item))).join(',');
  });

  const content = [headerRow, ...rows].join('\r\n');
  return includeBom ? `\uFEFF${content}` : content;
}

/**
 * Pre-defined column definitions for common BloodBridge export types
 */
export const DONATION_REPORT_COLUMNS: CsvColumnMapping<any>[] = [
  { header: 'Request ID', accessor: (r) => r.id },
  { header: 'Blood Group', accessor: (r) => r.bloodGroup },
  { header: 'Units', accessor: (r) => r.units },
  { header: 'Urgency', accessor: (r) => r.urgency },
  { header: 'Hospital Name', accessor: (r) => r.hospitalName },
  { header: 'Status', accessor: (r) => r.status },
  { header: 'Created At', accessor: (r) => r.createdAt },
];

export const INVENTORY_REPORT_COLUMNS: CsvColumnMapping<any>[] = [
  { header: 'Blood Group', accessor: (i) => i.bloodGroup },
  { header: 'Available Units', accessor: (i) => i.totalAvailable },
  { header: 'Reserved Units', accessor: (i) => i.totalReserved },
  { header: 'Expired Units', accessor: (i) => i.totalExpired },
  { header: 'Threshold', accessor: (i) => i.criticalThreshold },
  { header: 'Low Stock Alert', accessor: (i) => (i.isBelowThreshold ? 'YES' : 'NO') },
];
