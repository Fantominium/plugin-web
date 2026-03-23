<!--
Sync Impact Report
- Version change: 0.0.0-template -> 2.0.0
- Modified principles:
  - Template Principle 1 -> I. Test Evidence Before Implementation Approval
  - Template Principle 2 -> II. Accessibility Is a Hard Gate
  - Template Principle 3 -> III. Security and Authorization Default to Deny
  - Template Principle 4 -> IV. Operational Readiness Is Part of Done
  - Template Principle 5 -> V. Data Integrity, API Discipline, and Performance by Design
- Added sections:
  - Enforcement Model
  - Commit Gates
  - Pull Request and CI Gates
  - Release Gates
  - Measurable Standards by Area
  - Exception Process
- Removed sections:
  - none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .github/agents/speckit.plan.agent.md
  - ✅ .github/agents/speckit.analyze.agent.md
  - ✅ .github/agents/speckit.constitution.agent.md
- Companion artifacts:
  - ✅ .specify/memory/gate-checklist-matrix.md
  - ✅ .specify/memory/automation-policy.md
  - ✅ .github/workflows/quality-gates.yml
  - ✅ .githooks/pre-commit
  - ✅ .githooks/pre-push
  - ✅ scripts/quality-gates/common.sh
  - ✅ scripts/quality-gates/pre-commit.sh
  - ✅ scripts/quality-gates/pre-push.sh
  - ✅ scripts/quality-gates/ci.sh
  - ✅ scripts/quality-gates/validate-postgres-migrations.sh
-->

# Plugin Web Constitution

## Core Principles

### I. Test Evidence Before Implementation Approval

No implementation is complete until the required automated evidence exists and passes.

Mandatory rules:

- Every change MUST declare its impact area before implementation begins.
- Every changed behavior MUST map to the required combination of unit, integration,
  end-to-end, and regression testing.
- Every bug fix MUST include a regression test unless a written exception is approved.
- Focused tests, skipped tests, flaky retries, or undocumented test quarantines are prohibited.
- Missing test evidence is a gate failure, not a review note.

### II. Accessibility Is a Hard Gate

Accessibility is a release requirement for all user-facing work.

Mandatory rules:

- All user-facing changes MUST satisfy WCAG 2.2 AA expectations.
- Keyboard access, visible focus, semantic HTML, accessible names, and error recovery are mandatory.
- Dynamic UI MUST preserve focus order and announce meaningful state changes where required.
- Automated accessibility checks MUST be complemented by manual keyboard and focus verification
  for changed interactive flows.

### III. Security and Authorization Default to Deny

Security boundaries are enforced by default and cannot be delegated to the client.

Mandatory rules:

- Protected actions MUST be authenticated and authorized server-side.
- RBAC and ABAC policies MUST be centralized, explicit, and tested.
- Input validation, output encoding, secret protection, and least privilege are mandatory.
- Missing deny-path coverage is a gate failure.

### IV. Operational Readiness Is Part of Done

Code is not complete until it can be built, checked, run, observed, and recovered safely.

Mandatory rules:

- Every deployable artifact MUST build reproducibly from versioned source.
- Containerized services MUST define health checks, minimal runtime privileges, and image scan evidence.
- Production-capable changes MUST include enough observability to detect and diagnose failure.
- High-risk releases MUST define rollback or forward-fix paths before promotion.

### V. Data Integrity, API Discipline, and Performance by Design

Correctness, scalability, and portability depend on strong contracts, validated persistence, and
measured performance behavior.

Mandatory rules:

- PostgreSQL data integrity MUST be enforced with schema constraints and transactional correctness.
- REST APIs MUST use explicit contracts, validated inputs, structured errors, and correct HTTP semantics.
- Caching MUST never weaken correctness, authorization, or privacy.
- Performance-sensitive paths MUST define budgets and validation criteria.

## Enforcement Model

This constitution is written for binary evaluation by humans and agents.

- Every applicable gate returns exactly one of: `PASS`, `FAIL`, or `N/A`.
- Missing evidence is `FAIL`.
- `N/A` requires an explicit reason.
- Any required gate in `FAIL` blocks commit, push, merge, and release.
- Human approval does not override a failed constitution gate except through the formal exception process.
- The companion documents `.specify/memory/gate-checklist-matrix.md` and
  `.specify/memory/automation-policy.md` are normative operational references.

## Commit Gates

### C1. Clean Scope Gate

Pass only if the staged change set contains no secrets, no debug bypasses, no focused tests, and
no unrelated artifacts.

### C2. Formatting and Lint Gate

Pass only if formatting is clean, ESLint passes, and Biome check passes when `biome.json` is present.

### C3. Type Safety Gate

Pass only if TypeScript type checking completes with zero errors and no unapproved suppressions are added.

### C4. Unit Test Gate

Required for logic changes. Pass only if relevant unit tests exist, pass, and changed business logic
meets these thresholds:

- line coverage on new or changed logic >= 90%
- branch coverage on new or changed logic >= 85%
- branch coverage on new or changed auth, policy, validation, migration, and integrity logic = 100%

### C5. Secret and Dependency Safety Gate

Pass only if staged secret scan reports zero findings and no newly introduced dependency violates the
accepted severity threshold.

## Pull Request and CI Gates

### P1. Reproducible Build Gate

Pass only if the repository installs from lockfile and the production build succeeds on clean infrastructure.

### P2. Integration Gate

