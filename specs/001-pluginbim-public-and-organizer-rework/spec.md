# Feature Specification: PluginBIM-Inspired Public Experience and Role-Based Event Management Rework

**Feature Branch**: `001-pluginbim-public-and-organizer-rework`  
**Created**: 2026-03-23  
**Status**: Draft  
**Input**: User description: "Rework the existing Plugin Web application so the public-facing experience replicates, where appropriate, the functionality and overall feel of https://pluginbim.com/, while also adding a Contact Us page, secure MVP login limited to Google and email magic link with later expansion capability, an authenticated organizer dashboard, an event upload page, an event update page for organizers to manage events associated with their profile, and an admin panel with full management capabilities for admin users and restricted capabilities for event owner/uploader users."

## Constitution Gate Classification *(mandatory)*

| Area | In Scope? | Notes |
|------|-----------|-------|
| User-facing UI / Accessibility | Yes | Main page, events discovery, contact page, login flow, organizer dashboard, admin panel, upload page, update page, moderation views, event detail flows, responsive states, pricing inputs, status indicators, and form UX |
| Business Logic | Yes | Event ownership, create/update validation, submission workflow, admin moderation workflow, role-based management, upload processing, dashboard filtering, form handling, pricing capture, and email notification workflow |
| API Contract | Yes | Public event retrieval, organizer-authenticated event create/update endpoints, admin-management endpoints, profile-scoped dashboard endpoints, moderation status endpoints, and file upload contract |
| Authentication / Authorization | Yes | Secure MVP login via Google and email magic link, role assignment, admin and organizer session management, route protection, and ownership enforcement for restricted users |
| Database / Migrations | Yes | User roles, organizer profiles, admin-capable user records, events, event ownership, uploaded assets metadata, location catalog, moderation state, and notification audit metadata if persisted |
| Caching | No | Not required for first-pass MVP unless public event caching is added later |
| Container / Deployment | No | No deployment architecture change required in this feature scope |
| Network Security | Yes | OAuth/OIDC flow, magic-link login, file upload validation, CORS policy, CSRF/session handling, session expiry handling, upload abuse controls, timeout handling, and email delivery boundaries |
| Performance Sensitivity | Yes | Homepage loading, event browsing responsiveness, dashboard responsiveness, upload handling, image optimization |

## Required Validation Evidence *(mandatory)*

- **Unit Tests**: Validation and transformation logic for organizer event payloads, date/time rules, pricing rules, location selection, auth state helpers, role checks, ownership checks, submission-status transitions, admin moderation actions, and magic-link token handling.
- **Integration Tests**: Public homepage section rendering with data, Contact Us information rendering, organizer login/session flow, admin login/session flow, organizer dashboard event listing, admin panel event management, create-event submission, update-event submission, file upload integration, pending-approval state handling, owner-scoped authorization checks, admin override handling, privilege-escalation deny-path handling, and email delivery trigger behavior.
- **End-to-End Tests**: Visitor lands on main page and browses events; visitor reaches Contact Us page; organizer signs in with Google or email magic link; organizer opens dashboard; organizer creates an event; organizer edits their own event; admin signs in and opens the admin panel; admin reviews and publishes an event; unauthorized user cannot edit another organizer's event; expired sessions are redirected safely; and non-public events remain hidden from anonymous visitors.
- **Regression Tests**: Existing event discovery, modal event details, search/filter behaviors, footer/legal navigation, and any bug fixes introduced during route and layout rework.
- **Accessibility Validation**: Automated accessibility scanning on changed routes, manual keyboard verification for navigation, dialog/modal behavior, authenticated forms, upload controls, organizer dashboard workflows, and admin-panel workflows; focus-management checks for login and form errors; semantic-structure verification; accessible-name verification for interactive controls; color-contrast validation; and state-change announcement verification for authentication, submission, validation, and moderation-status updates.
- **Security Validation**: Authn/authz tests for protected pages and event ownership, role-boundary validation between admin and organizer users, explicit allow-path and deny-path coverage, privilege-escalation prevention tests, file upload type/size validation, secure session handling, safe email workflow boundaries, magic-link abuse protections, secret protection, least-privilege enforcement for privileged operations, CORS posture validation, CSRF/session-integrity validation, timeout-behavior validation, and abuse-control validation for externally reachable actions.
- **Contract Validation**: Schema validation for public event payloads, organizer dashboard responses, admin panel responses, create/update request bodies, moderation-status responses, upload metadata, and notification request payloads.
- **Contract Validation Mechanism**: This feature MUST introduce versioned OpenAPI or Swagger contract artifacts and a dedicated repository validation command such as `test:contracts` or `contracts:validate` so `validate-contracts.sh` can produce non-placeholder evidence.
- **Migration Validation**: Disposable database validation for organizer profile, events, ownership relations, location data, moderation state transitions, uniqueness constraints, and rollback-safe schema changes.
- **Performance Validation**: Recorded evidence for homepage render, dashboard readiness, submission acknowledgement, upload-feedback latency, and filtered-search response times using an agreed measurement method and representative test conditions.

## Automation and Gate Mapping *(mandatory)*

