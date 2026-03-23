#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

require_command npm

run_cmd bash ./scripts/quality-gates/ci.sh --local