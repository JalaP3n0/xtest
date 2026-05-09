# Research: Constitution Phase

This research document consolidates technical decisions and best practices for the EventOps AI Platform Phase 0 Constitution.

## RBAC Roles & Permissions

**Decision**: Define 5 core roles with the following baseline permissions:
- **Super Admin**: Full platform access, including system configuration and administrative audit logs.
- **Admin**: Event approval, client management, and operational monitoring.
- **Client**: Event creation, marketing campaign management, and reporting access.
- **Supervisor**: Real-time usher management, attendance tracking, and on-ground reporting.
- **Usher**: Event acceptance, check-in/out, and task execution.

**Rationale**: Aligns with the platform roles defined in `Plan.md` and provides a clear hierarchy for JWT-based authorization.

## Audit Logging Standards

**Decision**: Implement a structured logging policy with 3 levels:
- **SECURITY**: Auth failures, permission violations, encryption errors.
- **ADMIN**: Configuration changes, event approvals, role modifications.
- **OPERATIONAL**: User logins, event status transitions, supervisor assignments.

**Rationale**: Ensures compliance with the project's security mandate and provides auditability for administrative actions.

## Deployment & Infrastructure

**Decision**: Mandate **AWS (EC2/ECS)** using **Docker** containers. 
- Use Docker Compose for local development and containerized builds for CI/CD.
- Leverage AWS Secrets Manager for credential protection.

**Rationale**: Simplifies the operational footprint for the MVP while ensuring scalability and alignment with industry standards for security.

## AI Governance & Ethics

**Decision**: Prioritize bias prevention and explainability in the recommendation engine.
- Document criteria used for usher ranking (distance, rating, etc.).
- Ensure no protected characteristics are used in the scoring algorithm.

**Rationale**: Reduces legal and ethical risk associated with automated staffing decisions.

## Test Coverage & Coding Style

**Decision**: 
- Enforce a strict **80% line coverage** minimum using Jest/Vitest.
- Enforce the **Airbnb JavaScript/TypeScript Style Guide** via ESLint and Prettier.

**Rationale**: Ensures long-term maintainability and reduces technical debt in the monorepo.
