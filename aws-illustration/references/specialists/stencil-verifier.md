---
name: aws-illustration-stencil-verifier
description: Audit a draw.io XML file to verify every mxgraph.aws4 stencil name is valid and matches the aws-service-catalog.jsonl. Catches typos, deprecated aws3 stencils, and unknown resIcon values before the user opens the file in diagrams.net.
type: specialist
parent: aws-illustration
---

# Stencil Verifier Specialist

Audits `diagrams/<slug>.drawio` for valid `mxgraph.aws4` stencil names.

## Stencil version note

**`mxgraph.aws3.*` is DEPRECATED.** The current library is `mxgraph.aws4`. Any `shape=mxgraph.aws3.*` found in the XML is a hard error — flag it as AP-12 and provide the correct `mxgraph.aws4` equivalent.

The draw.io library version is NOT permanently `aws4`. If a future `aws5.xml` or later version is released at `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/stencils/`, the resIcon namespace prefix must be updated in the catalog. Check the repo when in doubt.

## What to check

1. **Service icon stencils** — extract every token matching `shape=mxgraph\.aws4\.resourceIcon` and the associated `resIcon=mxgraph\.aws4\.[a-z0-9_]+` value from all `style` attributes. **Stencil names use lowercase with underscores** (e.g., `api_gateway`, `elastic_block_store`, `kinesis_data_streams`) — NEVER spaces. Spaces in `resIcon=` values are silently truncated by the draw.io style parser, causing blank placeholder boxes. This is the most common error class.

   Source of truth: `Sidebar-AWS4.js` in the draw.io repo defines the canonical resIcon values.

2. For each extracted `resIcon` value, look up the full token (e.g., `mxgraph.aws4.lambda`) in `references/aws-service-catalog.jsonl` against the `resicon` field:
   - Exact match → PASS
   - Has spaces (e.g., `mxgraph.aws4.elastic beanstalk`) → AP-12 ERROR: "resIcon has spaces — must use underscores: `mxgraph.aws4.elastic_beanstalk`"
   - Near-match after underscore normalization → AP-12 WARN with suggestion
   - No match → AP-12 ERROR (flag as unknown; see "Unknown stencil resolution" below)

3. **Deprecated stencils** — if `shape=mxgraph.aws3.*` appears (old direct-shape format), flag as AP-12 ERROR with the message: "Deprecated mxgraph.aws3 stencil — replace with `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.<name>`".

4. **Group/container stencils** — for region, AZ, VPC, subnet boundaries, verify:
   - `shape=mxgraph.aws4.groupCenter` with `grIcon=mxgraph.aws4.group_region` (Region)
   - `shape=mxgraph.aws4.groupCenter` with `grIcon=mxgraph.aws4.group_availability_zone` (AZ)
   - `shape=mxgraph.aws4.groupCenter` with `grIcon=mxgraph.aws4.group_vpc` (VPC)
   If plain `shape=mxgraph.aws4.group` is used instead → AP-14

5. **sketch=0 check** — verify every service icon style contains `sketch=0`. Any `sketch=1` → AP-11.

6. **Dark stencil suffix** — if `background="#232F3E"` is set, check if `_dark` suffix stencil variants exist for the services used (advisory only — not all services have dark variants).

## Unknown stencil resolution protocol

When a `resIcon` value is not found in `aws-service-catalog.jsonl` (or has a `"note":"Verify resicon"` flag):

1. Fetch the authoritative AWS4 stencil XML from the draw.io GitHub repo:
   `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/stencils/aws4.xml`
2. Search for `<shape name="` entries where the name contains the service keyword (names are lowercase with spaces).
3. The `name` attribute value (the part after the last `/`) is the correct resIcon suffix — e.g., `name="mxgraph.aws4/api gateway"` → `resIcon=mxgraph.aws4.api gateway`.
4. If confirmed: append the correct entry to `references/aws-service-catalog.jsonl`, remove the `"note":"Verify resicon"` flag.
5. If still not found in `aws4.xml`: emit AP-12 ERROR with note "Not found in draw.io aws4.xml — may be a custom or third-party icon".

## Known valid group stencils (aws4 namespace)

`group_region`, `group_availability_zone`, `group_vpc`, `group_public_subnet`, `group_private_subnet`, `group_aws_cloud_alt`, `group_security_group`, `internet_alt2`, `user`, `traditional_server`

## Output format

```json
{"ap_id":"AP-12","cell_id":"s3_icon","stencil":"mxgraph.aws4.s3_bucket","issue":"Unknown resIcon — did you mean mxgraph.aws4.s3?","severity":"error"}
{"ap_id":"AP-12","cell_id":"lambda1","stencil":"mxgraph.aws3.lambda","issue":"Deprecated mxgraph.aws3 stencil — replace with shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda","severity":"error"}
{"ap_id":"AP-11","cell_id":"ec2_box","issue":"sketch=1 set — must be sketch=0 for clean 2023 rendering","severity":"error"}
{"ap_id":"AP-14","cell_id":"region_box","issue":"shape=mxgraph.aws4.group — use shape=mxgraph.aws4.groupCenter with grIcon=mxgraph.aws4.group_region","severity":"warn"}
```

If no issues:
```json
{"ap_id":null,"status":"PASS","message":"All stencil names valid; sketch=0 on all icons; group stencils correct"}
```

## Completion Status

- `## Completion Status: PASS` — all stencils valid, no deprecated formats
- `## Completion Status: WARN` — advisory findings only (dark variants, minor near-misses)
- `## Completion Status: FAIL` — deprecated aws3 stencils or unknown resIcon values that will render as blank gray boxes
