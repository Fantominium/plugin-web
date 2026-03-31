# Tasks: Authentication and Role Foundation

**Input**: Design documents from /specs/002-slice-02-spec/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Constitution-required tests are included for unit, integration, end-to-end, regression, accessibility, authorization, and network security scopes. API contract and migration tasks are omitted as N/A per spec.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared test scaffolding and quality-gate alignment for this slice.

- [ ] T001 Update evidence sections and anchors in specs/002-slice-02-spec/quickstart.md for manual-a11y, metrics, and quality-gate reporting
- [ ] T002 [P] Add auth test data helpers for organizer/admin identities in app/lib/auth/auth.test.ts
- [ ] T003 [P] Add reusable logging assertion helper for auth security events in app/lib/auth/magic-link.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement cross-story foundations that all user stories depend on.

**CRITICAL**: No user story work begins until this phase is complete.

- [ ] T004 Implement 24-hour session expiry in app/lib/auth/auth.ts
- [ ] T005 [P] Implement structured auth-failure logging hooks in app/lib/auth/authorize.ts
- [ ] T006 [P] Implement structured auth-failure logging hooks in middleware.ts
- [ ] T007 Add deterministic security-log assertions for shared middleware/auth behavior in app/middleware.test.ts
- [ ] T008 Add branch-coverage assertions for auth policy paths in app/lib/auth/authorize.test.ts

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Organizer Signs In and Accesses Protected Area (Priority: P1) 🎯 MVP

**Goal**: Organizer users can sign in and access organizer routes, while unauthenticated and wrong-role requests are denied correctly.

**Independent Test**: Sign in as organizer and verify /dashboard access; verify unauthenticated users are redirected to /login and wrong-role users are sent to /unauthorized.

### Tests for User Story 1

- [ ] T009 [P] [US1] Add integration coverage for organizer session issuance and protected-route access in app/lib/auth/auth.test.ts
- [ ] T010 [P] [US1] Add middleware integration tests for organizer allow/deny paths in app/middleware.test.ts
- [ ] T011 [P] [US1] Add end-to-end organizer sign-in and landing journey in e2e/auth/login.spec.ts
- [ ] T012 [P] [US1] Add authorization regression test for organizer role-mismatch denial in app/middleware.test.ts

### Implementation for User Story 1

- [ ] T013 [US1] Add organizer route-guard invariance comments and no-behavior-change assertions in middleware.ts
- [ ] T014 [US1] Implement explicit organizer role-claim distrust guard in app/lib/auth/authorize.ts
- [ ] T015 [US1] Implement organizer callbackUrl redirect handling in app/(pages)/login/page.tsx
- [ ] T016 [US1] Implement explicit unauthorized-state copy and action targets in app/(pages)/unauthorized/page.tsx

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Admin Access Is Restricted by Allowlist and Role (Priority: P2)

**Goal**: Only allowlisted admin users can access admin routes after sign-in; non-allowlisted users are denied.

**Independent Test**: Authenticate one allowlisted account and one non-allowlisted account and verify admin access is granted only to the allowlisted account.

### Tests for User Story 2

- [ ] T017 [P] [US2] Add allowlist resolution and admin-role assignment tests in app/lib/auth/authorize.test.ts
- [ ] T018 [P] [US2] Add middleware tests for admin allow/deny route enforcement in app/middleware.test.ts
- [ ] T019 [P] [US2] Add end-to-end admin sign-in and admin-panel access journey in e2e/auth/login.spec.ts
- [ ] T020 [P] [US2] Add authorization regression test for admin privilege-escalation denial in app/lib/auth/authorize.test.ts

### Implementation for User Story 2

- [ ] T021 [US2] Implement trimmed lowercase and duplicate-safe allowlist parsing in app/config/admin-allowlist.ts
- [ ] T022 [US2] Enforce admin role resolution from allowlist-only logic in app/lib/auth/authorize.ts
- [ ] T023 [US2] Add admin route-guard invariance comments and no-behavior-change assertions in middleware.ts
- [ ] T024 [US2] Implement admin callbackUrl and post-login landing handling in app/(pages)/login/page.tsx

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Magic-Link Authentication Is Time-Bound and Single-Use (Priority: P3)

**Goal**: Magic-link sign-in enforces 15-minute expiry, single-use replay protection, atomic first-writer-wins consumption, and 5-per-hour email rate limiting.

**Independent Test**: Issue a magic link, consume once, retry same token, verify expiry behavior, and exceed request threshold to confirm rate-limit denial.

### Tests for User Story 3

- [ ] T025 [P] [US3] Add magic-link expiry and replay unit tests in app/lib/auth/magic-link.test.ts
- [ ] T026 [P] [US3] Add magic-link concurrent consumption first-writer-wins tests in app/lib/auth/magic-link.test.ts
- [ ] T027 [P] [US3] Add per-email rolling-window rate-limit tests in app/lib/auth/magic-link.test.ts
- [ ] T028 [P] [US3] Add integration tests for magic-link session issuance and denial outcomes in app/lib/auth/auth.test.ts
- [ ] T029 [P] [US3] Add regression tests for replay-token and escalation denial paths in app/lib/auth/magic-link.test.ts
- [ ] T030 [P] [US3] Add network-security abuse-control assertions for magic-link request throttling in app/lib/auth/magic-link.test.ts
- [ ] T031 [P] [US3] Add secret non-exposure log assertions (hashed email only, no plaintext) in app/lib/auth/magic-link.test.ts
- [ ] T032 [P] [US3] Add CSRF/CORS/timeout expectation tests for auth trust-boundary behavior in app/middleware.test.ts

### Implementation for User Story 3

