# Slice Spec: Organizer Event Submission

**Parent Feature**: [spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/spec.md)  
**Slice ID**: `03-organizer-event-submission`  
**Status**: Draft

## Objective

Deliver the organizer upload workflow so a restricted organizer can create a new event, upload a poster, capture pricing, and submit the event into `pending_approval`.

## Slice Boundaries

Included:
- Protected upload page with three required sections
- Create-event form fields and validation
- Poster upload behavior
- Location selection
- Pricing capture on create
- Pending-approval persistence and organizer association
- Submission notification trigger behavior

Excluded:
- Organizer update workflow
- Admin moderation UI
- Public publication after moderation

## Parent Traceability

User stories:
- User Story 5 - Organizer Creates a New Event From the Upload Page

Functional requirements:
- `FR-013` through `FR-020`
- `FR-025`
- `FR-026`
- `FR-027`
- `FR-029`

Key entities:
- `EventFormSubmission`
- `EventRecord`
- `PosterAsset`
- `LocationOption`
- `NotificationRequest`
- `SubmissionStatus`

## Independent Verification

An authenticated organizer can open the upload page, submit a valid event, and see it appear in their dashboard in `pending_approval` status; invalid submissions are blocked with accessible feedback.

## Functional Completion Criteria

This slice is functionally complete when:
- the protected upload page exists with the exact required section structure
- valid submissions create pending-approval records
- invalid input, invalid URLs, invalid files, and invalid dates are rejected correctly
- submission notifications are triggered through the approved workflow

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
- `P8 PostgreSQL Migration`
- `P9 Authorization`
- `P12 Network Security`

## Required Evidence

- Unit tests for validation, transformation, pricing rules, and file checks
- Integration tests for create-event, upload, persistence, and dashboard reflection
- End-to-end tests for the organizer submission journey
- Authorization evidence confirming only allowed organizers can submit
- Network-security evidence for upload and protected mutation behavior

## Expected Slice Artifacts

- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis.md`
- `checklists/`

## Dependencies

Hard dependencies:
- Slice 02
- Slice 07 where missing gate tooling would block completeness

Enables:
- Slice 05