# BloodBridge — Relational Database Schema & Data Dictionary

The platform uses a normalized relational database schema managed via Prisma ORM. It runs on SQLite for zero-configuration, self-contained, offline portability, and can be pointed to PostgreSQL or MySQL with zero query code changes.

```
                      +-------------------+
                      |       User        |
                      +-------------------+
                      | id (PK)           |
                      | email (UQ)        |
                      | passwordHash      |
                      | fullName          |
                      | role              |
                      | status            |
                      +---------+---------+
                                |
        +-----------------------+-----------------------+
        | 1:1                   | 1:1                   | 1:N
        v                       v                       v
+-------------------+   +-------------------+   +-------------------+
|   DonorProfile    |   |  HospitalProfile  |   |   BloodRequest    |
+-------------------+   +-------------------+   +-------------------+
| id (PK)           |   | id (PK)           |   | id (PK, BB-xxxx)  |
| userId (FK)       |   | userId (FK)       |   | requesterId (FK)  |
| bloodGroup        |   | hospitalName      |   | hospitalId (FK)   |
| availabilityStatus|   | licenseNumber (UQ)|   | patientInitials   |
| latitude, long    |   | address           |   | bloodGroup        |
| totalDonations    |   | totalVerified     |   | unitsRequired     |
| reliabilityScore  |   +---------+---------+   | urgency, status   |
+---------+---------+             |             | isDuplicateFlagged|
          |                       |             +---------+---------+
          | 1:N                   | 1:N                   |
          |         +-------------+                       |
          v         v                                     |
+-------------------+                                     |
|    DonorMatch     |<------------------------------------+ (1:N)
+-------------------+                                     |
| id (PK)           |                                     |
| requestId (FK)    |                                     |
| donorId (FK)      |                                     |
| matchScore        |                                     |
| status            |                                     |
+-------------------+                                     |
                                                          |
        +-------------------------------------------------+
        |
        +------------------------+------------------------+
        | 1:N                    | 1:N                    | 1:N
        v                        v                        v
+-------------------+    +-------------------+    +-------------------+
|VerificationRecord |    |RequestStatusHist  |    |  EscalationEvent  |
+-------------------+    +-------------------+    +-------------------+
| id (PK)           |    | id (PK)           |    | id (PK)           |
| requestId (FK)    |    | requestId (FK)    |    | requestId (FK)    |
| hospitalId (FK)   |    | fromStatus        |    | stageNumber (1-5) |
| verifiedBy (FK)   |    | toStatus          |    | radiusKm          |
| status, notes     |    | changedBy (FK)    |    | donorsNotified    |
+-------------------+    +-------------------+    +-------------------+
```

## Entity Descriptions

### 1. `User`
Stores core authentication, identity, security status, and system roles.
- `role`: `DONOR`, `REQUESTER`, `HOSPITAL`, `ADMIN`
- `status`: `ACTIVE`, `SUSPENDED`

### 2. `DonorProfile`
Contains blood group, real-time availability, geographical coordinates, and lifetime participation metrics.
- `bloodGroup`: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`
- `availabilityStatus`: `AVAILABLE`, `AVAILABLE_LATER`, `NOT_AVAILABLE`

### 3. `HospitalProfile`
Contains facility credentials, geographical coordinates, contact details, and verification track record.

### 4. `BloodRequest`
The central coordination record with unique identifier format `BB-2026-XXXXXX`.
- `status`: `PENDING_VERIFICATION`, `HOSPITAL_VERIFIED`, `MATCHING_IN_PROGRESS`, `DONORS_NOTIFIED`, `DONOR_CONFIRMED`, `BLOOD_RECEIVED`, `COMPLETED`, `REJECTED`, `EXPIRED`.
- `urgency`: `NORMAL`, `URGENT`, `CRITICAL`.
- `isDuplicateFlagged`: Boolean flag indicating similarity $\ge 70\%$ against active submissions.

### 5. `DonorMatch`
Tracks individual donor dispatches, compatibility scores, response times, and accept/decline decisions.

### 6. `VerificationRecord`
Formal hospital audit record detailing physician review, timestamps, and clinical notes.

### 7. `EscalationEvent`
Records radius expansion iterations (3 km $\rightarrow$ 7 km $\rightarrow$ 15 km $\rightarrow$ Regional $\rightarrow$ Admin) and notification dispatches.

### 8. `Notification`
In-app and real-time push alert records with category tagging and read/unread status.

### 9. `RequestStatusHistory`
Immutable audit log tracking every status transition, actor ID, and rationale.

### 10. `AuditLog`
Platform-wide security and administrative operations trail for compliance and review.
