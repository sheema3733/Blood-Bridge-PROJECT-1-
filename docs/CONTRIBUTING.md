# BloodBridge — Engineering Contribution & Git Workflow Guidelines

## 1. Branching Model

All development adheres to strict GitFlow standards:
- `main`: Production releases only.
- `develop`: Integration branch for tested feature work.
- `feature/<name>`: Isolated feature branches merged via `--no-ff` pull requests.
- `fix/<name>`: Bug fix branches.

---

## 2. Commit Message Standards
All commits must follow the Conventional Commits specification:
```
<type>(<scope>): <short actionable description>
```
Types:
- `feat`: New feature or capability
- `fix`: Bug fix
- `test`: Adding or updating automated tests
- `docs`: Documentation updates
- `refactor`: Code reorganization without functional changes
- `chore`: Tooling, lockfiles, or configuration

---

## 3. Pull Request Quality Gate
Before any feature branch is merged into `develop`:
1. Automated tests must pass: `npm test`
2. TypeScript compilation must succeed: `npm run build`
3. No `.env` or credential files staged.
4. Descriptive PR body detailing changes, why they were made, and test evidence.
