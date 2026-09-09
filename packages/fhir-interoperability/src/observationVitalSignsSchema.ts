/**
 * BloodBridge FHIR & HL7 Interoperability Engine — FHIR Observation Transfusion Vital Signs
 * Compliant with HL7 FHIR Release 4 / Release 5 and ISBT 128 standards.
 */

export interface ObservationVitalSignsResource {
  resourceType: string;
  id: string;
  status: 'draft' | 'active' | 'completed' | 'entered-in-error' | 'revoked';
  identifier: Array<{ system: string; value: string; assigner?: string }>;
  isbt128ProductCode: string;
  snomedCode: string;
  loincCode: string;
  subjectPatientRef: string;
  requesterOrganizationRef: string;
  occurrenceDateTime: string;
  priority: 'stat' | 'urgent' | 'asap' | 'routine';
  quantityUnits: number;
  storageConditionCelsius: { min: number; max: number };
  safetyAuditSignature: string;
  telemetryValidationHash: string;
  meta: { versionId: string; lastUpdated: string; profile: string[] };
}

export const OBSERVATIONVITALSIGNSSCHEMA_DATASET: ObservationVitalSignsResource[] = [
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0001',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123001 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0001' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1001',
    requesterOrganizationRef: 'Organization/HOSP-APEX-101',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0001',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000001',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0002',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123002 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0002' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1002',
    requesterOrganizationRef: 'Organization/HOSP-APEX-102',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0002',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000002',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0003',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123003 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0003' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1003',
    requesterOrganizationRef: 'Organization/HOSP-APEX-103',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0003',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000003',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0004',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123004 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0004' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1004',
    requesterOrganizationRef: 'Organization/HOSP-APEX-104',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0004',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000004',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0005',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123005 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0005' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1005',
    requesterOrganizationRef: 'Organization/HOSP-APEX-105',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0005',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000005',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0006',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123006 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0006' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1006',
    requesterOrganizationRef: 'Organization/HOSP-APEX-106',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0006',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000006',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0007',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123007 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0007' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1007',
    requesterOrganizationRef: 'Organization/HOSP-APEX-107',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0007',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000007',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0008',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123008 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0008' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1008',
    requesterOrganizationRef: 'Organization/HOSP-APEX-108',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0008',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000008',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0009',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123009 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0009' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1009',
    requesterOrganizationRef: 'Organization/HOSP-APEX-109',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0009',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000009',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0010',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123010 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0010' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1010',
    requesterOrganizationRef: 'Organization/HOSP-APEX-110',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0010',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000010',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0011',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123011 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0011' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1011',
    requesterOrganizationRef: 'Organization/HOSP-APEX-111',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0011',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000011',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0012',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123012 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0012' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1012',
    requesterOrganizationRef: 'Organization/HOSP-APEX-112',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0012',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000012',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0013',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123013 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0013' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1013',
    requesterOrganizationRef: 'Organization/HOSP-APEX-113',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0013',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000013',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0014',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123014 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0014' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1014',
    requesterOrganizationRef: 'Organization/HOSP-APEX-114',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0014',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000014',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0015',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123015 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0015' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1015',
    requesterOrganizationRef: 'Organization/HOSP-APEX-115',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0015',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000015',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0016',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123016 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0016' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1016',
    requesterOrganizationRef: 'Organization/HOSP-APEX-116',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0016',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000016',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0017',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123017 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0017' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1017',
    requesterOrganizationRef: 'Organization/HOSP-APEX-117',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0017',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000017',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0018',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123018 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0018' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1018',
    requesterOrganizationRef: 'Organization/HOSP-APEX-118',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0018',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000018',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0019',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123019 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0019' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1019',
    requesterOrganizationRef: 'Organization/HOSP-APEX-119',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0019',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000019',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0020',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123020 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0020' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1020',
    requesterOrganizationRef: 'Organization/HOSP-APEX-100',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0020',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000020',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0021',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123021 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0021' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1021',
    requesterOrganizationRef: 'Organization/HOSP-APEX-101',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0021',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000021',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0022',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123022 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0022' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1022',
    requesterOrganizationRef: 'Organization/HOSP-APEX-102',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0022',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000022',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0023',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123023 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0023' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1023',
    requesterOrganizationRef: 'Organization/HOSP-APEX-103',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0023',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000023',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0024',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123024 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0024' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1024',
    requesterOrganizationRef: 'Organization/HOSP-APEX-104',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0024',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000024',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0025',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123025 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0025' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1025',
    requesterOrganizationRef: 'Organization/HOSP-APEX-105',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0025',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000025',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0026',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123026 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0026' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1026',
    requesterOrganizationRef: 'Organization/HOSP-APEX-106',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0026',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000026',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0027',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123027 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0027' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1027',
    requesterOrganizationRef: 'Organization/HOSP-APEX-107',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0027',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000027',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0028',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123028 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0028' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1028',
    requesterOrganizationRef: 'Organization/HOSP-APEX-108',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0028',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000028',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0029',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123029 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0029' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1029',
    requesterOrganizationRef: 'Organization/HOSP-APEX-109',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0029',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000029',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0030',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123030 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0030' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1030',
    requesterOrganizationRef: 'Organization/HOSP-APEX-110',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0030',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000030',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0031',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123031 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0031' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1031',
    requesterOrganizationRef: 'Organization/HOSP-APEX-111',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0031',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000031',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0032',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123032 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0032' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1032',
    requesterOrganizationRef: 'Organization/HOSP-APEX-112',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0032',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000032',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0033',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123033 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0033' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1033',
    requesterOrganizationRef: 'Organization/HOSP-APEX-113',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0033',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000033',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0034',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123034 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0034' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1034',
    requesterOrganizationRef: 'Organization/HOSP-APEX-114',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0034',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000034',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0035',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123035 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0035' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1035',
    requesterOrganizationRef: 'Organization/HOSP-APEX-115',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0035',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000035',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0036',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123036 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0036' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1036',
    requesterOrganizationRef: 'Organization/HOSP-APEX-116',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0036',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000036',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0037',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123037 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0037' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1037',
    requesterOrganizationRef: 'Organization/HOSP-APEX-117',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0037',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000037',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0038',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123038 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0038' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1038',
    requesterOrganizationRef: 'Organization/HOSP-APEX-118',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0038',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000038',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0039',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123039 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0039' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1039',
    requesterOrganizationRef: 'Organization/HOSP-APEX-119',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0039',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000039',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0040',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123040 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0040' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1040',
    requesterOrganizationRef: 'Organization/HOSP-APEX-100',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0040',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000040',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0041',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123041 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0041' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1041',
    requesterOrganizationRef: 'Organization/HOSP-APEX-101',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0041',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000041',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0042',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123042 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0042' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1042',
    requesterOrganizationRef: 'Organization/HOSP-APEX-102',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0042',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000042',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0043',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123043 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0043' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1043',
    requesterOrganizationRef: 'Organization/HOSP-APEX-103',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0043',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000043',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0044',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123044 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0044' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1044',
    requesterOrganizationRef: 'Organization/HOSP-APEX-104',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0044',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000044',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0045',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123045 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0045' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1045',
    requesterOrganizationRef: 'Organization/HOSP-APEX-105',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0045',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000045',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0046',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123046 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0046' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1046',
    requesterOrganizationRef: 'Organization/HOSP-APEX-106',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0046',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000046',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0047',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123047 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0047' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1047',
    requesterOrganizationRef: 'Organization/HOSP-APEX-107',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0047',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000047',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0048',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123048 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0048' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1048',
    requesterOrganizationRef: 'Organization/HOSP-APEX-108',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0048',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000048',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0049',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123049 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0049' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1049',
    requesterOrganizationRef: 'Organization/HOSP-APEX-109',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0049',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000049',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0050',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123050 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0050' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1050',
    requesterOrganizationRef: 'Organization/HOSP-APEX-110',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0050',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000050',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0051',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123051 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0051' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1051',
    requesterOrganizationRef: 'Organization/HOSP-APEX-111',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0051',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000051',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0052',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123052 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0052' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1052',
    requesterOrganizationRef: 'Organization/HOSP-APEX-112',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0052',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000052',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0053',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123053 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0053' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1053',
    requesterOrganizationRef: 'Organization/HOSP-APEX-113',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0053',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000053',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0054',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123054 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0054' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1054',
    requesterOrganizationRef: 'Organization/HOSP-APEX-114',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0054',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000054',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0055',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123055 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0055' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1055',
    requesterOrganizationRef: 'Organization/HOSP-APEX-115',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0055',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000055',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0056',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123056 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0056' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1056',
    requesterOrganizationRef: 'Organization/HOSP-APEX-116',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0056',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000056',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0057',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123057 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0057' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1057',
    requesterOrganizationRef: 'Organization/HOSP-APEX-117',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0057',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000057',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0058',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123058 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0058' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1058',
    requesterOrganizationRef: 'Organization/HOSP-APEX-118',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0058',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000058',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0059',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123059 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0059' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1059',
    requesterOrganizationRef: 'Organization/HOSP-APEX-119',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0059',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000059',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0060',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123060 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0060' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1060',
    requesterOrganizationRef: 'Organization/HOSP-APEX-100',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0060',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000060',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0061',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123061 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0061' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1061',
    requesterOrganizationRef: 'Organization/HOSP-APEX-101',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0061',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000061',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0062',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123062 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0062' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1062',
    requesterOrganizationRef: 'Organization/HOSP-APEX-102',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0062',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000062',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0063',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123063 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0063' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1063',
    requesterOrganizationRef: 'Organization/HOSP-APEX-103',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0063',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000063',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0064',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123064 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0064' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1064',
    requesterOrganizationRef: 'Organization/HOSP-APEX-104',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0064',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000064',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0065',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123065 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0065' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1065',
    requesterOrganizationRef: 'Organization/HOSP-APEX-105',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0065',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000065',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0066',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123066 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0066' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1066',
    requesterOrganizationRef: 'Organization/HOSP-APEX-106',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0066',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000066',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0067',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123067 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0067' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1067',
    requesterOrganizationRef: 'Organization/HOSP-APEX-107',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0067',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000067',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0068',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123068 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0068' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1068',
    requesterOrganizationRef: 'Organization/HOSP-APEX-108',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0068',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000068',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0069',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123069 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0069' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1069',
    requesterOrganizationRef: 'Organization/HOSP-APEX-109',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0069',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000069',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0070',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123070 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0070' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1070',
    requesterOrganizationRef: 'Organization/HOSP-APEX-110',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0070',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000070',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0071',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123071 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0071' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1071',
    requesterOrganizationRef: 'Organization/HOSP-APEX-111',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0071',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000071',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0072',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123072 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0072' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1072',
    requesterOrganizationRef: 'Organization/HOSP-APEX-112',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0072',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000072',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0073',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123073 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0073' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1073',
    requesterOrganizationRef: 'Organization/HOSP-APEX-113',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0073',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000073',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0074',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123074 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0074' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1074',
    requesterOrganizationRef: 'Organization/HOSP-APEX-114',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0074',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000074',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0075',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123075 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0075' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1075',
    requesterOrganizationRef: 'Organization/HOSP-APEX-115',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0075',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000075',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0076',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123076 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0076' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1076',
    requesterOrganizationRef: 'Organization/HOSP-APEX-116',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0076',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000076',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0077',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123077 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0077' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1077',
    requesterOrganizationRef: 'Organization/HOSP-APEX-117',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0077',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000077',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0078',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123078 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0078' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1078',
    requesterOrganizationRef: 'Organization/HOSP-APEX-118',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0078',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000078',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0079',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123079 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0079' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1079',
    requesterOrganizationRef: 'Organization/HOSP-APEX-119',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0079',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000079',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0080',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123080 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0080' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1080',
    requesterOrganizationRef: 'Organization/HOSP-APEX-100',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0080',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000080',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0081',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123081 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0081' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1081',
    requesterOrganizationRef: 'Organization/HOSP-APEX-101',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0081',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000081',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0082',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123082 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0082' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1082',
    requesterOrganizationRef: 'Organization/HOSP-APEX-102',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0082',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000082',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0083',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123083 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0083' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1083',
    requesterOrganizationRef: 'Organization/HOSP-APEX-103',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0083',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000083',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0084',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123084 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0084' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1084',
    requesterOrganizationRef: 'Organization/HOSP-APEX-104',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0084',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000084',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0085',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123085 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0085' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1085',
    requesterOrganizationRef: 'Organization/HOSP-APEX-105',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0085',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000085',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0086',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123086 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0086' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1086',
    requesterOrganizationRef: 'Organization/HOSP-APEX-106',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0086',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000086',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0087',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123087 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0087' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1087',
    requesterOrganizationRef: 'Organization/HOSP-APEX-107',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0087',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000087',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0088',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123088 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0088' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1088',
    requesterOrganizationRef: 'Organization/HOSP-APEX-108',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0088',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000088',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0089',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123089 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0089' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1089',
    requesterOrganizationRef: 'Organization/HOSP-APEX-109',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0089',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000089',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0090',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123090 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0090' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1090',
    requesterOrganizationRef: 'Organization/HOSP-APEX-110',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0090',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000090',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0091',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123091 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0091' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1091',
    requesterOrganizationRef: 'Organization/HOSP-APEX-111',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0091',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000091',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0092',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123092 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0092' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1092',
    requesterOrganizationRef: 'Organization/HOSP-APEX-112',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0092',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000092',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0093',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123093 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0093' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1093',
    requesterOrganizationRef: 'Organization/HOSP-APEX-113',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0093',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000093',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0094',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123094 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0094' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1094',
    requesterOrganizationRef: 'Organization/HOSP-APEX-114',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0094',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000094',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0095',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123095 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0095' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1095',
    requesterOrganizationRef: 'Organization/HOSP-APEX-115',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0095',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000095',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0096',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123096 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0096' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1096',
    requesterOrganizationRef: 'Organization/HOSP-APEX-116',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0096',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000096',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0097',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123097 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0097' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1097',
    requesterOrganizationRef: 'Organization/HOSP-APEX-117',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0097',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000097',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0098',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123098 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0098' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1098',
    requesterOrganizationRef: 'Organization/HOSP-APEX-118',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0098',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000098',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0099',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123099 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0099' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1099',
    requesterOrganizationRef: 'Organization/HOSP-APEX-119',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0099',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000099',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0100',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123100 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0100' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1100',
    requesterOrganizationRef: 'Organization/HOSP-APEX-100',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0100',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000100',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0101',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123101 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0101' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1101',
    requesterOrganizationRef: 'Organization/HOSP-APEX-101',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0101',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000101',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0102',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123102 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0102' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1102',
    requesterOrganizationRef: 'Organization/HOSP-APEX-102',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0102',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000102',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0103',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123103 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0103' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1103',
    requesterOrganizationRef: 'Organization/HOSP-APEX-103',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0103',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000103',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0104',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123104 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0104' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1104',
    requesterOrganizationRef: 'Organization/HOSP-APEX-104',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0104',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000104',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0105',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123105 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0105' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1105',
    requesterOrganizationRef: 'Organization/HOSP-APEX-105',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0105',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000105',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0106',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123106 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0106' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1106',
    requesterOrganizationRef: 'Organization/HOSP-APEX-106',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0106',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000106',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0107',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123107 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0107' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1107',
    requesterOrganizationRef: 'Organization/HOSP-APEX-107',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0107',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000107',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0108',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123108 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0108' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1108',
    requesterOrganizationRef: 'Organization/HOSP-APEX-108',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0108',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000108',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0109',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123109 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0109' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1109',
    requesterOrganizationRef: 'Organization/HOSP-APEX-109',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0109',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000109',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0110',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123110 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0110' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1110',
    requesterOrganizationRef: 'Organization/HOSP-APEX-110',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'asap',
    quantityUnits: 3,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0110',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000110',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0111',
    status: 'active',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123111 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0111' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1111',
    requesterOrganizationRef: 'Organization/HOSP-APEX-111',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'routine',
    quantityUnits: 4,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0111',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000111',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0112',
    status: 'completed',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123112 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0112' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1112',
    requesterOrganizationRef: 'Organization/HOSP-APEX-112',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'stat',
    quantityUnits: 1,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0112',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000112',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
  {
    resourceType: 'ObservationVitalSigns',
    id: 'FHIR-OBSE-0113',
    status: 'draft',
    identifier: [
      { system: 'https://bloodbridge.org/fhir/identifier/isbt128', value: 'W1234 26 123113 00' },
      { system: 'https://registry.cdsco.gov.in/bloodbank', value: 'BB-REG-2026-0113' }
    ],
    isbt128ProductCode: 'E0398V00',
    snomedCode: '102444008',
    loincCode: '883-9',
    subjectPatientRef: 'Patient/IN-DEL-1113',
    requesterOrganizationRef: 'Organization/HOSP-APEX-113',
    occurrenceDateTime: '2026-09-09T10:00:00.000Z',
    priority: 'urgent',
    quantityUnits: 2,
    storageConditionCelsius: { min: 2.0, max: 6.0 },
    safetyAuditSignature: 'ECDSA-SHA256-SIGNATURE-VERIFIED-OBSE-0113',
    telemetryValidationHash: 'SHA256-TELEMETRY-MERKLE-ROOT-000113',
    meta: {
      versionId: '1',
      lastUpdated: '2026-09-09T12:00:00.000Z',
      profile: ['https://bloodbridge.org/fhir/StructureDefinition/ObservationVitalSignsResource']
    }
  },
];

export function serializeObservationVitalSignsResourceToJson(resource: ObservationVitalSignsResource): string {
  return JSON.stringify(resource, null, 2);
}

export function validateObservationVitalSignsResource(resource: ObservationVitalSignsResource): boolean {
  if (!resource.id || !resource.resourceType) return false;
  if (!resource.identifier || resource.identifier.length === 0) return false;
  return true;
}
