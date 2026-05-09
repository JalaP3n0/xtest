---
description: "Task list for EventOps AI Platform Core Development"
---

# Tasks: EventOps AI Platform Core Development

**Input**: Design documents from `specs/002-platform-core-development/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/app/`
- **Prisma**: `backend/prisma/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize multi-tenant project structure and base configuration

- [ ] T001 Initialize Prisma schema with multi-tenant `Company` entity in `backend/prisma/schema.prisma`
- [ ] T002 [P] Configure Redis client for Socket.IO scaling in `backend/src/config/redis.config.ts`
- [ ] T003 [P] Setup FCM and Twilio API clients in `backend/src/lib/notifications.ts`
- [ ] T004 Initialize shared TypeScript types for monorepo in `packages/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core multi-tenant and authentication framework

- [ ] T005 [P] Implement `Company` management API (Create/List) in `backend/src/company/`
- [ ] T006 Implement JWT strategy with tenant-id extraction in `backend/src/auth/jwt.strategy.ts`
- [ ] T007 Implement RBAC Guards and `@Roles` decorator in `backend/src/auth/guards/roles.guard.ts`
- [ ] T008 [P] Implement multi-tenant Prisma middleware to enforce `companyId` filters in `backend/src/lib/prisma.middleware.ts`

**Checkpoint**: Foundation ready - tenant-isolated authentication is functional.

---

## Phase 3: User Story 1 - Secure Access & Onboarding (Priority: P1) 🎯 MVP

**Goal**: Implement secure registration and login with tenant isolation.

**Independent Test**: Register a user for a specific company and verify JWT contains correct `companyId` and `role`.

- [ ] T009 [P] [US1] Create `User` model with `companyId` and `role` enum in `backend/prisma/schema.prisma`
- [ ] T010 [US1] Implement Registration logic (Password hashing) in `backend/src/auth/auth.service.ts`
- [ ] T011 [US1] Implement Login endpoint with Refresh Tokens in `backend/src/auth/auth.controller.ts`
- [ ] T012 [P] [US1] Build Registration and Login UI in `frontend/app/(auth)/`
- [ ] T013 [US1] Integrate Auth context and API services in `frontend/services/auth.service.ts`

**Checkpoint**: User Story 1 complete. Users can onboard and authenticate.

---

## Phase 4: User Story 2 - Event Creation & Approval (Priority: P1)

**Goal**: Implement event lifecycle from creation to admin approval.

**Independent Test**: Create event as Client; approve as Admin; verify status transitions.

- [ ] T014 [P] [US2] Create `Event` model in `backend/prisma/schema.prisma`
- [ ] T015 [US2] Implement Event Creation API with validation in `backend/src/events/events.service.ts`
- [ ] T016 [US2] Implement Admin Approval endpoint in `backend/src/events/admin.controller.ts`
- [ ] T017 [P] [US2] Build Client Event Creation form in `frontend/app/client/events/new/`
- [ ] T018 [P] [US2] Build Admin Approval dashboard in `frontend/app/admin/approvals/`

**Checkpoint**: User Story 2 complete. Core event workflow is functional.

---

## Phase 5: User Story 3 - AI-Powered Staffing (Priority: P1)

**Goal**: AI-driven usher recommendation engine with pgvector similarity search.

**Independent Test**: Trigger recommendation for an event and verify ranked list of ushers with explainability scores.

- [ ] T019 [P] [US3] Create `StaffingAssignment` model in `backend/prisma/schema.prisma`
- [ ] T020 [US3] Implement pgvector similarity search for usher profiles in `backend/src/staffing/recommendation.engine.ts`
- [ ] T021 [US3] Integrate OpenAI for explainable ranking breakdown in `backend/src/staffing/ai.service.ts`
- [ ] T022 [US3] Implement Staffing Recommendation API in `backend/src/events/events.controller.ts`
- [ ] T023 [P] [US3] Build Staffing Recommendation UI in `frontend/app/admin/events/[id]/staffing/`

**Checkpoint**: User Story 3 complete. AI staffing is operational.

---

## Phase 6: User Story 4 - Real-time Communication & Monitoring (Priority: P2)

**Goal**: Socket.IO chat and bot-driven dual-verification check-ins.

**Independent Test**: Send real-time message; perform dual-verification (QR+Photo); verify photo stored in S3.

- [ ] T024 [P] [US4] Implement Socket.IO Gateway with Redis adapter in `backend/src/chat/chat.gateway.ts`
- [ ] T025 [US4] Implement Dual-Verification API (QR + S3 Photo Upload) in `backend/src/staffing/verification.service.ts`
- [ ] T026 [US4] Implement Monitoring Bot triggers (random photo requests) in `backend/src/bot/monitoring.service.ts`
- [ ] T027 [P] [US4] Build Real-time Chat UI in `frontend/app/events/[id]/chat/`
- [ ] T028 [P] [US4] Implement QR Scanner and Camera UI for verification in `frontend/app/supervisor/verify/`

**Checkpoint**: User Story 4 complete. Live event operations are supported.

---

## Phase 7: User Story 5 - Marketing Integration & Analytics (Priority: P3)

**Goal**: QR tracking and performance dashboards.

**Independent Test**: Generate QR for campaign; track scan; view analytics report.

- [ ] T029 [P] [US5] Create `MarketingCampaign` model in `backend/prisma/schema.prisma`
- [ ] T030 [US5] Implement QR Scan tracking and lead collection in `backend/src/marketing/tracking.service.ts`
- [ ] T031 [US5] Implement Analytics aggregation service in `backend/src/analytics/reports.service.ts`
- [ ] T032 [P] [US5] Build Analytics Dashboards in `frontend/app/client/analytics/`

**Checkpoint**: All user stories complete. Platform is feature-complete for MVP.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Security hardening, testing, and deployment.

- [ ] T033 [P] Configure S3 Lifecycle Policy for 90-day media deletion in `infrastructure/s3.tf`
- [ ] T034 [P] Implement 3-level structured Audit Logging in `backend/src/lib/audit.logger.ts`
- [ ] T035 Achieve 80% test coverage for core logic in `backend/tests/` and `frontend/tests/`
- [ ] T036 Final security review (OWASP A01-A10) and performance tuning.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1.
- **Phase 3 (Auth)**: Depends on Phase 2.
- **Phase 4 (Events)**: Depends on Phase 2.
- **Phase 5 (AI Staffing)**: Depends on Phase 4 and Phase 3 (Usher accounts).
- **Phase 6 (Real-time)**: Depends on Phase 5.
- **Phase 7 (Analytics)**: Depends on Phase 6.

### Parallel Opportunities
- T002, T003, T004 (Setup tasks).
- US1 (Auth) and US2 (Events) can be developed in parallel after Phase 2.
- Frontend and Backend tasks within each story phase are [P].

---

## Implementation Strategy

### MVP First (Phases 1-4)
1. Complete Infrastructure and Multi-tenant Auth.
2. Complete Event creation and approval.
3. **STOP and VALIDATE**: Verify that a Client can create an event and an Admin can approve it securely.

### Incremental Delivery
1. Add AI Staffing (Phase 5).
2. Add Real-time/Bot Monitoring (Phase 6).
3. Add Marketing/Analytics (Phase 7).
4. Harden and Deploy (Phase 8).
