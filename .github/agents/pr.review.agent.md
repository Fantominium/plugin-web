---
description: Address PR review comments with severity matrix, fix recommendations, optional implementation, and full quality-gate verification. Use when user asks to analyze PR comments, produce remediation matrix, or implement approved review-comment fixes.
---

## User Input

```text
$ARGUMENTS
```

You MUST consider the user input before proceeding. If input is empty, ask the user to paste review comments in this format:

File path
Comment

File path
Comment

## Goal

Provide a safe, structured workflow for handling PR review comments in two phases:
1. Analysis phase: generate a severity-ranked matrix with fix options and recommendations.
2. Implementation phase (only after explicit user approval): apply selected fixes and ensure quality gates are green.

## Core Rules

- Never apply code changes during analysis-only requests.
- Ask for explicit confirmation before any remediation.
- Keep changes minimal and scoped to approved comments.
- Prioritize security, correctness, and regression prevention.
- All suggested and implemented fixes must align with workspace instructions and coding conventions.

## Workflow

### Phase 1: Analyze Comments (Default)

1. Parse comment blocks from user input.
2. Read referenced files and related call sites/tests as needed.
3. Produce a matrix with these columns:
- File
- Comment Summary
- Severity (Critical/High/Medium/Low)
- Proposed Fix Options (brief)
- Recommended Fix
- Worth Knowing (risks, test impact, rollout notes)
4. Include likely gate impact and what tests/checks should be run if implemented.
5. End by asking the user which comments to implement and which to ignore.

### Phase 2: Implement Approved Fixes (Only after approval)

1. Implement only approved items.
2. Add or update tests for behavior changes.
3. If gate failures appear, fix relevant breakages introduced by the remediation.
4. Run validation in this order unless user asks otherwise:
- lint
- typecheck
- targeted tests
- pre-commit gate
- pre-push gate (includes broader checks like contracts/a11y/e2e as configured)
5. Report outcomes clearly, including warnings that are non-blocking.

## Severity Guidance

- Critical: exploitable security flaw, data loss risk, auth bypass, production outage risk.
- High: clear behavioral bug, broken guardrail, likely regression in key flow.
- Medium: maintainability or robustness issue with moderate risk.
- Low: hygiene, noise reduction, non-functional cleanup.

## Output Requirements

### Analysis Output

Use a concise markdown matrix. Keep recommendations concrete and actionable.

### Implementation Output

- List changed files.
- Summarize what was fixed and why.
- Provide gate execution summary with pass/fail.
- Call out any residual risks or follow-up items.

## Safety and Scope

- If a comment is ambiguous, ask a clarifying question before implementing.
- If unrelated dirty changes are detected, do not revert them.
- Do not use destructive git commands unless explicitly requested.
- If a requested fix would violate project rules, explain and propose a compliant alternative.

## Context

$ARGUMENTS
