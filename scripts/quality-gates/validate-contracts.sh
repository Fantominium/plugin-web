#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

if ! has_openapi_contracts; then
  info "No OpenAPI or Swagger contract files detected; contract gate is N/A"
  exit 0
fi

if package_json_has_script "test:contracts"; then
  run_cmd npm run test:contracts
  exit 0
fi

if package_json_has_script "contracts:validate"; then
  run_cmd npm run contracts:validate
  exit 0
fi

if [[ -n "${CONTRACT_VALIDATE_COMMAND:-}" ]]; then
  run_cmd bash -lc "$CONTRACT_VALIDATE_COMMAND"
  exit 0
fi

fail "Contract files were detected but no contract validation command is configured"