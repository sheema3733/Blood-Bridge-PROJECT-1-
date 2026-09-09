# BloodBridge — Security, Governance & Privacy Manifesto

## 1. Zero-PII Policy & Synthetic Demonstration Standard
- No real personally identifiable information (PII) is committed to version control or seed scripts.
- Demo accounts use `@demo.bloodbridge.org` synthetic emails and fictional 555-series phone numbers.
- Patient initials only (e.g. `M.K.`, `R.S.`) are displayed on public and donor-facing screens. Full patient records remain strictly within the hospital EHR boundary.

---

## 2. Authentication & Session Security
- **Passwords**: Salted and hashed using `bcryptjs` with a work factor of 10 rounds.
- **Tokens**: Signed JSON Web Tokens (JWT) using HMAC-SHA256 with 7-day expiration.
- **Authorization**: Role-based access control (RBAC) enforced on the server for all routes. Frontend role badges are for visual convenience only; backend verifies token payload and database status on every request.

---

## 3. Network & Infrastructure Defenses
- **Security Headers**: Powered by `helmet` to mitigate clickjacking, MIME-type sniffing, and cross-site scripting (XSS).
- **Rate Limiting**: Built-in DDoS protection via `express-rate-limit` capped at 1,000 requests per 15 minutes per IP.
- **Tamper-Evident Audit Logging**: All sensitive mutations (verifications, cancellations, receipts, account suspensions) are immutably logged with actor IDs, entity IDs, details, and timestamps.
