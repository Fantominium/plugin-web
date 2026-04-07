#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

require_command npm

run_cmd npm run lint
run_cmd npm run typecheck
run_cmd npm run test:ci
run_cmd npm run gates:bdd
run_cmd npm run gates:contracts
run_cmd npm run gates:a11y
run_cmd npm run gates:e2e

if [[ -f "$REPO_ROOT/biome.json" ]]; then
  info "Running repository Biome check"
  npx --yes @biomejs/biome check . || fail "Biome repository check failed"
fi

info "Repository CI quality gates passed"