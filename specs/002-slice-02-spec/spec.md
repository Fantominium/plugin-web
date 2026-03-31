# Feature Specification: Authentication and Role Foundation

**Feature Branch**: `002-slice-02-spec`  
**Created**: 2026-03-31  
**Status**: Draft  
**Input**: User description: "Begin the specification for slices/02"

## Clarifications

### Session 2026-03-31

- Q: How long should an authenticated session remain valid before re-authentication is required? → A: 24 hours
- Q: What is the correct outcome for an unauthenticated user vs. an authenticated wrong-role user reaching a protected route? → A: Unauthenticated → redirect to sign-in; role mismatch → render `/unauthorized` page
- Q: What is the rate limit for magic-link sign-in requests per email address? → A: 5 requests per email address per hour
- Q: What should happen when the Google identity provider is unreachable or returns an error during sign-in? → A: Show inline error on sign-in page with retry guidance; magic-link option remains visible as an independent alternative
- Q: What is the conflict-resolution strategy when two requests attempt to consume the same magic-link token concurrently? → A: First-writer wins via atomic token claim; the second concurrent request is denied as already-used

## Constitution Gate Classification *(mandatory)*

| Area | In Scope? | Notes |
|------|-----------|-------|
| User-facing UI / Accessibility | Yes | Login surface, post-login routing, denied-access handling, keyboard and focus continuity across auth flows |
| Business Logic | Yes | Role resolution, allowlist checks, magic-link expiry/replay protection, role-based landing logic |
| API Contract | No | No new external API contract in this slice; existing behavior is consumed without contract shape changes |
| Authentication / Authorization | Yes | Google login, email magic-link login, session issuance, server-side protected route and action authorization |
| Database / Migrations | No | Authentication and role foundation can be completed without schema changes in this slice |
| Caching | No | No cache introduction or cache-key behavior changes are required |
| Container / Deployment | No | No deployment artifact or runtime packaging changes are required |
| Network Security | Yes | CSRF/session protections, 24-hour session expiry enforcement, timeout behavior, abuse controls, and secret handling apply to auth boundaries |
| Performance Sensitivity | Yes | Sign-in and route-guard decisions must remain responsive to prevent login friction |

## Required Validation Evidence *(mandatory)*

- **Unit Tests**: Auth helper coverage for token verification, role mapping, allowlist evaluation, magic-link invalid/expired/replayed paths, concurrent atomic-claim denial, and rate-limit enforcement — all with full deny-path assertions.
- **Integration Tests**: End-to-end auth boundary tests at service and route layers validating session creation, role-aware redirects, and server-side route gating.
- **End-to-End Tests**: Organizer login success path, admin login success path, and unauthorized access denial for organizer/admin protected routes.
- **Regression Tests**: Privilege-escalation and replay-token regression scenarios to prevent recurrence of prior or potential auth boundary defects.
- **Accessibility Validation**: Automated a11y scan on login and unauthorized surfaces, plus manual keyboard-only verification of focus order and visible focus through sign-in, redirect, provider-error, and rate-limit-denial states.
- **Security Validation**: Explicit evidence for CSRF controls, session timeout handling (24-hour expiry), allowlist enforcement, magic-link rate limiting (≤ 5 requests per email per hour), input validation, secret non-exposure, and centralized server-side deny-by-default authorization.
- **Contract Validation**: N/A: no public API contract or payload changes are introduced in this slice.
- **Migration Validation**: N/A: no schema or migration change is required for this slice.

## Behavior-to-Test Mapping *(S2)*

| Behavior | Unit | Integration | E2E | Regression | Affected Gates |
|----------|------|-------------|-----|------------|----------------|
| Google sign-in success and session issuance | Required | Required | Required | — | C4, P2, P3, P9 |
| Magic-link sign-in success and session issuance | Required | Required | Required | — | C4, P2, P3, P9 |
| Magic-link expiry enforcement (15-min window) | Required | Required | — | — | C4, P2, P9 |
| Magic-link single-use / replay rejection | Required | Required | — | Required | C4, P2, P9 |
| Magic-link atomic concurrent-claim resolution | Required | Required | — | Required | C4, P2, P9 |
| Magic-link rate-limit enforcement (5/email/hr) | Required | Required | — | — | C4, P2, P9, P12 |
| Role resolution to single effective role | Required | Required | — | — | C4, P2, P9 |
| Admin allowlist eligibility check | Required | Required | Required | — | C4, P2, P3, P9 |
| Organizer→dashboard routing after sign-in | — | Required | Required | — | P2, P3 |
| Admin→admin-panel routing after sign-in | — | Required | Required | — | P2, P3 |
| Unauthenticated request → redirect to sign-in | Required | Required | Required | — | C4, P2, P3, P9 |
| Role-mismatch authenticated request → `/unauthorized` | Required | Required | Required | Required | C4, P2, P3, P9 |
| Privilege-escalation denial (client claim vs. server role) | Required | Required | — | Required | C4, P2, P9 |
| 24-hour session expiry and re-auth requirement | Required | Required | — | — | C4, P2, P9, P12 |
| Google IDP failure → inline error, magic-link remains operable | Required | Required | Required | — | C4, P2, P3, P5 |
| Security-relevant auth failures recorded | Required | — | — | — | C4, P9 |

