# Quickstart: Core Platform Setup

## Local Development

### 1. Prerequisites
- Node.js v20+
- Docker & Docker Compose
- PostgreSQL instance

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/eventops"
JWT_SECRET="super-secret"
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="sk-..."
```

### 3. Backend (NestJS)
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

### 4. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## Infrastructure
- **CI/CD**: GitHub Actions building Docker images.
- **Deployment**: `aws ecs update-service --cluster eventops --service platform`
