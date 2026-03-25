# Quickstart

## Purpose

This guide describes the intended local setup and validation flow for the planned implementation.

## Prerequisites

- Node.js 20 LTS
- Yarn 1.x compatible with the existing lockfile
- Docker and Docker Compose

## Environment Variables

Create `.env.local` with values equivalent to the following:

```bash
DATABASE_URL=postgresql://plugin_user:<db-password>@localhost:5432/plugin_dev
AUTH_SECRET=<generate-locally>
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=replace-me
GOOGLE_CLIENT_SECRET=<from-google-oauth>
RESEND_API_KEY=<from-resend>
EMAIL_FROM=noreply@example.com
ADMIN_ALLOWLIST=admin1@example.com,admin2@example.com
POSTER_STORAGE_DIR=./storage/posters
```

## Start PostgreSQL Runtime

```bash
docker compose up -d postgres
```

Expected outcome:
- PostgreSQL container reaches healthy status
- `DATABASE_URL` points at the containerized runtime

## Install Dependencies

```bash
yarn install --frozen-lockfile
```

## Run Database Migrations

```bash
yarn prisma migrate dev
```

Expected outcome:
- Database schema is created in the containerized PostgreSQL instance
- Migration validation can later reuse the same runtime shape in CI

## Start the App

```bash
yarn dev
```

Open `http://localhost:3000`.

## Planned Validation Commands

```bash
yarn lint
yarn typecheck
yarn test:ci
yarn gates:contracts
yarn gates:postgres
yarn gates:e2e
yarn gates:a11y
yarn build
```

## Planned Container Runtime Validation

```bash
docker compose up --build
```

Expected outcome:
- Web app container builds successfully
- Web app connects to PostgreSQL
- Runtime health checks pass

## Manual Accessibility Verification

Record manual verification results for each changed interactive flow:

- Homepage navigation and skip-link flow
- Contact page keyboard traversal
- Login flow including error states
- Organizer create-event form including file upload and validation
- Organizer edit-event form including status-change messaging
- Organizer dashboard navigation and preview actions
- Admin moderation flow including publish/reject actions

For each flow, capture:

- Keyboard-only completion result
- Visible focus result
- Focus-management result for route changes, errors, and modal or dialog states
- Assistive-technology announcement result for status or validation changes

## Planned Performance Evidence Workflow

```bash
yarn lighthouse:ci
yarn test:e2e --grep @performance
```

Expected outcome:
- Lighthouse CI records homepage and public-route budgets
- Playwright performance scenarios record dashboard, admin moderation, submission acknowledgement, upload-feedback, and search responsiveness timings

## Performance Evidence

| Journey | Budget | Measured Result | Environment | Pass/Fail |
|---------|--------|-----------------|-------------|-----------|
| Homepage initial render | < 2.5s |  |  |  |
| Organizer dashboard usable | < 2.0s |  |  |  |
| Admin panel usable | < 2.0s |  |  |  |
| Create/update acknowledgement | < 1.5s |  |  |  |
| Upload feedback after file select | < 500ms |  |  |  |
| Search/filter response | < 300ms |  |  |  |

## Notes

- Notification failures are expected to produce warnings, not roll back event persistence.
- Magic links must expire after 15 minutes and become invalid after first use.
- Admin access is determined only from the configured allowlist.