# Quality Gates Activation Guide

This repository already contains the constitution, gate matrix, pull request template, local hooks,
and CI wiring for policy enforcement. This guide explains how to turn each optional gate into an
active blocking gate as the stack grows.

## Already Active

- ESLint
- TypeScript type checking
- Jest CI coverage run
- BDD scenario tests via `test:bdd`
- Biome check when `biome.json` exists
- staged secret scan
- focused test detection
- PostgreSQL migration validation when migration directories exist
- container image scan when a `Dockerfile` exists

## Activate BDD Gate

Add a dedicated script in `package.json`:

```json
{
  "scripts": {
    "test:bdd": "jest --runInBand --testPathPatterns=.bdd.test.ts"
  }
}
```

Recommended tooling:

- `jest-cucumber` for Gherkin-style behavior tests running inside Jest

Once `test:bdd` exists, `npm run gates:bdd` becomes a blocking gate and runs as part of `gates:ci`.

## Activate Git Hooks

```bash
npm run hooks:install
```

## Spec Stage Commands

Before running `/speckit.plan`, reviewers can use:

- `/speckit.spec-readiness` for a read-only readiness verdict against constitution gates
- `/speckit.spec-readiness-checklist` to create or update a reviewer checklist at `checklists/spec-readiness.md`

The repository also injects `/speckit.spec-readiness` automatically before `/speckit.plan` and `/speckit.tasks` through `.specify/extensions.yml`.

## Activate End-to-End Gate

Choose one of the following:

1. Add Playwright and a config file such as `playwright.config.ts`
2. Add a dedicated script in `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

Once either exists, `npm run gates:e2e` stops reporting `N/A` and becomes a blocking gate.

## Activate Accessibility Automation Gate

Add a dedicated script in `package.json`:

```json
{
  "scripts": {
    "test:a11y": "jest --runInBand a11y"
  }
}
```

Recommended tooling:

- `jest-axe` for component and DOM accessibility assertions
- `@axe-core/playwright` for route-level accessibility checks

Once tooling exists, missing `test:a11y` becomes a failing gate.

## Activate Contract Validation Gate

If OpenAPI or Swagger files are added, configure one of:

```json
{
  "scripts": {
    "test:contracts": "your-contract-validator-command",
    "contracts:validate": "your-contract-validator-command"
  }
}
```

Or provide an environment variable in CI:

```bash
CONTRACT_VALIDATE_COMMAND="your-contract-validator-command"
```

Without one of those, contract files make the contract gate fail by design.

## Activate PostgreSQL Migration Validation Gate

When a migration tool is introduced, set the CI variable:

```bash
MIGRATION_VALIDATE_COMMAND="your-migration-apply-or-validate-command"
```

Examples:

- Prisma: `npx prisma migrate deploy`
- Drizzle: `npx drizzle-kit migrate`
- TypeORM: `npx typeorm migration:run -d path/to/data-source.ts`

## Activate SonarQube Gate

Configure the repository secrets:

- `SONAR_TOKEN`
- `SONAR_HOST_URL`

Then require the `sonarqube` job in branch protection.

## Activate Container Gate

Add a `Dockerfile` at the repository root. Once present, the workflow will:

- build the image
- scan the runtime image with Trivy
- fail on critical or high vulnerabilities

## Pull Request Workflow

Use the repository template in `.github/pull_request_template.md`.

Authors must:

- classify scope
- mark each gate `PASS`, `FAIL`, or `N/A`
- link evidence for applicable tests and scans
- document exceptions explicitly
