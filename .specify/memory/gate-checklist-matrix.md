# Plugin Web Gate Checklist Matrix

Use this as the one-page evaluation table for specification, planning, pull request review,
and release readiness. Every row is binary: `PASS`, `FAIL`, or `N/A`. Missing evidence is
`FAIL`.

## Specification Gate Matrix

| Gate | Applies When | Required Evidence in Spec / Plan | PASS Criteria | FAIL Criteria |
|------|--------------|----------------------------------|---------------|---------------|
| S1 Change Classification | Always | Explicit classification of impacted areas | All relevant areas are declared: UI/a11y, business logic, API, authz, database, caching, container, security, performance | Scope is missing, incomplete, or obviously misclassified |
| S2 Test Strategy | Always | Planned unit, integration, e2e, and regression evidence by scope | Every changed behavior has a declared test strategy and affected gates are identified | Tests are omitted, marked optional, or not mapped to scope |
| S3 Accessibility Scope | Any user-facing change | Accessibility acceptance criteria and validation notes | Keyboard, focus, semantics, errors, announcements, and contrast are addressed | Accessibility omitted for affected UI |
| S4 Security Scope | Any trust-boundary or privileged change | Authn/authz, input validation, secrets, abuse controls | Server-side enforcement and data protection are specified | Security-sensitive change lacks explicit controls |
| S5 Data and Migration Scope | Any schema or persistence change | Migration, rollback, invariants, constraints | PostgreSQL integrity and migration validation are defined | Schema change lacks validation or rollback planning |
| S6 API Contract Scope | Any endpoint or payload change | Contract update, status codes, errors, versioning | Backward compatibility or versioning path is explicit | Contract changed silently |
| S7 Performance and Caching Scope | Any latency-sensitive or cache change | Cache keys, TTLs, invalidation, budgets | Correctness and measurement plan are explicit | Performance or caching changes are vague or correctness-risking |
| S8 Automation Mapping | Always | Gate-to-tool mapping reference | Relevant commit, CI, SonarQube, container, and migration gates are named | Manual review is the only enforcement path |

## Pull Request Gate Matrix

| Gate | Applies When | Evidence Source | PASS Criteria | FAIL Criteria |
|------|--------------|----------------|---------------|---------------|
| P1 Clean Scope | Always | Staged diff / PR diff | No secrets, debug bypasses, focused tests, or unrelated artifacts | Any prohibited artifact or unintended file change |
| P2 Formatting and Lint | Always | Pre-commit + CI logs | ESLint passes, Biome check passes, no blocking warnings on changed files | Any formatter drift or lint failure |
| P3 Type Safety | TS/JS changes | CI logs | `npm run typecheck` passes with zero errors | Any type error or unapproved suppression |
| P4 Unit Tests | Logic changes | Jest output + coverage | Relevant unit tests pass; new or changed logic meets coverage thresholds | Missing tests, failures, skips, or coverage below threshold |
| P5 Integration Tests | Boundary changes | CI logs | Relevant integration coverage exists and passes | Missing or failing integration coverage |
| P6 End-to-End Tests | User-flow or auth-flow changes | CI logs | Critical changed journeys pass | Missing or failing critical-path e2e tests |
| P7 Regression Tests | Bug fixes / incidents | Test references | Regression test exists and passes | Fix lacks regression coverage |
| P8 Accessibility | UI changes | Automated scan + manual notes | Zero serious/critical issues; manual keyboard/focus checks recorded | Accessibility violations or missing manual verification |
| P9 SonarQube | Always once configured | SonarQube quality gate | Quality gate is `PASS`; zero blocker/critical issues and zero unreviewed hotspots | Any failing quality gate condition |
| P10 API Contract | API changes | Contract diff / CI validation | Contract updated and validated | Silent breaking change or stale contract |
| P11 Postgres Migration | DB changes | Migration validation job | Migrations apply cleanly and preserve invariants | Migration validation missing or failing |
| P12 Authorization | Protected actions / policy changes | Policy tests | Allow, deny, tenant, owner, and escalation tests pass | Default deny missing or privilege risk exists |
| P13 Caching | Cache changes | Tests + design notes | Keying, invalidation, and sensitive-data boundaries are validated | Cache can leak, stale, or corrupt correctness |
| P14 Container Security | Containerized deployables | Build + scan logs | Build passes, health checks exist, zero critical vulns | Build failure, missing health checks, or critical vuln |
| P15 Network Security | External/public interface changes | Tests + config review | Validation, timeout, CORS, CSRF, and abuse controls are present | Any trust boundary is left implicit or unprotected |

## Release Gate Matrix

| Gate | Applies When | Evidence Source | PASS Criteria | FAIL Criteria |
|------|--------------|----------------|---------------|---------------|
| R1 Full Regression | Production promotion | Release pipeline | Full regression suite passes | Any critical regression failure |
| R2 Smoke and Health | Deployment | Post-deploy checks | Readiness, liveness, smoke, and telemetry checks pass | Unhealthy deployment or no telemetry |
| R3 Recovery Readiness | High-risk releases | Release checklist | Rollback or forward-fix path exists and is credible | No recovery path for risky change |

## Threshold Reference

| Area | Threshold |
|------|-----------|
| Unit coverage on new or changed business logic | >= 90% line, >= 85% branch |
| Coverage for auth, policy, validation, migration, and integrity logic | 100% branch |
| SonarQube new-code coverage | >= 85% |
| SonarQube new-code duplication | <= 3% |
| SonarQube blocker issues | 0 |
| SonarQube critical issues | 0 |
| SonarQube unreviewed security hotspots | 0 |
| Accessibility serious or critical violations on changed surfaces | 0 |
| Runtime image critical vulnerabilities | 0 |
| Runtime image high vulnerabilities | 0 unless approved exception exists |

## Usage Notes

- Specifications and plans must reference the specification gate matrix.
- Pull requests must reference the pull request gate matrix.
- Release reviews must reference the release gate matrix.
- If a gate is `N/A`, the reason must be stated explicitly.