- **Clean Scope Gate**: Pre-commit and review enforcement MUST confirm no unrelated artifacts, debug bypasses, focused tests, or unintended file changes are included in the change set.
- **Reproducible Build Gate**: CI or release validation MUST run a clean production build using the repository lockfile and `yarn build` so deployable web changes prove production build reproducibility.
- **Formatting and Lint Gate**: `yarn lint` plus Biome checks required by the repo quality-gate scripts.
- **Type Safety Gate**: `yarn typecheck` MUST pass with zero errors.
- **Unit and Integration Evidence**: `yarn test:ci` MUST cover changed business logic and integration boundaries.
- **Secret and Dependency Safety Gate**: Repository secret scanning and dependency-safety checks required by the repo quality-gate process MUST report no prohibited secret findings or newly introduced disallowed dependency risk.
- **Accessibility Gate**: `scripts/quality-gates/validate-accessibility.sh` plus manual keyboard and focus verification notes for changed flows.
- **Contract Gate**: `scripts/quality-gates/validate-contracts.sh` MUST validate any introduced or updated request/response contracts.
- **Contract Tooling Enablement Requirement**: If this feature introduces or updates API contracts, it MUST also add the OpenAPI/Swagger artifacts and the package-level contract-validation command required for `validate-contracts.sh` to run successfully in CI.
- **Migration Gate**: `scripts/quality-gates/validate-postgres-migrations.sh` MUST validate schema changes against a disposable PostgreSQL instance.
- **End-to-End Gate**: `scripts/quality-gates/validate-e2e.sh` MUST run because the feature changes public journeys, authentication flows, and protected organizer actions.
- **Authorization Gate**: CI evidence MUST include allow-path, deny-path, owner-scope, and privilege-escalation tests for organizer-protected actions.
- **Network Security Gate**: CI and review evidence MUST explicitly cover validation boundaries, timeout handling, CORS policy, CSRF/session integrity, login abuse controls, and upload abuse controls for external-facing actions.
- **CI Gate**: `scripts/quality-gates/ci.sh` MUST remain the aggregate enforcement path for required checks in CI.
- **SonarQube Gate**: SonarQube quality gate MUST pass with repo-defined thresholds for coverage, duplication, reliability, maintainability, and security.
- **Spec Readiness Gate**: `speckit.spec-readiness` MUST be run before planning and before task generation, and `speckit.spec-readiness-checklist` MAY be generated for reviewer use.
- **Tooling Enablement Requirement**: Because the current repository does not yet expose dedicated automated E2E and accessibility test commands, this feature MUST include the tooling and script additions necessary to make `validate-e2e.sh` and `validate-accessibility.sh` produce enforceable evidence rather than `N/A` results.
- **Migration Tooling Enablement Requirement**: If this feature introduces schema changes or persisted workflow tables, it MUST also include the migration automation and disposable PostgreSQL configuration needed for `validate-postgres-migrations.sh` to produce enforceable evidence rather than a placeholder or failing-unconfigured path.

## Specification Gate Status *(mandatory)*

| Gate | Status | Evidence |
|------|--------|----------|
| S1 Change Classification | PASS | All impacted areas are explicitly classified in Constitution Gate Classification with scope notes for UI, business logic, API, authz, database, security, and performance. |
| S2 Test Strategy | PASS | Required Validation Evidence defines unit, integration, end-to-end, regression, accessibility, security, contract, and migration evidence by scope. |
| S3 Accessibility Scope | PASS | Accessibility validation and functional requirements explicitly cover keyboard use, focus order, semantic structure, accessible names, color contrast, validation errors, and state-change announcements. |
| S4 Security Scope | PASS | Security scope explicitly covers authn/authz, role and ownership checks, allow-path and deny-path coverage, least privilege, secret protection, CSRF/session handling, upload validation, and abuse controls. |
| S5 Data and Migration Scope | PASS | Data Integrity and Migration Notes define role constraints, ownership constraints, status invariants, rollback or forward-fix expectations, and migration validation requirements. |
| S6 API Contract Scope | PASS | API Contract Notes define MVP endpoints, role-aware authorization boundaries, structured validation errors, success/error status codes, and versioning guidance. |
| S7 Performance and Caching Scope | PASS | Performance Budgets and Performance Validation together define measurable targets, representative scenarios, and required evidence for performance-sensitive paths, and caching is explicitly out of scope for MVP with rationale. |
| S8 Automation Mapping | PASS | Automation and Gate Mapping ties repo checks and quality-gate scripts to clean scope, reproducible build, lint, type safety, tests, accessibility, end-to-end validation, contracts, migrations, CI, SonarQube, and required tooling enablement, including contract validation tooling. |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Main Public Experience (Priority: P1)

A visitor lands on the site and immediately understands the product, sees a PluginBIM-inspired homepage structure, browses featured event content, and can navigate into event discovery without confusion.

**Why this priority**: The main page is the public entry point and the client explicitly wants parity in feel and functionality where appropriate.

**Independent Test**: A first-time visitor can load the homepage, understand the product value proposition, move through the major homepage sections, and navigate into events or contact content without dead ends.

**Acceptance Scenarios**:

1. **Given** a first-time visitor opens the site, **When** the main page loads, **Then** the page presents a clearly structured, visually rich homepage inspired by the reference site rather than a placeholder marketing surface.
2. **Given** the visitor is on the main page, **When** they scroll through the content, **Then** they encounter complete homepage sections that support discovery, trust, and app promotion in a responsive layout.
3. **Given** the visitor selects an event or discovery CTA from the main page, **When** navigation occurs, **Then** they reach a valid event browsing or detail experience without broken links.

---

### User Story 2 - Reach the Contact Us Experience (Priority: P1)

A visitor can access a Contact Us page that gives the business a credible public contact surface and makes it clear how to reach the team.

**Why this priority**: The client explicitly requested Contact Us, and the reference experience includes trust/contact information as part of the public product surface.

**Independent Test**: A visitor can navigate to Contact Us from the main public experience and view the available contact details and social links without encountering incomplete or placeholder content.

**Acceptance Scenarios**:

1. **Given** a visitor wants to contact the business, **When** they navigate to Contact Us, **Then** the page displays complete and readable contact information.
2. **Given** the visitor is viewing Contact Us, **When** they inspect the page, **Then** they can access the approved social links from that page.
3. **Given** the visitor opens Contact Us on mobile or desktop, **When** the page renders, **Then** the layout remains readable, accessible, and complete.

---

### User Story 3 - Organizer Signs In Securely (Priority: P1)

An organizer can securely sign in using Google or an email magic-link flow, access only protected organizer surfaces, and maintain a stable authenticated session.

