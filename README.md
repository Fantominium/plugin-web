# Plugin Web

Plugin Web is a Next.js application for event discovery and related product workflows. This repository also includes a Spec Kit driven planning workflow backed by an enforceable engineering constitution, quality gates, and reviewer commands.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Quality Gates

Install local hooks once per clone:

```bash
npm run hooks:install
```

Additional gate activation details live in `QUALITY_GATES.md`.

## Spec Kit Workflow

The repository uses Spec Kit commands for specification, clarification, planning, and task generation.

Core authoring flow:

1. `/speckit.specify` to create or update the feature specification
2. `/speckit.clarify` to resolve high-impact ambiguities in the active spec
3. `/speckit.plan` to build the implementation plan
4. `/speckit.tasks` to generate dependency-ordered implementation tasks

## Reviewer Commands

Before planning, reviewers can use the following commands:

1. `/speckit.spec-readiness`
   Returns a read-only `READY` or `BLOCKED` verdict for the active spec against the constitution, specification gates, and required validation evidence.
2. `/speckit.spec-readiness-checklist`
   Creates or updates `checklists/spec-readiness.md` for reviewer use before `/speckit.plan`.

## Automatic Readiness Hooks

Spec readiness checks are also injected automatically through `.specify/extensions.yml`:

1. Before `/speckit.plan`
2. Before `/speckit.tasks`

Those hooks invoke `/speckit.spec-readiness` as a mandatory pre-check so planning and task generation do not proceed on an incomplete spec.

## Governance Files

The spec workflow is governed by:

1. `.specify/memory/constitution.md`
2. `.specify/memory/gate-checklist-matrix.md`
3. `.specify/memory/automation-policy.md`

## Stack

1. Next.js
2. React
3. TypeScript
4. Jest
5. ESLint
6. Biome
