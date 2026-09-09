# BloodBridge — Duplicate Request Detection Specification

## 1. Motivation
During acute crises, well-meaning family members often create separate accounts or post identical requests simultaneously for the same patient admitted to the same ward. This causes:
- Split donor responses
- False perception of multiple emergencies
- Confusion at hospital reception

---

## 2. Multi-Factor Scoring Matrix

When a new request is submitted, BloodBridge searches all active requests within the past $24\text{ hours}$ across four weighted dimensions:

| Factor | Condition | Weight |
|---|---|---|
| **Hospital Alignment** | Same destination hospital facility ID | $+40\%$ |
| **Blood Group Alignment** | Identical blood type requested | $+30\%$ |
| **Unit Requirement Alignment** | Exact unit count: $+15\%$<br>Within $\pm 1$ unit: $+10\%$ | Max $+15\%$ |
| **Temporal Proximity** | Required-by window within $6\text{ hours}$: $+15\%$<br>Within $12\text{ hours}$: $+10\%$ | Max $+15\%$ |

$$\text{Similarity Score} = \sum \text{Weights} \in [0, 100\%]$$

---

## 3. Decision Matrix
- **Score $< 70\%$**: Allowed as distinct emergency.
- **Score $\ge 70\%$**: Flagged as `POSSIBLE_DUPLICATE`.
  - The request is NOT discarded or rejected automatically.
  - It is prominently flagged in the **Hospital Verification Queue** and the **Admin Duplicate Review Queue** with comparison indicators.
  - Hospital staff can verify if it is genuine (e.g. genuine second unit requirement) or combine/decline duplicate entries.