- [ ] T033 [US3] Implement rolling-window magic-link rate limiting and helper store in app/lib/auth/magic-link.ts
- [ ] T034 [US3] Implement atomic token-claim documentation and replay logging in app/lib/auth/magic-link.ts
- [ ] T035 [US3] Implement expired-token and replay-token denial telemetry with hashed identifiers in app/lib/auth/magic-link.ts
- [ ] T036 [US3] Implement magic-link sign-in error propagation to login UI in app/(pages)/login/page.tsx

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: User Story 4 - Sign-In Recovers Gracefully from Identity Provider Failure (Priority: P3)

**Goal**: When Google provider auth fails, login page shows a clear inline error and keeps magic-link flow visible and usable.

**Independent Test**: Simulate Google provider failure and verify inline error appears, keyboard focus remains usable, and magic-link flow still works.

### Tests for User Story 4

- [ ] T037 [P] [US4] Add login UI unit tests for provider-failure inline error rendering in app/(pages)/login/page.test.tsx
- [ ] T038 [P] [US4] Add login UI tests for persistent magic-link form visibility during provider failure in app/(pages)/login/page.test.tsx
- [ ] T039 [P] [US4] Add accessibility-focused tests for error announcement wiring in app/(pages)/login/page.test.tsx
- [ ] T040 [P] [US4] Add end-to-end provider-failure recovery journey in e2e/auth/login.spec.ts

### Implementation for User Story 4

- [ ] T041 [US4] Implement accessible inline provider-failure error state in app/(pages)/login/page.tsx
- [ ] T042 [US4] Implement focus-management behavior for provider-failure error state in app/(pages)/login/page.tsx
- [ ] T043 [US4] Implement magic-link UI persistence during provider-failure state in app/(pages)/login/page.tsx

**Checkpoint**: User Story 4 is independently functional and testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cross-story validation, evidence capture, and hardening.

- [ ] T044 [P] Run and record coverage-threshold evidence (>=90 line, >=85 branch, 100 auth/policy branch) in specs/002-slice-02-spec/quickstart.md
- [ ] T045 [P] Run and record end-to-end timing evidence for SC-004 (p50 <= 3s over 10 runs) in e2e/auth/login.spec.ts
- [ ] T046 [P] Run and record first-attempt sign-in success-rate evidence for SC-001 (>=95%) in e2e/auth/login.spec.ts
- [ ] T047 [P] Record manual accessibility verification evidence in pull request checklist and specs/002-slice-02-spec/quickstart.md
- [ ] T048 [P] Update manual accessibility evidence prompt in .github/pull_request_template.md
- [ ] T049 [P] Record authorization allow/deny/escalation evidence traceability in specs/002-slice-02-spec/spec.md
- [ ] T050 Run full quality-gate command sequence once and capture command outputs in specs/002-slice-02-spec/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): no dependencies.
- Phase 2 (Foundational): depends on Phase 1 and blocks all user stories.
- Phase 3 (US1): depends on Phase 2 only.
- Phase 4 (US2): depends on Phase 2 only.
- Phase 5 (US3): depends on Phase 2; independent from US1/US2.
- Phase 6 (US4): depends on Phase 2; may reuse login updates from US1/US3 but remains independently testable.
- Phase 7 (Polish): depends on completion of all selected user stories.

### User Story Dependencies

- US1: no dependency on other user stories.
- US2: no dependency on other user stories.
- US3: no dependency on other user stories.
- US4: no dependency on other user stories.

### Within Each User Story

- Write tests first and confirm failing state before implementation.
- Implement core logic before UI wiring where applicable.
- Complete story-specific regression and authorization validations before checkpoint.

## Parallel Opportunities

- Setup tasks T002-T003 can run in parallel.
- Foundational tasks T005-T006 can run in parallel.
- US1 test tasks T009-T012 can run in parallel.
- US2 test tasks T017-T020 can run in parallel.
- US3 test tasks T025-T030 can run in parallel.
- US4 test tasks T037-T040 can run in parallel.
- Polish tasks T044-T049 can run in parallel.

## Parallel Example: User Story 1

- T009 [US1], T010 [US1], T011 [US1], and T012 [US1] can run simultaneously.
- T013 [US1] and T014 [US1] can run simultaneously after test scaffolding is committed.

## Parallel Example: User Story 2

- T017 [US2], T018 [US2], T019 [US2], and T020 [US2] can run simultaneously.
- T021 [US2] and T022 [US2] can run simultaneously before integrating middleware behavior.

## Parallel Example: User Story 3

- T025 [US3], T026 [US3], T027 [US3], T029 [US3], and T030 [US3] can run simultaneously.
- T031 [US3], T032 [US3], and T033 [US3] can run simultaneously after tests are in place.

## Parallel Example: User Story 4

- T037 [US4], T038 [US4], T039 [US4], and T040 [US4] can run simultaneously.
- T041 [US4] and T043 [US4] can run simultaneously, with T042 [US4] applied after error element markup is available.

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently via T009-T012 and checkpoint acceptance.
4. Demo/release MVP if desired.

### Incremental Delivery

1. Add US2 and validate admin allowlist enforcement.
2. Add US3 and validate magic-link security controls.
3. Add US4 and validate provider-failure recovery UX/accessibility.
4. Run Phase 7 cross-cutting quality-gate validations.

### Parallel Team Strategy

1. Team completes Phase 1 and Phase 2 together.
2. Then split by story: one engineer each for US1, US2, US3, and US4.
3. Rejoin for Phase 7 shared validation and final evidence capture.

## Notes

- [P] tasks are scoped to different files or non-blocking workflows.
- API contract and PostgreSQL migration tasks are intentionally omitted: both are N/A for this slice per spec.
- Every user story phase includes explicit gate-driven validation tasks before and during implementation.
