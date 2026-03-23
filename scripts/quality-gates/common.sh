#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

info() {
  printf '==> %s\n' "$*"
}

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

require_command() {
  has_command "$1" || fail "Missing required command: $1"
}

run_cmd() {
  info "$*"
  "$@"
}

list_staged_files() {
  git -C "$REPO_ROOT" diff --cached --name-only --diff-filter=ACMRTUXB
}

has_migration_path() {
  local candidate
  for candidate in \
    "$REPO_ROOT/migrations" \
    "$REPO_ROOT/db/migrations" \
    "$REPO_ROOT/prisma/migrations" \
    "$REPO_ROOT/supabase/migrations"; do
    if [[ -d "$candidate" ]]; then
      return 0
    fi
  done

  return 1
}

search_text() {
  local pattern="$1"
  shift

  if has_command rg; then
    rg -n "$pattern" "$@"
  else
    grep -R -n -E "$pattern" "$@"
  fi
}

package_json_has_script() {
  local script_name="$1"

  node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json','utf8')); process.exit(pkg.scripts && pkg.scripts['$script_name'] ? 0 : 1);" >/dev/null 2>&1
}

package_json_has_dependency() {
  local dependency_name="$1"

  node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json','utf8')); const deps={...(pkg.dependencies||{}), ...(pkg.devDependencies||{})}; process.exit(deps['$dependency_name'] ? 0 : 1);" >/dev/null 2>&1
}

has_openapi_contracts() {
  local candidate
  for candidate in \
    "$REPO_ROOT/openapi.yaml" \
    "$REPO_ROOT/openapi.yml" \
    "$REPO_ROOT/openapi.json" \
    "$REPO_ROOT/contracts/openapi.yaml" \
    "$REPO_ROOT/contracts/openapi.yml" \
    "$REPO_ROOT/contracts/openapi.json"; do
    if [[ -f "$candidate" ]]; then
      return 0
    fi
  done

  if has_command rg && rg -l 'openapi: 3|swagger: "2.0"|swagger: ''2.0''' "$REPO_ROOT/specs" >/dev/null 2>&1; then
    return 0
  fi

  return 1
}

has_playwright_e2e() {
  [[ -f "$REPO_ROOT/playwright.config.ts" ]] || [[ -f "$REPO_ROOT/playwright.config.js" ]] || package_json_has_dependency "@playwright/test" || package_json_has_dependency "playwright"
}

has_accessibility_tooling() {
  package_json_has_script "test:a11y" || package_json_has_dependency "jest-axe" || package_json_has_dependency "@axe-core/playwright" || package_json_has_dependency "axe-playwright"
}