---
name: aws-illustration-marketing-name-audit
description: Audit a draw.io XML file to ensure every service icon cell uses the official AWS marketing name in its value attribute. Flags short-form names, wrong prefixes, and unlisted services.
type: specialist
parent: aws-illustration
---

# Marketing Name Audit Specialist

Audits `diagrams/<slug>.drawio` for official AWS marketing-name label compliance.

## What to check

For every `<mxCell>` where the `style` attribute contains `shape=mxgraph.aws3.*` or `shape=mxgraph.aws4.resourceIcon`:

1. Extract the `value="…"` attribute.
2. Load `references/aws-service-catalog.jsonl`.
3. Find the catalog entry whose `marketing` field exactly matches the cell's value (case-sensitive).
4. If no exact match: try case-insensitive match in the `aliases` array → AP-03 (short-form label).
5. If prefix is wrong (e.g., `value="Amazon Lambda"` when catalog `prefix="AWS"`) → AP-10.
6. If the value is not in the catalog at all (unlisted service) → emit a `WARN` suggesting the user run the unlisted-service web-search workflow (SKILL.md Step 7d).

## Self-check marker comparison

If the file contains the `<!-- aws-illustration: ... catalog-hash=HASH ... -->` marker:
- Run `bin/aws-catalog-hash.sh` to get the current catalog hash.
- If `HASH` ≠ current hash, emit an additional finding:
  ```json
  {"ap_id":null,"cell_id":"_marker","issue":"Diagram generated with catalog hash HASH; current catalog is CURRENT_HASH — catalog has changed since generation","severity":"warn"}
  ```

## Output format

One JSON object per finding per line:

```json
{"ap_id":"AP-03","cell_id":"lambda1","value":"Lambda","expected":"AWS Lambda","severity":"error"}
{"ap_id":"AP-10","cell_id":"apigw1","value":"AWS API Gateway","expected":"Amazon API Gateway","severity":"error"}
{"ap_id":null,"cell_id":"custom_svc","value":"My Custom Service","issue":"Not in aws-service-catalog.jsonl — run web-search lookup (SKILL.md Step 7d)","severity":"warn"}
```

If no issues:
```json
{"ap_id":null,"status":"PASS","message":"All service labels use official AWS marketing names"}
```

## Completion Status

- `## Completion Status: PASS` — all labels correct
- `## Completion Status: WARN` — unlisted services (needs web-search, not a hard error)
- `## Completion Status: FAIL` — AP-03 or AP-10 found (wrong label form or prefix)
