# SumiFitness

A production-ready fitness trainer portfolio built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn-style UI primitives, Framer Motion, React Hook Form, and Zod.

## Run locally

```bash
npm install
cp .env.example .env.local
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

Public registration accepts `TRAINER` and `CLIENT` roles. `ADMIN` is supported by the database and JWT authorization model but is intentionally not assignable through public registration.

Protected CMS endpoints are available under `/api/cms` for trainer profiles, achievements, certifications, programs, gallery images, testimonials, and contact messages. They require a Bearer token for an active `ADMIN` or `TRAINER`. Published website content and contact submission are available under `/api/public` without authentication.

## CMS frontend

Start both the API and web development servers, then open [http://localhost:3000/admin/login](http://localhost:3000/admin/login). Administrator and trainer accounts can sign in and manage profile, achievement, certification, program, gallery, testimonial, and contact-message data through the protected CMS API.

```bash
npm run dev:api
npm run dev:web
```

The web app reads `NEXT_PUBLIC_API_URL` from `.env.local` and defaults to `http://127.0.0.1:4000`. For the MVP, the access token is kept in browser `sessionStorage`, so it is scoped to one tab and cleared on logout or an unauthorized API response.

The public profile, achievements, certifications, programs, gallery, and testimonials are rendered from published CMS API records. The public contact form submits to `POST /api/public/contact`, and new enquiries appear in the protected CMS messages view.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

# eg_sumifit
