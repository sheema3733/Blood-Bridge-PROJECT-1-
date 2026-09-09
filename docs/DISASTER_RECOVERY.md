# BloodBridge Disaster Recovery & Incident Response Runbook

This document defines the standard operating procedures (SOPs) for responding to infrastructure outages, data corruption events, network partitions, and security incidents on the BloodBridge platform.

---

## 1. Incident Severity Classification

| Severity Level | Definition | Target RTO (Recovery Time) | Target RPO (Data Loss) |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Core emergency coordination matching or WebSocket dispatch offline | < 15 minutes | < 1 minute |
| **SEV-2 (Major)** | Hospital inventory portal or reporting service degraded | < 1 hour | < 5 minutes |
| **SEV-3 (Moderate)** | Non-critical background telemetry or badge awards delayed | < 4 hours | < 1 hour |
| **SEV-4 (Minor)** | Cosmetic UI anomaly or documentation inaccuracy | Next Release | Zero impact |

---

## 2. Emergency Escalation Contacts & On-Call Rotation

- **Clinical Coordination Incident Commander**: Clinical Operations Lead
- **Platform Infrastructure Engineering**: Senior DevOps / Systems Architect
- **Data Protection Officer (DPO)**: Compliance & Healthcare Privacy Lead

---

## 3. Database Failover & Restore Procedure

In the event of database filesystem corruption or server failure:

### Step 1: Quarantine Damaged Node
Stop the server process immediately to prevent corruption propagation:
```bash
docker compose stop api
```

### Step 2: Identify Latest Certified Snapshot
Inspect the backup directory:
```bash
ls -la backups/
```

### Step 3: Restore Database Snapshot
Copy the most recent verified backup file over the active database target:
```bash
cp backups/bloodbridge_backup_YYYY-MM-DD-THH-MM-SS.db server/prisma/dev.db
```

### Step 4: Validate Chained Audit Ledger
Execute audit ledger verification to verify cryptographic non-repudiation:
```bash
npm test -- src/tests/e2eLifecycle.test.ts
```

### Step 5: Resume Ingress Traffic
```bash
docker compose up -d api
curl http://localhost:5000/api/health/deep
```

---

## 4. WebSocket Partition & Reconnect Storm Mitigation

If the real-time WebSocket connection cluster is interrupted:
1. Client applications feature an exponential backoff jitter reconnection loop (`1s`, `2s`, `4s`, `8s`, max `30s`).
2. The `OfflineIndicator` toast alerts hospital staff that offline caching is in effect.
3. Pending actions are queued locally in `sessionStorage` and dispatched once the connection is re-established.
4. Active broadcasts and unacknowledged alerts are automatically re-fetched upon handshake reconnect.

---

## 5. Post-Mortem Template

Every SEV-1 and SEV-2 incident requires a published post-mortem within 48 hours containing:
1. **Root Cause Analysis (5 Whys methodology)**
2. **Timeline of Events (UTC)**
3. **Impact on Emergency Coordination (dispatches affected, hospitals impacted)**
4. **Corrective & Preventive Actions (CAPA items with owners and Jira ticket links)**
