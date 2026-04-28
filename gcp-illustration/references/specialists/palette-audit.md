---
name: gcp-illustration-palette-audit
description: Audit a draw.io XML file for GCP brand palette compliance. Checks every fillColor hex against the 4 Google brand colors and 6 neutral colors, verifies per-category assignments, and flags AWS/Azure palette drift.
type: specialist
parent: gcp-illustration
---

# Palette Audit Specialist

Audits `diagrams/<slug>.drawio` for Google Cloud brand palette compliance.

## Authorized palette

| Color name | Hex | Categories / Roles |
|---|---|---|
| Google Blue | `#4285F4` | Compute, Networking, Security, DevTools, AI |
| Google Green | `#34A853` | Storage, Serverless (Cloud Run, Cloud Functions, App Engine) |
| Google Red | `#EA4335` | Database, CI/CD (Cloud Build, Cloud Deploy) |
| Google Yellow | `#FBBC04` | Analytics, Big Data |
| Deep Gray | `#202124` | Dark-mode background only |
| Slate | `#5F6368` | Arrows (light mode), Management service icons |
| Light Gray | `#F1F3F4` | Card backgrounds (light mode) |
| Border | `#DADCE0` | Card borders (light mode) |
| Dark Card | `#303134` | Card fill (dark mode) |
| Pale Gray | `#9AA0A6` | Arrows (dark mode), zone boundaries |
| White | `#FFFFFF` | Page background (light mode), text (dark mode) |

## Checks to perform

1. Extract every `fillColor=#XXXXXX` value from cells where `style` contains `shape=mxgraph.gcp2.*`.
2. For each extracted hex, check if it matches one of the authorized palette colors (case-insensitive, strip leading `#`).
3. For service icons, verify the hex matches the expected category: look up the service's `key` in `gcp-service-catalog.jsonl`, get the `hex` field, compare.
4. Flag any hex that is:
   - Not in the authorized palette at all → AP-13 (palette drift). Common drift cases:
     - AWS orange `#ED7100` or `#FF9900` — cross-cloud contamination
     - Azure blue `#0089D6` — cross-cloud contamination
     - Pre-Google hex `#1A73E8` (older GCP blue) — outdated
     - Random corporate colors with no GCP justification
   - Assigned to the wrong category → AP-03 variant (e.g., Google Blue used for Cloud Storage instead of Green)
5. In dark mode (background `#202124`), verify no `shadow` properties are set on card cells.
6. VPC/Region/Zone boundary strokes are exempt from category checks (they use `strokeColor` not `fillColor`):
   - VPC boundary: `strokeColor=#4285F4` ✅
   - Region boundary: `strokeColor=#5F6368` ✅
   - Zone boundary: `strokeColor=#9AA0A6` ✅

## What NOT to flag

- `fillColor=none` — transparent fill on boundary boxes is correct.
- `fillColor=#FFFFFF` — card fill in light mode is correct.
- `fillColor=#F1F3F4` — light gray card background is correct.
- `fillColor=#303134` — dark card fill in dark mode is correct.
- `fillColor=#5F6368` — Management/Operations service icons and User/Internet topology icons are correct.
- Arrow `strokeColor` values — these are covered by layout-rules, not palette-audit.
- Text cells and label cells (no shape stencil) — labels inherit color from `fontColor`, not `fillColor`.

## Output format

Emit one JSON object per finding on its own line:

```json
{"ap_id":"AP-13","cell_id":"s3_icon","issue":"fillColor=#ED7100 is AWS orange — replace with Google Green #34A853 for Cloud Storage (Storage category)","severity":"error"}
{"ap_id":"AP-13","cell_id":"lambda1","issue":"fillColor=#0089D6 is Azure blue — not in GCP palette","severity":"error"}
{"ap_id":"AP-13","cell_id":"bq1","issue":"fillColor=#4285F4 (Google Blue) used for BigQuery (Analytics — expected Google Yellow #FBBC04)","severity":"warn"}
```

If no issues found, emit:
```json
{"ap_id":null,"status":"PASS","message":"All fillColor values match Google Cloud brand palette"}
```

## Completion Status

- `## Completion Status: PASS` — zero issues
- `## Completion Status: WARN` — wrong-category assignment (fixable, diagram still usable)
- `## Completion Status: FAIL` — non-GCP palette colors (AWS/Azure drift, unknown hex values)
