# Implementation Plan: Authentication and Role Foundation

**Branch**: `002-slice-02-spec` | **Date**: 2026-03-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-slice-02-spec/spec.md`

## Summary

Complete and harden secure MVP authentication for organizer and admin users: Google OAuth and email magic-link sign-in, session expiry fixed at 24 hours, server-side role-aware route protection, allowlist-based admin resolution, magic-link rate limiting (5/email/hr), atomic single-use token claim, and inline IDP-failure error recovery on the sign-in surface. The foundation is largely in place — the primary work is closing five behavioural gaps against the spec.

## Technical Context

**Language/Version**: TypeScript 5.x / ES2022  
**Runtime**: Next.js 16.1.4, App Router, React 19.2  
**Auth Library**: next-auth v5 (`^5.0.0-beta.29`) with `@auth/prisma-adapter ^2.11.0`  
**Identity Providers**: Google OAuth, Resend email magic-link  
**Storage**: PostgreSQL via Prisma (database session strategy); in-memory Map for magic-link token store (MVP)  
**Testing**: Jest + `@testing-library/react`; Playwright for e2e  
**Project Type**: Next.js web application (App Router)  
**Performance Goals**: Median sign-in-to-landing ≤ 3 s; magic-link consumption server-side ≤ 500 ms; route-guard decision ≤ 100 ms  
**Constraints**: No DB schema migrations in this slice; in-memory token store acceptable for single-process MVP  
**Scale/Scope**: MVP; single server process; rate limit window maintained in-memory

## Current Implementation State

| Capability | File | Status | Gap vs Spec |
|---|---|---|---|
| Google OAuth | `app/lib/auth/auth.ts` | ✅ Configured | None |
| Email / Resend magic-link | `app/lib/auth/auth.ts` | ✅ Configured | None |
| Magic-link 15-min TTL | `app/lib/auth/magic-link.ts` | ✅ Implemented | None |
| Magic-link single-use replay prevention | `app/lib/auth/magic-link.ts` | ✅ Implemented | None |
| Magic-link atomic claim (single-process) | `app/lib/auth/magic-link.ts` | ✅ Effectively atomic (Node.js event loop) | Needs explicit documentation in code |
| Admin allowlist eligibility | `app/config/admin-allowlist.ts` | ✅ Implemented | None |
| Role resolution (allowlist → admin/organizer) | `app/lib/auth/authorize.ts` | ✅ Implemented | None |
| Session strategy (database) | `app/lib/auth/auth.ts` | ✅ Configured | **maxAge = 30 days; spec requires 24 hours (FR-015)** |
| Unauthenticated → redirect to sign-in | `middleware.ts` | ✅ Implemented | None |
| Role-mismatch → `/unauthorized` page | `middleware.ts` | ✅ Implemented | None |
| Organizer landing routing | `middleware.ts` | ✅ Implemented | None |
| Admin landing routing | `middleware.ts` | ✅ Implemented | None |
| Magic-link rate limiting | — | ❌ Missing | **FR-018: 5 requests/email/hr not implemented** |
| IDP failure inline error display | `app/(pages)/login/page.tsx` | ⚠️ Partial | **FR-019: error state exists but inline message + magic-link always-visible not verified** |
| Privilege-escalation denial | `middleware.ts` + `authorize.ts` | ✅ Server-side enforced | None |
| Security event logging | — | ❌ Missing | **FR-014: failed auth events not recorded** |

## Constitution Check

*Pre-design gate evaluation from readiness review completed 2026-03-31.*

| Gate | Applies? | Evidence Planned | Status |
|------|----------|------------------|--------|
| S1 Change Classification | Yes | Impacted areas declared in spec constitution table | PASS |
| S2 Test Strategy | Yes | Behavior-to-test mapping in spec with unit/integration/e2e/regression per behavior | PASS |
| S3 Accessibility Scope | Yes | Accessibility Scope section in spec covers keyboard, semantics, announcements, contrast, manual walkthrough | PASS |
| S4 Security Scope | Yes | CSRF, session expiry, allowlist, rate limit, validation, deny-by-default all explicit | PASS |
| S5 Data and Migration Scope | N/A | No schema change; in-memory store for magic-link token; NextAuth adapter auto-generates session/token tables | N/A |
| S6 API Contract Scope | N/A | No new or modified public API endpoints | N/A |
| S7 Performance and Caching Scope | Yes | Performance budgets and validation methods defined in spec S7 section | PASS |
| S8 Automation Mapping | Yes | Gate-to-automation table in spec maps all applicable gates to CI jobs and hooks | PASS |

Reference: `.specify/memory/gate-checklist-matrix.md`, `.specify/memory/automation-policy.md`.

---

## Phase 0: Research

*Generated artifact: `research.md`*

### Research Tasks

| Unknown | Research Task | Resolution |
|---------|---------------|------------|
| Session maxAge setting | Current auth.ts uses `maxAge: 30 * 24 * 60 * 60` (30 days). Spec FR-015 requires 24 hours. | Change `maxAge` to `24 * 60 * 60`. NextAuth v5 database sessions respect this; the adapter will expire sessions past the maxAge on next auth check. |
| Magic-link rate limiting pattern | No rate-limiter exists. Spec requires ≤ 5 requests per email per rolling hour. No DB migration allowed. | In-memory Map keyed by normalized email: `{ count: number; windowStart: number }`. Reset window when `Date.now() - windowStart > 3_600_000`. This is consistent with the existing in-memory magic-link store pattern. |
| Atomic concurrent claim | Node.js is single-threaded; Map operations within a single tick are not interrupted. Current `verifyMagicLinkToken` reads then writes synchronously — this IS effectively atomic for single-process MVP. | Add an explicit code comment documenting the single-process atomicity guarantee and the upgrade path to a DB atomic UPDATE for distributed deployments. |
| IDP failure error handling | Login page has `?error=true` query param handling but no explicit inline error message rendered for provider failure. Magic-link option visibility during error state not confirmed. | Verify and update login page to render a human-readable inline error element (not just query-param detection) and ensure magic-link section is rendered unconditionally so it remains visible during Google provider errors. |
| FR-014 security event logging | No security event recording for expired token, replay, denied role. | Use `console.error` / structured `console.warn` at minimum for MVP, consistent with project logging standards. No new logging infrastructure required. |

---

## Phase 1: Design

*Generated artifacts: `data-model.md`, `quickstart.md`. No `contracts/` — API contract gate is N/A.*

### Data Model Decisions

No new database entities or schema changes are introduced. The following logical entities map to existing infrastructure:

| Entity | Implementation | Notes |
|--------|---------------|-------|
| `UserRole` | `'organizer' \| 'admin'` union type in `app/lib/auth/session.ts` and `app/lib/auth/authorize.ts` | Resolved server-side only; never trusted from client |
| `OrganizerSession` | NextAuth database Session row + `role: 'organizer'` in session token | Managed by `@auth/prisma-adapter` |
| `AdminSession` | NextAuth database Session row + `role: 'admin'` in session token | Granted only when `isAllowlistedAdmin()` returns true |
| `MagicLinkToken` | In-memory `Map<string, MagicLinkRecord>` in `magic-link.ts` | SHA-256 hashed; 15-min TTL; single-use via `consumedAt` flag |
| `AdminAllowlistEntry` | String array in `app/config/admin-allowlist.ts` | ADMIN_ALLOWLIST env var override; normalized to lowercase |
| `MagicLinkRateLimit` | New in-memory `Map<email, { count, windowStart }>` in `magic-link.ts` | Rolling 1-hour window; reset when window expires |

### Implementation Scope (by file)

**`app/lib/auth/auth.ts`**
- Change session `maxAge` from `30 * 24 * 60 * 60` to `24 * 60 * 60` (FR-015)

**`app/lib/auth/magic-link.ts`**
- Add `MagicLinkRateLimit` in-memory map and `RATE_LIMIT_MAX = 5`, `RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000`
- Add `checkAndIncrementRateLimit(email): boolean` — returns false when limit exceeded
- Call rate check at start of `issueMagicLink`; throw or return `{ error: 'rate_limited' }` when exceeded
- Add atomicity comment to `verifyMagicLinkToken` documenting single-process guarantee
- Add `clearRateLimitStore()` for test isolation
- Add structured log output for: expired token, replayed token, rate limit denial (FR-014)

**`app/(pages)/login/page.tsx`**
- Ensure Google error path renders a visible, screen-reader-accessible inline error message element (not just class toggling)
- Ensure magic-link email form section is rendered unconditionally (not conditional on Google success) so it appears during IDP failure (FR-019)
- Add `aria-describedby` linking inline error to the button/form that triggered it
- Focus management: on IDP error, move focus to the inline error element

**`app/lib/auth/authorize.ts`**
- Add structured log output for: denied role access, privilege escalation attempt (FR-014)

**`middleware.ts`**
- Add structured log output for unauthorized access denial (FR-014)
- No routing logic changes required (already correct per current implementation state)

**Test files (new or updated)**
- `app/lib/auth/magic-link.test.ts` — add rate-limit enforcement tests, concurrent claim tests, log output assertions
- `app/lib/auth/auth.test.ts` — add 24-hour session maxAge assertion
- `app/(pages)/login/page.test.tsx` — add IDP failure inline error rendering test, magic-link visibility test
- `app/middleware.test.ts` — add privilege-escalation denial test, security log assertion
- `e2e/auth/login.spec.ts` — add organizer happy path, admin happy path, IDP failure recovery, unauthorized access denial

### Quickstart Summary

The following environment variables must be set for this slice to function end-to-end:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@pluginbim.com
ADMIN_ALLOWLIST=admin@pluginbim.com,owner@pluginbim.com
NEXTAUTH_SECRET=
DATABASE_URL=
```

