#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

require_command git
require_command npm

STAGED_FILES=()
while IFS= read -r staged_file; do
  STAGED_FILES+=("$staged_file")
done < <(list_staged_files)

if [[ ${#STAGED_FILES[@]} -eq 0 ]]; then
  info "No staged files detected; skipping pre-commit checks"
  exit 0
fi

info "Scanning staged diff for obvious secrets"
ADDED_LINES="$(git diff --cached --no-color --unified=0 | grep -E '^\+[^+]' || true)"

if [[ -n "$ADDED_LINES" ]]; then
  FILTERED_LINES="$(printf '%s\n' "$ADDED_LINES" \
    | grep -E -v '\$\{\{[[:space:]]*secrets\.[^}]+\}\}' \
    | grep -E -v '^[+].*(POSTGRES_PASSWORD|PGPASSWORD):[[:space:]]*postgres([[:space:]]*)$' \
    || true)"

  if printf '%s\n' "$FILTERED_LINES" | grep -E -i "(-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----|((api[_-]?key|secret|token|password)[[:space:]]*[:=][[:space:]]*['\"][^'\"]+['\"]|((api[_-]?key|secret|token|password)[[:space:]]*[:=][[:space:]]*[A-Za-z0-9_+-]{12,})))" >/dev/null; then
    fail "Potential secret material detected in staged changes"
  fi
fi

info "Checking for focused tests"
if search_text '(describe|it|test)\.only\(' "${STAGED_FILES[@]}" >/dev/null 2>&1; then
  fail "Focused tests detected in staged files"
fi

run_cmd npm run lint
run_cmd npm run typecheck

JS_TS_STAGED=()
BIOME_STAGED=()
for file in "${STAGED_FILES[@]}"; do
  case "$file" in
    *.js|*.jsx|*.ts|*.tsx)
      JS_TS_STAGED+=("$file")
      ;;
  esac

  case "$file" in
    *.js|*.jsx|*.cjs|*.mjs|*.ts|*.tsx|*.cts|*.mts|*.json|*.jsonc|*.css)
      BIOME_STAGED+=("$file")
      ;;
  esac
done

if [[ ${#JS_TS_STAGED[@]} -gt 0 ]]; then
  run_cmd npm test -- --findRelatedTests "${JS_TS_STAGED[@]}" --passWithNoTests
fi

if [[ -f "$REPO_ROOT/biome.json" ]]; then
  if [[ ${#BIOME_STAGED[@]} -gt 0 ]]; then
    info "Running Biome staged-file check"
    npx --yes @biomejs/biome check "${BIOME_STAGED[@]}" || fail "Biome check failed"
  else
    info "No Biome-supported staged files detected; skipping Biome staged-file check"
  fi
fi

info "Pre-commit quality gates passed"