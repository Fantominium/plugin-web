#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

cd "$REPO_ROOT"

if ! has_migration_path; then
  info "No migration directory detected; PostgreSQL migration gate is N/A"
  exit 0
fi

require_command psql

if [[ -z "${DATABASE_URL:-}" ]]; then
  fail "DATABASE_URL is required for PostgreSQL migration validation"
fi

if [[ -z "${MIGRATION_VALIDATE_COMMAND:-}" ]]; then
  fail "Migration directory exists but MIGRATION_VALIDATE_COMMAND is not configured"
fi

info "Checking PostgreSQL connectivity"
psql "$DATABASE_URL" -c 'SELECT 1;' >/dev/null

info "Running migration validation command"
bash -lc "$MIGRATION_VALIDATE_COMMAND"

info "PostgreSQL migration validation passed"