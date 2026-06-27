# SumiFitness

A production-ready fitness trainer portfolio built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn-style UI primitives, Framer Motion, React Hook Form, and Zod.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend foundation

The Fastify API lives in `apps/api`, and the shared Prisma/PostgreSQL package lives in `packages/db`. Copy the API environment example before starting the backend:

```bash
cp apps/api/.env.example apps/api/.env
cp packages/db/.env.example packages/db/.env
npm run db:generate
npm run dev:api
```

The API listens on [http://127.0.0.1:4000](http://127.0.0.1:4000). Foundation routes are available at `GET /health` and `GET /api/status`; authentication routes are available at `POST /api/auth/register`, `POST /api/auth/login`, and protected `GET /api/auth/me`.

Public registration accepts `TRAINER` and `CLIENT` roles. `ADMIN` is supported by the database and JWT authorization model but is intentionally not assignable through public registration. CMS content endpoints are not implemented yet.

## CMS frontend demo

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to preview the Phase 2 content workspace. The admin routes use mock data and local component state only—there is no authentication, API, database, or persistence layer.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

The contact form is intentionally frontend-only. Connect it to a form delivery service before deploying if submissions should be delivered.

# eg_sumifit
