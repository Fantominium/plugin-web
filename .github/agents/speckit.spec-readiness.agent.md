---
description: Review the active feature specification for constitution gate completeness and readiness before planning.
handoffs:
  - label: Generate Readiness Checklist
    agent: speckit.spec-readiness-checklist
    prompt: Create the reviewer checklist for spec readiness
    send: true
  - label: Clarify Spec Requirements
    agent: speckit.clarify
    prompt: Resolve missing or ambiguous specification details before planning
    send: true
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Proceed to planning only if the specification is ready
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Perform a read-only specification readiness review before `/speckit.plan`. The review is governed by `.specify/memory/constitution.md`, `.specify/memory/gate-checklist-matrix.md`, and `.specify/memory/automation-policy.md`.

## Execution Steps

1. Run `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` from repo root once and parse:
   - `FEATURE_DIR`
   - `FEATURE_SPEC`
   - `IMPL_PLAN`
   Abort with an error if no active feature spec exists.

2. Load the minimal required context from:
   - `FEATURE_SPEC`
   - `.specify/memory/constitution.md`
   - `.specify/memory/gate-checklist-matrix.md`
   - `.specify/memory/automation-policy.md`

3. Validate the specification against these mandatory pre-plan conditions:
   - `## Constitution Gate Classification` exists and every row has an explicit `Yes` or `No` plus concrete notes
   - `## Required Validation Evidence` exists and every applicable validation area has explicit evidence expectations
   - Any `N/A` evidence item states a reason
   - User scenarios, requirements, edge cases, and success criteria are present and materially consistent with the classified gates
   - Specification gates `S1` through `S8` are each `PASS`, `FAIL`, or `N/A` with evidence

4. Produce a compact markdown review with:
   - A readiness verdict: `READY` or `BLOCKED`
   - A gate table with columns: `Gate | Status | Evidence / Gap | Required Action`
   - A short section named `Blocking Issues` for every `FAIL`
   - A short section named `Open Questions` for any ambiguity better handled by `/speckit.clarify`
   - A short section named `Next Command`

5. Verdict rules:
   - If any mandatory section is missing, verdict is `BLOCKED`
   - If any applicable specification gate fails, verdict is `BLOCKED`
   - `READY` is allowed only when every applicable gate passes and no required evidence section is incomplete

## Operating Constraints

- Read-only: never modify files
- Treat constitution requirements as authoritative
- Do not hand-wave missing evidence; if it is absent, mark `FAIL`
- Keep the report concise and reviewer-oriented

## Output

End with exactly one recommended next command:
- `/speckit.plan` when verdict is `READY`
- `/speckit.clarify` or `/speckit.specify` when verdict is `BLOCKED`