## Accessibility Scope *(S3)*

**Surfaces in scope**: sign-in page, `/unauthorized` page, post-login redirect states, provider-error inline error state, rate-limit-denial state.

| Criterion | Requirement |
|-----------|-------------|
| Keyboard navigation | All interactive sign-in controls (Google button, magic-link email field, submit) must be fully operable by keyboard alone; no keyboard traps |
| Visible focus | Focus indicator must be visible on all interactive elements throughout the entire auth flow |
| Semantic HTML | Sign-in form uses `<form>`, `<label>`, `<input>`, `<button>` correctly; heading hierarchy is logical on sign-in and unauthorized pages |
| Inline error announcements | Provider-error and rate-limit-denial messages must be associated with the triggering element (via `aria-describedby` or equivalent) so screen readers announce them without requiring user navigation |
| Redirect state | When a redirect occurs (unauthenticated → sign-in), focus must land at a logical point on the destination page (typically the page heading or first interactive element) |
| Unauthorized page | The `/unauthorized` page must have a descriptive page title, semantic main landmark, and a visible, keyboard-accessible action (e.g., return to home) |
| Colour contrast | All text, error messages, and interactive control labels on changed surfaces must meet WCAG 2.2 AA minimum contrast (4.5:1 for normal text, 3:1 for large text and UI components) |
| Automated gate | Zero serious or critical violations on all in-scope surfaces via automated accessibility tooling |
| Manual verification | Keyboard-only walkthrough of: (1) successful sign-in, (2) Google error recovery, (3) rate-limit denial, (4) unauthenticated redirect, (5) unauthorized page |

## Performance Validation *(S7)*

**In-scope paths**: sign-in initiation, magic-link consumption, post-login role resolution and redirect, protected-route authorization decision.

| Path | Budget | Validation Method | Acceptance Signal |
|------|--------|-------------------|-------------------|
| Successful sign-in to role landing (end-to-end) | Median ≤ 3 s under staging load | E2E test with timing assertion (`page.waitForURL` + elapsed time) | p50 ≤ 3 s over 10 consecutive runs |
| Magic-link consumption to session creation | ≤ 500 ms server-side processing | Integration test with explicit timing boundary | Processing time assertion passes consistently in CI |
| Protected-route authorization decision (server-side) | ≤ 100 ms per decision | Unit/integration test on authorization policy function | Elapsed-time assertion passes consistently in CI |

**Caching**: marked out of scope (Constitution Gate Classification: No). No cache is introduced or modified; correctness and privacy posture are unaffected by this slice.

## Gate-to-Automation Mapping *(S8)*

