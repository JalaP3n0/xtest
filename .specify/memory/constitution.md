<!--
Version change: none → 1.0.0
List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Security-First (OWASP Compliance)
  - [PRINCIPLE_2_NAME] → II. Spec-Driven Development (SDD)
  - [PRINCIPLE_3_NAME] → III. Mobile-Ready API-First
  - [PRINCIPLE_4_NAME] → IV. Test-Driven Integrity
  - [PRINCIPLE_5_NAME] → V. AI Transparency & Orchestration
Added sections:
  - Technical Standards
  - Governance & Compliance
Removed sections:
  - none
Templates requiring updates:
  - .specify/templates/plan-template.md (✅ aligned)
  - .specify/templates/spec-template.md (✅ aligned)
  - .specify/templates/tasks-template.md (✅ aligned)
Follow-up TODOs:
  - none
-->

# EventOps AI Platform Constitution

## Core Principles

### I. Security-First (OWASP Compliance)
The platform must adhere to OWASP Top Ten security standards for both Web and Mobile applications. Security is 
a non-negotiable requirement integrated into every phase of the lifecycle. This includes:
- Mandatory encryption of sensitive data at rest and in transit.
- Rigorous input validation and output encoding to prevent injection and XSS.
- Secure authentication using JWT and strict Role-Based Access Control (RBAC).

### II. Spec-Driven Development (SDD)
No implementation code should be written without a corresponding, approved specification and plan. All 
development must follow the Spec Kit workflow (Specify -> Plan -> Tasks -> Implement). This ensures 
architectural alignment and reduces implementation ambiguity.

### III. Mobile-Ready API-First
The backend architecture must prioritize a robust, documented API that serves both the Web frontend and 
upcoming Mobile applications. Use NestJS for structured backend services and Socket.IO for real-time 
coordination between ushers, supervisors, and clients.

### IV. Test-Driven Integrity
Automated testing is mandatory. Every new feature must include unit and integration tests. Critical paths, 
especially security-sensitive workflows like authentication and authorization, must have high test coverage 
to prevent regressions.

### V. AI Transparency & Orchestration
AI-powered recommendations for usher allocation and supervisor assignment must be explainable and 
transparent. Monitoring bots must operate within strict boundaries to ensure operational accountability 
without compromising user privacy.

## Technical Standards

The project leverages a modern, type-safe stack:
- **Web Frontend**: Next.js, TypeScript, TailwindCSS, and shadcn/ui.
- **Backend**: NestJS with PostgreSQL and Prisma ORM.
- **Real-time**: Socket.IO for live event monitoring and chat.
- **AI**: OpenAI API and LangChain for orchestration and smart recommendations.
- **Infrastructure**: Monorepo architecture for shared types and logic.

## Governance & Compliance

- **Authentication**: All endpoints must be secured by default; exceptions must be explicitly justified.
- **Audit Logging**: All administrative and supervisor actions must be logged for auditability.
- **Review Process**: All architectural changes require an update to this constitution and a version bump.

## Governance
This constitution is the foundational document for the EventOps AI Platform. It supersedes all other 
engineering practices. Amendments require a formal update, documentation of rationale, and a semantic 
version bump. All developers are expected to review and comply with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-10
