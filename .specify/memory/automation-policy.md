# Plugin Web Automation Policy

This document maps constitution gates to concrete automation. It exists to ensure gate
evaluation is performed by tooling instead of reviewer memory.

## Enforcement Layers

| Layer | Trigger | Enforced By | Failure Effect |
| ----- | ------- | ----------- | -------------- |
| Local pre-commit | `git commit` | `.githooks/pre-commit` -> `scripts/quality-gates/pre-commit.sh` | Commit blocked |
| Local pre-push | `git push` | `.githooks/pre-push` -> `scripts/quality-gates/pre-push.sh` | Push blocked |
| Pull request CI | `pull_request` | `.github/workflows/quality-gates.yml` | PR not mergeable |
| Main branch CI | `push` to protected branches | `.github/workflows/quality-gates.yml` | Branch protection fails |
| SonarQube | PR / main branch | SonarQube quality gate + `sonar-project.properties` | PR blocked once branch protection requires job |
| Container security | PR / main branch when Dockerfile exists | Trivy image scan in workflow | PR blocked for critical findings |
| Postgres migration validation | PR / main branch when migration paths exist | Migration validation script + PostgreSQL service container | PR blocked |

## Required Repository Controls

The following repository settings must be enabled:

1. Protected main branch with required status checks.
2. Required linear history or squash merges.
3. Dismiss stale approvals on new commits.
4. Require conversation resolution before merge.
5. Require signed or verified commits if organization policy demands it.
6. Require the following checks once configured:
   - `quality-gates`
   - `postgres-migration-validation`
   - `container-security`
   - `sonarqube`

## Local Hook Policy

### Pre-commit

The pre-commit hook must block commits when any of the following fail:

- staged secret scan
- focused test detection (`.only`)
- lint on repository scope
- type check on repository scope
- related Jest tests for staged JS/TS files
- Biome repository check when `biome.json` is present

Install hooks with:

```bash
npm run hooks:install
```

### Pre-push

The pre-push hook must block push when any of the following fail:

- repository lint
- repository type check
- CI Jest suite
- Biome repository check when configured

## GitHub Actions Policy

### Workflow: `quality-gates`

Mandatory jobs:

1. `quality-gates`
   - clean checkout
   - dependency install from lockfile
   - ESLint
   - TypeScript type check
   - Jest CI coverage run
   - contract validation with `N/A` only when no contract files exist
   - accessibility automation with `N/A` only when no dedicated tooling exists
   - end-to-end validation with `N/A` only when no end-to-end framework exists
   - Biome check

2. `postgres-migration-validation`
   - start PostgreSQL service
   - export test database environment
   - run migration validation script
   - fail if migration command is required but not configured

3. `container-security`
   - build runtime image when Dockerfile exists
   - run Trivy scan
   - fail on critical vulnerabilities
   - fail on high vulnerabilities unless exception process exists outside pipeline

4. `sonarqube`
   - run only when SonarQube secrets are configured
   - quality gate must be required in branch protection once server integration is active

## SonarQube Policy

### Required secrets

- `SONAR_TOKEN`
- `SONAR_HOST_URL`

### Required quality gate thresholds

- new-code coverage >= 85%
- new-code duplication <= 3%
- blocker issues = 0
- critical issues = 0
- unreviewed security hotspots = 0
- maintainability rating = A
- reliability rating = A
- security rating = A

### Project configuration

- `sonar-project.properties` must exist in repo root.
- Coverage report path must point to Jest LCOV output.
- Test files must be declared clearly to avoid false negatives.

## Biome Policy

Biome exists for formatter and inline lint diagnostics.

Required controls:

- `biome.json` must exist at repo root.
- Editor integration should surface inline diagnostics on changed files.
- CI must run `npx @biomejs/biome check .`.
- Local hooks must fail if `biome.json` exists but Biome is unavailable.

## Pull Request Template Policy

The repository-level pull request template must mirror the constitution gate matrix.

Required controls:

- PR authors must mark each applicable PR gate as `PASS`, `FAIL`, or `N/A`.
- `N/A` requires a short reason.
- Evidence links or references are required for unit, integration, e2e, regression, accessibility,
   contract, migration, and SonarQube outcomes.

## Spec Kit Hook Policy

Specification quality must be enforced before planning and task generation, not discovered late.

- `.specify/extensions.yml` is the source of truth for Spec Kit pre-plan and pre-tasks hooks
- `hooks.before_plan` MUST invoke `/speckit.spec-readiness` as a mandatory hook
- `hooks.before_tasks` MUST invoke `/speckit.spec-readiness` as a mandatory hook
- reviewer-facing checklist generation is available via `/speckit.spec-readiness-checklist`
- if the readiness review reports `BLOCKED`, the user must resolve the specification with `/speckit.specify` or `/speckit.clarify` before continuing

## End-to-End Validation Policy

End-to-end validation is mandatory when user-critical flows change.

Activation rules:

- if Playwright or another e2e runner is not present, the automation reports `N/A`
- if e2e tooling exists, a runnable command must exist through `test:e2e` or the gate fails

## Accessibility Automation Policy

Dedicated accessibility automation should be activated as soon as the repository introduces tooling.

Activation rules:

- if no dedicated accessibility tooling is present, the automation reports `N/A`
- if accessibility tooling exists, a runnable `test:a11y` command must exist or the gate fails

## Contract Validation Policy

Contract validation becomes mandatory when OpenAPI or Swagger contracts appear in the repository.

Activation rules:

- if no contract files exist, the automation reports `N/A`
- if contract files exist, one of the following must be configured: `test:contracts`, `contracts:validate`, or `CONTRACT_VALIDATE_COMMAND`
- if none is configured, the contract gate fails

## Container Security Policy

If a Dockerfile exists or container deployment is introduced:

- runtime image must be built in CI
- image must be scanned with Trivy
- health checks must exist in Dockerfile or deployment manifest
- runtime container must avoid root user unless explicitly approved
- secrets must not be present in image layers

## PostgreSQL Migration Validation Policy

Migration validation is mandatory when a migration directory exists or database-affecting changes are introduced.

Expected setup:

- workflow provides a disposable PostgreSQL instance
- `DATABASE_URL` is set for validation
- `MIGRATION_VALIDATE_COMMAND` is defined in CI when the project introduces a migration tool

Validation rules:

- if no migration paths exist, the gate is `N/A`
- if migration paths exist and no validation command is configured, the gate is `FAIL`
- if migration command fails on a clean disposable database, the gate is `FAIL`

## Exception Handling

Automation must not silently downgrade failures to warnings for constitution-level gates.

Exceptions may be documented outside tooling, but the pipeline must still fail unless the
relevant gate has been redefined by explicit constitution amendment.
