# Tasks: PluginBIM-Inspired Public Experience and Role-Based Event Management Rework

**Input**: Design documents from `/specs/001-pluginbim-public-and-organizer-rework/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/openapi-v1.yaml

**Tests**: Tests are required whenever the constitution and gate matrix mark them applicable. This task list includes unit, integration, end-to-end, regression, accessibility, contract, migration, and container-validation work where the feature scope requires it.

**Organization**: Tasks are grouped by setup, foundational prerequisites, and user stories so each story can be implemented and tested independently once prerequisites are complete.

## Phase 1: Setup

**Purpose**: Establish repository-level tooling, runtime assets, and validation scaffolding shared by all slices.

- [ ] T001 Update Prisma, Auth.js, Playwright, axe, Lighthouse, Redocly, and supporting scripts in package.json
- [ ] T002 Create application container and local orchestration assets in Dockerfile, docker-compose.yml, and .dockerignore
- [ ] T003 [P] Add environment variable templates and runtime documentation in .env.example and README.md
- [ ] T004 [P] Scaffold Prisma project files in prisma/schema.prisma and prisma/seed.ts
- [ ] T005 [P] Add repo-level tooling configuration in playwright.config.ts, lighthouserc.json, and redocly.yaml

---

## Phase 2: Foundational

**Purpose**: Build the shared runtime, data, validation, contract, and automation foundations that block all user story work.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T006 Implement shared environment parsing in app/config/env.ts
- [ ] T007 [P] Implement Prisma client and repository bootstrap in app/lib/prisma.ts and app/lib/repositories/index.ts
- [ ] T008 [P] Implement shared API error and response helpers in app/lib/api/errors.ts and app/types/api.ts
- [ ] T009 [P] Implement shared validation and normalization utilities in app/lib/validation/common.ts and app/lib/validation/event.ts
- [ ] T010 [P] Add controlled configuration datasets in app/config/locations.ts and app/config/admin-allowlist.ts
- [ ] T011 [P] Create repository contract validation wiring by syncing specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml to contracts/openapi.yaml and wiring validation in package.json
- [ ] T012 [P] Enable quality-gate automation wiring in .github/workflows/quality-gates.yml and scripts/quality-gates/ci.sh
- [ ] T013 Create foundational auth and organizer schema models in prisma/schema.prisma
- [ ] T014 Create foundational Prisma migration for auth and organizer tables in prisma/migrations/
- [ ] T015 [P] Implement cross-cutting poster storage and notification abstractions in app/lib/storage/poster-storage.ts and app/lib/notifications/notification-service.ts
- [ ] T016 [P] Add runtime health and migration validation support in app/api/health/route.ts and scripts/quality-gates/validate-postgres-migrations.sh
- [ ] T082 [P] Implement shared network security configuration for CORS, request timeouts, and abuse-control defaults in app/config/security.ts and app/lib/api/security.ts
- [ ] T083 [P] Implement server-side CSRF/session-integrity helpers for authenticated mutations in app/lib/auth/csrf.ts and app/lib/auth/session.ts

**Checkpoint**: Shared runtime, Prisma baseline, contract scaffolding, and automation foundations are ready.

---

## Phase 3: User Story 1 - Browse the Main Public Experience (Priority: P1) 🎯 MVP

**Goal**: Deliver a PluginBIM-inspired public homepage with complete sections, valid navigation, and typed event discovery wiring.

**Independent Test**: A first-time visitor can load the homepage, understand the product, move through complete public sections, and navigate to public discovery destinations without dead ends.

### Tests for User Story 1

- [ ] T017 [P] [US1] Add homepage integration coverage in app/page.test.tsx
- [ ] T018 [P] [US1] Add homepage E2E and accessibility coverage in e2e/public/homepage.spec.ts and e2e/public/homepage.a11y.spec.ts
- [ ] T019 [P] [US1] Add regression coverage for public event discovery navigation in app/(pages)/events/page.test.tsx

### Implementation for User Story 1

- [ ] T020 [P] [US1] Rework homepage composition and data loading in app/page.tsx
- [ ] T021 [P] [US1] Refresh public navigation structure in app/components/Header/Header.tsx
- [ ] T022 [P] [US1] Refresh footer navigation and legal/public links in app/components/Footer/Footer.tsx
- [ ] T023 [P] [US1] Implement homepage feature sections in app/components/Hero/Hero.tsx, app/components/Categories/Categories.tsx, app/components/FeaturedEvents/FeaturedEvents.tsx, and app/components/AppPromotion/AppPromotion.tsx
- [ ] T024 [US1] Wire homepage event discovery data through app/lib/event-service.ts and app/types/event.ts

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Reach the Contact Us Experience (Priority: P1)

**Goal**: Provide a complete, accessible Contact Us page with approved public contact and social information.

**Independent Test**: A visitor can navigate to Contact Us from public navigation and view complete contact details and approved social links on mobile and desktop.

### Tests for User Story 2

- [ ] T025 [P] [US2] Add Contact Us route integration coverage in app/(pages)/contact/page.test.tsx
- [ ] T026 [P] [US2] Add Contact Us E2E and accessibility coverage in e2e/public/contact.spec.ts and e2e/public/contact.a11y.spec.ts

### Implementation for User Story 2

- [ ] T027 [P] [US2] Add public contact configuration in app/config/public-contact.ts
- [ ] T028 [US2] Implement the Contact Us route in app/(pages)/contact/page.tsx
- [ ] T029 [US2] Link Contact Us into public navigation in app/components/Header/Header.tsx and app/components/Footer/Footer.tsx

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Organizer Signs In Securely (Priority: P1)

**Goal**: Deliver secure Google and magic-link sign-in with server-side protected routes, allowlist-based admin resolution, and protected session handling.

**Independent Test**: An organizer can sign in and access protected routes, an allowlisted admin lands on admin-authorized routes, and unauthenticated or unauthorized access is denied.

### Tests for User Story 3

- [ ] T030 [P] [US3] Add auth unit coverage for allowlist and magic-link rules in app/lib/auth/auth.test.ts and app/lib/auth/authorize.test.ts
- [ ] T031 [P] [US3] Add auth contract and route validation coverage in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/auth/magic-link/route.test.ts
- [ ] T032 [P] [US3] Add organizer/admin sign-in E2E coverage in e2e/auth/login.spec.ts
- [ ] T033 [P] [US3] Add protected-route authorization regression coverage in app/middleware.test.ts
- [ ] T084 [P] [US3] Add timeout, replay, CSRF/session-integrity, and abuse-control validation coverage for auth flows in app/api/v1/auth/magic-link/route.test.ts and app/lib/auth/auth.test.ts

### Implementation for User Story 3

- [ ] T034 [P] [US3] Implement Auth.js configuration and session callbacks in app/lib/auth/auth.ts and app/api/auth/[...nextauth]/route.ts
- [ ] T035 [P] [US3] Implement allowlist-based role resolution in app/lib/auth/authorize.ts and app/config/admin-allowlist.ts
- [ ] T036 [P] [US3] Implement magic-link request and verification flow in app/api/v1/auth/magic-link/route.ts and app/lib/auth/magic-link.ts
- [ ] T037 [US3] Add middleware-based protected routing in middleware.ts and app/lib/auth/session.ts
- [ ] T038 [US3] Create login and unauthorized UI routes in app/(pages)/login/page.tsx and app/(pages)/unauthorized/page.tsx

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: User Story 5 - Organizer Creates a New Event From the Upload Page (Priority: P1)

**Goal**: Let authenticated organizers upload posters, capture pricing, and submit new events into `pending_approval` with non-blocking notification handling.

**Independent Test**: An authenticated organizer can complete the upload-page flow, submit a valid event, and see it persisted in `pending_approval`; invalid inputs are blocked with accessible feedback.

### Tests for User Story 5

- [ ] T039 [P] [US5] Add organizer create/upload contract coverage in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/organizer/events/route.test.ts
- [ ] T040 [P] [US5] Add event validation unit coverage in app/lib/validation/event.test.ts and app/lib/storage/poster-storage.test.ts
- [ ] T041 [P] [US5] Add create-event integration coverage in app/api/v1/organizer/events/create.integration.test.ts and app/api/v1/uploads/posters/route.test.ts
- [ ] T042 [P] [US5] Add organizer submission E2E and accessibility coverage in e2e/organizer/create-event.spec.ts and e2e/organizer/create-event.a11y.spec.ts
- [ ] T085 [P] [US5] Add CORS, timeout, CSRF/session-integrity, and upload abuse-control coverage in app/api/v1/uploads/posters/route.test.ts and app/api/v1/organizer/events/create.integration.test.ts

### Implementation for User Story 5

- [ ] T043 [P] [US5] Extend Prisma event, pricing, poster, and notification models in prisma/schema.prisma
- [ ] T044 [US5] Create Prisma migration for organizer submission entities in prisma/migrations/
- [ ] T045 [P] [US5] Implement create-event service and notification warning handling in app/lib/events/create-event.ts and app/lib/notifications/notification-service.ts
- [ ] T046 [P] [US5] Implement poster upload route and storage assignment logic in app/api/v1/uploads/posters/route.ts and app/lib/storage/poster-storage.ts
- [ ] T047 [P] [US5] Build upload-form and pricing UI in app/components/EventForm/EventForm.tsx and app/components/EventPricing/EventPricingSection.tsx
- [ ] T048 [US5] Implement protected organizer upload page and create endpoint in app/(pages)/dashboard/events/new/page.tsx and app/api/v1/organizer/events/route.ts

**Checkpoint**: User Story 5 is independently functional and testable.

---

## Phase 7: User Story 7 - Organizer Uses a Dashboard to Manage Profile-Scoped Events (Priority: P1)

**Goal**: Provide an organizer dashboard that lists only owned events, shows statuses, and links to create, preview, and edit workflows.

**Independent Test**: After authentication, an organizer can open the dashboard, see only owned events, inspect statuses, preview public routes, and navigate into create and edit flows.

### Tests for User Story 7

- [ ] T049 [P] [US7] Add dashboard contract coverage for organizer event summaries and status responses in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/organizer/events/[eventId]/status/route.test.ts
- [ ] T050 [P] [US7] Add organizer dashboard integration coverage in app/(pages)/dashboard/page.test.tsx and app/lib/events/list-organizer-events.test.ts
- [ ] T051 [P] [US7] Add organizer dashboard E2E and accessibility coverage in e2e/organizer/dashboard.spec.ts and e2e/organizer/dashboard.a11y.spec.ts
- [ ] T088 [P] [US7] Add organizer preview action coverage in app/(pages)/dashboard/page.test.tsx and app/components/OrganizerDashboard/EventList.test.tsx

### Implementation for User Story 7

- [ ] T052 [P] [US7] Implement organizer dashboard queries and status helpers in app/lib/events/list-organizer-events.ts and app/lib/events/get-event-status.ts
- [ ] T053 [P] [US7] Build organizer dashboard UI components in app/components/OrganizerDashboard/OrganizerDashboard.tsx and app/components/OrganizerDashboard/EventList.tsx
- [ ] T089 [P] [US7] Implement organizer preview actions and preview-link behavior in app/components/OrganizerDashboard/EventList.tsx and app/(pages)/dashboard/page.tsx
- [ ] T054 [US7] Implement the protected dashboard page and organizer status route in app/(pages)/dashboard/page.tsx and app/api/v1/organizer/events/[eventId]/status/route.ts

**Checkpoint**: User Story 7 is independently functional and testable.

---

## Phase 8: User Story 6 - Organizer Updates an Existing Event (Priority: P1)

**Goal**: Let organizers edit owned events, prepopulate existing values, and reset previously published events back to `pending_approval`.

**Independent Test**: An organizer can open an owned event for editing, submit valid changes, and see status updates reflected while non-owned access remains denied.

### Tests for User Story 6

- [ ] T055 [P] [US6] Add organizer update contract coverage in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/organizer/events/[eventId]/route.test.ts
- [ ] T056 [P] [US6] Add unit coverage for ownership and published-reset logic in app/lib/events/update-event.test.ts and app/lib/auth/ownership.test.ts
- [ ] T057 [P] [US6] Add organizer edit E2E and accessibility coverage in e2e/organizer/edit-event.spec.ts and e2e/organizer/edit-event.a11y.spec.ts

### Implementation for User Story 6

- [ ] T058 [P] [US6] Implement organizer ownership and update logic in app/lib/events/update-event.ts and app/lib/auth/ownership.ts
- [ ] T059 [P] [US6] Build prepopulated edit-form UI in app/(pages)/dashboard/events/[eventId]/edit/page.tsx and app/components/EventForm/EditEventForm.tsx
- [ ] T060 [US6] Implement organizer update route in app/api/v1/organizer/events/[eventId]/route.ts

**Checkpoint**: User Story 6 is independently functional and testable.

---

## Phase 9: User Story 4 - Admin Signs In And Manages The Platform (Priority: P1)

**Goal**: Deliver the admin panel, moderation queue, and publish/reject actions across organizer boundaries.

**Independent Test**: An allowlisted admin can open the admin panel, moderate pending events, and an organizer cannot access the same routes or actions.

### Tests for User Story 4

- [ ] T061 [P] [US4] Add admin moderation contract coverage in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/admin/events/[eventId]/moderation/route.test.ts
- [ ] T062 [P] [US4] Add admin moderation integration coverage in app/api/v1/admin/events/route.test.ts and app/lib/admin/moderate-event.test.ts
- [ ] T063 [P] [US4] Add admin moderation E2E and accessibility coverage in e2e/admin/moderation.spec.ts and e2e/admin/moderation.a11y.spec.ts
- [ ] T064 [P] [US4] Add authorization regression coverage for organizer denial paths in app/middleware.admin.test.ts
- [ ] T086 [P] [US4] Add admin route security coverage for CORS posture, timeout handling, and session-integrity enforcement in app/api/v1/admin/events/route.test.ts and app/api/v1/admin/events/[eventId]/moderation/route.test.ts

### Implementation for User Story 4

- [ ] T065 [P] [US4] Extend Prisma schema and migration for moderation audit actions in prisma/schema.prisma and prisma/migrations/
- [ ] T066 [P] [US4] Implement admin moderation services and queue queries in app/lib/admin/list-events-for-moderation.ts and app/lib/admin/moderate-event.ts
- [ ] T067 [P] [US4] Build the admin panel UI in app/(pages)/admin/page.tsx and app/components/AdminPanel/AdminPanel.tsx
- [ ] T068 [US4] Implement admin event list and moderation routes in app/api/v1/admin/events/route.ts and app/api/v1/admin/events/[eventId]/moderation/route.ts

**Checkpoint**: User Story 4 is independently functional and testable.

---

## Phase 10: User Story 8 - Public Visitors Can View Updated Event Content (Priority: P2)

**Goal**: Ensure only published events appear on public surfaces and that organizer-edited published events disappear until re-approved.

**Independent Test**: A pending or rejected event is hidden from anonymous visitors, a published event is discoverable publicly, and an edited published event disappears until admin re-approval.

### Tests for User Story 8

- [ ] T069 [P] [US8] Add public-event contract coverage in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/public/events/route.test.ts
- [ ] T070 [P] [US8] Add public visibility integration and regression coverage in app/(pages)/events/page.test.tsx and app/components/EventDetails/EventDetails.test.tsx
- [ ] T071 [P] [US8] Add publication-visibility E2E and accessibility coverage in e2e/public/published-events.spec.ts and e2e/public/published-events.a11y.spec.ts

### Implementation for User Story 8

- [ ] T072 [P] [US8] Implement public event list and detail route handlers in app/api/v1/public/events/route.ts and app/api/v1/public/events/[eventId]/route.ts
- [ ] T073 [P] [US8] Update public event discovery services for published-only visibility in app/lib/event-service.ts and app/lib/search-service.ts
- [ ] T074 [US8] Wire publication-aware visibility into public list, detail, modal, and homepage surfaces in app/(pages)/events/page.tsx, app/components/EventDetails/EventDetails.tsx, app/@modal/(.)events/[id]/page.tsx, and app/components/FeaturedEvents/FeaturedEvents.tsx

**Checkpoint**: User Story 8 is independently functional and testable.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation, performance evidence, and cross-story gate compliance.

- [ ] T075 [P] Update implementation and runtime documentation in README.md and DEVELOPER_GUIDE.md
- [ ] T076 [P] Add performance evidence scenarios for homepage, organizer dashboard, admin moderation, organizer submission acknowledgement, upload-feedback latency, and public search/filter responsiveness in e2e/performance/homepage.performance.spec.ts, e2e/performance/dashboard.performance.spec.ts, e2e/performance/admin.performance.spec.ts, and e2e/performance/event-workflows.performance.spec.ts
- [ ] T077 [P] Finalize contract sync and validation wiring in package.json and scripts/quality-gates/validate-contracts.sh so contracts/openapi.yaml is validated from specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml
- [ ] T078 [P] Finalize container security and CI gate integration in .github/workflows/quality-gates.yml and sonar-project.properties
- [ ] T079 Validate quickstart and full gate execution guidance in specs/001-pluginbim-public-and-organizer-rework/quickstart.md and scripts/quality-gates/ci.sh
- [ ] T080 [P] Record manual keyboard and focus verification evidence for changed public, organizer, and admin flows in specs/001-pluginbim-public-and-organizer-rework/quickstart.md and QUALITY_GATES.md
- [ ] T081 [P] Update scripts/quality-gates/validate-accessibility.sh and README.md so automated accessibility checks reference required manual verification notes for changed flows
- [ ] T087 [P] Record measured performance results against spec budgets in specs/001-pluginbim-public-and-organizer-rework/quickstart.md and IMPLEMENTATION_PROGRESS.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies; start immediately.
- **Phase 2: Foundational**: Depends on Setup and blocks all user stories.
- **Phase 3: User Story 1**: Depends on Foundational.
- **Phase 4: User Story 2**: Depends on Foundational.
- **Phase 5: User Story 3**: Depends on Foundational.
- **Phase 6: User Story 5**: Depends on Foundational and should not complete before User Story 3.
- **Phase 7: User Story 7**: Depends on Foundational and should not complete before User Stories 3 and 5.
- **Phase 8: User Story 6**: Depends on Foundational and should not complete before User Stories 5 and 7.
- **Phase 9: User Story 4**: Depends on Foundational and should not complete before User Stories 3 and 5.
- **Phase 10: User Story 8**: Depends on Foundational and should not complete before User Stories 4, 5, and 6.
- **Phase 11: Polish**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1**: No dependencies beyond Foundational.
- **US2**: No dependencies beyond Foundational.
- **US3**: No dependencies beyond Foundational.
- **US5**: Depends on US3 for protected organizer access.
- **US7**: Depends on US3 for protected routing and US5 for meaningful organizer event data.
- **US6**: Depends on US5 for existing event records and US7 for dashboard-driven navigation.
- **US4**: Depends on US3 for admin access and US5 for events to moderate.
- **US8**: Depends on US4 and US5, and uses US6 to validate edited-published visibility rules.

### Within Each User Story

- Contract, unit, integration, E2E, regression, and accessibility tasks required by the gates come before implementation.
- Schema and migration changes come before service-layer work that depends on them.
- Service-layer work comes before route handlers and page wiring.
- Page wiring and UI integration come before cross-story polish.

## Parallel Opportunities

### Setup

- T003, T004, and T005 can run in parallel after T001 and T002 start the repository-level setup.

### Foundational

- T007 through T012 and T082 can run in parallel once Setup is complete.
- T013 and T014 must stay sequential.
- T015, T016, and T083 can run in parallel with T013/T014 once foundational file layout exists.

### User Story 1

- T017, T018, and T019 can run in parallel.
- T020, T021, T022, and T023 can run in parallel once test scaffolding exists.

### User Story 2

- T025 and T026 can run in parallel.
- T027 and T028 can run in parallel before T029 links the route into shared navigation.

### User Story 3

- T030, T031, T032, T033, and T084 can run in parallel.
- T034, T035, and T036 can run in parallel before T037 completes the login UX.

### User Story 5

- T039, T040, T041, T042, and T085 can run in parallel.
- T043 and T044 must stay sequential.
- T045, T046, and T047 can run in parallel before T048 completes page and route wiring.

### User Story 7

- T049, T050, T051, and T088 can run in parallel.
- T052, T053, and T089 can run in parallel before T054 completes dashboard route wiring.

### User Story 6

- T055, T056, and T057 can run in parallel.
- T058 and T059 can run in parallel before T060 completes endpoint wiring.

### User Story 4

- T061, T062, T063, T064, and T086 can run in parallel.
- T065 and T066 must stay sequential if the migration changes schema.
- T067 and T068 can run in parallel once the moderation services are available.

### User Story 8

- T069, T070, and T071 can run in parallel.
- T072 and T073 can run in parallel before T074 wires the public surfaces.

### Polish

- T075, T076, T077, T078, T080, and T081 can run in parallel.
- T079 and T087 run after the cross-cutting updates land.

## Parallel Example: User Story 5

```text
Task: T039 [US5] Add organizer create/upload contract coverage in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/organizer/events/route.test.ts
Task: T040 [US5] Add event validation unit coverage in app/lib/validation/event.test.ts and app/lib/storage/poster-storage.test.ts
Task: T041 [US5] Add create-event integration coverage in app/api/v1/organizer/events/create.integration.test.ts and app/api/v1/uploads/posters/route.test.ts
Task: T042 [US5] Add organizer submission E2E and accessibility coverage in e2e/organizer/create-event.spec.ts and e2e/organizer/create-event.a11y.spec.ts
```

## Parallel Example: User Story 4

```text
Task: T061 [US4] Add admin moderation contract coverage in specs/001-pluginbim-public-and-organizer-rework/contracts/openapi-v1.yaml, contracts/openapi.yaml, and app/api/v1/admin/events/[eventId]/moderation/route.test.ts
Task: T062 [US4] Add admin moderation integration coverage in app/api/v1/admin/events/route.test.ts and app/lib/admin/moderate-event.test.ts
Task: T063 [US4] Add admin moderation E2E and accessibility coverage in e2e/admin/moderation.spec.ts and e2e/admin/moderation.a11y.spec.ts
Task: T064 [US4] Add authorization regression coverage for organizer denial paths in app/middleware.admin.test.ts
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1, US2, and US3 to establish public entry points and secure access.
3. Complete US5 to unlock the first end-to-end organizer submission flow.
4. Validate gates and demo the first protected organizer milestone.

### Incremental Delivery

1. Add US7 after US5 so organizers can manage submitted events.
2. Add US6 so organizers can edit owned records and exercise re-approval logic.
3. Add US4 so admins can moderate and publish organizer content.
4. Add US8 to complete public published-event propagation.
5. Finish with Polish to satisfy cross-cutting evidence and operational readiness.

### Team Strategy

1. One developer can own Setup plus Foundational automation and runtime work.
2. Public experience work can proceed on US1 and US2 once Foundational is done.
3. Protected workflow work can split between US3/US5/US7 and US4/US8 once dependencies are available.

## Notes

- Every task follows the required checklist format.
- `[P]` marks tasks that can execute in parallel without incomplete-task dependencies.
- Story labels appear only on user-story phases.
- Tests and evidence tasks are included wherever constitution gates make them mandatory.