**Why this priority**: The requested upload, update, and dashboard flows depend on secure authentication and authorization.

**Independent Test**: An organizer can complete login through the supported provider, be redirected to a dashboard, and access protected pages without exposing those pages to unauthenticated users.

**Acceptance Scenarios**:

1. **Given** an organizer is not signed in, **When** they attempt to access the dashboard or upload page, **Then** they are redirected to a secure login flow.
2. **Given** an organizer selects Google sign-in or email magic-link login, **When** authentication succeeds, **Then** the system creates or retrieves the organizer profile and redirects them to their dashboard.
3. **Given** an unauthenticated or unauthorized user attempts to access protected edit functionality, **When** the request reaches the server, **Then** access is denied.

---

### User Story 4 - Admin Signs In And Manages The Platform (Priority: P1)

An authenticated admin can access an admin panel with full management capabilities across users, events, moderation state, and publishing actions, while organizer/uploader users remain restricted to their own records.

**Why this priority**: You want moderation and full platform management included in MVP, which requires a first-class admin surface rather than a manual external process.

**Independent Test**: An admin can sign in, open the admin panel, review pending events, publish or reject them, and manage records beyond a single organizer scope, while an organizer cannot access the same capabilities.

**Acceptance Scenarios**:

1. **Given** an admin signs in successfully, **When** they are redirected, **Then** they land on an admin panel with privileged management capabilities.
2. **Given** an admin views pending events, **When** they approve one, **Then** the event transitions to `published` and becomes eligible for public visibility.
3. **Given** an admin rejects an event, **When** the decision is saved, **Then** the organizer dashboard reflects the rejected status and the event remains non-public.
4. **Given** an organizer or uploader attempts to access admin-only routes or actions, **When** the request reaches the server, **Then** access is denied.

---

### User Story 5 - Organizer Creates a New Event From the Upload Page (Priority: P1)

An authenticated organizer can open an upload page with three clearly defined sections, complete the event form, enter ticket-pricing data, upload a poster image, and submit the event so it is stored in a pending-approval state associated with their profile.

**Why this priority**: The upload page is one of the most concrete client requirements and is a core organizer workflow.

**Independent Test**: An authenticated organizer can navigate to the upload page, interact with all three sections, submit a valid event payload, and see the new event linked to their dashboard profile.

**Acceptance Scenarios**:

1. **Given** an authenticated organizer opens the upload page, **When** the page renders, **Then** it contains exactly three top-level sections: an image banner, a dedicated pricing section with actual ticket-pricing inputs, and a submission form.
2. **Given** the organizer completes the form with valid data including pricing, a poster upload, and location selection, **When** they submit, **Then** the event is created in a `pending_approval` state and associated with the organizer profile.
3. **Given** the organizer provides invalid dates, unsupported files, or missing required fields, **When** they submit, **Then** submission is blocked and accessible field-level feedback is shown.
4. **Given** the create flow succeeds, **When** the organizer returns to the dashboard, **Then** the new event appears in the organizer's event list.

---

### User Story 6 - Organizer Updates an Existing Event (Priority: P1)

An authenticated organizer can edit an existing event they own using an update page that contains the same event-editing fields as the upload page, except the dedicated pricing section is omitted.

**Why this priority**: The client explicitly wants a dedicated update form and expects organizers to manage their own event records after creation.

**Independent Test**: An organizer can select one of their events from the dashboard, open the update page, modify allowed fields, submit changes, and see those changes reflected in the dashboard and public views.

**Acceptance Scenarios**:

1. **Given** an organizer opens the update page for an event they own, **When** the page loads, **Then** it displays the event-editing form pre-populated with existing values and does not include the dedicated pricing section.
2. **Given** the organizer edits valid fields and submits, **When** the update succeeds, **Then** the stored event is updated and remains associated with the organizer profile.
3. **Given** a user attempts to edit an event not associated with their profile, **When** they access the route or submit a request, **Then** the system denies access.

---

### User Story 7 - Organizer Uses a Dashboard to Manage Profile-Scoped Events (Priority: P1)

After login, an organizer reaches a dashboard where they can view, create, and edit only the events associated with their own profile, while also previewing the public event page and checking submission status. Their capabilities are intentionally restricted compared with an admin user.

**Why this priority**: The dashboard is the central post-login destination and ties authentication, ownership, create, and update workflows together.

**Independent Test**: After authentication, an organizer can open the dashboard, see only their events, navigate to create a new event, open edit flows for owned events, preview an event's public page, and view the current submission status.

**Acceptance Scenarios**:

1. **Given** an organizer successfully signs in, **When** they are redirected, **Then** they land on a dashboard rather than a generic homepage.
2. **Given** the organizer is on the dashboard, **When** data loads, **Then** the page shows only events associated with that organizer profile.
3. **Given** the organizer views their event list, **When** they inspect an event row or card, **Then** they can see its current submission status and access a public preview action.
4. **Given** the organizer selects create or edit actions from the dashboard, **When** navigation occurs, **Then** the system routes them to valid protected workflows.

---

### User Story 8 - Public Visitors Can View Updated Event Content (Priority: P2)

Public visitors can discover and view events that organizers have submitted or updated, with content appearing consistently across the main page, event details, and event listing surfaces.

**Why this priority**: Organizer tooling only creates value if the public experience can surface the resulting event content.

**Independent Test**: After an organizer creates or updates an event, a public visitor can find and open that event through the public experience once approval results in publication, while non-public states remain hidden.

**Acceptance Scenarios**:

1. **Given** an organizer submits a valid event, **When** the event is in `pending_approval`, **Then** it is not publicly visible until the review workflow approves publication.
2. **Given** a public visitor opens event details, **When** the event has optional fields missing, **Then** the UI degrades gracefully without broken layout or inaccessible controls.
3. **Given** an organizer-owned event has been approved for publication, **When** a public visitor browses the relevant public surfaces, **Then** the event becomes discoverable in the allowed homepage, listing, and detail experiences.

