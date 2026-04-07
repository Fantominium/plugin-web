# plugin-web Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-31

## Active Technologies
- TypeScript 5.x on Node.js 20 LTS, React 19.2.3, Next.js 16.1.4 + Next.js App Router, Tailwind CSS 4, Auth.js v5, Prisma ORM, `@prisma/client`, Resend, Zod, Playwright, `@axe-core/playwright`, Lighthouse CI, `@redocly/cli`, `openapi-typescript` (001-pluginbim-public-and-organizer-rework)
- PostgreSQL 17 in a container for relational data; volume-backed local poster storage for MVP behind a `PosterStorage` abstraction (001-pluginbim-public-and-organizer-rework)
- TypeScript 5.x / ES2022 (002-slice-02-spec)
- PostgreSQL via Prisma (database session strategy); in-memory Map for magic-link token store (MVP) (002-slice-02-spec)

## Project Structure

```text
app/
public/
scripts/
specs/
.github/
.specify/

README.md
DEVELOPER_GUIDE.md
QUALITY_GATES.md
IMPLEMENTATION_PROGRESS.md

package.json
next.config.ts
tsconfig.json
eslint.config.mjs
jest.config.js
```

## Commands

yarn dev
yarn test
yarn lint
yarn build

## Code Style

TypeScript 5.x on Node.js 20 LTS, React 19.2.3, Next.js 16.1.4: Follow standard conventions

## Recent Changes
- 002-slice-02-spec: Added TypeScript 5.x / ES2022
- 001-pluginbim-public-and-organizer-rework: Added TypeScript 5.x on Node.js 20 LTS, React 19.2.3, Next.js 16.1.4 + Next.js App Router, Tailwind CSS 4, Auth.js v5, Prisma ORM, `@prisma/client`, Resend, Zod, Playwright, `@axe-core/playwright`, Lighthouse CI, `@redocly/cli`, `openapi-typescript`
- 001-pluginbim-public-and-organizer-rework: Added TypeScript 5.x on Node.js 20 LTS, React 19.2.3, Next.js 16.1.4 + Next.js App Router, Tailwind CSS 4, Auth.js v5, Prisma ORM, `@prisma/client`, Resend, Zod, Playwright, `@axe-core/playwright`, Lighthouse CI, `@redocly/cli`, `openapi-typescript`

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
