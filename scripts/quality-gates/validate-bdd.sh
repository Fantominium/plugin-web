#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

if ! package_json_has_script "test:bdd"; then
  fail "BDD gate requires a test:bdd script in package.json"
fi

run_cmd npm run test:bdd
