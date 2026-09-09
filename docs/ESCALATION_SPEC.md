# BloodBridge — Multi-Stage Smart Escalation Specification

## 1. Objective
To guarantee that no emergency blood request goes unanswered due to geographic boundaries or local donor unavailability, BloodBridge executes a progressive multi-stage radius expansion algorithm.

---

## 2. Progressive Radius Stages

```
[ Stage 1: 0 to 3 km ]  ──(10 min timeout)──>  [ Stage 2: 3 to 7 km ]
                                                        │
                                                 (10 min timeout)
                                                        │
                                                        ▼
[ Stage 5: Platform Admin Incident ]  <──  [ Stage 4: Regional Network ]  <──  [ Stage 3: 7 to 15 km ]
    (Manual Command Triage)                  (Volunteer Blood Banks)                 (City Network)
```

| Stage | Radius | Target Audience | Trigger Condition |
|---|---|---|---|
| **Stage 1** | $3\text{ km}$ | Immediate neighborhood donors | Initial hospital verification |
| **Stage 2** | $7\text{ km}$ | Surrounding districts | No responses after $10\text{ minutes}$ |
| **Stage 3** | $15\text{ km}$ | Metropolitan area | No responses after $20\text{ minutes}$ |
| **Stage 4** | $25\text{ km}$ | Regional volunteers & institutional blood banks | No responses after $30\text{ minutes}$ |
| **Stage 5** | $50\text{ km}$ | Platform Admin Command Center | Critical urgency incident escalation ($45\text{ min}$) |

---

## 3. Rate-Limiting & Spam Prevention
- Donors who declined the request in an earlier stage are NOT re-notified during expansion.
- Donors who have accepted another emergency within 24 hours are excluded.
- Every expansion event is logged in the `EscalationEvent` database entity with timestamps, donor counts, and radius measurements.
