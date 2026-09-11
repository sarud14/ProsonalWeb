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
import re

title = os.environ["NOTIFY_TITLE"]
color = int(os.environ["NOTIFY_COLOR"])
stage = os.environ.get("NOTIFY_STAGE", "")
branch = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME", "")
sha = os.environ.get("GITHUB_SHA", "")[:7]
repo = os.environ["GITHUB_REPOSITORY"]
run_url = f"https://github.com/{repo}/actions/runs/{os.environ['GITHUB_RUN_ID']}"
actor = os.environ.get("GITHUB_ACTOR", "")
event_name = os.environ.get("GITHUB_EVENT_NAME", "")
pr_number = os.environ.get("PR_NUMBER", "").strip()
message = re.sub(r"\s+", " ", os.environ.get("COMMIT_MESSAGE", "")).strip()[:120]
deploy_url = os.environ.get("DEPLOY_URL", "").strip()
deploy_env = os.environ.get("DEPLOY_ENV", "").strip()

if event_name == "pull_request" and pr_number:
    event_label = f"PR #{pr_number}"
elif event_name == "push":
    event_label = f"Push to `{branch}`"
else:
    event_label = event_name or "CI"

description_parts = [event_label]
if message:
    description_parts.append(message)
description = " · ".join(description_parts)

fields = [
    {"name": "Branch", "value": branch or "(unknown)", "inline": True},
    {"name": "Author", "value": actor or "(unknown)", "inline": True},
    {"name": "Commit", "value": f"`{sha}`" if sha else "(unknown)", "inline": True},
]

check = os.environ.get("CHECK_RESULT", "").strip()
e2e = os.environ.get("E2E_RESULT", "").strip()
vercel = os.environ.get("VERCEL_RESULT", "").strip()

if stage in ("ready", "done") and (check or e2e):
    lines = []
    if check:
        lines.append(f"check · {check}")
    if e2e:
        lines.append(f"e2e · {e2e}")
    fields.append({"name": "Tests", "value": "\n".join(lines), "inline": True})

if stage == "ready" and deploy_env:
    fields.append({"name": "Target", "value": deploy_env, "inline": True})

if stage == "done":
    if vercel:
        fields.append({"name": "Vercel", "value": vercel, "inline": True})
    if deploy_url:
        fields.append({"name": "URL", "value": deploy_url, "inline": False})

embed_url = deploy_url if stage == "done" and deploy_url else run_url

print(json.dumps({
    "username": "sarut-portfolio CI",
    "embeds": [{
        "title": title,
        "description": description,
        "color": color,
        "url": embed_url,
        "fields": fields,
    }],
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
