# Troubleshooting

> For the canonical anti-pattern list with stable IDs, see `references/anti-patterns.md`.
> `--verify` cites these IDs (e.g., "AP-03: value='Cloud Firestore' on cell c3").

## AI Image Generation Issues

### Gemini generates old or non-Google icons (blue gradient, isometric) — AP-01, AP-02
**Cause:** Gemini recognizes "GCP" or "Google Cloud" and defaults to a generic cloud icon style or outdated palette.
**Fix:** Add these phrases to the prompt:
> "Official Google Cloud service icons. Material Design aesthetic. Flat 2D icons. NOT isometric. NOT blue gradient icons. NOT 3D perspective. NOT generic cloud shapes."

Also add: `"Use the style from cloud.google.com/icons — flat icons in their official Google brand color."`

---

### Zones are placed side by side horizontally instead of stacked vertically — AP-05
**Cause:** Horizontal placement is the model's default for "multiple of the same thing."
**Fix:** Add 3 explicit instructions:
1. Rule block at top: `"Zones must be stacked VERTICALLY. Zone A is in the TOP ROW. Zone B is in the BOTTOM ROW. They are NOT side by side."`
2. Inline: For each zone description, state its row position.
3. Closing summary: `"Confirm: Zone A is in row 1, Zone B is in row 2. They are stacked vertically."`

---

### VPC is drawn as a regional box instead of a global boundary — AP-04
**Cause:** The model is familiar with AWS VPCs (regional) and applies the same pattern to GCP.
**Fix:** State the global scope explicitly 3 times:
> "VPC Network is a GLOBAL resource in GCP — NOT regional. One VPC boundary wraps ALL regions. Region boxes (dashed) are INSIDE the VPC box."

---

### Services all use the same Google Blue instead of correct category colors — AP-13
**Cause:** Gemini knows Google = blue and applies it uniformly.
**Fix:** Call out each service with its marketing name + specific color explicitly:
> "Compute Engine icon in Google Blue (#4285F4). Cloud Storage icon in Google Green (#34A853). Cloud SQL icon in Google Red (#EA4335). BigQuery icon in Google Yellow (#FBBC04)."

Also: attach `assets/palette.svg` as a reference image in Gemini for color fidelity.

---

### Arrows curve or go backwards — AP-06
**Fix:** Use exhaustive negation + redundancy (see `layout-rules.md`):
> "All arrows point strictly RIGHT. No arrows point LEFT. No arrows point DOWN. No diagonal arrows. No curved arrows. No arrows that reverse direction."

---

### Text labels are illegible or misspelled
**Cause:** AI image models have limited text rendering accuracy.
**Fix:** For draw.io XML, always use the full GCP marketing name in `value=""` — this renders perfectly as SVG text. The `.drawio` file is the authoritative artifact for correct labels.

---

### Dark mode background renders as pure black instead of Deep Gray — AP-07
**Cause:** "dark background" defaults to `#000000` in AI model training data.
**Fix:** Specify `"Deep Gray (#202124) background, NOT pure black"` and add `"the background is a very dark charcoal-gray, like Google Cloud Console dark mode, not pure black."`

---

### Boundary lines all look the same (no visual hierarchy) — AP-08
**Cause:** Model defaults to all solid borders at the same weight.
**Fix:** Describe each border style concretely:
> "VPC Network boundary: solid 2px Google Blue (#4285F4) line. Region boundary: dashed 1px gray line. Zone boundary: dotted (smaller dots) 1px gray line. These three border styles are DIFFERENT from each other."

---

## draw.io XML Issues

### Service icon renders as a blank gray placeholder box — AP-12
**Cause:** `mxgraph.gcp2` stencil name is incorrect or the GCP shape library isn't loaded.
**Fix:**
1. Run `--verify` to check all stencil names against `gcp-service-catalog.jsonl` (stencil-verifier specialist).
2. Check common aliases — see `gcp-service-catalog.md` or `bin/gcp-service-lookup.sh <name>`.
3. In draw.io, go to Extras → Edit Diagram and verify the style string. Load the "GCP" shape library (click `+` in sidebar, select "GCP").
4. **Critical:** stencil names use underscores, never spaces. `mxgraph.gcp2.cloud_storage` is correct; `mxgraph.gcp2.cloud storage` silently fails.

---

