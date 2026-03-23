#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

if ! has_playwright_e2e && ! package_json_has_script "test:e2e"; then
  info "No end-to-end framework detected; E2E gate is N/A"
  exit 0
fi

if package_json_has_script "test:e2e"; then
  run_cmd npm run test:e2e
  exit 0
fi

if has_playwright_e2e; then
  run_cmd npx playwright test
  exit 0
fi

fail "End-to-end gate is applicable but no runnable E2E command was found"