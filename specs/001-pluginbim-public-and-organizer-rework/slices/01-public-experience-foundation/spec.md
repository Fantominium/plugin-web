# Slice Specification: Public Experience Foundation

**Parent Feature**: [spec.md](../../spec.md)  
**Slice ID**: `01-public-experience-foundation`  
**Feature Branch**: `001-pluginbim-public-and-organizer-rework`  
**Created**: 2026-03-30  
**Status**: Draft  
**Input**: Slice objective: "Deliver the public-facing homepage, Contact Us page, route validity, and baseline public information architecture so visitors can understand the product and navigate without dead ends."

## Objective

Deliver the public-facing homepage, Contact Us page, route validity, and baseline public information architecture so visitors can understand the product and navigate without dead ends.

## Clarifications

### Session 2026-03-30

- Q: Where should approved Contact Us details and social links come from for this slice? → A: Store approved Contact Us details and social links in versioned typed config within the repo.
- Q: What should Contact Us do when no approved social links exist? → A: Hide the social-links section when no approved links exist.
- Q: What should the homepage do when featured event content is empty or unavailable? → A: Show the section with an empty-state message and a valid fallback action.
- Q: What fallback action should the homepage use when featured event content is empty or unavailable? → A: Use a fallback CTA that links to the main Events page.

## Slice Boundaries

Included:

- PluginBIM-inspired main page
- Contact Us page with business contact details and approved social links
- Valid public navigation on changed surfaces
- Public accessibility baseline for layout, semantics, names, focus, and announcements
- Public event-discovery entry points that continue to work from changed homepage and navigation surfaces

Excluded:

- Authentication and role assignment
- Organizer upload and update workflows
- Organizer dashboard and admin panel behavior
- Published event propagation from admin moderation
- Contract, migration, or container-runtime enablement that belongs to cross-cutting slices unless directly required to keep public routes working

## Parent Traceability

User stories:

- User Story 1 - Browse the Main Public Experience
- User Story 2 - Reach the Contact Us Experience

Functional requirements:

- `FR-001` through `FR-004`
- `FR-028`
- `FR-030`
- `FR-031`
- `FR-031A`
- `FR-031B`
- `FR-032`
- `FR-033`
- `FR-038`

Success criteria:

- `SC-001`
- `SC-002`
- `SC-005`
- `SC-006`
- `SC-010`

## Assumptions

- Existing event-discovery foundations, typed event models, and modal or listing entry points remain available and are not redesigned by this slice.
- Approved business contact details and approved social destinations are available from stakeholders before implementation is considered complete.
- Approved Contact Us details and social links are maintained in versioned typed configuration within the repository for this slice rather than environment variables or backend fetches.
- Public navigation changes remain within the current application route structure and do not require new authentication or backend contracts.
- Automated end-to-end and dedicated accessibility tooling may depend on slice 07 unless equivalent enablement is intentionally included in this slice plan.

## Independent Verification

A first-time visitor can load the homepage, understand the product, navigate to Contact Us, and move through public discovery entry points without broken navigation.

## Functional Completion Criteria

This slice is functionally complete when:

- the homepage presents a coherent public product story instead of placeholder sections
- Contact Us is complete, readable, and accessible
- all changed public navigation targets resolve correctly
- existing public event-discovery entry points still work from the changed surfaces
- public-facing accessibility expectations for the changed surfaces are met

## Required Quality Gates

Always applicable:

- `C1 Clean Scope`
- `C2 Formatting and Lint`
- `C3 Type Safety`
- `C4 Unit Tests` when slice logic introduces route helpers, fallback-state behavior, or shared public content selection
- `C5 Secret and Dependency Safety`
- `P1 Reproducible Build`
- `P6 SonarQube`

Slice-specific:

- `P2 Integration` when homepage sections are wired to data or route boundaries
- `P3 End-to-End`
- `P4 Regression` for replaced public navigation or existing event-discovery behavior
- `P5 Accessibility`

## Expected Slice Artifacts

- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis.md` when design rationale or review notes are needed
- `checklists/` when reviewer checklists are required

## Dependencies

Hard dependencies:

- None for slice specification or design completion

Recommended dependencies:

- Slice 07 before claiming CI-complete automated `P3 End-to-End` and `P5 Accessibility` evidence, unless equivalent tooling enablement is explicitly delivered within this slice

Recommended parallelism:

- Can proceed in parallel with slice 02 if no protected workflow dependencies are introduced

## Constitution Gate Classification *(mandatory)*

| Area | In Scope? | Notes |
| ----- | --------- | ----- |
| User-facing UI / Accessibility | Yes | Homepage, Contact Us, global public navigation, route transitions, semantic structure, keyboard behavior, focus visibility, accessible names, and announcement behavior on changed public surfaces |
| Business Logic | Yes | Public navigation integrity, homepage section composition, public content fallback behavior, and preservation of typed event-discovery entry points |
| API Contract | No | This slice must consume existing public data interfaces only and does not introduce or change external request or response contracts |
| Authentication / Authorization | No | No protected actions, role changes, or auth-gated routes are introduced by this slice |
| Database / Migrations | No | No new persistence model, schema change, or migration path is required for homepage, Contact Us, or route-validity work |
| Caching | No | No new cache behavior, invalidation rule, or freshness policy is required for the slice scope |
| Container / Deployment | No | Runtime, image, and container orchestration work belongs to slice 08 unless needed elsewhere |
| Network Security | No | The slice does not add new public trust-boundary endpoints, cross-origin flows, or privileged network interactions |
| Performance Sensitivity | Yes | Homepage load, public navigation responsiveness, and typed event-entry rendering must remain fast enough to preserve first-visit usability |

## Required Validation Evidence *(mandatory)*

- **Unit Tests**: Required for any new navigation configuration helpers, route-validity utilities, public content-selection logic, fallback-state helpers, or announcement logic introduced by the slice; `N/A` only if the final change remains purely static rendering with no conditional logic.
- **Integration Tests**: Required for homepage section wiring to typed event data, route-to-section behavior, footer or header navigation updates, and Contact Us content rendering when sourced through shared configuration.
- **End-to-End Tests**: Required for the visitor journeys from homepage to event discovery and from homepage to Contact Us; if automated E2E tooling is still unavailable, the slice plan must explicitly depend on slice 07 or include equivalent tooling before CI-complete evidence can be claimed.
- **Regression Tests**: Required for replaced public navigation behavior, existing event-discovery entry points, modal or detail entry paths touched by the homepage, and any route previously available from the public shell.
- **Accessibility Validation**: Required for homepage and Contact Us with automated scan evidence once tooling exists, plus manual keyboard, focus, semantic landmark, heading order, accessible-name, contrast, and announcement verification for all changed public interactions.
- **Performance Validation**: Required because the slice declares performance sensitivity and a timed success criterion. Planning and implementation evidence MUST record how homepage and Contact Us are measured against the 2.5-second budget for primary heading visibility plus first actionable navigation visibility under representative mid-tier mobile and standard broadband conditions.
- **Security Validation**: `N/A`: the slice does not add protected actions, new trust-boundary endpoints, or authorization rules beyond standard clean-scope and secret-safety gates already enforced repository-wide.
- **Contract Validation**: `N/A`: the slice does not introduce or change API contracts, payload schemas, or versioned interface artifacts.
- **Migration Validation**: `N/A`: the slice does not introduce schema, durable storage, or migration changes.

## Automation and Gate Mapping *(mandatory)*

- **C1 Clean Scope**: Repository pre-commit and pre-push gates must verify no unrelated artifacts, focused tests, debug bypasses, or accidental route files are included.
- **C2 Formatting and Lint**: `yarn lint` and the repository Biome check must pass for changed public-route and component files.
- **C3 Type Safety**: `yarn typecheck` must pass with zero type errors after homepage, Contact Us, and navigation changes.
- **C4 Unit Tests**: `yarn test:ci` must include relevant Jest coverage for new or changed route helpers, fallback-state behavior, shared public content configuration, and other slice logic introduced outside static rendering.
- **C5 Secret and Dependency Safety**: Repository secret and dependency checks remain required even though the slice is public-facing only.
- **P1 Reproducible Build**: `yarn build` must succeed from a clean install so public-route changes prove production build safety.
- **P2 Integration**: `yarn test:ci` must cover any homepage-to-data wiring, shared navigation configuration, or route-boundary behavior changed by the slice.
- **P3 End-to-End**: `yarn gates:e2e` must validate the critical visitor journeys once automated E2E tooling is available; until then, slice planning must capture the dependency on slice 07 or equivalent enablement work.
- **P4 Regression**: `yarn test:ci` must include regression assertions showing that existing event-discovery entry points and changed public navigation still resolve correctly after the homepage rework.
- **P5 Accessibility**: `yarn gates:a11y` plus recorded manual keyboard and focus verification are required for changed public surfaces once dedicated automation is enabled.
- **P6 SonarQube**: The repository SonarQube quality gate must pass with no blocker or critical issues on new code.

## Specification Gate Status *(mandatory)*

| Gate | Status | Evidence |
| ----- | ------ | -------- |
| S1 Change Classification | PASS | The slice explicitly classifies UI, business logic, performance, and out-of-scope areas with concrete notes. |
| S2 Test Strategy | PASS | Validation evidence defines unit, integration, end-to-end, regression, and accessibility coverage expectations, plus explicit `N/A` reasons where gates do not apply. |
| S3 Accessibility Scope | PASS | Accessibility expectations cover keyboard use, focus, semantics, names, contrast, and announcements for changed public interactions. |
| S4 Security Scope | PASS | Security-sensitive areas are explicitly marked out of scope with a reason, avoiding hidden trust-boundary assumptions. |
| S5 Data and Migration Scope | PASS | Database and migration work are explicitly out of scope with a reason, preventing silent schema creep in this slice. |
| S6 API Contract Scope | PASS | The slice declares that it consumes existing interfaces only and makes no contract changes. |
| S7 Performance and Caching Scope | PASS | Performance-sensitive behavior is declared in scope, caching is explicitly excluded, and required validation evidence now includes the measurement method and budget. |
| S8 Automation Mapping | PASS | Required repo gates and scripts are mapped to the slice evidence path, including the unit-test gate, regression enforcement through Jest coverage, and the current dependency on slice 07 for automated E2E and accessibility enforcement. |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Main Public Experience (Priority: P1)

A first-time visitor lands on the homepage, understands what the product offers, sees complete public sections, and can move into event discovery without encountering placeholder content or dead ends.

**Why this priority**: The homepage is the primary public entry point and the highest-value surface for first impressions, discovery, and trust.

**Independent Test**: A visitor who has never used the site can open the homepage, identify the product purpose, locate a next public action, and reach a valid discovery destination without help.

**Acceptance Scenarios**:

1. **Given** a first-time visitor opens the site, **When** the homepage loads, **Then** the page presents a clear public product story with complete sections rather than placeholder content.
2. **Given** the visitor scans the homepage, **When** they use the primary discovery or event entry actions, **Then** each changed action resolves to a valid public destination.
3. **Given** featured public event content is unavailable or empty, **When** the visitor reaches the relevant homepage section, **Then** the page presents a clear empty-state message with a fallback action that links to the main Events page without breaking the surrounding layout or navigation.

---

### User Story 2 - Reach the Contact Us Experience (Priority: P1)

A visitor can reach a dedicated Contact Us page from public navigation and find complete contact details and approved social destinations without confusion.

**Why this priority**: Contact Us is a direct stakeholder requirement and a core trust-building public surface.

**Independent Test**: A visitor can navigate from the public shell to Contact Us, read the contact details, and use the approved outbound links without encountering missing content.

**Acceptance Scenarios**:

1. **Given** a visitor wants to contact the business, **When** they choose Contact Us from changed public navigation, **Then** they land on a dedicated Contact Us page rather than a placeholder or dead route.
2. **Given** the visitor is on Contact Us, **When** they review the page, **Then** they can find the current business contact details in a readable and accessible format.
3. **Given** approved social links are present, **When** the visitor activates one, **Then** the destination opens correctly and the link purpose is clear before activation.
4. **Given** no approved social links exist, **When** the visitor opens Contact Us, **Then** the page still shows the business contact details and omits the social-links section entirely.

---

### User Story 3 - Move Through Public Navigation Without Dead Ends (Priority: P2)

A visitor can move among the changed public routes and discovery entry points without broken links, inaccessible route transitions, or routes that terminate in incomplete screens.

**Why this priority**: Route validity is part of the slice objective and protects existing public discovery value during the homepage rework.

**Independent Test**: Starting from the public shell, a visitor can traverse each changed navigation target and return to another public destination without hitting a dead end.

**Acceptance Scenarios**:

1. **Given** a visitor uses header, footer, or homepage navigation changed by this slice, **When** they activate any target, **Then** the system resolves the route successfully.
2. **Given** a changed public route includes interactive controls or route transitions, **When** the visitor navigates using only the keyboard, **Then** focus remains visible and lands in a predictable location.
3. **Given** an existing public event-discovery path is reachable from the changed shell, **When** the visitor uses it after the rework, **Then** the path still works and no existing discovery behavior regresses.

### Edge Cases

- What happens when homepage event content is empty, delayed, or temporarily unavailable?
- What happens when a navigation item points to a route that was renamed or removed during the rework?
- What happens when Contact Us has fewer approved social links than expected or none at all?
- What happens when a visitor opens changed public routes on a narrow mobile viewport or with zoom applied?
- What happens when a visitor navigates between changed routes using only the keyboard or a screen reader?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a reworked main page that communicates the product purpose and reflects the approved PluginBIM-inspired public experience.
- **FR-002**: The main page MUST include complete production-ready public sections that support discovery, trust, and next-step actions rather than placeholders.
- **FR-003**: The system MUST provide a dedicated Contact Us page reachable from changed public navigation.
- **FR-004**: The Contact Us page MUST display current business contact details and, when approved social links exist, those approved social links.
- **FR-004B**: Approved Contact Us details and social links for this slice MUST be sourced from versioned typed configuration within the repository.
- **FR-004A**: If approved social links are unavailable, the Contact Us page MUST continue to display business contact details without reducing the completeness or readability of the contact information.
- **FR-004C**: If no approved social links exist, the Contact Us page MUST hide the social-links section entirely rather than rendering empty, disabled, or placeholder social content.
- **FR-028**: Public event-discovery entry points presented on changed homepage surfaces MUST use the application's typed public event foundation rather than hardcoded dead-end fragments.
- **FR-028A**: If homepage event content is empty or unavailable, the affected homepage section MUST remain visible with a clear empty-state message and a fallback action that links to the main Events page.
- **FR-030**: Changed public routes MUST remain readable and usable on mobile and desktop viewports.
- **FR-031**: The changed public experience MUST satisfy WCAG 2.2 AA expectations for navigation, content structure, and interactions within the slice scope.
- **FR-031A**: Changed public pages MUST use semantic landmarks, heading structure, labels where applicable, and accessible names for interactive elements.
- **FR-031B**: Changed public interactions MUST provide visible focus states and sufficient contrast. Where this slice introduces client-side status changes, those changes MUST be announced to assistive technologies.
- **FR-032**: All changed public navigation targets MUST resolve to implemented routes with no dead ends.
- **FR-033**: The slice MUST preserve or improve the existing public event-discovery foundation already present in the application.
- **FR-038**: Public homepage and Contact Us content MUST remain maintainable through clearly structured content sections or configuration rather than requiring a full architectural rewrite for routine updates.

### Key Entities

- **HomepageSection**: Represents a public-facing content block on the homepage, including its purpose, destination action, and expected empty-state message plus fallback behavior, including a fallback CTA to the main Events page when featured event content is unavailable.
- **PublicNavigationItem**: Represents a visitor-visible navigation target in the header, footer, or homepage CTA surfaces.
- **PublicContactProfile**: Represents the approved business contact details and approved social destinations shown on Contact Us, sourced from versioned typed configuration in the repository for this slice, including the rule that the social-links section is omitted when no approved links exist.
- **PublicEventSummary**: Represents the typed public event information surfaced through homepage discovery entry points.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pre-release stakeholder review confirms that the homepage communicates the product purpose and presents at least one clear next public action without placeholder content.
- **SC-002**: Regression validation confirms that 100% of changed public navigation targets resolve successfully to a valid destination.
- **SC-003**: Manual accessibility verification confirms 100% completion of the homepage-to-event-discovery and homepage-to-Contact-Us journeys using keyboard-only navigation on changed surfaces.
- **SC-004**: Changed homepage and Contact Us surfaces remain usable at both 360-pixel-wide mobile and 1280-pixel-wide desktop viewports without unintended horizontal scrolling.
- **SC-005**: Changed public pages display their primary heading and first actionable navigation element within 2.5 seconds under representative mid-tier mobile and standard broadband test conditions.
- **SC-006**: Stakeholder review confirms that the reworked homepage captures the structure and feel of the pluginbim.com experience for the public-facing surfaces delivered in this slice.
