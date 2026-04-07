# Implementation Plan: Public Experience Foundation

**Branch**: `001-pluginbim-public-and-organizer-rework` | **Date**: 2026-03-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/spec.md`

## Summary

Refresh the public homepage and shell so the product story, Contact Us journey, and public navigation are complete and accessible without breaking existing event-discovery entry points. The implementation will reuse the current Next.js App Router shell, keep approved Contact Us content in versioned typed configuration inside the repository, preserve homepage event sections with explicit empty-state messaging that routes visitors to `/events`, and treat automated end-to-end and accessibility evidence as a dependency on slice 07 rather than bundling tooling enablement into this slice.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 16.1.4 with React 19.2  
**Primary Dependencies**: Next.js App Router, React 19.2, Tailwind CSS 4, Jest 30, React Testing Library, ESLint 9  
**Storage**: N/A for this slice; consume existing typed public event data sources plus versioned typed public content configuration stored in the repository  
**Testing**: Jest, React Testing Library, repository quality-gate scripts, manual keyboard, focus, semantic landmark, heading order, accessible-name, contrast, announcement, and responsive viewport verification at 360px and 1280px, plus recorded performance evidence for the 2.5-second content-visibility budget; automated E2E and dedicated accessibility automation depend on slice 07  
**Target Platform**: Responsive web browsers on mobile and desktop  
**Project Type**: Next.js web application  
**Performance Goals**: Homepage and Contact Us remain usable within the slice spec budget of primary heading plus first actionable control visible within 2.5 seconds under representative mid-tier mobile and broadband conditions  
**Constraints**: Preserve existing public discovery entry points, keep auth/API/schema changes out of scope, satisfy WCAG 2.2 AA for changed public surfaces, keep Contact Us and homepage fallback content in versioned typed configuration, and avoid introducing new automation infrastructure in this slice  
**Scale/Scope**: Homepage route, Contact Us route, shared header and footer navigation, homepage discovery sections, and regression coverage for changed public shell behavior

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Applies? | Evidence Planned | Status |
| ----- | -------- | ---------------- | ------ |
| S1 Change Classification | Yes | Slice spec explicitly classifies UI, business logic, performance, and out-of-scope areas | PASS |
| S2 Test Strategy | Yes | Plan includes unit, integration, e2e, regression, and accessibility evidence with `N/A` reasons for non-applicable gates | PASS |
| S3 Accessibility Scope | Yes | Manual keyboard/focus verification plus accessibility acceptance criteria are captured in spec, research, contract, and quickstart artifacts | PASS |
| S4 Security Scope | No | Security-sensitive changes are explicitly out of scope and remain covered by repository clean-scope and secret-safety gates only | N/A |
| S5 Data and Migration Scope | No | No persistence or schema work is introduced by this slice | N/A |
| S6 API Contract Scope | No | Slice consumes existing public data interfaces only; UI route contract is documented separately | N/A |
| S7 Performance and Caching Scope | Yes | Performance budget and out-of-scope caching decision are captured in the slice spec and research notes | PASS |
| S8 Automation Mapping | Yes | Applicable repo gate scripts and dependency on slice 07 for automated P3/P5 evidence are documented | PASS |

Reference: `.specify/memory/gate-checklist-matrix.md` and `.specify/memory/automation-policy.md`.

## Project Structure

### Documentation (this slice)

```text
specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── public-routes.md
├── checklists/
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── layout.tsx
├── page.tsx
├── (pages)/
│   ├── contact-us/page.tsx
│   ├── events/page.tsx
│   ├── privacy-policy/page.tsx
│   └── terms-and-conditions/page.tsx
├── @modal/
│   └── (.)events/[id]/page.tsx
└── components/
    ├── AppPromotion/AppPromotion.tsx
    ├── Categories/Categories.tsx
    ├── ContactUs/ContactUs.tsx
    ├── FeaturedEvents/FeaturedEvents.tsx
    ├── Footer/Footer.tsx
    ├── Header/Header.tsx
    ├── Hero/Hero.tsx
    └── SearchBar/SearchBar.tsx

app/lib/
├── public-content.ts
├── public-routes.ts
├── event-service.ts
└── search-service.ts

app/types/
├── public-content.ts
└── event.ts
```

**Structure Decision**: Keep all planning artifacts beside the slice spec per the slice portfolio. Constrain implementation to existing public App Router pages and shared shell components, introduce one new public page route, and centralize Contact Us content plus homepage empty-state behavior in lightweight typed configuration and presentational helpers.

## Phase 0: Research Summary

- Reuse the existing App Router public shell rather than introducing a new route group or layout tier for this slice.
- Implement Contact Us as a public content route under `app/(pages)/contact-us/page.tsx` to match the existing kebab-case content-route convention.
- Store approved Contact Us details and social links in versioned typed configuration within the repository so the slice stays within UI scope and remains maintainable.
- Preserve public event discovery by reusing typed event data and existing event-entry surfaces rather than inventing homepage-only data shapes.
- Keep homepage discovery sections visible when featured event content is empty by rendering an explicit empty-state message and fallback CTA to `/events`.
- Depend on slice 07 for automated `P3 End-to-End` and `P5 Accessibility` evidence rather than blending tooling enablement into this slice.
- Treat public route behavior as a UI contract and document it in a slice-local contract artifact even though no external API contract changes occur.
- Record SC-005 evidence with browser-based responsive testing under representative mid-tier mobile emulation and standard broadband conditions, measuring time until the primary heading and first actionable navigation element are visible.

## Phase 1: Design Summary

- Model homepage content, public navigation, contact details, and homepage event entries as small UI-domain entities with validation rules focused on route validity, maintainable typed configuration, and accessible labeling.
- Update the shared shell through `Header` and `Footer`, add the Contact Us route, read public contact content from typed configuration, and refine homepage composition in `app/page.tsx` and public-facing components.
- Keep the homepage featured-events section visible when event data is empty by rendering a clear empty-state message and CTA to `/events`, and hide the Contact Us social-links section entirely when no approved links exist.
- Preserve existing event discovery touchpoints in `app/(pages)/events/page.tsx`, modal event routes, and typed event services.
- Validate the changed public surfaces with component and integration tests where logic or wiring exists, plus manual accessibility verification, stakeholder design review, and recorded performance evidence in implementation artifacts.

## Post-Design Constitution Check

| Gate | Applies? | Evidence Planned | Status |
| ----- | -------- | ---------------- | ------ |
| S1 Change Classification | Yes | Design remains limited to public UI shell, route validity, and typed discovery integration | PASS |
| S2 Test Strategy | Yes | Tests, manual checks, stakeholder review, and performance evidence remain mapped to all changed behaviors | PASS |
| S3 Accessibility Scope | Yes | Design preserves semantic structure, focus visibility, accessible names, and keyboard route transitions | PASS |
| S4 Security Scope | No | No trust-boundary or privileged changes introduced during design | N/A |
| S5 Data and Migration Scope | No | No database or migration work added during design | N/A |
| S6 API Contract Scope | No | No API or payload contract changes introduced during design | N/A |
| S7 Performance and Caching Scope | Yes | Design uses existing shell and typed event primitives without introducing cache complexity and defines a concrete browser-based measurement method for SC-005 | PASS |
| S8 Automation Mapping | Yes | Design still relies on current repo gates and explicit slice 07 dependency for automated P3/P5 evidence | PASS |

## Complexity Tracking

No constitution exceptions or added complexity justifications are required for this slice.