### Edge Cases

- What happens when an organizer starts an event on one day and ends it on another day or across multiple days?
- What happens when an end date is before the start date?
- What happens when the organizer uploads a poster that is too large, unsupported, corrupt, or missing?
- What happens when the organizer leaves optional URL fields blank or provides malformed URLs?
- What happens when a location required by the organizer is not present in the dropdown list?
- What happens when a social-login account exists but does not yet have an organizer profile record?
- What happens when an organizer tries to update an event they do not own?
- What happens when email delivery fails after an event submission action?
- What happens when the authenticated session expires while the organizer is completing the upload or update form?
- What happens when an admin loses session state while reviewing or moderating a pending event?
- What happens when public navigation points to a page that is not yet implemented?
- What happens when a pending-approval event is awaiting approval for an extended period or is rejected?
- What happens when an organizer account is promoted to admin or an admin account is downgraded to organizer?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a reworked main page that captures the structure, clarity, and overall feel of the pluginbim.com public experience while remaining an original implementation tailored to this product.
- **FR-002**: The main page MUST include complete, production-ready homepage sections rather than placeholder sections.
- **FR-003**: The system MUST provide a dedicated Contact Us page reachable from public navigation.
- **FR-004**: The Contact Us page MUST display business contact details and approved social links.
- **FR-005**: The system MUST provide secure MVP authentication limited to Google login and email magic-link login.
- **FR-006**: The authentication architecture MUST allow additional providers to be added later without reworking the core authorization model.
- **FR-007**: The system MUST create or associate an organizer profile upon successful authenticated login.
- **FR-008**: The system MUST provide an authenticated organizer dashboard as the default post-login landing page.
- **FR-008A**: The system MUST provide an authenticated admin panel as the default post-login landing page for admin users.
- **FR-009**: The organizer dashboard MUST allow the organizer to view only events associated with their own profile.
- **FR-010**: The organizer dashboard MUST provide clear actions to create a new event and edit an existing owned event.
- **FR-011**: The organizer dashboard MUST provide a public preview action for each event associated with the organizer profile.
- **FR-012**: The organizer dashboard MUST display the current submission or publication status for each organizer-owned event.
- **FR-012A**: The admin panel MUST provide full management capability over submitted events, event publication status, and user-accessible moderation actions required by MVP.
- **FR-012B**: The admin panel MUST allow admin users to review, publish, reject, and otherwise manage events across all organizer profiles.
- **FR-012C**: Organizer or uploader users MUST NOT have access to admin-only management actions or global event visibility beyond their own records.
- **FR-013**: The system MUST provide a protected event upload page for authenticated organizers.
- **FR-014**: The upload page MUST contain exactly three primary sections: an image banner, a dedicated pricing section with actual ticket-pricing inputs, and an event submission form.
- **FR-015**: The upload page form MUST include fields for `emailAddress`, `eventName`, `startDate`, `startTime`, `endDate`, `ticketUrl`, `registrationUrl`, `socialUrl`, `description`, `poster`, and `location`.
- **FR-016**: The dedicated pricing section on the upload page MUST capture actual event ticket-pricing data as part of the create-event workflow.
- **FR-017**: The `location` field MUST be presented as a dropdown list sourced from a controlled location dataset.
- **FR-018**: The `poster` field MUST support image upload with validation for allowed file types and size limits.
- **FR-019**: The upload workflow MUST associate each successfully created event with the authenticated organizer profile.
- **FR-020**: Newly created events MUST be stored in a `pending_approval` state and MUST NOT become publicly visible until they transition to `published` through the moderation workflow.
- **FR-021**: The system MUST provide a protected event update page for authenticated organizers.
- **FR-022**: The update page MUST present the same editable event fields as the upload page, excluding the dedicated pricing section; ticket-pricing data is create-time only in MVP unless a future moderation-controlled pricing-edit workflow is added.
- **FR-023**: The update page MUST pre-populate stored values for the selected event.
- **FR-024**: The system MUST enforce server-side ownership rules so organizers can edit only events associated with their profile.
- **FR-024A**: Admin users MUST be allowed to manage any event record required by the MVP moderation and management workflow, regardless of original organizer ownership.
- **FR-025**: The system MUST validate start date, start time, and end date combinations, including multi-day events.
- **FR-026**: The system MUST validate all submitted URLs and either normalize or reject invalid values with accessible error messaging.
- **FR-027**: The system MUST send event submission data to a configured email address or trigger an equivalent business notification workflow.
- **FR-028**: The public event experience MUST remain browsable through homepage and event-detail surfaces using typed event data rather than hardcoded view-only fragments.
- **FR-029**: The system MUST provide loading, empty, success, and error states for public and authenticated workflows.
- **FR-030**: The system MUST provide responsive layouts for mobile and desktop across the main page, Contact Us page, login, dashboard, upload, and update routes.
- **FR-031**: The system MUST satisfy WCAG 2.2 AA expectations for navigation, forms, dialogs, file inputs, validation feedback, and protected workflow pages.
- **FR-031A**: The system MUST use semantic HTML landmarks, headings, labels, and accessible names across public and organizer workflows.
- **FR-031B**: The system MUST provide visible focus states, sufficient color contrast, and assistive-technology-readable state-change announcements for login, validation, upload, submission, and moderation-status changes.
- **FR-032**: The system MUST ensure that all public and authenticated navigation targets resolve to implemented routes.
- **FR-033**: The system MUST preserve or improve the existing public event discovery foundation already present in the codebase rather than regress it.
- **FR-034**: The system MUST define typed contracts for organizer profile data, dashboard event summaries, event create/update payloads, location options, pricing data, and notification requests.
- **FR-034A**: The system MUST define typed contracts for user role data, admin panel summaries, moderation actions, and role-aware event management responses.
- **FR-035**: The system MUST persist organizer-owned events in a manner that supports pending-approval review, later public discovery after approval, and profile-scoped management.
- **FR-036**: The system MUST protect authenticated pages against unauthenticated access and protect mutation endpoints against unauthorized access.
- **FR-037**: The system MUST implement a moderation-aware publication workflow in which organizer-submitted events require admin approval before public visibility, and approval MUST be the trigger that transitions the event from `pending_approval` to `published` on public surfaces.
- **FR-038**: The system MUST be designed so the client can update supported locations, email destinations, and homepage content without rewriting the entire application architecture.
- **FR-039**: The system MUST centralize authorization policy server-side so role-based access, ownership, protected-route access, and mutation permissions are enforced outside the client UI.
- **FR-040**: The system MUST protect secrets and privileged credentials by keeping provider secrets, email-delivery credentials, and storage credentials outside client-accessible code and outside persisted browser state.
- **FR-041**: The system MUST apply least-privilege rules to protected operations so organizers can act only on their own profiles and events, while non-owners and anonymous users are denied access.
- **FR-042**: The system MUST define explicit authorization evidence requirements for allow-path, deny-path, owner-scope, admin-scope, and privilege-escalation scenarios in protected organizer and admin flows.
- **FR-043**: The system MUST define and enforce an explicit CORS policy for any externally reachable API routes or upload endpoints introduced by this feature.
- **FR-044**: The system MUST define timeout expectations and failure behavior for authentication, upload, notification, and event-mutation requests that cross trust boundaries.
- **FR-045**: The feature implementation MUST add or enable automated end-to-end and accessibility tooling so constitution-required UI and auth-flow evidence can be produced by repository automation.

