# Plugin Web

Plugin Web is a Next.js application for event discovery and related product workflows. This repository also includes a Spec Kit driven planning workflow backed by an enforceable engineering constitution, quality gates, and reviewer commands.

## Getting Started

Run the development server:

```bash
yarn dev
```

Open `http://localhost:3000` in your browser.

## Environment Template

Copy `.env.example` to `.env.local` and set local secrets:

```bash
cp .env.example .env.local
```

Key runtime values include:

1. `DATABASE_URL` for PostgreSQL
2. `AUTH_SECRET`/`NEXTAUTH_SECRET` for auth/session signing
3. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth
4. `RESEND_API_KEY` and sender email for magic-link delivery
5. `ADMIN_ALLOWLIST` for admin role resolution

## Local PostgreSQL and Container Runtime

Start only PostgreSQL for local development:

```bash
docker compose up -d postgres
```

Start the full containerized stack:

```bash
docker compose up --build
```

## Prisma and Contracts Tooling

Generate Prisma client and run migrations:

```bash
yarn prisma:generate
yarn prisma:migrate
```

Sync and lint repository OpenAPI contract:

```bash
yarn contracts:sync
yarn contracts:lint
```

Seed development data (including designated admin test user):

```bash
yarn prisma:seed
```

## Test Admin Credentials

For local testing, the Prisma seed creates a designated admin user:

1. Email: `admin@pluginbim.com`
2. Role: `admin`
3. Display Name: `Designated Admin User (Test)`

Authentication notes:

1. This app uses OAuth and email magic-link auth (no local password credential).
2. Use Google or magic-link sign-in with the seeded email to obtain admin role behavior.
3. Ensure `ADMIN_ALLOWLIST` includes `admin@pluginbim.com` (default config already includes it).

## Browser and UX Validation

Install Playwright browsers once:

```bash
yarn playwright install
```

Run end-to-end and Lighthouse checks:

```bash
yarn test:e2e
yarn lighthouse:ci
```

## Quality Gates

Install local hooks once per clone:

```bash
yarn hooks:install
```

Additional gate activation details live in `QUALITY_GATES.md`.

## Spec Kit Workflow

The repository uses Spec Kit commands for specification, clarification, planning, and task generation.

Core authoring flow:

1. `/speckit.specify` to create or update the feature specification
2. `/speckit.clarify` to resolve high-impact ambiguities in the active spec
3. `/speckit.plan` to build the implementation plan
4. `/speckit.tasks` to generate dependency-ordered implementation tasks

## Reviewer Commands

Before planning, reviewers can use the following commands:

1. `/speckit.spec-readiness`
   Returns a read-only `READY` or `BLOCKED` verdict for the active spec against the constitution, specification gates, and required validation evidence.
2. `/speckit.spec-readiness-checklist`
   Creates or updates `checklists/spec-readiness.md` for reviewer use before `/speckit.plan`.

## Automatic Readiness Hooks

Spec readiness checks are also injected automatically through `.specify/extensions.yml`:

1. Before `/speckit.plan`
2. Before `/speckit.tasks`

Those hooks invoke `/speckit.spec-readiness` as a mandatory pre-check so planning and task generation do not proceed on an incomplete spec.

## Governance Files

The spec workflow is governed by:

1. `.specify/memory/constitution.md`
2. `.specify/memory/gate-checklist-matrix.md`
3. `.specify/memory/automation-policy.md`

## Stack

1. Next.js
2. React
3. TypeScript
4. Jest
5. ESLint
6. Biome
