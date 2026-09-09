# BloodBridge — End-to-End Coordination Workflows & State Machine

## 1. Complete Emergency Coordination Sequence Diagram

```
Requester              Hospital Staff             Matching Engine            Eligible Donors
    │                         │                          │                          │
    │── 1. Create Request ───>│                          │                          │
    │   (Status: PENDING_VER) │                          │                          │
    │                         │── 2. Review Emergency ──>│                          │
    │                         │   (Check Ward & Necessity│                          │
    │                         │── 3. Click "VERIFY" ────>│                          │
    │                         │   (Status: HOSP_VERIFIED)│                          │
    │                         │                          │── 4. Calculate Distance ─│
    │                         │                          │   & Compatibility Score  │
    │                         │                          │── 5. Push Notification ─>│
    │                         │                          │   (Status: DONORS_NOTIF) │
    │                         │                          │                          │
    │                         │                          │<── 6. Click "ACCEPT" ────│
    │                         │                          │   (Status: DONOR_CONF)   │
    │<── 7. Realtime Alert ───│<── Realtime Alert ───────│                          │
    │   "Donor En Route"      │   "Donor En Route"       │                          │
    │                         │                          │                          │
    │── 8. Donor Arrives at Hospital Blood Bank ─────────┼─────────────────────────>│
    │                         │                          │                          │
    │                         │── 9. Blood Infused & ────│                          │
    │                         │   Confirmed Received     │                          │
    │<── 10. Status Closed ───│   (Status: COMPLETED)    │── 10. Cooldown Updated ─>│
```

---

## 2. Request Status Lifecycle State Machine

| Status | Trigger Event | Authorized Roles | Next Valid States |
|---|---|---|---|
| `PENDING_VERIFICATION` | Requester submits request | Requester, Admin | `HOSPITAL_VERIFIED`, `REJECTED` |
| `HOSPITAL_VERIFIED` | Hospital clicks Verify | Hospital, Admin | `MATCHING_IN_PROGRESS` |
| `MATCHING_IN_PROGRESS` | Matching algorithm executes | System | `DONORS_NOTIFIED` |
| `DONORS_NOTIFIED` | Compatible donors dispatched | System | `DONOR_CONFIRMED`, `ESCALATED` |
| `DONOR_CONFIRMED` | A matched donor clicks Accept | Donor | `BLOOD_RECEIVED`, `COMPLETED` |
| `BLOOD_RECEIVED` | Units verified at blood bank | Hospital, Requester | `COMPLETED` |
| `COMPLETED` | Coordination finalized | Hospital, Requester, Admin | (Terminal State) |
| `REJECTED` | Hospital rejects request | Hospital, Admin | (Terminal State) |
| `EXPIRED` | Time deadline passed | System | (Terminal State) |

---

## 3. Real-Time Failure & Edge-Case Handling
1. **Donor Declines**: If a donor declines, their decline reason is logged. If zero active notified donors remain, the escalation engine immediately triggers the next radius stage.
2. **Hospital Rejection**: If clinical records do not corroborate the emergency, hospital staff rejects the request with a detailed reason, notifying the requester immediately.
3. **Network Disconnection**: If a client temporarily loses internet connection, the Socket.IO client automatically triggers reconnection with exponential backoff and room resubscription upon reconnect.