### Data Integrity and Migration Notes

- User accounts MUST carry an explicit role or equivalent authorization classification that distinguishes admin users from organizer/uploader users.
- Organizer profiles MUST be uniquely identifiable by provider subject or by the email address used for the approved authentication flow, with duplicate-profile creation prevented at the database level.
- Every event record MUST belong to exactly one organizer profile through a non-null ownership relationship enforced by schema constraints.
- Every persisted event record MUST use a controlled submission-status value from an explicit finite set: `pending_approval`, `rejected`, or `published`.
- Status transitions MUST preserve auditability. At minimum, the system MUST retain the current status, the last moderation decision timestamp, and enough metadata to explain rejection to the organizer if rejection is supported in MVP.
- Poster assets MUST either remain unassigned until event creation completes or be cleaned up safely if the event-creation transaction fails.
- Location references used by events MUST resolve to a valid controlled location option and MUST reject orphaned or unknown location identifiers.
- Migration planning MUST preserve existing public event-discovery data and provide a rollback or forward-fix path for organizer, ownership, moderation-status, and asset-association changes.
- Migration validation MUST explicitly confirm uniqueness constraints, foreign-key integrity, allowed status values, and non-loss of existing public event records.

### API Contract Notes

- Public event-list endpoint or route handler MUST return only publicly visible events and MUST exclude `pending_approval` and `rejected` events from anonymous responses.
- Public event-detail endpoint or route handler MUST return `404` for nonexistent events and MUST NOT expose non-public event records to anonymous users.
- A moderation approval decision in MVP MUST transition the event into `published`, after which it becomes eligible for public listing and public detail visibility according to normal public-surface rules.
- Organizer dashboard list endpoint or route handler MUST return only events owned by the authenticated organizer and SHOULD include summary status, preview eligibility, and last-updated metadata.
- Admin panel list endpoints or route handlers MUST return role-appropriate global or platform-wide management data for authenticated admin users only.
- Event-create endpoint or route handler MUST accept the normalized organizer event payload, validate required fields, create the record in a non-public state, and return `201` on success.
- Event-update endpoint or route handler MUST validate organizer ownership server-side, reject unauthorized updates with `403`, and return `404` when the target event does not exist.
- Poster-upload endpoint or route handler MUST validate content type and size, return structured upload metadata on success, and reject unsupported files with `400`.
- Moderation-status endpoint or route handler MUST expose the organizer-visible status of owned events and MUST NOT expose moderation data for events outside the authenticated organizer scope.
- Admin moderation endpoints or route handlers MUST allow authorized admin users to publish or reject pending events and MUST reject non-admin callers with `403`.
- Authentication endpoints or handlers MUST support Google sign-in and email magic-link flows, and MUST return predictable success and failure states for session creation, expiry, and invalid login attempts.
- Validation errors for create, update, upload, and auth flows MUST use structured error responses that the UI can map to accessible field or page-level messaging.
- API contracts introduced or changed by this feature MUST be represented through versioned OpenAPI or Swagger artifacts, and any externally consumed or unstable contract MUST define an explicit compatibility path before release.

### Moderation Workflow Notes

- Organizer-created events are persisted in `pending_approval` once successfully submitted. Unsaved in-progress form state during entry is client-side only and is not treated as a persisted workflow status in MVP.
- Approval is the operational trigger that moves an event into its publicly visible published state in MVP.
- Rejected events MUST remain visible in the organizer dashboard with a rejected status and enough context for the organizer to understand that public publication did not occur.
- Organizer preview behavior in MVP SHOULD allow the organizer to inspect their own pending-approval, rejected, or published event representation without making non-public states publicly visible.
- Admin review tooling is in scope for this MVP through the admin panel. Admin users perform moderation decisions within the product surface, while organizer/uploader users can only view the resulting status of their own submissions.

### Security and Authorization Notes