Required for boundary changes. Pass only if relevant integration tests exist and pass.

### P3. End-to-End Gate

Required for changed user flows, authentication, or protected actions. Pass only if all affected critical
journeys pass in CI.

### P4. Regression Gate

Required for bug fixes, incidents, accessibility fixes, and authorization fixes. Pass only if a regression
test exists and passes.

### P5. Accessibility Gate

Required for user-facing changes. Pass only if:

- automated accessibility checks report zero serious or critical issues on changed surfaces
- manual keyboard verification is recorded for changed interactive flows
- manual focus-management verification is recorded for dialogs, menus, drawers, and route transitions

### P6. SonarQube Gate

Pass only if SonarQube quality gate status is `PASS` with these minimum thresholds:

- blocker issues = 0
- critical issues = 0
- unreviewed security hotspots = 0
- maintainability rating = A
- reliability rating = A
- security rating = A
- new-code coverage >= 85%
- new-code duplication <= 3%

### P7. API Contract Gate

Required for API changes. Pass only if the contract is updated, validated, and either backward compatible
or explicitly versioned.

### P8. PostgreSQL Migration Gate

Required for schema or persistence changes. Pass only if migrations validate successfully against a disposable
PostgreSQL instance and preserve declared invariants.

### P9. Authorization Gate

Required for protected actions or policy changes. Pass only if allow-path, deny-path, tenant or ownership,
and privilege escalation tests all pass.

### P10. Caching Gate

Required for cache introduction or change. Pass only if keying, invalidation, freshness, and sensitive-data
partitioning are documented and validated.

### P11. Container Security Gate

Required for containerized deployment. Pass only if the runtime image builds, health checks exist, and image
scan reports zero critical vulnerabilities and zero high vulnerabilities unless an approved exception exists.

### P12. Network Security Gate

Required for trust-boundary changes. Pass only if validation, timeout, CORS, CSRF, and abuse-control requirements
are explicitly satisfied.

## Release Gates

### R1. Full Regression Gate

Pass only if the full regression suite passes in a production-like environment.

### R2. Health and Smoke Gate

Pass only if readiness, liveness, smoke checks, and deployment telemetry all report healthy status.

### R3. Recovery Gate

Required for high-risk releases. Pass only if rollback or forward-fix strategy is documented and credible,
and data recovery posture is confirmed.

## Measurable Standards by Area

### Testing Thresholds

- Unit coverage on new or changed business logic MUST be >= 90% line and >= 85% branch.
- Auth, policy, validation, migration, and integrity logic MUST maintain 100% branch coverage.
- Changed critical user paths MUST have end-to-end coverage.
- Non-trivial bug fixes MUST have regression tests.

### Accessibility Thresholds

- Serious or critical accessibility violations on changed surfaces MUST equal 0.
- Keyboard traps MUST equal 0.
- Unlabeled interactive controls on changed surfaces MUST equal 0.
- Focus-loss defects on changed flows MUST equal 0.

### SonarQube Thresholds

- Quality gate status MUST equal `PASS`.
- New-code coverage MUST be >= 85%.
- New-code duplication MUST be <= 3%.
- Blocker issues MUST equal 0.
- Critical issues MUST equal 0.
- Unreviewed security hotspots MUST equal 0.

### Container Thresholds

- Runtime image critical vulnerabilities MUST equal 0.
- Runtime image high vulnerabilities MUST equal 0 unless a valid exception exists.
- Runtime user MUST NOT be root unless a valid exception exists.
- Health checks MUST exist for deployable services.

### PostgreSQL Thresholds

- Every new durable table MUST have a primary key.
- Referential relationships MUST use foreign keys unless a documented exception exists.
- Critical uniqueness and domain invariants MUST be enforced by schema constraints.
- Schema changes MUST be validated through migration automation before merge.

### Authorization Thresholds

- Default deny MUST apply to undefined policy paths.
- Allow-path, deny-path, isolation, and escalation tests are mandatory where relevant.
- Policy decisions MUST use trusted server-side attributes.

### Caching Thresholds

- Every cache MUST declare key strategy, TTL, invalidation, and fallback behavior.
- Authorization-sensitive responses MUST NOT be stored in shared caches.
- Cache partitioning MUST include all response-shaping dimensions that affect correctness or exposure.

## Exception Process

Exceptions are temporary and rare. A valid exception MUST include:

1. the exact gate that fails
2. the reason it cannot currently pass
3. a risk assessment
4. compensating controls
5. a named owner
6. an expiry date
7. a linked follow-up issue

If any required field is missing, the exception is invalid and the gate remains `FAIL`.

The following are non-waivable without explicit constitution amendment:

- committed secrets
- missing required test evidence
- blocker or critical SonarQube issues on new code
- missing authorization on privileged actions
- serious or critical accessibility defects on changed user-facing flows
- critical container vulnerabilities
- failed migration validation for schema changes

## Governance

- This constitution supersedes undocumented team habit and convenience-based exceptions.
- Every specification, plan, task list, pull request, and release review MUST evaluate applicable gates.
- Agents MUST report gate outcomes explicitly using `PASS`, `FAIL`, or `N/A` with evidence.
- Companion files and automation must be kept in sync with amendments to this constitution.
- Constitutional changes follow semantic versioning:
  - MAJOR for incompatible governance or gate redefinition
  - MINOR for new gates or materially expanded requirements
  - PATCH for clarifications that do not alter enforcement semantics

**Version**: 2.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-23
