# Implementation Plan: PluginBIM-Inspired Public Experience and Role-Based Event Management Rework

**Branch**: `001-pluginbim-public-and-organizer-rework` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pluginbim-public-and-organizer-rework/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Rework the existing Next.js web application into a PluginBIM-inspired public event platform with protected organizer and admin workflows, backed by PostgreSQL and a containerized runtime. The implementation will use Auth.js v5 for Google and email magic-link authentication, Prisma ORM for typed PostgreSQL access and migrations, volume-backed poster storage behind a replaceable server-side abstraction, OpenAPI 3.1 contracts under `/api/v1`, and enforceable quality-gate tooling for E2E, accessibility, contracts, migrations, performance, and container security.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS, React 19.2.3, Next.js 16.1.4  
**Primary Dependencies**: Next.js App Router, Tailwind CSS 4, Auth.js v5, Prisma ORM, `@prisma/client`, Resend, Zod, Playwright, `@axe-core/playwright`, Lighthouse CI, `@redocly/cli`, `openapi-typescript`  
**Storage**: PostgreSQL 17 in a container for relational data; volume-backed local poster storage for MVP behind a `PosterStorage` abstraction  
**Testing**: Jest + React Testing Library, Playwright E2E, axe-core accessibility checks, Lighthouse CI, Redocly OpenAPI lint, PostgreSQL migration validation scripts  
**Target Platform**: Containerized Linux-hosted Next.js web app with PostgreSQL-backed API and App Router UI
**Project Type**: Single Next.js web application with route handlers, server components, client components, and quality-gate automation  
**Performance Goals**: Main page under 2.5s initial render on representative mid-tier mobile; dashboard/admin readiness under 2s; create/update acknowledgement under 1.5s excluding image upload; poster validation feedback under 500ms; filtered search under 300ms  
**Constraints**: WCAG 2.2 AA; server-side default-deny authorization; 15-minute single-use magic links; admin allowlist; non-blocking notification failure handling; explicit same-origin-or-stricter CORS posture for introduced endpoints; CSRF/session-integrity protection for authenticated mutations; defined timeout and fail-safe behavior for auth, uploads, notifications, and event mutations; PostgreSQL migration validation in disposable containers; container runtime must satisfy `P11 Container Security`  
**Scale/Scope**: Eight delivery slices spanning public UX, authentication, organizer submission/editing, admin moderation, public publication visibility, quality-gate enablement, and containerized runtime foundations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Applies? | Evidence Planned | Status |
| ----- | ---------- | ------------------ | -------- |
| S1 Change Classification | Yes | Parent spec classifies UI, business logic, API, authz, database, container, security, and performance impact | PASS |
| S2 Test Strategy | Yes | Unit, integration, E2E, regression, a11y, security, contract, migration, container, and performance evidence mapped in spec and slices | PASS |
| S3 Accessibility Scope | Yes | WCAG 2.2 AA requirements plus automated and manual validation are explicit in spec and planned tooling | PASS |
| S4 Security Scope | Yes | Auth.js sessions, admin allowlist, ownership checks, CORS/CSRF/timeouts, secret isolation, upload validation, and abuse controls are planned | PASS |
| S5 Data and Migration Scope | Yes | PostgreSQL persistence, Prisma schema and migrations, schema constraints, rollback-forward-fix posture, and disposable validation are planned | PASS |
| S6 API Contract Scope | Yes | OpenAPI 3.1 artifacts, `/api/v1` versioning, structured errors, and explicit major-version strategy are planned | PASS |
| S7 Performance and Caching Scope | Yes | Concrete budgets from spec; Lighthouse CI and Playwright timing evidence chosen; caching remains N/A for MVP | PASS |
| S8 Automation Mapping | Yes | Repo gates map to Jest, Playwright, axe, Redocly, migration validation, Docker build/scan, SonarQube, and CI scripts | PASS |

Reference: `.specify/memory/gate-checklist-matrix.md` and `.specify/memory/automation-policy.md`.

### Post-Design Constitution Recheck

| Gate | Post-Design Evidence | Status |
| ----- | ---------------------- | -------- |
| S1 | Design artifacts preserve the parent feature's eight-slice structure and explicit container/runtime scope | PASS |
| S2 | `research.md`, `data-model.md`, `quickstart.md`, and `contracts/openapi-v1.yaml` map technical decisions to tests and gates | PASS |
| S3 | Accessibility tooling plan includes Playwright + axe checks and manual verification hooks in quality gates | PASS |
| S4 | Auth, authorization, upload, notification, and secret-handling design choices remain server-enforced and default deny | PASS |
| S5 | Data model and quickstart lock persistence to PostgreSQL + Prisma migrations with container-backed validation | PASS |
| S6 | Versioned contract artifact exists and uses major-version path strategy under `/api/v1` | PASS |
| S7 | Performance evidence method is selected and mapped to the relevant user journeys | PASS |
| S8 | Design explicitly includes contract, migration, accessibility, E2E, and container-security enablement work | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (pages)/
├── @modal/
├── api/
│   └── v1/
│       ├── admin/
│       ├── auth/
│       ├── organizer/
│       ├── public/
│       └── uploads/
├── components/
├── config/
├── lib/
│   ├── auth/
│   ├── notifications/
│   ├── storage/
│   └── validation/
└── types/

prisma/
├── schema.prisma
├── migrations/
└── seed.ts

contracts/
└── openapi.yaml

e2e/
├── auth/
├── organizer/
├── admin/
└── public/

scripts/
└── quality-gates/

specs/001-pluginbim-public-and-organizer-rework/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
  └── openapi-v1.yaml
```

**Structure Decision**: Keep the repository as a single App Router Next.js project rooted at `app/`, extend it with route handlers under `app/api/v1`, add `prisma/` for Prisma schema, migrations, and seeds, add `app/config` for static datasets and allowlists, add `app/lib` service layers for auth, storage, notifications, validation, and Prisma-backed data access, and use a versioned feature contract at `specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml` as the source of truth, with any repo-level `contracts/openapi.yaml` acting only as a generated or synchronized validation entrypoint.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| ----------- | ------------ | ------------------------------------- |
| None | N/A | N/A |

## Phase 0 Research Output

- [research.md](./research.md)

## Phase 1 Design Output

- [data-model.md](./data-model.md)
- [quickstart.md](./quickstart.md)
- [contracts/openapi-v1.yaml](./contracts/openapi-v1.yaml)
