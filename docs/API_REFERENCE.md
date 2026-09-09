# BloodBridge — REST API Reference Manual

Base URL: `http://localhost:5000/api`

All authenticated endpoints require an `Authorization` HTTP header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication Domain (`/api/auth`)

### `POST /api/auth/register`
Creates a new platform account with role-specific profile (`DONOR`, `REQUESTER`, `HOSPITAL`, `ADMIN`).
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "fullName": "Jane Doe",
    "role": "DONOR",
    "phone": "+1-555-0199",
    "bloodGroup": "O-",
    "addressCity": "Downtown Metro"
  }
  ```
- **Response `201 Created`**: Returns `{ success: true, token, user }`.

### `POST /api/auth/login`
Authenticates credentials and issues a 7-day signed JWT bearer token.
- **Body**: `{ "email": "user@example.com", "password": "Password123!" }`
- **Response `200 OK`**: Returns `{ success: true, token, user }`.

### `GET /api/auth/me`
Retrieves authenticated user profile and active donor/hospital metadata.
- **Auth**: Required.

### `POST /api/auth/demo-login`
Instant fast-login switcher for evaluation.
- **Body**: `{ "role": "DONOR" | "REQUESTER" | "HOSPITAL" | "ADMIN" }`
- **Response `200 OK`**: Authenticates pre-seeded synthetic account.

---

## 2. Emergency Blood Requests (`/api/requests`)

### `POST /api/requests`
Initiates a new emergency blood request with duplicate detection checks.
- **Auth**: Required (`REQUESTER`, `ADMIN`).
- **Body**:
  ```json
  {
    "hospitalId": "UUID",
    "patientInitials": "M.K.",
    "bloodGroup": "A+",
    "unitsRequired": 2,
    "urgency": "CRITICAL",
    "requiredBy": "2026-09-09T18:00:00.000Z",
    "notes": "Emergency thoracic surgery in ICU."
  }
  ```
- **Response `201 Created`**: Returns `{ success: true, request, duplicateWarning }`.

### `GET /api/requests`
Lists emergency blood requests with multi-parameter filtering.
- **Query Params**: `status`, `bloodGroup`, `urgency`, `hospitalId`, `isDuplicateFlagged`, `page`, `limit`.

### `GET /api/requests/:id`
Fetches full request details, including hospital metadata, 8-step status history, matched donors, and escalation events.

### `POST /api/requests/:id/complete`
Marks blood units safely received at the hospital and completes the coordination lifecycle.
- **Auth**: Required (`REQUESTER`, `HOSPITAL`, `ADMIN`).

### `POST /api/requests/:id/escalate`
Triggers immediate smart escalation to the next radius stage.

---

## 3. Donors Domain (`/api/donors`)

### `GET /api/donors/dashboard`
Returns donor profile, incoming live emergency calls (`NOTIFIED`), active commitments (`ACCEPTED`), and completed donation history.
- **Auth**: Required (`DONOR`, `ADMIN`).

### `PUT /api/donors/availability`
Updates donor real-time availability status (`AVAILABLE`, `AVAILABLE_LATER`, `NOT_AVAILABLE`).
- **Auth**: Required (`DONOR`, `ADMIN`).

### `POST /api/donors/matches/:matchId/respond`
Donor accepts or declines an emergency donation dispatch.
- **Auth**: Required (`DONOR`, `ADMIN`).
- **Body**: `{ "action": "ACCEPT" | "DECLINE", "declineReason": "Optional string" }`

---

## 4. Hospitals Domain (`/api/hospitals`)

### `GET /api/hospitals`
Returns list of verified hospitals for dropdown selectors.

### `GET /api/hospitals/dashboard`
Returns pending verification queue, active admitted emergency coordination, and completed logs.
- **Auth**: Required (`HOSPITAL`, `ADMIN`).

### `POST /api/hospitals/requests/:requestId/verify`
Hospital clinical verification decision.
- **Auth**: Required (`HOSPITAL`, `ADMIN`).
- **Body**: `{ "status": "VERIFIED" | "REJECTED" | "INFO_REQUESTED", "reviewNotes": "String" }`

---

## 5. Administrative Domain (`/api/admin`)

### `GET /api/admin/overview`
Computes live platform metrics, blood group demand distribution, and emergency counts.
- **Auth**: Required (`ADMIN`).

### `GET /api/admin/duplicates`
Lists requests flagged by duplicate detection algorithm for triage.
- **Auth**: Required (`ADMIN`).

### `GET /api/admin/users`
User governance list with role and status filtering.
- **Auth**: Required (`ADMIN`).

### `PATCH /api/admin/users/:userId/status`
Toggles account activation (`ACTIVE` / `SUSPENDED`).
- **Auth**: Required (`ADMIN`).

### `GET /api/admin/audit-logs`
Returns chronological security and operational audit trails.
- **Auth**: Required (`ADMIN`).
