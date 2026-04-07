# Research: Public Experience Foundation

## Decision: Reuse the existing App Router public shell

**Rationale**: The repository already routes public traffic through `app/layout.tsx`, `app/page.tsx`, `Header`, and `Footer`. Keeping slice 01 inside that structure minimizes route churn, reduces regression risk for existing event discovery, and keeps the scope aligned to public experience refinement rather than application architecture changes.

**Alternatives considered**:

- Introduce a dedicated public route group with a new layout: rejected because the current shell already provides the right composition point and a new layout would expand regression risk.
- Build the homepage as an isolated landing route outside the current shell: rejected because it would fragment navigation and complicate route validity.

## Decision: Implement Contact Us as `app/(pages)/contact-us/page.tsx`

**Rationale**: Existing public content routes already follow kebab-case naming under `app/(pages)/...`, such as privacy-policy and terms-and-conditions. A `contact-us` route keeps routing consistent, easy to discover, and semantically clear to users and maintainers.

**Alternatives considered**:

- `app/contact/page.tsx`: rejected because it diverges from the current public content-route convention.
- A modal or footer-only contact surface: rejected because the slice explicitly requires a dedicated Contact Us page.

## Decision: Store approved Contact Us details and social links in versioned typed configuration

**Rationale**: The slice explicitly keeps API, environment-management, and backend contract changes out of scope. Versioned typed configuration in the repository keeps Contact Us content maintainable, testable, and aligned with the slice's UI-only boundary while still allowing stakeholder-approved updates through normal versioned changes.

**Alternatives considered**:

- Environment variables: rejected because public contact content is structured presentation data rather than deployment secret material and would be harder to validate and review.
- Backend fetch from an existing service: rejected because it would expand scope into external data contracts and failure handling not required for this slice.

## Decision: Preserve event discovery by reusing typed event data and current discovery surfaces

**Rationale**: The repository already has event-service, search-service, event listing scaffolding, and modal detail entry points. Slice 01 should route visitors into those existing surfaces rather than inventing parallel homepage-only content models that would drift from the discovery experience.

**Alternatives considered**:

- Hardcoded homepage teaser cards unrelated to typed event data: rejected because the slice spec explicitly forbids dead-end fragments.
- New slice-specific discovery API work: rejected because API and contract changes are out of scope.

## Decision: Keep homepage discovery sections visible with an empty-state message and CTA to `/events`

**Rationale**: When featured event content is unavailable, hiding the section would make the homepage feel incomplete and weaken discovery. Keeping the section visible with a clear empty-state message and a fallback CTA to `/events` preserves layout stability, gives the visitor a valid next step, and stays consistent with the requirement to avoid dead ends.

**Alternatives considered**:

- Hide the section entirely: rejected because it weakens the public homepage structure and removes a discovery cue.
- Show placeholder event cards: rejected because placeholder content conflicts with the slice's production-ready requirement.

## Decision: Depend on slice 07 for automated `P3` and `P5` evidence

**Rationale**: The automation policy and slice portfolio already position slice 07 as the enabling slice for dedicated end-to-end and accessibility tooling. Keeping that enablement out of slice 01 preserves clean scope and allows this slice to focus on public experience delivery while still documenting the dependency explicitly.

**Alternatives considered**:

- Pull tooling enablement into slice 01: rejected because it widens scope into cross-cutting quality infrastructure already assigned to slice 07.
- Ignore the tooling gap and claim full automation anyway: rejected because that would violate the constitution and automation policy.

## Decision: Treat public route behavior as a UI contract artifact for this slice

**Rationale**: There are no API contract changes, but the planning workflow expects contract documentation when the project exposes interfaces. For a public web application slice, the most relevant interface is the public route contract: which routes exist, how they are reached, and what they must guarantee to users.

**Alternatives considered**:

- Omit contracts entirely: rejected because the slice does expose stable public routes and navigation expectations that benefit from explicit documentation.
- Create an OpenAPI file for unchanged APIs: rejected because no API or payload changes are in scope.

## Decision: Measure SC-005 with browser-based responsive evidence instead of introducing new tooling

**Rationale**: The slice has a concrete 2.5-second budget but explicitly avoids introducing new automation infrastructure. Browser-based measurement under representative mid-tier mobile emulation and standard broadband conditions provides a concrete, repeatable evidence path for planning and implementation without expanding scope into new performance tooling.

**Alternatives considered**:

- Introduce Lighthouse CI or new performance automation in this slice: rejected because tooling enablement belongs to cross-cutting quality work rather than this UI slice.
- Leave performance evidence informal: rejected because the constitution requires explicit budgets and measurement planning for performance-sensitive scope.