- Organizer-protected and admin-protected actions MUST be enforced server-side through a centralized authorization policy layer rather than by client-side route guards alone.
- Authorization evidence MUST cover at minimum: successful owner access, successful admin access, denial for anonymous access, denial for authenticated non-owners, denial for organizer access to admin-only routes, and denial for attempted privilege escalation.
- Google and magic-link credentials, email-delivery credentials, storage credentials, and any signing secrets MUST remain server-side and MUST NOT be exposed through client bundles, browser storage, or logs.
- Session handling MUST use secure, tamper-resistant mechanisms appropriate to the chosen auth implementation, and expired or invalid sessions MUST fail closed.
- API routes and upload endpoints introduced by this feature MUST declare and enforce an explicit CORS posture, even if that posture is same-origin only in MVP.
- External-facing requests MUST define timeout behavior, retry policy if any, and fail-safe behavior for authentication, uploads, and notifications.
- File upload workflows MUST validate file type, file size, and content integrity before persistence and MUST reject unsupported content before it becomes publicly reachable.
- Notification workflows MUST operate with least privilege and MUST be limited to the minimum configuration required to send organizer-submission notifications.

### Performance Budgets

- Main page initial render SHOULD present primary above-the-fold content in under 2.5 seconds on a representative mid-tier mobile device and standard broadband profile.
- Organizer dashboard data SHOULD become visibly usable in under 2 seconds after a valid authenticated navigation.
- Admin panel data SHOULD become visibly usable in under 2 seconds after a valid authenticated navigation.
- Event create and update submissions excluding image upload SHOULD complete server acknowledgement in under 1.5 seconds under normal operating conditions.
- Poster upload validation feedback SHOULD appear in under 500 milliseconds after client-side file selection for supported files.
- Public event list filtering and search interactions SHOULD reflect updated results in under 300 milliseconds after the debounced input or filter action resolves.

### Performance Validation Plan

- Main page render evidence MUST be captured using an agreed repeatable measurement method such as Lighthouse, browser performance traces, or Web Vitals capture in a production-like build.
- Dashboard readiness evidence MUST be captured from authenticated navigation to usable organizer content under representative network and device conditions.
- Admin-panel readiness evidence MUST be captured from authenticated navigation to usable admin content under representative network and device conditions.
- Submission and upload-feedback evidence MUST be captured from create and update workflows using representative payloads, including at least one valid poster upload case.
- Filter and search responsiveness evidence MUST be captured using representative event datasets large enough to exercise the intended client and server path.
- Performance evidence MUST be recorded in planning or implementation artifacts so reviewers can compare actual measurements to the budgets above.

### Validation and Error Semantics

- URL fields MAY be optional, but when provided they MUST pass normalization and validation rules before persistence.
- End date MAY be equal to or later than the start date, but it MUST NOT precede the start date.
- The system MUST reject upload attempts whose file type, file size, or image integrity checks fail and MUST provide recoverable error feedback.
- Expired sessions during protected form workflows MUST result in re-authentication requirements without silently discarding unsaved client-entered data where recovery is practical.
- Authentication success, validation errors, upload failures, submission completion, and moderation-status changes SHOULD expose programmatically determinable state changes so assistive technologies can announce them when appropriate.

### Key Entities *(include if feature involves data)*

- **UserRole**: Represents the authorization role assigned to an authenticated user, distinguishing admin users from organizer/uploader users and governing their allowed actions.
- **OrganizerProfile**: Represents the authenticated event owner, including identity-provider linkage, profile metadata, access status, and the collection of events associated with that organizer.
- **EventRecord**: Represents a public or review-scoped event created by an organizer, including ownership, name, start date, start time, end date, description, links, poster asset reference, location, pricing data, publication status, and audit metadata.
- **EventFormSubmission**: Represents the normalized create or update payload submitted from the upload or update form before persistence and notification handling.
- **LocationOption**: Represents an allowed selectable event location for the upload and update form dropdown.
- **PosterAsset**: Represents an uploaded image file and its validated metadata, storage reference, and association to an event.
- **OrganizerSession**: Represents the authenticated session and authorization context used to access protected organizer workflows.
- **AdminSession**: Represents the authenticated session and authorization context used to access admin-only workflows and moderation actions.
- **AdminAction**: Represents an admin-triggered management or moderation action such as publishing, rejecting, or otherwise managing an event or related user-visible record.
- **NotificationRequest**: Represents an outbound business email or notification generated by event-submission workflows or internal moderation operations.
- **SubmissionStatus**: Represents the lifecycle state of a persisted organizer event, such as pending approval, rejected, or published, and is shown in the organizer dashboard.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time public visitor can identify the product purpose and reach a valid discovery or contact destination from the main page in no more than 2 interactions.
- **SC-002**: 100% of public and authenticated navigation links on changed surfaces resolve to implemented routes with no dead-end pages.
- **SC-003**: An authenticated organizer can complete a valid event creation flow, including poster upload, pricing capture, and location selection, without manual administrator intervention during submission.
- **SC-003A**: An authenticated admin can review and publish or reject pending events from the admin panel without leaving the product surface.
- **SC-004**: An authenticated organizer can update one of their own events successfully, and unauthorized users are prevented from editing events they do not own.
- **SC-005**: Public and protected form workflows provide accessible validation and report zero serious or critical automated accessibility violations on changed surfaces.
- **SC-006**: Stakeholder review confirms that the reworked main page captures the structure and feel of the pluginbim.com experience while supporting the client-requested organizer workflows.
- **SC-007**: The organizer dashboard shows only profile-associated events for the authenticated organizer in all tested role and ownership scenarios, while the admin panel shows the broader management data permitted to admin users.
- **SC-008**: Organizer-submitted events remain non-public while in `pending_approval`, become publicly discoverable once `published`, and the dashboard accurately reflects their submission status in all tested workflow states.
- **SC-009**: Event-submission notifications reach the configured business destination in the approved success path and fail with recoverable user feedback in the approved error path.
- **SC-010**: The final design remains responsive and usable on mobile and desktop for the homepage, Contact Us page, login, organizer dashboard, admin panel, upload, and update flows.

## Delivery Slices and Functional Completion Model

This feature SHOULD be delivered in independently testable slices. Each slice is functionally complete only when its independent verification path succeeds and every applicable quality gate passes.

### Cross-Slice Completion Rules

