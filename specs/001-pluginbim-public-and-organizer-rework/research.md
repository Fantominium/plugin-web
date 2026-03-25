# Phase 0 Research

## Decision: Use Auth.js v5 for authentication and session management

**Rationale**: Auth.js v5 fits Next.js App Router, supports Google OAuth and email magic-link flows in one server-side abstraction, and allows JWT/session callbacks to enforce the admin allowlist and role-aware redirects without moving auth logic into the client.

**Alternatives considered**:
- Auth0: strong managed platform but adds higher external dependency and vendor coupling for MVP.
- Custom auth implementation: too much security risk and implementation overhead for the feature scope.
- Clerk: polished but introduces more product-level dependency and pricing coupling than needed for this MVP.

## Decision: Use Resend as the MVP notification provider behind a server-side abstraction

**Rationale**: Resend is reputable, secure, has a free-tier entry point, works well with transactional email and magic-link delivery, and keeps provider-specific concerns isolated behind a notification service that can be swapped later.

**Alternatives considered**:
- SendGrid: mature but heavier setup and less ergonomic for an MVP.
- Self-hosted SMTP: removes vendor dependency but creates deliverability and operational burden.
- Postmark: strong transactional delivery but not as favorable for a free-entry MVP.

## Decision: Use Prisma ORM with Prisma Migrate for PostgreSQL access and migrations

**Rationale**: Prisma provides a mature TypeScript developer experience, strong PostgreSQL support, stable migration tooling, and a well-understood workflow for teams building Next.js applications with protected route handlers and relational workflows. It reduces planning risk because the auth, admin, and organizer flows can all share one clearly modeled schema and generated client.

**Alternatives considered**:
- Drizzle ORM: lighter-weight and strongly typed, but Prisma is the preferred choice for this feature and team direction.
- Raw SQL only: too error-prone for the amount of auth, ownership, moderation, and contract-backed data modeling in scope.
- TypeORM/Sequelize: heavier abstractions with less desirable TypeScript ergonomics for this codebase.

## Decision: Use Dockerfile plus Docker Compose for app and PostgreSQL container orchestration

**Rationale**: Docker Compose is the fastest path to deterministic local and CI runtime parity for the Next.js app plus PostgreSQL, satisfies the new containerization slice, and keeps migration validation and health-checked startup reproducible.

**Alternatives considered**:
- Kubernetes manifests: over-scoped for MVP and would slow down delivery.
- Podman-only setup: workable, but Docker Compose is the more common baseline for contributors and CI examples.
- Non-container local database setup: conflicts with the clarified requirement for containerized PostgreSQL runtime parity.

## Decision: Store poster assets in a volume-backed local filesystem behind a `PosterStorage` abstraction for MVP

**Rationale**: A mounted local storage path avoids adding a second external storage dependency while still allowing safe validation, cleanup, and future replacement with S3-compatible object storage. The abstraction keeps public and organizer flows insulated from the storage backend choice.

**Alternatives considered**:
- S3-compatible object storage immediately: better long-term scalability, but adds another service dependency before core workflows are stable.
- PostgreSQL `bytea` storage: removes an external store but is not a good default for image asset lifecycle or delivery performance.
- Public folder writes without abstraction: simpler initially, but creates an upgrade trap and mixes runtime data with build artifacts.

## Decision: Version API contracts with explicit major versions in the URL path and OpenAPI 3.1 artifacts

**Rationale**: `/api/v1/...` path versioning makes breaking-change boundaries explicit, keeps test routing clear, and aligns with the clarified contract-versioning requirement. OpenAPI 3.1 plus Redocly lint and generated TypeScript types provide a stable artifact and validation workflow.

**Alternatives considered**:
- Header-only version negotiation: more flexible but less explicit for reviewers and tests.
- Unversioned contracts with additive-only policy: too brittle given the new protected workflows and moderation APIs.
- GraphQL: not justified by the existing repo shape or feature scope.

## Decision: Use Playwright plus axe-core for UX validation and Lighthouse CI plus Playwright timing capture for performance evidence

**Rationale**: Playwright can exercise the required public, organizer, and admin journeys while also supporting accessibility assertions. Lighthouse CI is a strong fit for public-route performance budgets, and Playwright timing capture can measure authenticated dashboard and submission flows that Lighthouse does not cover well.

**Alternatives considered**:
- Cypress: viable, but Playwright is stronger for modern cross-browser CI and authenticated flow scripting.
- Manual Lighthouse runs only: insufficient for consistent CI evidence.
- Browser DevTools traces only: useful locally, but not a durable automation strategy for quality gates.