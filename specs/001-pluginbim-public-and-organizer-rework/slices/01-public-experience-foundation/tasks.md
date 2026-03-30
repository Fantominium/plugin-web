# Tasks: Public Experience Foundation

**Input**: Design documents from `/specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/public-routes.md

**Tests**: Tests are required for this slice. Unit coverage is required for shared public content and route helper logic, component and integration coverage is required for changed public routes and discovery wiring, and manual accessibility, contrast, responsive, stakeholder-review, and performance evidence is required for changed public interactions and surfaces. Automated `P3 End-to-End` and `P5 Accessibility` tooling remains an explicit dependency on slice 07.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup

**Purpose**: Establish slice-local implementation and evidence files shared across all story work.

- [ ] T001 Create slice implementation evidence log in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/analysis.md
- [ ] T002 [P] Create shared public UI types in app/types/public-content.ts
- [ ] T003 [P] Create shared public content dataset, including approved contact profile content, homepage empty-state content, and optional social-link fallback rules, in app/lib/public-content.ts

---

## Phase 2: Foundational

**Purpose**: Add shared route, typed configuration, and shell primitives that all public story work depends on.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T004 [P] Add unit tests for typed public content fallback behavior in app/lib/public-content.test.ts
- [ ] T005 [P] Add unit tests for public route constants and validation helpers in app/lib/public-routes.test.ts
- [ ] T006 Create public route constants and validation helpers in app/lib/public-routes.ts
- [ ] T007 [P] Update shared public shell landmarks and metadata wiring in app/layout.tsx
- [ ] T008 [P] Create manual accessibility, contrast, responsive, regression, semantic-landmark, heading-order, accessible-name, and announcement-verification checklist in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/checklists/validation.md

**Checkpoint**: Shared public shell, route helpers, typed content tests, and validation artifacts are ready.

---

## Phase 3: User Story 1 - Browse the Main Public Experience (Priority: P1) 🎯 MVP

**Goal**: Deliver a coherent, production-ready homepage that communicates the product story and routes visitors into event discovery without dead ends.

**Independent Test**: A first-time visitor can load the homepage, understand the product purpose, and use homepage discovery actions to reach valid public event destinations.

### Tests for User Story 1

- [ ] T009 [P] [US1] Add homepage composition regression tests in app/page.test.tsx
- [ ] T010 [P] [US1] Add featured discovery and empty-state integration tests in app/components/FeaturedEvents/FeaturedEvents.test.tsx

### Implementation for User Story 1

- [ ] T011 [P] [US1] Refactor homepage hero content and CTA behavior in app/components/Hero/Hero.tsx
- [ ] T012 [P] [US1] Update app promotion supporting content in app/components/AppPromotion/AppPromotion.tsx
- [ ] T013 [P] [US1] Update categories discovery section in app/components/Categories/Categories.tsx
- [ ] T014 [P] [US1] Update featured event summaries, empty-state messaging, and fallback CTA behavior in app/components/FeaturedEvents/FeaturedEvents.tsx
- [ ] T015 [US1] Recompose homepage sections and discovery entry points in app/page.tsx

**Checkpoint**: The homepage is independently functional, understandable, and routes visitors into valid discovery paths.

---

## Phase 4: User Story 2 - Reach the Contact Us Experience (Priority: P1)

**Goal**: Deliver a dedicated Contact Us page with complete business contact details and approved social links reachable from the public shell.

**Independent Test**: A visitor can navigate to Contact Us from the public shell and find readable contact details plus approved social destinations.

### Tests for User Story 2

- [ ] T016 [P] [US2] Add Contact Us page rendering tests for full, partial, and no-social-link states in app/(pages)/contact-us/page.test.tsx
- [ ] T017 [P] [US2] Add footer contact and social link tests, including the hidden-social-links state, in app/components/Footer/Footer.test.tsx

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create contact presentation component with optional social-link rendering in app/components/ContactUs/ContactUs.tsx
- [ ] T019 [US2] Add Contact Us route in app/(pages)/contact-us/page.tsx
- [ ] T020 [US2] Replace footer placeholder with contact and social navigation in app/components/Footer/Footer.tsx

**Checkpoint**: Contact Us is independently reachable, complete, and accessible.

---

## Phase 5: User Story 3 - Move Through Public Navigation Without Dead Ends (Priority: P2)

**Goal**: Ensure changed public navigation targets resolve correctly, preserve keyboard usability, and do not regress the existing public discovery shell.

**Independent Test**: Starting from the header, footer, or homepage, a visitor can navigate among changed public routes and discovery entry points without dead ends or focus-loss defects.

### Tests for User Story 3

- [ ] T021 [P] [US3] Extend header navigation regression tests in app/components/Header/Header.test.tsx
- [ ] T022 [P] [US3] Add shell-level navigation integration tests covering homepage, header, and footer journeys to Contact Us and Events in app/layout.test.tsx
- [ ] T023 [P] [US3] Add intercepted event modal/detail regression tests in app/@modal/(.)events/[id]/page.test.tsx
- [ ] T024 [P] [US3] Add public events route and homepage fallback-entry regression tests in app/(pages)/events/page.test.tsx

### Implementation for User Story 3

- [ ] T025 [P] [US3] Update header navigation and mobile menu destinations in app/components/Header/Header.tsx
- [ ] T026 [P] [US3] Implement placeholder-free public events route content in app/(pages)/events/page.tsx
- [ ] T027 [US3] Align intercepted event modal route behavior with updated public navigation in app/@modal/(.)events/[id]/page.tsx
- [ ] T028 [US3] Record keyboard, focus, semantic-structure, accessible-name, contrast, and announcement verification evidence in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/analysis.md
- [ ] T029 [US3] Sync route contract examples with implemented navigation in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/contracts/public-routes.md

**Checkpoint**: Public navigation is valid, shell-integrated, keyboard-verifiable, regression-safe across changed routes, and preserves the modal/detail discovery path.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final evidence capture and cross-story cleanup.

- [ ] T030 [P] Update slice validation and implementation notes in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/quickstart.md
- [ ] T031 [P] Capture final regression, accessibility, contrast, responsive viewport, semantic-structure review, accessible-name review, announcement verification, and stakeholder sign-off in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/analysis.md
- [ ] T032 [P] Record homepage and Contact Us performance evidence against the 2.5-second heading-and-first-action budget in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/analysis.md
- [ ] T033 Validate delivered scope against the readiness checklist in specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 has no dependencies and can start immediately.
- Phase 2 depends on Phase 1 and blocks all user story implementation.
- Phases 3, 4, and 5 depend on Phase 2.
- Phase 6 depends on the completion of the desired user stories.
- Automated `P3 End-to-End` and `P5 Accessibility` enforcement depend on slice 07; do not mark those gates fully automated for this slice until that dependency is complete.

### User Story Dependencies

- **US1** can start after Phase 2 and is the MVP for slice 01.
- **US2** can start after Phase 2 and is independently testable once footer and route changes are complete.
- **US3** can start after Phase 2, but it should be finalized after the US1 and US2 navigation destinations exist.

### Within Each User Story

- Write the listed tests or validation tasks before implementation and ensure the behavioral gap is represented.
- Shared types and configuration should be consumed before route or component composition changes.
- Route and shell updates should land before final validation evidence is recorded.

### Parallel Opportunities

- `T002` and `T003` can run in parallel.
- `T004` and `T005` can run in parallel, and `T007` and `T008` can run in parallel after `T006` starts or completes as needed.
- In US1, `T009` and `T010` can run in parallel, and `T011` through `T014` can run in parallel before `T015`.
- In US2, `T016` and `T017` can run in parallel, and `T018` can run in parallel with test work before `T019` and `T020`.
- In US3, `T021` through `T024` can run in parallel, and `T025` and `T026` can run in parallel before `T027` and `T029`.

---

## Parallel Example: User Story 1

```text
Task: T009 [US1] Add homepage composition regression tests in app/page.test.tsx
Task: T010 [US1] Add featured discovery and empty-state integration tests in app/components/FeaturedEvents/FeaturedEvents.test.tsx
Task: T011 [US1] Refactor homepage hero content and CTA behavior in app/components/Hero/Hero.tsx
Task: T012 [US1] Update app promotion supporting content in app/components/AppPromotion/AppPromotion.tsx
Task: T013 [US1] Update categories discovery section in app/components/Categories/Categories.tsx
Task: T014 [US1] Update featured event summaries, empty-state messaging, and fallback CTA behavior in app/components/FeaturedEvents/FeaturedEvents.tsx
```

## Parallel Example: User Story 2

```text
Task: T016 [US2] Add Contact Us page rendering tests for full, partial, and no-social-link states in app/(pages)/contact-us/page.test.tsx
Task: T017 [US2] Add footer contact and social link tests, including the hidden-social-links state, in app/components/Footer/Footer.test.tsx
Task: T018 [US2] Create contact presentation component with optional social-link rendering in app/components/ContactUs/ContactUs.tsx
```

## Parallel Example: User Story 3

```text
Task: T021 [US3] Extend header navigation regression tests in app/components/Header/Header.test.tsx
Task: T022 [US3] Add shell-level navigation integration tests covering homepage, header, and footer journeys to Contact Us and Events in app/layout.test.tsx
Task: T023 [US3] Add intercepted event modal/detail regression tests in app/@modal/(.)events/[id]/page.test.tsx
Task: T024 [US3] Add public events route and homepage fallback-entry regression tests in app/(pages)/events/page.test.tsx
Task: T025 [US3] Update header navigation and mobile menu destinations in app/components/Header/Header.tsx
Task: T026 [US3] Implement placeholder-free public events route content in app/(pages)/events/page.tsx
```

---

## Implementation Strategy

### MVP First

1. Complete Phases 1 and 2.
2. Complete Phase 3 for US1.
3. Validate homepage understanding and discovery routing independently.
4. Demo or ship the MVP increment if desired.

### Incremental Delivery

1. Foundation first: Phases 1 and 2.
2. Add US1 and validate it independently.
3. Add US2 and validate Contact Us independently.
4. Add US3 and validate route integrity plus manual accessibility evidence.
5. Finish Phase 6 to consolidate evidence and checklist closure.

### Parallel Team Strategy

1. One developer completes Phase 1 and Phase 2.
2. After foundation is ready:
   - Developer A implements US1.
   - Developer B implements US2.
   - Developer C prepares US3 regression and navigation updates.
3. Rejoin for final polish and evidence capture.

---

## Notes

- All task lines follow the required checklist format.
- Only user story tasks carry `[US1]`, `[US2]`, or `[US3]` labels.
- Exact file paths are included in every task.
- Slice 07 remains the explicit dependency for automated `P3` and `P5` tooling evidence.
