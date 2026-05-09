# API Contract: Authentication & RBAC

## Endpoints

### POST /api/auth/register
- **Description**: Create a new account.
- **Payload**: `{ email, password, role, companyId }`
- **Response**: `201 Created`

### POST /api/auth/login
- **Description**: Secure login.
- **Payload**: `{ email, password }`
- **Response**: `{ accessToken, refreshToken, user: { id, role, companyId } }`

### GET /api/users/me
- **Description**: Get current user profile.
- **Header**: `Authorization: Bearer <JWT>`
- **Response**: User object with tenant isolation enforced.

## Security Controls
- **JWT**: Expiry set to 15m.
- **Refresh Token**: Stored in HTTP-only cookie.
- **Roles**: Enforced via `@Roles` decorator in NestJS.
