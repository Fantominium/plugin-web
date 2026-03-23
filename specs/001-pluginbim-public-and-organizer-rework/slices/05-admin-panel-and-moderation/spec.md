# Slice Spec: Admin Panel and Moderation

**Parent Feature**: [spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/spec.md)  
**Slice ID**: `05-admin-panel-and-moderation`  
**Status**: Draft

## Objective

Deliver the admin panel with full MVP management capability so admin users can review, publish, reject, and manage event records across organizer boundaries.

## Slice Boundaries

Included:
- Admin landing surface
- Admin event management views
- Moderation queue or equivalent review surface
- Publish and reject actions
- Global event-management capability beyond organizer ownership boundaries

Excluded:
- Public anonymous discovery behavior after publication propagation
- General public homepage refinement unrelated to admin-managed publication outcomes

## Parent Traceability

User stories:
- User Story 4 - Admin Signs In And Manages The Platform

Functional requirements:
- `FR-008A`
- `FR-012A`
- `FR-012B`
- `FR-012C`
- `FR-024A`
- `FR-034A`
- `FR-037`
- `FR-039`
- `FR-041`
- `FR-042`

Key entities:
- `UserRole`
- `AdminSession`
- `AdminAction`
- `SubmissionStatus`
- `EventRecord`

## Independent Verification

An authenticated admin can review a pending event, publish or reject it, and manage records outside a single organizer scope; an organizer or uploader cannot access these admin capabilities.

## Functional Completion Criteria

This slice is functionally complete when:
- admin users can access a dedicated admin panel
- admin users can publish and reject pending events
- admin users can manage records outside organizer ownership boundaries
- organizer or uploader users are denied admin-only capabilities

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
- `P5 Accessibility`
- `P7 API Contract`
- `P8 PostgreSQL Migration` if moderation or audit schema changes are introduced
- `P9 Authorization`
- `P12 Network Security`

## Required Evidence

- Unit tests for moderation actions and role checks
- Integration tests for admin management flows and organizer-status reflection
- End-to-end tests for admin publish and reject journeys
- Authorization tests for admin-only actions and organizer denial paths
- Network-security evidence for protected management endpoints

## Expected Slice Artifacts

- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis.md`
- `checklists/`

## Dependencies

Hard dependencies:
- Slice 02
- Slice 03

Enables:
- Slice 06