| Constitution Gate | Enforcement Layer | Tool / Job | Trigger |
|-------------------|-------------------|------------|---------|
| C1 Clean Scope | Pre-commit | `.githooks/pre-commit` → `scripts/quality-gates/pre-commit.sh` (secret scan, `.only` detection) | `git commit` |
| C2 Formatting and Lint | Pre-commit + CI | Pre-commit hook + `quality-gates` CI job (ESLint, Biome) | `git commit`, `pull_request` |
| C3 Type Safety | Pre-commit + CI | Pre-commit hook + `quality-gates` CI job (`tsc --noEmit`) | `git commit`, `pull_request` |
| C4 Unit Test | Pre-commit + CI | Pre-commit hook + `quality-gates` CI job (Jest, coverage thresholds) | `git commit`, `pull_request` |
| C5 Secret and Dependency Safety | Pre-commit | `.githooks/pre-commit` → secret scan step | `git commit` |
| P1 Reproducible Build | CI | `quality-gates` job (clean install + production build) | `pull_request` |
| P2 Integration | CI | `quality-gates` job (Jest integration suite) | `pull_request` |
| P3 End-to-End | CI | `quality-gates` job (Playwright `test:e2e`) | `pull_request` |
| P5 Accessibility | CI | `quality-gates` job (`test:a11y`) | `pull_request` |
| P6 SonarQube | CI | `sonarqube` job + quality gate webhook | `pull_request`, push to protected branch |
| P9 Authorization | CI | `quality-gates` job (Jest authorization suite) | `pull_request` |
| P12 Network Security | CI | `quality-gates` job (network/abuse control tests) | `pull_request` |
| C4 Auth/Policy Branch Coverage (100%) | Pre-commit + CI | Pre-commit hook + `quality-gates` CI job (Jest coverage; auth/policy/validation logic requires 100% branch) | `git commit`, `pull_request` |
| P4 Regression | CI | `quality-gates` job (Jest regression suite; privilege-escalation and replay-token regression tests) | `pull_request` |
| P7 API Contract | N/A | No new or modified public API endpoints in this slice | — |
| P8 PostgreSQL Migration | N/A | No schema or migration change in this slice | — |
| P10 Caching | N/A | No cache is introduced or modified | — |
| P11 Container Security | N/A | No Dockerfile or deployment artifact change in this slice | — |
| R1–R3 Release | Out of scope for this plan | Release gates apply at production promotion; tracked in release checklist | — |

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Organizer Signs In and Accesses Protected Area (Priority: P1)

As an organizer, I can authenticate and enter organizer-only pages while unauthorized users are denied.

**Why this priority**: Organizer access is the minimum secure workflow needed to unlock protected product value.

**Independent Test**: Can be fully tested by signing in as an organizer and navigating to organizer-protected routes, then verifying denial for non-authenticated and wrong-role users.

**Acceptance Scenarios**:

1. **Given** an organizer account with valid credentials, **When** the organizer signs in, **Then** an organizer session is issued and organizer dashboard access is granted.
2. **Given** an authenticated user without the organizer role, **When** the user attempts organizer-protected access, **Then** the user is shown the `/unauthorized` page.
3. **Given** no authenticated session, **When** a protected organizer route is requested, **Then** the request is redirected to the sign-in page.

---

### User Story 2 - Admin Access Is Restricted by Allowlist and Role (Priority: P2)

As a platform admin, I can sign in and reach admin-only pages only when my account is explicitly allowlisted.

**Why this priority**: Admin entry points are high-risk and must enforce strict eligibility and role boundaries.

**Independent Test**: Can be fully tested by authenticating one allowlisted admin and one non-allowlisted account, then validating opposite authorization outcomes.

**Acceptance Scenarios**:

1. **Given** an allowlisted admin account, **When** the user signs in, **Then** admin role resolution succeeds and admin panel access is granted.
2. **Given** an authenticated non-allowlisted account, **When** the user attempts admin-protected access, **Then** the user is shown the `/unauthorized` page.
3. **Given** no authenticated session, **When** an admin-protected route is requested, **Then** the request is redirected to the sign-in page.

---

### User Story 3 - Magic-Link Authentication Is Time-Bound and Single-Use (Priority: P3)

As an organizer or admin user choosing email sign-in, I can use a secure magic link that expires and cannot be replayed.

**Why this priority**: Magic links reduce credential friction but require strict anti-replay and expiry guarantees to remain secure.

**Independent Test**: Can be fully tested by issuing a link, consuming it once, retrying the same link, and attempting use after expiry.

**Acceptance Scenarios**:

1. **Given** a newly issued magic link within its validity window, **When** the user activates the link once, **Then** authentication succeeds and a session is created.
2. **Given** a previously consumed magic link, **When** the same link is reused, **Then** authentication is denied and replay is logged.
3. **Given** an expired magic link, **When** the user attempts sign-in with it, **Then** authentication is denied and the user is prompted to request a fresh link.

---

### User Story 4 - Sign-In Recovers Gracefully from Identity Provider Failure (Priority: P3)

As a user attempting Google sign-in when the provider is unavailable, I receive a clear error message and can switch to magic-link sign-in without losing my session state or being left on a broken screen.

**Why this priority**: External provider failures are inevitable; a silent or broken failure state blocks all access and damages trust.

**Independent Test**: Can be fully tested by simulating a Google OAuth provider error and verifying that the sign-in page displays an inline error and the magic-link option remains operable.

**Acceptance Scenarios**:

