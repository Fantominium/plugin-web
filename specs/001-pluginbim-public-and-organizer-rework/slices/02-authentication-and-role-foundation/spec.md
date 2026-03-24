# Slice Spec: Authentication and Role Foundation

**Parent Feature**: [spec.md](/Users/malcolm/Desktop/projects/plugin/plugin-web/specs/001-pluginbim-public-and-organizer-rework/spec.md)  
**Slice ID**: `02-authentication-and-role-foundation`  
**Status**: Draft

## Objective

Establish secure MVP authentication, session handling, user-role assignment, protected routing, and server-side role-aware authorization for admin and organizer users.

## Slice Boundaries

Included:
- Google login
- Email magic-link login
- Magic-link expiry and replay protection
- Role assignment and role-aware landing behavior
- Admin allowlist resolution for MVP
- Organizer and admin protected route boundaries
- Centralized server-side authorization foundation

Excluded:
- Organizer create-event workflow details
- Organizer dashboard data management behavior beyond landing and protection
- Admin moderation UI behavior beyond successful access and role boundary enforcement

## Parent Traceability

User stories:
- User Story 3 - Organizer Signs In Securely
- User Story 4 - Admin Signs In And Manages The Platform, limited to sign-in, routing, and role landing behavior

Functional requirements:
- `FR-005`
- `FR-005A`
- `FR-006`
- `FR-007`
- `FR-008`
- `FR-008A`
- `FR-008B`
- `FR-036`
- `FR-039`
- `FR-040`
- `FR-041`
- `FR-042`
- `FR-043`
- `FR-044`

Key entities:
- `UserRole`
- `OrganizerProfile`
- `OrganizerSession`
- `AdminSession`

## Independent Verification

An organizer can sign in and reach the organizer dashboard, an admin can sign in and reach the admin panel, and unauthorized users are denied protected access.

## Functional Completion Criteria

This slice is functionally complete when:
- MVP login supports Google and email magic link
- email magic links expire after 15 minutes and cannot be replayed after first use
- user roles are resolved consistently
- admin access is granted only to approved allowlisted accounts
- organizer and admin route access is server-side enforced
- unauthorized, non-owner, and privilege-escalation paths are denied

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
- `P8 PostgreSQL Migration` if user-role or session persistence changes are introduced
- `P9 Authorization`
- `P12 Network Security`

## Required Evidence

- Unit tests for auth helpers, role checks, token handling, and policy logic
- Unit tests for allowlist-based admin resolution and invalid, expired, or replayed magic-link handling
- Integration tests for login/session flow and post-login routing
- End-to-end tests for organizer and admin sign-in journeys
- Authorization tests for allow-path, deny-path, owner-scope, admin-scope, and escalation cases
- Network-security evidence for CORS, CSRF, timeouts, abuse controls, and secret handling

## Expected Slice Artifacts

- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis.md`
- `checklists/`

## Dependencies

Hard dependencies:
- Slice 07 for enforceable automation where missing tooling blocks required evidence

Recommended dependencies:
- Slice 08 when authentication persistence or migration validation is implemented against PostgreSQL

Enables:
- Slice 03
- Slice 04
- Slice 05