# Layout Rules — Google Cloud Platform Illustrations

Apply these rules to all GCP illustration types that have directional flows or container hierarchies.
Anti-pattern IDs (AP-NN) reference `references/anti-patterns.md`.

---

## Universal Flow Direction Rules

- **State flow direction at the TOP of the prompt** — before describing any components.
- **Exhaustive negation is required** — "All arrows point strictly RIGHT" is insufficient alone. Always add:
  > "No arrows point downward. No arrows point left. No diagonal arrows. No curved arrows that change direction."
- **Redundancy beats brevity** — state layout rules 3 times: as a rule block at the top, inline after each component, and as a closing constraint.
- **Fallback instruction** — always include:
  > "If components don't fit on one row, shrink them or reduce label font size — never wrap to a second row."
- **AP-06**: Arrows curving or pointing backward → see anti-patterns.md AP-06 for fix.

---

## Single-Row Enforcement (architecture type)

- Default to ONE horizontal row. State this three times:
  1. As a rule block at the top of the prompt.
  2. Inline after listing each component.
  3. As a closing constraint after all components.
- Number components in sequence (Component 1, Component 2, …) for unambiguous ordering.
- After listing all: `"All N components sit on the same horizontal level."`

---

## GCP Network / Region Hierarchy Rules

These rules apply specifically to `region-diagram` illustrations. GCP has a fundamentally different networking model from AWS.

### VPC Network (global boundary)

