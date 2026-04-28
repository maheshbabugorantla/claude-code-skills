---
name: gcp-illustration-stencil-verifier
description: Audit a draw.io XML file to verify every mxgraph.gcp2 stencil name is valid and matches gcp-service-catalog.jsonl. Catches typos, cross-cloud namespace contamination (aws4/azure), spaces in resIcon values (the silent truncation bug), and unknown stencil names before the user opens the file in diagrams.net.
type: specialist
parent: gcp-illustration
---

# Stencil Verifier Specialist

Audits `diagrams/<slug>.drawio` for valid `mxgraph.gcp2` stencil names.

## Critical stencil rule — no spaces in resIcon values

**`mxgraph.gcp2` stencil names use lowercase with underscores, NEVER spaces.**

Example: `mxgraph.gcp2.cloud_storage` is correct. `mxgraph.gcp2.cloud storage` silently truncates at the space in draw.io's style parser, rendering a blank white rectangle. This is the most common GCP stencil error class.

## What to check

1. **Service icon stencils** — extract every `shape=mxgraph.gcp2.*` and the associated `resIcon=mxgraph.gcp2.[a-z0-9_]+` value from all `style` attributes.

   For each extracted `resIcon` value, look it up in `references/gcp-service-catalog.jsonl` against the `resicon` field:
   - Exact match → PASS
   - Has spaces (e.g., `mxgraph.gcp2.cloud storage`) → AP-12 ERROR: "resIcon has spaces — must use underscores: `mxgraph.gcp2.cloud_storage`"
   - Near-match after underscore normalization → AP-12 WARN with suggestion
   - No match → AP-12 ERROR (see "Unknown stencil resolution" below)

2. **Cross-cloud namespace contamination** — flag any stencil from the wrong cloud namespace:
   - `shape=mxgraph.aws4.*` in a GCP illustration → AP-12 ERROR: "AWS stencil in GCP illustration"
   - `shape=mxgraph.aws3.*` → AP-12 ERROR: "Deprecated AWS stencil in GCP illustration"
   - `shape=mxgraph.azure.*` or `shape=mxgraph.office.*` in a GCP illustration → AP-12 ERROR

3. **sketch=0 check** — verify every service icon style contains `sketch=0`. Any `sketch=1` → AP-11.

4. **Catalog `"note":"Verify resicon"` entries** — if the JSON catalog entry for a used service has `"note":"Verify resicon"`, emit a WARN prompting the user to confirm the stencil renders correctly in draw.io.

5. **Boundary cell stencils (informational)** — GCP doesn't have an official group stencil format like AWS (`mxgraph.aws4.groupCenter`). The expected boundary pattern is plain rounded rectangles with custom stroke styles:
   - VPC boundary: `rounded=1; strokeColor=#4285F4; dashed=0; fillColor=none`
   - Region boundary: `rounded=1; strokeColor=#5F6368; dashed=1; fillColor=none`
   - Zone boundary: `rounded=1; strokeColor=#9AA0A6; dashed=1; dashPattern=4 4; fillColor=none`
   Flag if VPC boundary uses `strokeColor` other than `#4285F4` (AP-08).

## Unknown stencil resolution protocol

When a `resIcon` value is not found in `gcp-service-catalog.jsonl`:

1. Fetch `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/diagramly/sidebar/Sidebar-GCP2.js` and search for the service name.
2. Extract the `resIcon=` value from the sidebar definition.
3. **Convert any spaces to underscores** to get the correct catalog key (if the sidebar uses spaces in the icon name).
4. If confirmed: append the correct entry to `references/gcp-service-catalog.jsonl`.
5. If still not found: emit AP-12 ERROR with note "Not found in draw.io GCP2 sidebar — may need a placeholder shape or a newer draw.io version."

## Output format

```json
{"ap_id":"AP-12","cell_id":"storage1","stencil":"mxgraph.gcp2.cloud storage","issue":"Spaces in resIcon value — must be underscores: mxgraph.gcp2.cloud_storage","severity":"error"}
{"ap_id":"AP-12","cell_id":"lambda1","stencil":"mxgraph.aws4.lambda","issue":"AWS stencil (mxgraph.aws4) used in a GCP illustration — replace with mxgraph.gcp2 equivalent","severity":"error"}
{"ap_id":"AP-12","cell_id":"eventarc1","stencil":"mxgraph.gcp2.eventarc","issue":"Catalog entry has note='Verify resicon' — confirm this renders in draw.io (may not exist in all versions)","severity":"warn"}
{"ap_id":"AP-11","cell_id":"gke_box","issue":"sketch=1 set — must be sketch=0","severity":"error"}
{"ap_id":"AP-08","cell_id":"vpc_boundary","issue":"VPC boundary strokeColor=#EA4335 (Red) — expected #4285F4 (Google Blue)","severity":"warn"}
```

If no issues:
```json
{"ap_id":null,"status":"PASS","message":"All stencil names valid; no cross-cloud contamination; sketch=0 on all icons"}
```

## Completion Status

- `## Completion Status: PASS` — all stencils valid, no cross-cloud contamination
- `## Completion Status: WARN` — advisory findings (verify-resicon flags, minor near-misses)
- `## Completion Status: FAIL` — unknown resIcon values or cross-cloud stencils that will render as blank gray boxes