1. **Given** the Google identity provider returns an error, **When** a user attempts Google sign-in, **Then** an inline error is displayed on the sign-in page with guidance to retry or use the magic-link alternative.
2. **Given** the sign-in page is showing a Google provider error, **When** the user chooses the magic-link option, **Then** the magic-link flow proceeds normally without side-effects from the prior failure.

---

### Edge Cases

- User authenticates with a valid identity provider account but does not map to organizer or allowlisted admin role.
- Magic-link token is malformed, revoked, expired, or already consumed.
- Concurrent attempts try to consume the same magic link at nearly the same time; the first writer claims the token atomically and succeeds, the second is denied as already-used.
- Authenticated organizer attempts to access admin route and authenticated admin attempts organizer owner-scoped content without ownership.
- Session exists but is invalid due to timeout or tampering.
- Email address exceeds the rate limit of 5 magic-link requests per hour; further requests must be denied until the window resets.
- Google identity provider is unreachable or returns an error mid-sign-in; the sign-in page must display an inline error and keep the magic-link option visible and functional.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support sign-in through Google identity authentication.
- **FR-002**: System MUST support sign-in through email magic-link authentication.
- **FR-003**: System MUST enforce a magic-link validity window of 15 minutes from issuance.
- **FR-004**: System MUST reject any magic-link token after first successful use.
- **FR-005**: System MUST resolve each authenticated account to exactly one effective role for current-session authorization decisions.
- **FR-006**: System MUST grant admin role only when the authenticated account matches the configured admin allowlist.
- **FR-007**: System MUST route authenticated organizer users to organizer landing behavior.
- **FR-008**: System MUST route authenticated allowlisted admin users to admin landing behavior.
- **FR-009**: System MUST enforce organizer protected-route access on the server side.
- **FR-010**: System MUST enforce admin protected-route access on the server side.
- **FR-011**: System MUST deny unauthorized, unauthenticated, and role-mismatched requests to protected routes.
- **FR-012**: System MUST evaluate authorization through centralized server-side policy logic rather than per-page ad hoc checks.
- **FR-013**: System MUST detect and deny privilege-escalation attempts where client-provided claims conflict with server-side role resolution.
- **FR-014**: System MUST record security-relevant auth failures including expired token, replay attempt, and denied role access outcomes.
- **FR-015**: System MUST expire authenticated sessions after 24 hours, requiring re-authentication upon next access.
- **FR-016**: System MUST redirect unauthenticated requests to protected routes to the sign-in page, preserving no protected resource details in the redirect.
- **FR-017**: System MUST render the `/unauthorized` page for authenticated requests to protected routes where the resolved role does not satisfy the required permission.
- **FR-018**: System MUST enforce a maximum of 5 magic-link sign-in requests per email address per rolling hour and reject further requests until the window resets.
- **FR-019**: System MUST display an inline error message on the sign-in surface when the Google identity provider is unreachable or returns an error, and MUST keep the magic-link sign-in option visible and operable.
- **FR-020**: System MUST use an atomic token-claim operation when consuming a magic-link token so that only the first successful claimant receives a session; any concurrent attempt on the same token MUST be denied as already-used.

### Assumptions

- Existing identity-provider and email-delivery capabilities are available to issue and verify sign-in attempts.
- Existing user records contain sufficient attributes to resolve organizer and admin eligibility without introducing schema changes.
- Unauthenticated access to protected routes redirects to the sign-in page; authenticated role-mismatch access renders the `/unauthorized` page.
- Audit/security event recording follows existing project logging and observability standards.

### Key Entities *(include if feature involves data)*

- **UserRole**: The effective authorization role assigned to an authenticated account for current session decisions.
- **OrganizerSession**: Authenticated organizer session context used to authorize organizer routes and actions.
- **AdminSession**: Authenticated admin session context used to authorize admin routes and actions.
- **MagicLinkToken**: Single-use, time-bound token used for email authentication and replay prevention.
- **AdminAllowlistEntry**: Approved identity reference used to determine admin eligibility at sign-in.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of valid organizer and allowlisted-admin sign-ins complete successfully on first attempt in controlled test runs.
- **SC-002**: 100% of expired and replayed magic-link attempts are denied in automated test coverage.
- **SC-003**: 100% of unauthorized access attempts to organizer/admin protected routes are denied in authorization test suites.
- **SC-004**: Median time from successful authentication to reaching role-appropriate landing page is 3 seconds or less under normal staging conditions.
- **SC-005**: 0 serious or critical accessibility violations are found on changed authentication and unauthorized-access surfaces.