- **GCP VPCs are GLOBAL resources** — a single VPC spans all regions. (AP-04)
- Drawn as the **outermost boundary**, containing all Region boxes.
- Style: solid 2px line, `strokeColor=#4285F4` (Google Blue), no fill, 8px corner radius.
- Label: `"VPC Network: <name>"` top-left inside the boundary.
- **Never** draw a VPC inside a Region or Zone.
- **Never** draw one VPC per region (that's the AWS mental model, not GCP).

### Region boundary (regional, inside VPC)

- Drawn as a **dashed** border box inside the VPC boundary.
- Style: `dashed=1; strokeColor=#5F6368` (Slate), no fill.
- Label: `"<region-name>"` (e.g., `"us-central1"`) top-left.
- Contains: Subnet boundaries and Zone boundaries.
- Default region when unspecified: `us-central1`.

### Subnet boundary (regional, spans zones)

- **GCP Subnets are REGIONAL** — they span all zones in a region. (Unlike AWS where subnets are zonal.)
- Drawn as a solid gray box spanning across Zone boxes.
- Style: `strokeColor=#9AA0A6` (Pale Gray), no fill, light gray background `#F1F3F4` if labeled.
- Label: subnet CIDR or `"Public Subnet"` / `"Private Subnet"`.
- A single Subnet box should visually span the full vertical height of both Zone boxes.

### Zone boundaries (inside region, VERTICAL stacking)

- **Zones are stacked VERTICALLY within a Region — NOT side by side horizontally.** (AP-05)
- Drawn as dotted boxes.
- Style: `dashed=1; dashPattern=4 4; strokeColor=#9AA0A6` (Pale Gray), no fill.
- Label: `"Zone: <region>-a"` (e.g., `"Zone: us-central1-a"`) top-left.
- Default: 2 zones, Zone A on top, Zone B on bottom.
- State 3 times: `"Zone us-central1-a is in the TOP ROW. Zone us-central1-b is in the BOTTOM ROW. They are NOT side by side."`

### Nesting order

```
[VPC Network — solid Google Blue boundary]
  └── [Region us-central1 — dashed Slate boundary]
        ├── [Subnet 10.0.0.0/24 — spans both zones]
        │     ├── [Zone us-central1-a — dotted Pale Gray]
        │     │     └── Services: Compute Engine, GKE node, Cloud SQL primary
        │     └── [Zone us-central1-b — dotted Pale Gray]
        │           └── Services: Standby nodes, Cloud SQL replica
        └── (optional second subnet — same zone layout)
```

### Services outside the VPC (Google-managed)

These services are Google-managed and live **outside** the VPC boundary. Connect them with dotted arrows labeled `"Private Google Access"` or `"Public Endpoint"`:
- Cloud Storage
- BigQuery (serverless, multi-regional — AP-04 context)
- Pub/Sub
- Cloud Run (unless Direct VPC egress is configured)
- Cloud Functions (1st gen; 2nd gen supports VPC connector)
- Dataflow (managed; workers live in VPC subnet)
- Cloud DNS (global)
- Cloud Load Balancing (at the VPC edge, or global)
- Vertex AI, Cloud AutoML, Vision API (API endpoints)

### Multi-region diagram

- Draw a second Region box (dashed) inside the same VPC boundary.
- Place regions side-by-side horizontally if 2 regions; top/bottom if 3+.
- Use Cloud Spanner or Cloud Storage with a `"Multi-regional"` label spanning both regions.
- Route between regions via Cloud Load Balancing or Cloud Interconnect at the VPC edge.

---

## Resource Hierarchy Rules (resource-hierarchy type)

GCP Resource Hierarchy is a strict 4-level tree. Different from AWS Organizations (3 levels).

```
Organization          ← top level (root)
  └── Folder(s)        ← optional grouping (can be nested)
        └── Project(s)  ← billing unit; IAM boundary
              └── Resources (VMs, buckets, datasets, etc.)
```

Layout rules:
- Flow is **top-to-bottom**. Organization at the top center.
- Use **right-angle connectors only** (no diagonal, no curved lines).
- Organization icon: `mxgraph.gcp2.cloud_resource_manager` at top center.
- Folders: spaced horizontally below Organization.
- Projects: spaced horizontally below their parent Folder.
- Resources: show representative icons below their parent Project.
- **Never** draw Folder as a child of Project — that's inverted (AP-14).
- **Never** draw Resources at the same level as Projects.
- IAM icon adjacent to the node where the binding applies (usually Project level), labeled `"IAM binding"`.

---

## Arrow Labeling Rules

- Arrows between architecture components should carry a **protocol or payload label** when known:
  - REST / HTTPS call → `HTTPS`
  - gRPC call → `gRPC`
  - Pub/Sub message → `Pub/Sub`
  - Cloud Storage event → `GCS event`
  - Eventarc trigger → `Eventarc`
  - SQL query → `SQL`
- Keep labels ≤ 3 words.
- Place label at the midpoint of the arrow.
- Add `labelBackgroundColor=#FFFFFF` (light) or `#202124` (dark) to prevent overlap with arrow line (AP-17).
- Default arrow style: `endArrow=classic; strokeWidth=2; strokeColor=#5F6368` (light mode).
- Default arrow style dark mode: `endArrow=classic; strokeWidth=1.5; strokeColor=#9AA0A6`.
- **Never use `endArrow=none`** (AP-16).

---

## Whitespace Rules

- **40px minimum** between any two adjacent components (in draw.io logical units).
- **16px minimum** clearance between a component and its containing boundary box.
- **24px inset** for boundary box labels from the box edge.
- Leave at least **10% of the canvas as background color**.
- Canvas size: size to content + ~70px all-side margins. Do not inflate to 1920×1080 if the content fits in 1920×560 (AP-15).

---

## Skip-Logic Reference (for SKILL.md Step 6)

| Type | Requires layout-rules? | Key sections |
|---|---|---|
| `architecture` | Yes | Single-row enforcement, arrow rules |
| `workflow` | Yes | Arrow rules, whitespace |
| `split-panel` | Yes | Single-row enforcement, arrow rules |
| `process-flow` | Yes | Arrow rules, whitespace |
| `region-diagram` | Yes | Full hierarchy rules, VPC global rule |
| `resource-hierarchy` | Yes | Resource hierarchy rules, right-angle connectors |
| `concept-cards` | No | — |
| `grid` | No | — |
| `mapping` | No | — |
| `gcp-architecture-framework` | No | — |
