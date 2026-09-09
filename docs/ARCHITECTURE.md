# BloodBridge — Platform Architecture & Technical Specification

## 1. System Overview
BloodBridge is an end-to-end, real-time emergency blood coordination platform built to solve the fragmentation, delays, notification spam, and uncertainty typical of informal social media and chat-based blood appeals.

BloodBridge does NOT provide medical diagnosis or replace hospital blood banks. It coordinates logistics and matches verified emergency requests with compatible donors within geographic radius stages.

```
+-------------------------------------------------------------------------------+
|                             CLIENT APPLICATION                                |
|  - React 18 + TypeScript + Vite + Tailwind CSS                                |
|  - Role-Based Dashboards: Donor, Requester, Hospital Staff, Chief Admin       |
|  - Socket.IO Client for instant live state updates without page refreshes     |
+---------------------------------------+---------------------------------------+
                                        | (HTTP REST + WebSockets)
                                        v
+-------------------------------------------------------------------------------+
|                            API & REAL-TIME SERVER                             |
|  - Node.js + Express + TypeScript                                             |
|  - Socket.IO Server with targeted room dispatch                               |
|  - Middleware: JWT Authentication, RBAC, Rate Limiter, Helmet Security        |
|  - Domain Engines:                                                            |
|      * Smart Donor Matching Engine (ABO/Rh matrix + Haversine distance)       |
|      * Duplicate Request Detection Engine (Similarity scoring triage)         |
|      * Multi-Stage Smart Escalation Engine (Radius expansion 3-50 km)         |
|      * Hospital Verification Workflow & Audit Logger                          |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                                DATABASE LAYER                                 |
|  - Prisma ORM + Normalized Relational Schema                                  |
|  - SQLite (Portable, zero-dependency, self-contained, transactional)          |
|  - 10 Core Entities with foreign keys, cascade safety, and indexes            |
+-------------------------------------------------------------------------------+
```

## 2. Real-Time WebSocket Channel Architecture
To ensure zero-latency synchronization across all actors during a blood emergency, BloodBridge establishes targeted WebSocket rooms:

| Room Pattern | Purpose | Audience |
|---|---|---|
| `user:<userId>` | Private notifications, direct alerts, and dispatch calls | Specific user |
| `role:DONOR` | Broad donor notifications and availability sync | All active voluntary donors |
| `role:HOSPITAL` | Incoming requests queued for clinical verification | Hospital staff coordinators |
| `role:ADMIN` | Global emergency tracking, audit logs, duplicate triage | Platform administrators |
| `request:<requestId>` | Real-time 8-step lifecycle updates & donor responses | Request participants |

### Key Real-Time Events:
- `request:created`: Dispatched when a family/requester submits an emergency. Hospital queue updates instantly.
- `request:verified`: Hospital confirms patient admission; triggers matching engine immediately.
- `donor:notified`: Dispatched to compatible nearby donors with push notification and alert chime.
- `donor:accepted`: Emitted when a donor commits to donate. Requester's live timeline updates to **Donor Confirmed** without refreshing.
- `matching:radius_expanded` / `request:escalated`: Search radius widens if initial radius times out.
- `blood:received` / `request:completed`: Hospital confirms units received and safely closes the request.

---

## 3. Algorithmic Specifications

### A. Smart Donor Matching Algorithm
Formula for match score $S \in [0, 100]$:
$$S = S_{\text{blood}} + S_{\text{availability}} + S_{\text{distance}} + S_{\text{reliability}}$$

Where:
- $S_{\text{blood}} \in \{0, 30, 40\}$: Exact blood group match = $40$ pts; compatible alternative = $30$ pts; incompatible = $0$ pts.
- $S_{\text{availability}} \in \{0, 10, 25\}$: `AVAILABLE` = $25$ pts; `AVAILABLE_LATER` = $10$ pts; `NOT_AVAILABLE` = $0$ pts.
- $S_{\text{distance}} = \max\left(0, \left(1 - \frac{d}{R}\right) \times 20\right)$, where $d$ is the Haversine distance in km, and $R$ is the current stage radius.
- $S_{\text{reliability}} = \left(\frac{\text{ReliabilityScore}}{100}\right) \times 15$ pts.

### B. Duplicate Request Detection Algorithm
Incoming requests are compared against all active requests within the past 24 hours:
- Identical Hospital: $+40\%$
- Identical Blood Group: $+30\%$
- Similar Unit Count ($|\Delta \text{units}| \le 1$): $+15\%$
- Close Required-By Window ($|\Delta t| \le 12\text{h}$): $+15\%$

If total similarity $\ge 70\%$, the request is flagged as `POSSIBLE_DUPLICATE` and presented to hospital verification staff with a comparison card rather than discarded, ensuring genuine emergencies are never lost while preventing spam.

### C. Multi-Stage Smart Escalation
- **Stage 1 (0 min)**: Immediate neighborhood radius ($3\text{ km}$).
- **Stage 2 (10 min)**: Expanded neighborhood radius ($7\text{ km}$).
- **Stage 3 (20 min)**: City network radius ($15\text{ km}$).
- **Stage 4 (30 min)**: Regional volunteer and institutional blood bank network ($25\text{ km}$).
- **Stage 5 (45 min)**: Platform Admin High-Priority Incident Escalation ($50\text{ km}$).
