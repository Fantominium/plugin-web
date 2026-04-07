# Quickstart: Authentication and Role Foundation

**Feature**: `002-slice-02-spec`  
**Date**: 2026-03-31

This guide explains what is being changed, why, and what you need to run and verify the slice locally.

---

## Prerequisites

These must be configured before the slice can be run end-to-end:

```bash
# .env.local
GOOGLE_CLIENT_ID=<your Google OAuth client ID>
GOOGLE_CLIENT_SECRET=<your Google OAuth client secret>
RESEND_API_KEY=<your Resend API key>
RESEND_FROM_EMAIL=noreply@pluginbim.com
ADMIN_ALLOWLIST=admin@pluginbim.com,owner@pluginbim.com
NEXTAUTH_SECRET=<random secret, min 32 chars>
DATABASE_URL=postgresql://user:pass@localhost:5432/pluginbim_dev
```

No new environment variables are introduced by this slice.

---

## What This Slice Changes

### 1. Session expiry changed to 24 hours

**File**: `app/lib/auth/auth.ts`  
**Why**: Spec FR-015 requires 24-hour expiry. The prior value (30 days) was a NextAuth default, not a deliberate choice.  
**Effect**: Sessions created after this change will expire after 24 hours. Existing sessions older than 24 hours will be invalidated on next auth check.

### 2. Magic-link rate limiting added

**File**: `app/lib/auth/magic-link.ts`  
**Why**: FR-018 requires ≤ 5 magic-link requests per email per rolling hour to prevent email-flooding abuse.  
**Effect**: `issueMagicLink()` now returns `{ error: 'rate_limited' }` when the threshold is exceeded. The calling code must surface an appropriate user message.

### 3. Inline IDP failure error on login page

**File**: `app/(pages)/login/page.tsx`  
**Why**: FR-019 requires a visible, accessible inline error when Google OAuth fails, with magic-link option always visible.  
**Effect**: The Google error state now renders a `role="alert"` element with a human-readable message. The magic-link section is rendered unconditionally.

### 4. Security event logging

**Files**: `app/lib/auth/magic-link.ts`, `app/lib/auth/authorize.ts`, `middleware.ts`  
**Why**: FR-014 requires recording expired token, replay, rate-limit, and denied role access events.  
**Effect**: `console.error` / `console.warn` calls with structured messages are added at each failure point. Email addresses are hashed before logging.

### 5. Atomicity documentation for token claim

**File**: `app/lib/auth/magic-link.ts`  
**Why**: FR-020 requires atomic token claim. The current implementation is already effectively atomic for single-process Node.js but this is not documented.  
**Effect**: Code comment added documenting the atomicity guarantee and the upgrade path for distributed deployments.

---

## Running the Development Server

```bash
yarn dev
```

Visit `http://localhost:3000/login` to exercise the sign-in surface.

---

## Running Tests

```bash
# All unit and integration tests
yarn test

# Watch mode during development
yarn test --watch

# Coverage report
yarn test --coverage

# End-to-end tests (requires dev server running)
yarn test:e2e
```

---

## Manual Verification Checklist

Before submitting the slice for review, verify the following manually:

### Sign-in flows

- [ ] Google OAuth sign-in completes and lands organizer on organizer dashboard
- [ ] Google OAuth sign-in completes and lands allowlisted admin on admin panel
- [ ] Email magic-link is delivered and link completes sign-in successfully
- [ ] Magic-link expires after 15 minutes (set system clock or use test helper)
- [ ] Re-using a consumed magic-link is denied
- [ ] Requesting more than 5 magic links in one hour is denied with a user message

### Route protection

- [ ] Unauthenticated user requesting `/dashboard` is redirected to `/login`
- [ ] Unauthenticated user requesting `/admin` is redirected to `/login`
- [ ] Authenticated organizer requesting `/admin` is shown `/unauthorized` page
- [ ] Authenticated non-allowlisted user requesting `/admin` is shown `/unauthorized` page
- [ ] Session expires after 24 hours and re-auth is required

