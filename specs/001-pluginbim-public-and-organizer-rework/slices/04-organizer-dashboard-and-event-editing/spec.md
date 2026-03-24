# Slice Spec: Organizer Dashboard and Event Editing

**Parent Feature**: [spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/spec.md)  
**Slice ID**: `04-organizer-dashboard-and-event-editing`  
**Status**: Draft

## Objective

Deliver the organizer-owned management surface so organizers can view only their events, preview public representations, and edit eligible records with restricted permissions.

## Slice Boundaries

Included:
- Organizer dashboard event listing
- Submission/publication status display for owned records
- Preview behavior for owned records
- Update page with pre-populated data
- Ownership enforcement for organizer edits
- Reset of edited `published` events back to `pending_approval`

Excluded:
- Admin global management behavior
- Admin moderation actions
- Public published-state propagation across anonymous surfaces

## Parent Traceability

User stories:
- User Story 6 - Organizer Updates an Existing Event
- User Story 7 - Organizer Uses a Dashboard to Manage Profile-Scoped Events

Functional requirements:
- `FR-009` through `FR-012`
- `FR-021` through `FR-024`
- `FR-024B`
- `FR-029`

Success criteria:
- `SC-008A`

Key entities:
- `OrganizerProfile`
- `EventRecord`
- `SubmissionStatus`

## Independent Verification

An organizer can view only their own events, open an update form for an owned event, save changes successfully, and is denied access to non-owned records.

## Functional Completion Criteria

This slice is functionally complete when:
- organizer dashboard data is restricted to owned records
- organizers can preview and edit only allowed records
- the update page respects its field boundaries, including no dedicated pricing section
- editing a previously `published` event returns it to `pending_approval` and updates organizer-visible status messaging
- unauthorized access to non-owned records is denied server-side

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
- `P9 Authorization`

## Required Evidence

- Unit tests for ownership logic and update validations
- Integration tests for dashboard listing, update persistence, and `published` to `pending_approval` status reset behavior
- End-to-end tests for organizer-managed edit behavior
- Regression tests for existing discovery behavior touched by preview or detail wiring
- Authorization tests for owned versus non-owned access

## Expected Slice Artifacts

- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis.md`
- `checklists/`

## Dependencies

Hard dependencies:
- Slice 02
- Slice 08

Recommended dependencies:
- Slice 03 if dashboard completeness should include newly created pending records