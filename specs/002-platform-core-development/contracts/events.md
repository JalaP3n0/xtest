# API Contract: Event & Staffing

## Endpoints

### POST /api/events
- **Role**: Client
- **Description**: Create a new event.
- **Payload**: `{ title, location, requirements, staffingCount }`

### GET /api/events/:id/recommendations
- **Role**: Admin
- **Description**: Trigger AI engine for staffing recommendations.
- **Response**: `[{ usherId, score, breakdown: { distance, rating } }]`

### PATCH /api/staffing/:id/check-in
- **Role**: Supervisor
- **Description**: Dual verification (QR + Photo).
- **Payload**: `FormData { qrCode, photoBlob }`
