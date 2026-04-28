#!/usr/bin/env bash
# gcp-catalog-hash.sh — print a 12-char SHA256 of the JSONL catalog
# Used by gcp-illustration to embed a catalog-hash in generated .drawio markers
# Usage: gcp-catalog-hash.sh
# Output: 12-char hex string (first 12 chars of SHA256 of the catalog file)

set -euo pipefail

CATALOG="$(dirname "$0")/../references/gcp-service-catalog.jsonl"

if command -v sha256sum &>/dev/null; then
  sha256sum "$CATALOG" | cut -c1-12
elif command -v shasum &>/dev/null; then
  shasum -a 256 "$CATALOG" | cut -c1-12
else
  # Fallback: openssl (always available on macOS)
  openssl dgst -sha256 "$CATALOG" | awk '{print $2}' | cut -c1-12
fi