No new environment variables are introduced by this slice.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-slice-02-spec/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── checklists/
│   └── requirements.md
└── tasks.md             ← Phase 2 output (generated by /speckit.tasks)
```

### Source Code (files touched by this slice)

```text
app/
├── (pages)/
│   └── login/
│       └── page.tsx                   ← IDP error display, magic-link always-visible (FR-019)
├── lib/
│   └── auth/
│       ├── auth.ts                    ← session maxAge → 24 h (FR-015)
│       ├── magic-link.ts              ← rate limit + atomicity comment + security logs (FR-014, FR-018, FR-020)
│       ├── authorize.ts               ← security log on denial / escalation (FR-014)
│       ├── auth.test.ts               ← 24-h maxAge assertion
│       ├── magic-link.test.ts         ← rate limit, concurrent claim, log tests
│       └── authorize.test.ts          ← escalation denial + log tests
middleware.ts                          ← security log on unauthorized denial (FR-014)
app/middleware.test.ts                 ← privilege-escalation denial test
app/(pages)/login/page.test.tsx        ← IDP failure inline error, magic-link visibility
e2e/auth/login.spec.ts                 ← organizer path, admin path, IDP failure, unauthorized
```

**Structure Decision**: No new files or directories are required outside test additions. All changes are targeted edits to existing files. The in-memory rate-limit store lives alongside the existing in-memory magic-link store in `magic-link.ts` to keep token lifecycle logic co-located.

### Manual Accessibility Evidence

Manual a11y verification must be recorded in the pull request description using the checklist in `quickstart.md`. The reviewer must confirm keyboard-only walkthrough completion for: (1) successful sign-in, (2) Google error recovery, (3) rate-limit denial, (4) unauthenticated redirect, (5) unauthorized page. If any walkthrough item is blocked, it must be noted with a tracking issue before merge.

---

## Complexity Tracking

No constitution violations to justify.
