#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DISCORD_WEBHOOK_URL:-}" ]; then
  echo "DISCORD_WEBHOOK_URL secret is not set; skipping notification."
  exit 0
fi

python3 - <<'PY'
import json
import os
import urllib.request

webhook = os.environ["DISCORD_WEBHOOK_URL"]
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

payload = {
    "username": "sarut-portfolio CI",
    "embeds": [{"title": title, "color": color, "url": run_url, "fields": fields}],
}

request = urllib.request.Request(
    webhook,
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(request, timeout=30) as response:
    response.read()
PY
