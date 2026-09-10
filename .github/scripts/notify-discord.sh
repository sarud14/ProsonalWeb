#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DISCORD_WEBHOOK_URL:-}" ]; then
  echo "DISCORD_WEBHOOK_URL secret is not set; skipping notification."
  exit 0
fi

# Discord/Cloudflare returns 403 for Python-urllib's default User-Agent.
payload="$(python3 - <<'PY'
import json
import os

title = os.environ["NOTIFY_TITLE"]
color = int(os.environ["NOTIFY_COLOR"])
branch = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME", "")
sha = os.environ.get("GITHUB_SHA", "")[:7]
repo = os.environ["GITHUB_REPOSITORY"]
run_url = f"https://github.com/{repo}/actions/runs/{os.environ['GITHUB_RUN_ID']}"

fields = [
    {"name": "Repository", "value": repo, "inline": True},
    {"name": "Branch", "value": branch or "(unknown)", "inline": True},
    {"name": "Commit", "value": sha or "(unknown)", "inline": False},
]

for key, label, inline in (
    ("CHECK_RESULT", "check job", True),
    ("E2E_RESULT", "e2e job", True),
    ("VERCEL_RESULT", "Vercel", True),
    ("DEPLOY_URL", "Deploy URL", False),
):
    value = os.environ.get(key, "").strip()
    if value:
        fields.append({"name": label, "value": value, "inline": inline})

print(json.dumps({
    "username": "sarut-portfolio CI",
    "embeds": [{"title": title, "color": color, "url": run_url, "fields": fields}],
}))
PY
)"

tmp="$(mktemp)"
http_code="$(
  curl -sS --max-time 30 -o "$tmp" -w "%{http_code}" -X POST "$DISCORD_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -H "User-Agent: sarut-portfolio-ci" \
    -d "$payload"
)"
body="$(cat "$tmp")"
rm -f "$tmp"

if [ "$http_code" != "204" ] && [ "$http_code" != "200" ]; then
  echo "Discord webhook failed with HTTP $http_code" >&2
  if [ -n "$body" ]; then
    echo "$body" >&2
  fi
  exit 1
fi
