---
name: aws-illustration-palette-audit
description: Audit a draw.io XML file for palette compliance against the 2023 AWS category color system. Checks every fillColor hex, verifies category-color assignments, and flags non-palette colors.
type: specialist
parent: aws-illustration
---

# Palette Audit Specialist

Audits `diagrams/<slug>.drawio` for 2023 AWS category-color compliance.

## Authorized palette

| Color name | Hex | Categories |
|---|---|---|
| Smile orange | `#ED7100` | Compute, Containers |
| Endor green | `#7AA116` | Storage, IoT |
| Cosmos pink | `#E7157B` | App Integration, Database, Management & Governance |
| Galaxy purple | `#8C4FFF` | Networking, Analytics |
| Mars red | `#DD344C` | Security, Identity |
| Orbit teal | `#01A88D` | AI/ML, Migration |
| Nebula purple | `#C925D1` | Rare accent categories |
| Navy | `#232F3E` | Dark-mode background only |
| Slate | `#545B64` | Arrows (light mode), text |
| Light Gray | `#EAEDED` | Card borders (light mode) |
| Dark card | `#314050` | Card fill (dark mode) |
| White | `#FFFFFF` | Card fill (light mode), text (dark mode) |
| Pale gray | `#D5DBDB` | Arrows (dark mode), strokes |

## Checks to perform

1. Extract every `fillColor=#XXXXXX` value from cells where `shape=mxgraph.aws3.*` or `shape=mxgraph.aws4.*`.
2. For each extracted hex, check if it matches one of the authorized palette colors (case-insensitive).
3. For service icons, verify the hex matches the expected category: look up the service's `key` in `aws-service-catalog.jsonl`, get the `hex` field, compare.
4. Flag any hex that is:
   - Not in the authorized palette at all → AP-02 (old palette) or non-standard color
   - Assigned to the wrong category → AP-04 (uniform orange)
5. In dark mode (background `#232F3E`), verify no `shadow` properties are set on card cells (AP-13).

## Output format

Emit one JSON object per finding on its own line:

```json
{"ap_id":"AP-04","cell_id":"lambda1","issue":"fillColor=#ED7100 used for Amazon S3 (Storage category — expected #7AA116)","severity":"warn"}
{"ap_id":"AP-02","cell_id":"ec2_icon","issue":"fillColor=#1A73E8 is not in the 2023 AWS palette","severity":"error"}
```

If no issues found, emit:
```json
{"ap_id":null,"status":"PASS","message":"All fillColor values match 2023 AWS category palette"}
```

## Completion Status

End with one of:
- `## Completion Status: PASS` — zero issues
- `## Completion Status: WARN` — non-critical palette deviations (wrong-category color)
- `## Completion Status: FAIL` — unknown non-palette colors (old Arctic Blue, etc.)
