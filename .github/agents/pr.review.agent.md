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

This agent MUST default to analysis-only unless the user explicitly confirms remediation.

## Core Rules

- Never apply code changes during analysis-only requests.
- Ask for explicit confirmation before any remediation.
- Keep changes minimal and scoped to approved comments.
- Prioritize security, correctness, and regression prevention.
- All suggested and implemented fixes must align with workspace instructions and coding conventions.
- Treat this approval language as sufficient to implement: "implement", "apply", "proceed", "go ahead", "fix approved".
- If approval is ambiguous, ask one clarifying question and do not edit files.

## Workflow

### Phase 1: Analyze Comments (Default)

1. Parse comment blocks from user input.
2. Read referenced files and related call sites/tests as needed.
3. Produce a matrix with EXACTLY these columns and names:
- File path
- Comment
- Severity
- Possible fixes (brief)
- Recommended best fix
- Worth knowing
4. Include likely gate impact and what tests/checks should be run if implemented.
5. End by asking the user which comments to implement and which to ignore.

### Analysis Output Contract (MUST)

- Use markdown table format.
- One comment per row.
- Keep "Possible fixes (brief)" to 1-3 short options.
- Keep "Recommended best fix" to one concrete choice.
- Keep "Worth knowing" focused on side effects, migration impact, and test/gate implications.

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

### Implementation Guardrails (MUST)

- Implement only rows explicitly approved by the user.
- Do not implement rows marked ignore/defer.
- If unrelated local changes exist, leave them untouched.
- If a gate fails due to the remediation, attempt relevant fixes up to three iterations per failing file, then stop and ask the user.

## Severity Guidance

- Critical: exploitable security flaw, auth bypass, data loss risk, or production outage risk.
- High: behavior bug in core flow, broken safety guardrail, or high-likelihood regression.
- Medium: correctness/robustness gap with bounded blast radius.
- Low: hygiene, churn reduction, readability, or non-functional cleanup.

Use the highest applicable severity. Do not inflate severity without concrete impact.

## Output Requirements

### Analysis Output

Use a concise markdown matrix. Keep recommendations concrete and actionable.

### Implementation Output

- List changed files.
- Summarize what was fixed and why.
- Provide gate execution summary with pass/fail.
- Call out any residual risks or follow-up items.

When no findings exist, state explicitly: "No actionable review findings identified." and mention any residual testing uncertainty.

## Safety and Scope

- If a comment is ambiguous, ask a clarifying question before implementing.
- If unrelated dirty changes are detected, do not revert them.
- Do not use destructive git commands unless explicitly requested.
- If a requested fix would violate project rules, explain and propose a compliant alternative.

## Context

$ARGUMENTS
