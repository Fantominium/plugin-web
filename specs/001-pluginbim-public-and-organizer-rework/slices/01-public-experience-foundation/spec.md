# Slice Spec: Public Experience Foundation

**Parent Feature**: [spec.md](../../spec.md)  
**Slice ID**: `01-public-experience-foundation`  
**Status**: Draft

## Objective

Deliver the public-facing homepage, Contact Us page, route validity, and baseline public information architecture so visitors can understand the product and navigate without dead ends.

## Slice Boundaries

Included:
- PluginBIM-inspired main page
- Contact Us page with business contact details and approved social links
- Valid public navigation on changed surfaces
- Public accessibility baseline for layout, semantics, names, focus, and announcements

Excluded:
- Authentication and role assignment
- Organizer upload and update workflows
- Admin panel and moderation actions
- Published event propagation from admin moderation

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

## Independent Verification

A first-time visitor can load the homepage, understand the product, navigate to Contact Us, and move through public discovery entry points without broken navigation.

## Functional Completion Criteria

This slice is functionally complete when:
- the homepage presents a coherent public product story
- Contact Us is complete and accessible
- all changed public navigation targets resolve correctly
- public-facing accessibility expectations for the changed surfaces are met

## Required Quality Gates

Always applicable:
- `C1 Clean Scope`
- `C2 Formatting and Lint`
- `C3 Type Safety`
- `C5 Secret and Dependency Safety`
- `P1 Reproducible Build`
- `P6 SonarQube`

Slice-specific:
- `P2 Integration` when homepage sections are wired to data or route boundaries
- `P3 End-to-End`
- `P4 Regression` for replaced public navigation or existing event-discovery behavior
- `P5 Accessibility`

## Required Evidence

- Unit tests only if new presentational logic introduces meaningful logic branches
- Integration tests for route-to-section or data-to-section wiring
- End-to-end tests for homepage and Contact Us journeys
- Regression tests for replaced navigation behavior
- Accessibility evidence for keyboard, focus, semantics, names, contrast, and announcements

## Expected Slice Artifacts

- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis.md` when design rationale or review notes are needed
- `checklists/` when reviewer checklists are required

## Dependencies

Hard dependencies:
- None

Recommended parallelism:
- Can proceed in parallel with slice 02 if no protected workflow dependencies are introduced