- Every slice MUST pass the always-applicable gates: `C1 Clean Scope`, `C2 Formatting and Lint`, `C3 Type Safety`, `C5 Secret and Dependency Safety`, `P1 Reproducible Build`, and `P6 SonarQube`.
- A slice that changes user-facing flows MUST also pass `P3 End-to-End` and `P5 Accessibility`.
- A slice that changes business logic across component or route boundaries MUST also pass `P2 Integration`.
- A slice that changes APIs or payload contracts MUST also pass `P7 API Contract`.
- A slice that changes schema or persistence MUST also pass `P8 PostgreSQL Migration`.
- A slice that changes protected actions, roles, ownership, or moderation MUST also pass `P9 Authorization`.
- A slice that changes external or trust-boundary behavior MUST also pass `P12 Network Security`.
- A slice that fixes or replaces existing behavior MUST include the required `P4 Regression` evidence for the touched behavior.
- `P11 Container Security` and `P13 Caching` remain `N/A` unless a later implementation slice explicitly introduces container-runtime or caching changes.

### Slice 1 - Public Experience Foundation

**Objective**: Deliver the public-facing homepage, Contact Us page, route validity, and baseline public information architecture so visitors can understand the product and navigate without dead ends.

**Primary scope**:
- User Story 1 - Browse the Main Public Experience
- User Story 2 - Reach the Contact Us Experience
- Functional requirements: `FR-001` through `FR-004`, `FR-028`, `FR-030`, `FR-031`, `FR-031A`, `FR-031B`, `FR-032`, `FR-033`, `FR-038`
- Success criteria: `SC-001`, `SC-002`, `SC-005`, `SC-006`, `SC-010`

**Key deliverables**:
- Reworked PluginBIM-inspired main page
- Responsive Contact Us page with business contact details and approved social links
- Valid public navigation with no dead routes on changed surfaces
- Public accessibility baseline for layout, semantics, names, focus, and announcements

**Independent verification**:
- A first-time visitor can load the homepage, understand the product, navigate to Contact Us, and move through public discovery entry points without broken navigation.

**Required quality gates for functional completeness**:
- Always-applicable gates
- `P2 Integration` when homepage sections are wired to data or route boundaries
- `P3 End-to-End`
- `P5 Accessibility`
- `P4 Regression` for any replaced public navigation or existing event-discovery behavior

### Slice 2 - Authentication and Role Foundation

**Objective**: Establish secure MVP authentication, session handling, user-role assignment, protected routing, and server-side role-aware authorization for admin and organizer users.

**Primary scope**:
- User Story 3 - Organizer Signs In Securely
- User Story 4 - Admin Signs In And Manages The Platform, limited to sign-in, routing, and role landing behavior
- Functional requirements: `FR-005`, `FR-006`, `FR-007`, `FR-008`, `FR-008A`, `FR-036`, `FR-039`, `FR-040`, `FR-041`, `FR-042`, `FR-043`, `FR-044`
- Key entities: `UserRole`, `OrganizerSession`, `AdminSession`, `OrganizerProfile`

**Key deliverables**:
- Google and email magic-link MVP login
- Role assignment and post-login landing behavior
- Protected organizer and admin route boundaries
- Centralized server-side authorization policy

**Independent verification**:
- An organizer can sign in and reach the organizer dashboard, an admin can sign in and reach the admin panel, and unauthorized users are denied protected access.

**Required quality gates for functional completeness**:
- Always-applicable gates
- `P2 Integration`
- `P3 End-to-End`
- `P5 Accessibility`
- `P7 API Contract`
- `P8 PostgreSQL Migration` if user-role or session-related persistence changes are introduced
- `P9 Authorization`
- `P12 Network Security`

### Slice 3 - Organizer Event Submission

**Objective**: Deliver the organizer upload workflow so a restricted organizer can create a new event, upload a poster, capture pricing, and submit the event into `pending_approval`.

**Primary scope**:
- User Story 5 - Organizer Creates a New Event From the Upload Page
- Functional requirements: `FR-013` through `FR-020`, `FR-025`, `FR-026`, `FR-027`, `FR-029`
- Key entities: `EventFormSubmission`, `EventRecord`, `PosterAsset`, `LocationOption`, `NotificationRequest`, `SubmissionStatus`

**Key deliverables**:
- Protected upload page with exactly three sections
- Create-event form with required fields
- Poster upload validation and location selection
- Pending-approval persistence and organizer association
- Submission notification trigger behavior

**Independent verification**:
- An authenticated organizer can open the upload page, submit a valid event, and see it appear in their dashboard in `pending_approval` status; invalid submissions are blocked with accessible feedback.

**Required quality gates for functional completeness**:
- Always-applicable gates
- `P2 Integration`
- `P3 End-to-End`
- `P5 Accessibility`
- `P7 API Contract`
- `P8 PostgreSQL Migration`
- `P9 Authorization`
- `P12 Network Security`

### Slice 4 - Organizer Dashboard and Event Editing

**Objective**: Deliver the organizer-owned management surface so organizers can view only their events, preview public representations, and edit eligible records with restricted permissions.

**Primary scope**:
- User Story 6 - Organizer Updates an Existing Event
- User Story 7 - Organizer Uses a Dashboard to Manage Profile-Scoped Events
- Functional requirements: `FR-009` through `FR-012`, `FR-021` through `FR-024`, `FR-024A` excluded from this slice, `FR-029`
- Key entities: `OrganizerProfile`, `EventRecord`, `SubmissionStatus`

**Key deliverables**:
- Organizer dashboard listing only owned events
- Preview links for owned events
- Update page with pre-populated data and restricted editing rules
- Ownership enforcement for organizer-only edits

**Independent verification**:
- An organizer can view only their own events, open an update form for an owned event, save changes successfully, and is denied access to non-owned records.

