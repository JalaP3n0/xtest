# Research: Core Platform Development

This document details the architectural decisions and best practices for implementing the EventOps AI Platform core features (Phases 1-13).

## Multi-Tenancy Strategy

**Decision**: Implement "Discriminator Column" multi-tenancy using `company_id`.
- **Rationale**: Given the MVP focus and the use of Prisma, a discriminator column provides a balanced approach between isolation and development speed.
- **Implementation**: All core tables (Users, Events, Staffing) will include a mandatory `companyId` field. Middleware in NestJS will enforce tenant isolation by injecting the `companyId` from the JWT into every query.

## Real-time Architecture (Socket.IO)

**Decision**: Use Redis Adapter for Socket.IO horizontal scaling.
- **Rationale**: To support multiple backend instances in AWS ECS, a Redis Pub/Sub backplane is required for message synchronization across nodes.
- **Best Practices**:
  - Namespace communication by `eventId`.
  - Implement heartbeat/reconnection logic in the Next.js frontend.

## AI Recommendation Engine

**Decision**: Hybrid Ranking Model (Vector Search + Rule-based Filtering).
- **Rationale**: pgvector will be used to store usher profiles and event requirements for similarity matching, while business rules (availability, proximity) act as hard filters.
- **Explainability**: Each recommendation will include a "Score Breakdown" object documenting the weights for each criterion.

## Notification & Media Pipeline

**Decision**: 
- **Notifications**: Use Firebase Cloud Messaging (FCM) for Push and Twilio for WhatsApp.
- **Media Storage**: AWS S3 with Lifecycle Policies.
  - **Rationale**: Automates the 90-day deletion requirement without application-level cron jobs.

## Authentication & Security (OWASP)

**Decision**: JWT with Refresh Tokens and strict RBAC decorators.
- **OWASP Alignment**:
  - A01:2021-Broken Access Control: Enforced via NestJS Guards and Prisma Middleware.
  - A07:2021-Identification and Authentication Failures: Account lockout and secure password hashing (bcrypt).
