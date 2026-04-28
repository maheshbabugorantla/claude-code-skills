# GCP Illustration Anti-Patterns

Stable IDs for known failure modes. `--verify` cites these IDs in findings.
Each entry: **symptom**, **detection signal**, **fix**.

---

## AP-01 — Isometric 3D service boxes

**Reject:** Any 3D perspective, isometric tile, "layered card deck," or axonometric layout.
**Detection:** Prompt contains "isometric", "3D", "perspective", "axonometric", "layered", or "depth".
**Fix:** Add to prompt: `"FLAT 2D icons. NOT isometric. NOT 3D perspective. NOT layered cards."`
Also add: `"Google Cloud architecture diagram style — flat Material Design icons on a white or Deep Gray background."`

---

## AP-02 — Non-Google or outdated icon style

**Reject:** Generic cloud icons, blue gradient fills, AWS-style orange squares, or icon styles that don't match the official GCP product icon set.
**Detection:** Generated PNG shows non-Material-Design icons; or prompt lacks "Google Cloud architecture diagram" or "official Google Cloud service icons."
**Fix:** Add to prompt: `"Official Google Cloud service icons. Material Design aesthetic. NOT generic cloud icons. NOT AWS-style icons."`

---

## AP-03 — Short-form service labels in draw.io XML

**Reject:** `value="GCS"`, `value="GKE"`, `value="Spanner"`, `value="BQ"`, etc.
**Detection:** `--verify` reads every `value="…"` on cells where `shape=mxgraph.gcp2.*`. Flags values not matching the `marketing` field in `gcp-service-catalog.jsonl`.
**Fix:** Replace with the exact `marketing` field from the catalog: `value="Cloud Storage"`, `value="Google Kubernetes Engine"`, `value="Cloud Spanner"`.
**Common misses:** `value="Cloud Firestore"` → `"Firestore"` · `value="Big Query"` → `"BigQuery"` · `value="PubSub"` → `"Pub/Sub"` · `value="GCS"` → `"Cloud Storage"` · `value="AlloyDB"` → `"AlloyDB for PostgreSQL"`

---

## AP-04 — VPC drawn as a regional boundary (GCP VPCs are global)

**Reject:** Drawing the VPC box as a dashed region boundary or labeling it "VPC (us-central1)". GCP VPCs are global resources — a single VPC spans all regions.
**Detection:** `value="VPC (us-central1)"` or a VPC box nested inside a region boundary in the XML; or Gemini prompt says "VPC in us-central1".
**Fix:**
- Draw VPC as the outermost boundary containing ALL regions.
- Region boxes (dashed) live INSIDE the VPC box.
- VPC label: just `"VPC Network"`, no region suffix.
- State explicitly in the prompt: `"VPC Network is a GLOBAL resource — one VPC boundary wraps both regions. Region boxes sit inside the VPC, not alongside it."`

---

## AP-05 — Zones placed side by side horizontally instead of stacked vertically

**Reject:** Two Zone boxes sitting left-right instead of top-bottom within a region.
**Detection:** Generated PNG shows Zone A and Zone B at the same Y position; or prompt lacks explicit stacking instruction.
**Fix:** State vertical stacking 3 times (opening + inline + closing):
```
CRITICAL: Zones are stacked VERTICALLY within each region. Zone A is in the TOP ROW.
Zone B is in the BOTTOM ROW. They are NOT side by side horizontally.
```

---

## AP-06 — Curved or reversed arrows

**Reject:** Arrows that curve, bend diagonally, point leftward, or loop back unexpectedly.
**Detection:** Generated PNG shows curved arcs or backward flow; or prompt lacks exhaustive negation.
**Fix:** Add exhaustive-negation block:
```
All arrows point strictly RIGHT. No arrows point LEFT. No arrows point DOWN.
No diagonal arrows. No curved arrows. No arcs. No arrows that reverse direction.
```
State this rule 3 times (opening rule block + inline per component + closing confirm).

---

## AP-07 — Pure black dark-mode background

**Reject:** Background renders as `#000000` instead of Deep Gray `#202124`.
**Detection:** Generated PNG background is pure black; or `mxGraphModel background="#000000"`.
**Fix:** Specify `"Deep Gray (#202124) background, NOT pure black"` and add `"very dark charcoal-gray, like Google Cloud Console dark mode, not pure black"`.

---

## AP-08 — All-solid boundary lines (no visual hierarchy)

**Reject:** VPC, Region, and Zone boundaries all rendered as identical solid lines.
**Detection:** XML uses `dashed=0` for all three boundary types; or generated PNG shows no visual difference.
**Fix:** Enforce distinct styles per layer:
- VPC Network: `dashed=0; strokeColor=#4285F4` (solid Google Blue)
- Region: `dashed=1` (dashed gray)
- Zone: `dashed=1; strokeDashPattern=4 4` (dotted, shorter gaps)

---

## AP-09 — Wrong "Cloud" / "Google Cloud" / no-prefix marketing name

