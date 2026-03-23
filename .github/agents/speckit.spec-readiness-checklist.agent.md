---
description: Create or update a reviewer-facing specification readiness checklist before planning.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Create or update `FEATURE_DIR/checklists/spec-readiness.md` as a reviewer checklist that tests whether the specification is ready for `/speckit.plan` under the project constitution.

## Execution Steps

1. Run `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` from repo root once and parse:
   - `FEATURE_DIR`
   - `FEATURE_SPEC`
   Abort with an error if no active feature spec exists.

2. Load the necessary context from:
   - `FEATURE_SPEC`
   - `.specify/templates/checklist-template.md`
   - `.specify/memory/constitution.md`
   - `.specify/memory/gate-checklist-matrix.md`
   - `.specify/memory/automation-policy.md`

3. Create or update `FEATURE_DIR/checklists/spec-readiness.md` using the checklist template structure.

4. Populate the checklist with requirement-quality questions, not implementation tests. Cover at minimum:
   - gate classification completeness and consistency
   - validation evidence completeness and explicit `N/A` reasons
   - user scenario coverage
   - requirement clarity and measurability
   - accessibility, security, database, API contract, caching, and performance requirement coverage when relevant
   - automation mapping for applicable gates

5. Checklist rules:
   - Use reviewer-oriented wording for pre-plan readiness
   - Include traceability references or gap markers on at least 80% of items
   - Include a `Constitution Gate Coverage` section with questions aligned to `S1` through `S8`
   - Append to the existing checklist if it already exists; do not delete reviewer notes

6. Report:
   - checklist path
   - whether the file was created or appended
   - item count
   - primary gates covered