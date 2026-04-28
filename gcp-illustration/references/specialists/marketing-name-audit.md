---
name: gcp-illustration-marketing-name-audit
description: Audit a draw.io XML file to ensure every service icon cell uses the official GCP marketing name in its value attribute. Flags short-form names, wrong prefixes (e.g. "Google Cloud Storage" vs "Cloud Storage"), and unlisted services.
type: specialist
parent: gcp-illustration
---

# Marketing Name Audit Specialist

Audits `diagrams/<slug>.drawio` for official GCP marketing-name label compliance.

## What to check

For every `<mxCell>` where the `style` attribute contains `shape=mxgraph.gcp2.*`:

1. Extract the `value="…"` attribute.
2. Load `references/gcp-service-catalog.jsonl`.
3. Find the catalog entry whose `marketing` field exactly matches the cell's value (case-sensitive).
4. If no exact match: try case-insensitive match in the `aliases` array → AP-03 (short-form label, e.g. `value="GCS"` instead of `value="Cloud Storage"`).
5. If prefix is wrong → AP-09. Key wrong-prefix cases:
   - `value="Google Cloud Storage"` when correct is `"Cloud Storage"` (over-prefixed)
   - `value="Cloud Firestore"` when correct is `"Firestore"` (prefix was dropped)
   - `value="Big Query"` when correct is `"BigQuery"` (one word)
   - `value="PubSub"` or `value="Cloud Pub/Sub"` when correct is `"Pub/Sub"`
   - `value="Google Vertex AI"` when correct is `"Vertex AI"`
   - `value="AlloyDB"` when correct is `"AlloyDB for PostgreSQL"`
   - `value="Identity Aware Proxy"` when correct is `"Identity-Aware Proxy"` (hyphen missing)
   - `value="Speech to Text"` when correct is `"Speech-to-Text"` (hyphen missing)
6. If the value is not in the catalog at all (unlisted service) → emit a `WARN` suggesting the user run the unlisted-service lookup workflow (SKILL.md Step 7d).

## Self-check marker comparison

If the file contains the `<!-- gcp-illustration: ... catalog-hash=HASH ... -->` marker:
- Run `bin/gcp-catalog-hash.sh` to get the current catalog hash.
- If `HASH` ≠ current hash, emit an additional finding:
  ```json
  {"ap_id":null,"cell_id":"_marker","issue":"Diagram generated with catalog hash HASH; current catalog is CURRENT_HASH — catalog has changed since generation","severity":"warn"}
  ```

## What NOT to flag

- Do NOT flag boundary cells (VPC, Region, Zone labels) — these are container labels, not service icon labels.
- Do NOT flag generic labels like `"Internet"`, `"User"`, `"Client"`, `"On-premises"` — these are topology annotations, not GCP service names.
- Do NOT flag text cells that are arrow labels or callout annotations.

## Output format

One JSON object per finding per line:

```json
{"ap_id":"AP-03","cell_id":"gcs1","value":"GCS","expected":"Cloud Storage","severity":"error"}
{"ap_id":"AP-09","cell_id":"firestore1","value":"Cloud Firestore","expected":"Firestore","issue":"Drop the 'Cloud' prefix — it was removed from Firestore's marketing name","severity":"error"}
{"ap_id":"AP-09","cell_id":"bq1","value":"Big Query","expected":"BigQuery","issue":"One word: BigQuery (no space)","severity":"error"}
{"ap_id":null,"cell_id":"custom_svc","value":"My Custom Service","issue":"Not in gcp-service-catalog.jsonl — run web-search lookup (SKILL.md Step 7d)","severity":"warn"}
```

If no issues:
```json
{"ap_id":null,"status":"PASS","message":"All service labels use official GCP marketing names"}
```

## Completion Status

- `## Completion Status: PASS` — all labels correct
- `## Completion Status: WARN` — unlisted services (needs web-search, not a hard error)
- `## Completion Status: FAIL` — AP-03 or AP-09 found (wrong label form or prefix)