**Required quality gates for functional completeness**:
- Always-applicable gates
- `P2 Integration`
- `P3 End-to-End`
- `P4 Regression`
- `P5 Accessibility`
- `P7 API Contract`
- `P9 Authorization`

### Slice 5 - Admin Panel and Moderation Workflow

**Objective**: Deliver the admin panel with full MVP management capability so admin users can review, publish, reject, and manage event records across organizer boundaries.

**Primary scope**:
- User Story 4 - Admin Signs In And Manages The Platform
- Functional requirements: `FR-008A`, `FR-012A`, `FR-012B`, `FR-012C`, `FR-024A`, `FR-034A`, `FR-037`, `FR-039`, `FR-041`, `FR-042`
- Key entities: `UserRole`, `AdminSession`, `AdminAction`, `SubmissionStatus`, `EventRecord`

**Key deliverables**:
- Admin landing surface
- Pending-event review queue or equivalent moderation views
- Publish and reject actions
- Global management permissions distinct from organizer scope

**Independent verification**:
- An authenticated admin can review a pending event, publish or reject it, and manage records outside a single organizer scope; an organizer or uploader cannot access these admin capabilities.

**Required quality gates for functional completeness**:
- Always-applicable gates
- `P2 Integration`
- `P3 End-to-End`
- `P5 Accessibility`
- `P7 API Contract`
- `P8 PostgreSQL Migration` if moderation/audit schema changes are introduced
- `P9 Authorization`
- `P12 Network Security`

### Slice 6 - Public Published Event Visibility

**Objective**: Ensure moderated events flow correctly into the public experience so only `published` events become discoverable while non-public states remain hidden.

**Primary scope**:
- User Story 8 - Public Visitors Can View Updated Event Content
- Functional requirements: `FR-020`, `FR-028`, `FR-033`, `FR-035`, `FR-037`
- Success criteria: `SC-006`, `SC-007`, `SC-008`

**Key deliverables**:
- Public listing and detail behavior aligned to publication state
- Correct hidden behavior for `pending_approval` and `rejected`
- Published-event propagation into homepage, listing, and detail surfaces

**Independent verification**:
- A pending event remains hidden from anonymous users, and once an admin publishes it, the event becomes discoverable on the intended public surfaces.

**Required quality gates for functional completeness**:
- Always-applicable gates
- `P2 Integration`
- `P3 End-to-End`
- `P4 Regression`
- `P5 Accessibility`
- `P7 API Contract`
- `P9 Authorization` where admin-triggered publication intersects protected actions

### Slice 7 - Quality-Gate and Operational Enablement

**Objective**: Make the repository capable of enforcing the required evidence paths so the feature can progress through CI and release gates without placeholder or `N/A` outcomes where the spec expects enforceable checks.

**Primary scope**:
- Automation and Gate Mapping section
- Contract validation mechanism
- Tooling enablement requirements for E2E, accessibility, contracts, build, and migrations
- Performance validation plan
- Functional requirements: `FR-045` plus any implementation needed to satisfy `Contract Validation Mechanism`, `Contract Tooling Enablement Requirement`, and `Migration Tooling Enablement Requirement`

**Key deliverables**:
- Enforceable E2E path
- Enforceable accessibility validation path
- Versioned OpenAPI or Swagger artifacts plus runnable contract-validation command
- Enforceable migration validation setup when schema work exists
- Production build evidence path and recorded performance evidence approach

**Independent verification**:
- The repo can produce non-placeholder evidence for the required build, E2E, accessibility, contract, and migration gates, and reviewers can point to those artifacts in CI.

**Required quality gates for functional completeness**:
- Always-applicable gates
- `P1 Reproducible Build`
- `P3 End-to-End`
- `P5 Accessibility`
- `P7 API Contract`
- `P8 PostgreSQL Migration` when schema changes are introduced
- `P6 SonarQube`

### Recommended Slice Sequencing

The recommended sequencing separates non-negotiable foundations from user-visible milestones so planning can distinguish platform-enablement work from feature delivery.

#### Foundational Prerequisites

These slices establish capability, enforcement, and security boundaries that later user-visible milestones depend on.

1. Slice 7 - Quality-Gate and Operational Enablement
2. Slice 2 - Authentication and Role Foundation

#### User-Visible Milestones

These slices deliver visible product value after the prerequisite capabilities are in place.

1. Slice 1 - Public Experience Foundation
2. Slice 3 - Organizer Event Submission
3. Slice 4 - Organizer Dashboard and Event Editing
4. Slice 5 - Admin Panel and Moderation Workflow
5. Slice 6 - Public Published Event Visibility

#### Parallelization Guidance

- Slice 7 SHOULD start first and continue in parallel with later work until all required evidence paths are enforceable in CI.
- Slice 1 MAY begin in parallel with Slice 2 if public-page work avoids blocked dependencies on auth, role, or protected workflow infrastructure.
- Slice 3 and Slice 4 SHOULD not be considered functionally complete until Slice 2 is in place because both rely on authenticated, role-aware, protected workflows.
- Slice 5 SHOULD not begin before Slice 2 is stable and SHOULD not be considered complete before Slice 3 provides real pending-approval event records to moderate.
- Slice 6 SHOULD be the final user-visible milestone because it depends on the organizer submission path, admin moderation path, and publication-state propagation all working together.

### Slice Dependency Notes

- Slice 7 is a prerequisite enabler for any slice that depends on currently missing automated E2E, accessibility, contract, build, or migration evidence.
- Slice 2 is a prerequisite for Slices 3, 4, and 5.
- Slice 1 is not a hard dependency for the protected workflow slices, but it is the first public-facing milestone and can be delivered independently once its own gates pass.
- Slice 3 is a prerequisite for Slice 5 because moderation needs submitted events.
- Slice 5 is a prerequisite for Slice 6 because public publication depends on admin moderation.
- Slice 7 MUST be complete before any slice that relies on currently unavailable gate tooling is considered CI-ready or release-ready.