# Data Model: Core Platform

This document defines the Prisma schema and entity relationships for the EventOps AI Platform.

## Core Entities

### Company (Tenant)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| name | String | Organization Name |
| createdAt | DateTime | Timestamp |

### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| email | String | Unique Identifier |
| password | String | Hashed Credential |
| role | Enum | SuperAdmin, Admin, Client, Supervisor, Usher |
| companyId | UUID | Foreign Key (Company) |
| rating | Float | Average Performance Score |

### Event
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| title | String | Event Name |
| status | Enum | PENDING, APPROVED, LIVE, COMPLETED, CANCELLED |
| companyId | UUID | Foreign Key (Company) |
| location | Json | Latitude, Longitude, Address |
| startTime | DateTime | Schedule Start |

### StaffingAssignment
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| eventId | UUID | Foreign Key (Event) |
| usherId | UUID | Foreign Key (User) |
| status | Enum | RECOMMENDED, ACCEPTED, CHECKED_IN, NO_SHOW |
| checkInTime | DateTime?| Dual verification timestamp |
| checkInPhoto | String? | URL to S3 storage |

## Real-time & Bot Entities

### ChatMessage
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| eventId | UUID | Foreign Key (Event) |
| senderId | UUID | Foreign Key (User) |
| content | Text | Message body |
| mediaUrl | String? | S3 Attachment URL |

## Relationships
- **Company** has many **Users** and **Events**.
- **Event** has many **StaffingAssignments** and **ChatMessages**.
- **User** has many **StaffingAssignments**.
