# Slice Spec Portfolio

This directory breaks the parent feature specification into independently usable slice specs.

Parent feature:
- [spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/spec.md)

## Intended Workflow

Each slice is a discrete planning and delivery unit. For each slice, future artifacts should live beside its `spec.md` file.

Expected per-slice artifacts:
- `spec.md`: slice-scoped specification
- `plan.md`: slice-scoped implementation plan
- `tasks.md`: dependency-ordered implementation tasks
- `analysis.md`: optional design or review notes
- `checklists/`: reviewer or readiness checklists when needed

## Slice Index

1. [01-public-experience-foundation/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/01-public-experience-foundation/spec.md)
2. [02-authentication-and-role-foundation/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/02-authentication-and-role-foundation/spec.md)
3. [03-organizer-event-submission/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/03-organizer-event-submission/spec.md)
4. [04-organizer-dashboard-and-event-editing/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/04-organizer-dashboard-and-event-editing/spec.md)
5. [05-admin-panel-and-moderation/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/05-admin-panel-and-moderation/spec.md)
6. [06-public-published-event-visibility/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/06-public-published-event-visibility/spec.md)
7. [07-quality-gate-and-operational-enablement/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/07-quality-gate-and-operational-enablement/spec.md)
8. [08-containerization-and-postgresql-runtime-foundation/spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/slices/08-containerization-and-postgresql-runtime-foundation/spec.md)

## Sequencing Model

Foundational prerequisites:
1. Slice 07 - Quality-Gate and Operational Enablement
2. Slice 08 - Containerization and PostgreSQL Runtime Foundation
3. Slice 02 - Authentication and Role Foundation

User-visible milestones:
1. Slice 01 - Public Experience Foundation
2. Slice 03 - Organizer Event Submission
3. Slice 04 - Organizer Dashboard and Event Editing
4. Slice 05 - Admin Panel and Moderation
5. Slice 06 - Public Published Event Visibility

## Dependency Rules

- Slice 07 enables enforceable evidence for slices that rely on missing automation.
- Slice 08 enables slices that rely on PostgreSQL-backed persistence or container-runtime parity.
- Slice 02 is a prerequisite for slices 03, 04, and 05.
- Slice 03 is a prerequisite for slice 05.
- Slice 05 is a prerequisite for slice 06.
- Slice 01 can proceed independently once its own public-surface gates pass.