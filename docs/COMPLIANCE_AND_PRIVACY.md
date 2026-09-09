# BloodBridge Healthcare Privacy, HIPAA, and GDPR Compliance Architecture

BloodBridge operates under strict healthcare data governance standards designed to protect Protected Health Information (PHI) and donor Personally Identifiable Information (PII).

---

## 1. PHI Isolation & Data Minimization

BloodBridge adheres to the principle of **Minimum Necessary Disclosure**:
1. **Donor Geolocation Obfuscation**: Exact donor home addresses are never persisted or transmitted. Geospatial distance calculations are computed in memory using centroid approximate coordinates.
2. **Patient Anonymity**: Blood coordination requests identify clinical requirements (Blood Group, Units, Urgency, Hospital Ward/Bed) without broadcasting patient legal names or medical diagnoses.
3. **Stand-Down Ephemerality**: Once a blood request is fulfilled or cancelled, donor contact information is unlinked from public query streams.

---

## 2. Cryptographic Security Standards

- **In-Transit Encryption**: All communication is enforced over TLS 1.3 with forward secrecy. WebSocket handshakes require WSS with JWT authorization tokens.
- **At-Rest Protection**: Database volumes utilize AES-256 block encryption.
- **Audit Integrity**: Critical coordination actions are logged to a tamper-evident hash-chained ledger utilizing SHA-256 hash pointers.
- **Outbound Webhooks**: External hospital HMS dispatch payloads are signed with HMAC-SHA256 headers (`X-BloodBridge-Signature`) to guarantee authenticity.

---

## 3. GDPR Data Subject Rights

BloodBridge provides automated facilities for European GDPR and Indian DPDP compliance:
- **Right of Access (Article 15)**: Donors can export their complete donation history, awarded badges, and communication preferences as RFC 4180 CSV files.
- **Right to Erasure / To Be Forgotten (Article 17)**: Deactivation cascades anonymize user profiles while preserving non-identifiable clinical batch transfusion records for hospital medical audit requirements.
- **Right to Restriction of Processing (Article 18)**: Donors can configure quiet hours, set travel radius to 0 km, or toggle "Emergency Only" mode.

---

## 4. Business Associate Agreement (BAA) Readiness

For healthcare network deployments:
- Administrative audit logs capture actor identity, IP masking, timestamp, and modification deltas.
- System backups undergo automated retention pruning and are verified through cryptographic checksums.