**Reject:** "Google Cloud Storage", "Cloud Firestore", "Cloud BigQuery", "Google Pub/Sub", "Cloud Vertex AI".
**Detection:** marketing-name-audit.md compares every label against the `prefix` field in `gcp-service-catalog.jsonl`. Wrong-prefix match = AP-09.
**Fix:**
| ❌ Wrong | ✅ Correct | Rule |
|---|---|---|
| Google Cloud Storage | **Cloud Storage** | Drop "Google Cloud" prefix |
| Cloud Firestore | **Firestore** | Drop "Cloud" prefix |
| Google BigQuery | **BigQuery** | No prefix |
| Cloud Pub/Sub | **Pub/Sub** | No prefix |
| Google Vertex AI | **Vertex AI** | No prefix |
| Cloud Vertex AI | **Vertex AI** | No prefix |
| Cloud Spanner | keep as is | "Cloud" prefix is correct here |

---

## AP-10 — Glass morphism / neon glow effects

**Reject:** Frosted glass, translucent panels, neon outlines, bloom effects, "futuristic" aesthetics.
**Detection:** Prompt lacks explicit negation; generated PNG shows glow or transparency.
**Fix:** Add to prompt: `"NO glass morphism. NO frosted glass. NO neon glows. NO bloom effects. Flat, clean, solid Material Design aesthetic."`

---

## AP-11 — Sketchy / rough icon rendering (`sketch=1`)

**Reject:** Icons rendered in draw.io with a hand-drawn / rough style.
**Detection:** Any `sketch=1` in an mxgraph.gcp2 style string.
**Fix:** Replace `sketch=1` with `sketch=0` in every service icon style string.

---

## AP-12 — Wrong stencil namespace (`mxgraph.aws4.*` or `mxgraph.azure.*`)

**Reject:** GCP illustrations using `shape=mxgraph.aws4.*`, `shape=mxgraph.azure.*`, or any non-GCP namespace.
**Detection:** stencil-verifier.md scans for `aws4`, `azure`, or unknown namespace tokens in gcp-illustration outputs.
**Fix:** Replace with the correct `mxgraph.gcp2.*` stencil from `gcp-service-catalog.jsonl`. Every `resicon` field in the catalog is authoritative. Never cross-namespace.

---

## AP-13 — Non-Google palette colors (palette drift)

**Reject:** Icons or fills using AWS orange `#ED7100`, Azure blue `#0089D6`, Microsoft gray, or any hex not in the GCP palette.
**Detection:** palette-audit.md flags any `fillColor=#…` that doesn't match the 4 brand colors (`#4285F4`, `#34A853`, `#EA4335`, `#FBBC04`) or the 6 neutrals (`#202124`, `#5F6368`, `#F1F3F4`, `#DADCE0`, `#303134`, `#9AA0A6`).
**Fix:** Replace non-GCP hexes with the correct GCP color for that service's category. Attach `assets/palette.svg` as a Gemini reference image for color accuracy.

---

## AP-14 — Resource Hierarchy collapse (wrong nesting order)

**Reject:** Drawing Project as the parent of Folder, or drawing Resources as siblings of Projects, or omitting the Organization node when showing multi-project scope.
**Detection:** XML shows `Folder` nested inside `Project`, or `Project` at the same level as `Organization`.
**Fix:** Enforce the 4-level GCP Resource Hierarchy top-to-bottom:
```
Organization  ← top level
  └── Folder(s)
        └── Project(s)
              └── Resources (VMs, buckets, etc.)
```
State this explicitly: `"Organization is the ROOT. Folders are inside the Organization. Projects are inside Folders. Resources are inside Projects. This is a strict top-to-bottom tree."`

---

## AP-15 — Canvas larger than its content (blank space around diagram)

**Reject:** `pageWidth`/`pageHeight` set to 1920×1080 when diagram content fills a much smaller area, leaving visible blank margins.
**Detection:** Generated PNG shows large empty regions around the diagram. Icon or card sizes inflated to fill empty space.
**Fix:** Size the canvas to the content bounding box + ~70px all-side margins. Content drives canvas dimensions — never the reverse.

---

## AP-16 — Arrow with no arrowhead (`endArrow=none`)

**Reject:** Edges rendered as plain lines with no arrowhead, making data-flow direction ambiguous.
**Detection:** XML contains `endArrow=none` on any edge in an architecture or flow diagram.
**Fix:** Replace `endArrow=none` with `endArrow=classic;strokeWidth=3;` (light mode) or `endArrow=classic;strokeWidth=1.5;` (dark mode). The default draw.io edge style is `endArrow=none` — always override it explicitly.

---

## AP-17 — Arrow label text overlapping the arrow line

**Reject:** Edge label text sits directly on top of the arrow line without a background, making both unreadable.
**Detection:** Generated PNG shows arrow labels without a white or dark pill background; or XML edge style lacks `labelBackgroundColor`.
**Fix:** Add `labelBackgroundColor=#FFFFFF;labelBorderColor=none;` (light mode) or `labelBackgroundColor=#202124;labelBorderColor=none;` (dark mode) to the edge style.

---

## AP-18 — Editing user-modified .drawio files without re-reading first

**Reject:** Using a previously-generated XML version as the basis for an edit after the user has opened and saved the file in draw.io.
**Detection:** Edit tool fails with "old_string not found"; or cell IDs look like auto-generated hashes.
**Fix:** Always Read the .drawio file immediately before any Edit. The draw.io app mutates cell IDs, injects HTML wrappers into `value=` attributes, and may silently reformat XML. Last-known state is never current state after a user save.
