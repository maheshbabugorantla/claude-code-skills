#!/usr/bin/env bash
# gcp-service-lookup.sh — look up a GCP service by key or alias
# Usage: gcp-service-lookup.sh <key-or-alias>
# Output: JSON object for the matched service, or empty string if not found
# Requires: jq

set -euo pipefail

CATALOG="$(dirname "$0")/../references/gcp-service-catalog.jsonl"

if [[ $# -eq 0 ]]; then
  echo "Usage: gcp-service-lookup.sh <key-or-alias>" >&2
  exit 1
fi

query="$1"

# Try exact key match first (fastest), then case-insensitive alias scan
# Use -c for compact (single-line) output so head -1 captures the full object
result=$(jq -rc --arg q "$query" '
  select(.key == $q or (.aliases[] | ascii_downcase) == ($q | ascii_downcase))
' "$CATALOG" | head -1)

if [[ -n "$result" ]]; then
  echo "$result"
else
  echo "" # not found — caller should fall back to web search (SKILL.md Step 7d)
fi
