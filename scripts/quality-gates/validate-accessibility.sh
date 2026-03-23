#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

if ! has_accessibility_tooling; then
  info "No dedicated accessibility automation detected; accessibility automation gate is N/A"
  exit 0
fi

if package_json_has_script "test:a11y"; then
  run_cmd npm run test:a11y
  exit 0
fi

fail "Accessibility tooling is present but no test:a11y script is configured"