### IDP failure recovery

- [ ] With Google unavailable (disconnect in dev tools or mock), sign-in attempt shows inline error
- [ ] Magic-link form is visible and operable during/after Google error state
- [ ] Error message is announced by screen reader (test with VoiceOver or axe DevTools)

### Accessibility

- [ ] Keyboard-only sign-in flow works end-to-end: focus moves correctly, no traps
- [ ] Error states have visible and audible announcements
- [ ] `/unauthorized` page has descriptive title, main landmark, home link
- [ ] Colour contrast meets WCAG 2.2 AA on all changed surfaces

---

## Evidence Anchors

### manual-a11y

Record keyboard and screen-reader walkthrough evidence for:

- successful sign-in
- provider-failure recovery
- magic-link rate-limit denial
- unauthenticated redirect
- unauthorized page

### metrics

Capture and paste measured evidence for:

- SC-001 first-attempt sign-in success rate (>= 95%)
- SC-004 sign-in to protected landing p50 latency over 10 runs (<= 3s)
- coverage thresholds (>= 90 line, >= 85 branch, and 100 for auth/policy branch paths)

### quality-gates

Paste the latest successful outputs from:

- `npm run gates:precommit`
- `npm run gates:prepush`
- `npm run gates:ci`

Include command timestamps and short notes for any retries.

## Evidence Log (2026-03-31)

### Coverage Evidence (T044)

Command:

```bash
npm run test:ci
```

Observed result:

- Overall line coverage: `82.92%`
- Overall branch coverage: `71.46%`
- Auth/policy branch samples:
	- `app/lib/auth/magic-link.ts`: `92.85%`
	- `app/lib/auth/authorize.ts`: `66.66%`
	- `middleware.ts`: `78.57%`

Threshold status:

- `>= 90` line: `FAIL`
- `>= 85` branch: `FAIL`
- `100` auth/policy branch: `FAIL`

### E2E Timing Evidence (T045)

Command:

```bash
npx playwright test e2e/auth/login.spec.ts --grep "callback target" --repeat-each=10 --reporter=json > /tmp/login-auth-metrics.json
```

Parsed metrics:

- Sample count: `20`
- SC-004 p50 auth journey time: `2769.5ms` (`PASS`, budget `<= 3000ms`)

### First-Attempt Success Evidence (T046)

Source: same repeat-each run above.

- Passed: `20`
- Total: `20`
- SC-001 success rate: `100%` (`PASS`, target `>= 95%`)

### Manual Accessibility Evidence (T047)

Reviewer checklist copied into PR template section `Manual Accessibility Evidence`.

Walkthrough record (to be completed by reviewer before merge):

- [ ] Sign-in success path
- [ ] Provider-failure recovery path
- [ ] Magic-link rate-limit denial path
- [ ] Unauthenticated redirect path
- [ ] Unauthorized page path
- [ ] Screen-reader error announcement for login inline alert

### Quality-Gate Sequence Output (T050)

Executed sequence:

```bash
npm run gates:precommit
npm run gates:prepush
```

Latest outcome summary:

- Precommit: `PASS` (lint, typecheck, related tests, biome staged check)
- Prepush: `PASS` (ci quality gates, contracts lint, a11y checks, full e2e, repository biome)
- Notes: Redocly contract lints emitted warnings only; validation succeeded.

---

## Key File Locations

| File | Purpose |
|------|---------|
| `app/lib/auth/auth.ts` | NextAuth configuration; session maxAge |
| `app/lib/auth/magic-link.ts` | Token issuance, verification, rate limiting |
| `app/lib/auth/authorize.ts` | Role resolution, authorization policy functions |
| `app/config/admin-allowlist.ts` | Admin allowlist configuration |
| `middleware.ts` | Protected route matching and enforcement |
| `app/(pages)/login/page.tsx` | Sign-in surface |
| `app/(pages)/unauthorized/page.tsx` | Access-denied surface |
