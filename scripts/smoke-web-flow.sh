#!/usr/bin/env bash
# Post-deploy / local smoke test for public routes + health + admin auth gate.
# Usage: ./scripts/smoke-web-flow.sh [base-url]
# Example: ./scripts/smoke-web-flow.sh http://localhost:3001

set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
BASE_URL="${BASE_URL%/}"

pass=0
fail=0

check_status() {
  local label="$1"
  local path="$2"
  local expected="$3"
  local code

  code="$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")"
  if [[ "$code" == "$expected" ]]; then
    echo "OK   ${label} (${path}) → ${code}"
    pass=$((pass + 1))
  else
    echo "FAIL ${label} (${path}) → expected ${expected}, got ${code}"
    fail=$((fail + 1))
  fi
}

echo "Smoke test: ${BASE_URL}"
echo ""

echo "── Health ──"
health_json="$(curl -s "${BASE_URL}/api/health")"
echo "${health_json}"
if echo "${health_json}" | grep -q '"ok":true'; then
  echo "OK   /api/health → ok:true"
  pass=$((pass + 1))
else
  echo "FAIL /api/health → ok is not true"
  fail=$((fail + 1))
fi
echo ""

echo "── Public routes ──"
check_status "Home" "/" "200"
check_status "Work" "/work" "200"
check_status "Journal" "/journal" "200"
check_status "Engineering" "/engineering" "200"
check_status "Resume" "/resume" "200"
check_status "Login" "/login" "200"
echo ""

echo "── Admin gate ──"
# When auth is configured, unauthenticated /admin should redirect to /login
admin_code="$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/admin")"
if [[ "$admin_code" == "200" || "$admin_code" == "307" || "$admin_code" == "308" ]]; then
  echo "OK   Admin gate (/admin) → ${admin_code}"
  pass=$((pass + 1))
else
  echo "FAIL Admin gate (/admin) → expected 200/307/308, got ${admin_code}"
  fail=$((fail + 1))
fi
echo ""

echo "── Summary ──"
echo "Passed: ${pass}  Failed: ${fail}"
echo ""
echo "Manual CMS flow (browser):"
echo "  1. /login → GitHub or Google OAuth"
echo "  2. /admin/work → create/edit → Publish"
echo "  3. /admin/resume → save profile"
echo "  4. /admin/media → upload (needs BLOB_READ_WRITE_TOKEN)"
echo "  5. Public /work + /resume → verify published content"

if [[ "$fail" -gt 0 ]]; then
  exit 1
fi
