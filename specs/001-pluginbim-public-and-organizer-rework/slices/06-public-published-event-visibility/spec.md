# Slice Spec: Public Published Event Visibility

**Parent Feature**: [spec.md](../../spec.md)  
**Slice ID**: `06-public-published-event-visibility`  
**Status**: Draft

## Objective

Ensure moderated events flow correctly into the public experience so only `published` events become discoverable while non-public states remain hidden.

## Slice Boundaries

Included:
- Publication-state-aware anonymous listing behavior
- Publication-state-aware anonymous detail behavior
- Correct hidden behavior for pending and rejected states
- Public propagation of admin-published event content into the intended surfaces
- Removal from anonymous visibility when an organizer edit returns a previously published event to `pending_approval`

Excluded:
- Auth foundation
- Organizer creation flow itself
- Admin moderation UI itself

## Parent Traceability

User stories:
- User Story 8 - Public Visitors Can View Updated Event Content

Functional requirements:
- `FR-020`
- `FR-028`
- `FR-033`
- `FR-035`
- `FR-037`

Success criteria:
- `SC-006`
- `SC-007`
- `SC-008`
- `SC-008A`

## Independent Verification

A pending event remains hidden from anonymous users, and once an admin publishes it, the event becomes discoverable on the intended public surfaces.

## Functional Completion Criteria

This slice is functionally complete when:
- pending and rejected events remain hidden from anonymous users
- published events appear on intended public surfaces
- organizer-edited previously published events disappear from anonymous public surfaces until re-approved
- public detail and listing behavior follows the publication-state contract
- public experience remains accessible and regression-safe after publication-state changes

## Required Quality Gates

Always applicable:
- `C1 Clean Scope`
- `C2 Formatting and Lint`
- `C3 Type Safety`
- `C5 Secret and Dependency Safety`
- `P1 Reproducible Build`
- `P6 SonarQube`

Slice-specific:
- `P2 Integration`
- `P3 End-to-End`
- `P4 Regression`
- `P5 Accessibility`
- `P7 API Contract`
- `P9 Authorization` where admin-triggered publication intersects protected actions

## Required Evidence

- Integration tests for publication-state-aware listing and detail behavior
- End-to-end tests for hidden pending behavior, visible published behavior, and temporary removal of edited published events until re-approval
- Regression tests for previously working event discovery routes and details
- Accessibility validation for all changed public surfaces

## Expected Slice Artifacts

- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis.md`
- `checklists/`

## Dependencies

Hard dependencies:
- Slice 03
- Slice 05
- Slice 08

Recommended dependencies:
- Slice 01 for coherent public surface delivery