### Icons look "rough" or sketchy in draw.io — AP-11
**Fix:** Set `sketch=0` in every service icon's style string.

---

### draw.io file opens with wrong background color in dark mode — AP-07
**Fix:** Set `background="#202124"` in the `<mxGraphModel>` tag for dark mode, `background="#FFFFFF"` for light mode.

---

### `--verify` reports unknown stencils for services I know exist
**Cause:** Some newer GCP services (Dataform, Eventarc, Cloud Tasks, etc.) may not yet have stencils in the `mxgraph.gcp2` library, or their stencil names have changed.
**Fix:**
1. Fetch `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/diagramly/sidebar/Sidebar-GCP2.js` and search for the service name.
2. If the stencil doesn't exist, use a placeholder shape (rounded rectangle in the correct brand color) and note it with `"note":"Verify resicon"` in the catalog entry.
3. Once confirmed, update `gcp-service-catalog.jsonl` and remove the `"note"` flag.

---

### VPC box is nested inside the Region box instead of surrounding it — AP-04
**Cause:** The XML was generated with Region as the outer boundary.
**Fix:** In the XML, verify z-order: the VPC `mxCell` must be the parent (higher in the tree) with `id="vpc"`, and Region cells must be children or siblings positioned inside the VPC boundary. Correct structure:
```xml
<mxCell id="vpc" value="VPC Network" style="...strokeColor=#4285F4;..." vertex="1" parent="1">
  <mxGeometry .../>
</mxCell>
<mxCell id="region-a" value="us-central1" style="...dashed=1..." vertex="1" parent="1">
  <mxGeometry ... />  <!-- inside vpc bounds -->
</mxCell>
```

---

### Resource Hierarchy shows Folder as child of Project — AP-14
**Cause:** The XML was generated with the wrong nesting order.
**Fix:** Enforce strict top-to-bottom order: Organization → Folder → Project → Resource. See `references/templates/resource-hierarchy.md` for the correct XML boilerplate.

---

## --from File Ingest Issues

### Ingest didn't detect a service from the file
**Cause:** The service name omitted the GCP marketing prefix or was an acronym (e.g., "GCS" instead of "Cloud Storage", "BQ" instead of "BigQuery").
**Fix:** The ingest parser uses the `aliases` array in `gcp-service-catalog.jsonl` to normalize common short forms. Test it: `bin/gcp-service-lookup.sh "GCS"` → returns the Cloud Storage row. If ingest still misses the service, add the alias to the JSONL entry.

---

### Gemini renders a service with the wrong prefix (e.g., "Google Cloud Storage" or "Cloud Firestore") — AP-09
**Cause:** The prompt used a verbose or wrong-prefix form.
**Fix:** Always write the exact official marketing name in the prompt. See the **Key Marketing-Name Rules** table in `gcp-service-catalog.md`. The most common wrong-prefix errors:
- `"Google Cloud Storage"` → `"Cloud Storage"`
- `"Cloud Firestore"` → `"Firestore"`
- `"Cloud BigQuery"` → `"BigQuery"`
- `"Cloud Pub/Sub"` → `"Pub/Sub"`
- `"Google Vertex AI"` → `"Vertex AI"`

---

## Multi-Region / Multi-Project Issues

### Multi-region diagram shows separate VPCs per region
**Cause:** Designer assumed AWS-style (VPC per region) semantics.
**Fix:** In GCP, one VPC spans all regions. Draw a single VPC boundary containing multiple region boxes. Use VPC Peering or Shared VPC only if the architecture genuinely requires it.

---

### IAM policy shown attached to a VM instead of at the Project level
**Cause:** IAM roles are often shown inline on resources from AWS diagrams, but GCP IAM bindings live on the resource hierarchy node (Organization, Folder, Project, or Resource).
**Fix:** Show the IAM icon adjacent to the node where the binding lives (usually the Project), with a labeled arrow indicating the scope. Add a callout: `"IAM binding on Project level — inherits down to all resources in this Project."`

---

### BigQuery shown inside a Region box with a subnet boundary
**Cause:** Designers treat BigQuery like a database inside a VPC. BigQuery is a serverless, multi-regional managed service — it has no VPC placement.
**Fix:** Draw BigQuery outside the VPC boundary with a dotted-line connection from the VPC to BigQuery. Label the connection `"Private Google Access"` or `"Public endpoint"` as appropriate. Do NOT draw BigQuery inside a subnet.
