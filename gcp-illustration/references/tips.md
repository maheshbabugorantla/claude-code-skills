# Tips

## GCP Marketing Names — Required

**Always use official GCP marketing names in all outputs (AI prompts AND draw.io labels).**
Write "Cloud Storage" not "GCS" or "object storage". Write "Google Kubernetes Engine" not "GKE" or "Kubernetes cluster". Write "Pub/Sub" not "PubSub" or "Cloud Pub/Sub". This is non-negotiable — architecture diagrams must match Google Cloud brand conventions.

### GCP prefix rules — quick reference

| Pattern | Rule | Examples |
|---|---|---|
| **Cloud ___** | Majority of GCP managed services | Cloud Storage, Cloud SQL, Cloud Spanner, Cloud Run, Cloud Build, Cloud Deploy, Cloud DNS, Cloud Load Balancing, Cloud Logging |
| **Google ___** | Services where Google is part of the brand | Google Kubernetes Engine, Google Cloud VMware Engine |
| **No prefix** | Standalone Google product names | BigQuery, Firestore, Pub/Sub, Vertex AI, Looker, Dataflow, Dataproc, Dataplex, Dataform, Dialogflow, Eventarc, AlloyDB for PostgreSQL, Apigee, Anthos |

**Gotchas** (common brand errors):
- `"Cloud Firestore"` → **Firestore** (prefix was dropped)
- `"Big Query"` → **BigQuery** (one word, no space)
- `"Cloud Pub/Sub"` → **Pub/Sub** (no prefix, keep the slash)
- `"Google Cloud Storage"` → **Cloud Storage** (not "Google Cloud ___")
- `"Google Vertex AI"` → **Vertex AI** (no Google prefix)
- `"AlloyDB"` → **AlloyDB for PostgreSQL** (full name)
- `"Identity Aware Proxy"` → **Identity-Aware Proxy** (hyphenated)
- `"Speech to Text"` → **Speech-to-Text** (hyphenated)
- `"Text to Speech"` → **Text-to-Speech** (hyphenated)
- `"Cloud Spanner"` → keep as is (**Cloud Spanner** is correct)

See `gcp-service-catalog.md` for the complete list with lookup keys, correct marketing names, and aliases.

---

## GCP Style Tips

- **Always use official GCP marketing names** in prompts. Write `"Cloud Storage icon in Google Green (#34A853)"` not `"GCS icon"`. Write `"Vertex AI icon in Google Blue (#4285F4)"` not `"ML icon"`.
- **Name the category color explicitly** in the prompt with its hex. Gemini knows GCP = blue and will apply it uniformly without explicit per-service colors.
- **Use `"Google Cloud architecture diagram style"`** at the top of every prompt. This anchors the model's visual understanding to the Material Design aesthetic.
- **Use `"Material Design aesthetic"`** to signal flat, clean, no-shadow, no-glass style.
- **Avoid generic synonyms** — don't say "serverless function" when you mean "Cloud Functions", don't say "managed Kubernetes" when you mean "Google Kubernetes Engine".
- **For region diagrams**, clarify GCP VPC scope explicitly: `"VPC Network is GLOBAL — one VPC boundary wraps all regions."` The model defaults to AWS-style (VPC per region) without this.

---

## Layout Tips (architecture, workflow, split-panel, process-flow, region-diagram)

- **Arrow direction is the #1 failure mode** — use exhaustive negation: `"All arrows point strictly RIGHT. No arrows point downward. No arrows point left. No diagonal arrows."`
- **Redundancy beats brevity** — state layout rules 3 times: as a rule block before components, inline with component placement, and as a summary after all components.
- **Number your components** — numbering (Component 1, Component 2, …) gives the model an unambiguous ordering and prevents reordering or duplication.
- **For region-diagram**: always say `"Zones stacked VERTICALLY, one per row — NOT side by side"` and repeat it. The default AI behavior is to place zones horizontally.
- **For resource-hierarchy**: use right-angle connectors only. State `"Hierarchy uses right-angle connectors only. No diagonal lines. No curved lines."` at the top.
- **Sublabels prevent clutter** — `"Cloud Storage / incoming events"` (marketing title + short sublabel) instead of a long title. Marketing name is always the title.

---

## draw.io XML Tips

- **Always set `sketch=0`** in every `mxgraph.gcp2` style string. Without it, icons may render in a rough sketch style.
- **Specify `aspect=fixed`** to prevent icon distortion when resizing cells.
- **Use `verticalLabelPosition=bottom;verticalAlign=top`** to place the service name below the icon, matching GCP's official architecture diagram style.
- **VPC boundary color**: `strokeColor=#4285F4` (Google Blue), `dashed=0`, `fillColor=none`.
- **Region boundary**: `strokeColor=#5F6368` (Slate), `dashed=1`, `fillColor=none`.
- **Zone boundary**: `strokeColor=#9AA0A6` (Pale Gray), `dashed=1`, `dashPattern=4 4`, `fillColor=none`.
- **Cell IDs must be unique** — use descriptive IDs like `cloud_run_1`, `firestore_1`, `region_us_central1`.
- **Run `--verify`** before handing draw.io XML to the user — stencil typos cause blank placeholder boxes.

---

## Palette / Color Tips

- **Google Blue `#4285F4`** is the dominant color — Compute, Networking, Security, DevTools, AI all use it. Use it for the majority of services.
- **Green `#34A853`** is for Storage and Serverless (Cloud Run, Cloud Functions, App Engine). If a service *stores data persistently*, it's probably Green.
- **Red `#EA4335`** is for Databases and CI/CD. Cloud SQL, Firestore, Cloud Build, Cloud Deploy.
- **Yellow `#FBBC04`** is for Analytics and Big Data. BigQuery, Pub/Sub, Dataflow, Dataproc.
- **Never mix GCP and AWS palette colors** in the same diagram. palette-audit.md will flag AWS orange `#ED7100` or Azure blue `#0089D6` as AP-13.
- **Slate `#5F6368`** is for arrows (light mode) and for Management/Operations service icons. Not for primary architecture components.

---

## Multi-Modal Gemini Tip

Attach `assets/palette.svg` as a reference image when prompting Gemini:
> "Make the illustration's service icon colors consistent with this Google Cloud palette swatch: [attach palette.svg]"

This dramatically improves category-color fidelity versus text-only palette descriptions. Without it, Gemini often defaults to all-blue or uses incorrect shades.

---

## Region Diagram Tips

- Always place the internet/user icon **outside and to the left** of the VPC boundary.
- Cloud Load Balancing lives at the **VPC edge** — it's a global resource, show it before the VPC boundary (or at the VPC entry point).
- Cloud NAT goes in the **regional subnet** layer, not inside a zone.
- Cloud SQL goes inside a **zone** boundary with its read replica in the sibling zone.
- Cloud Spanner is **multi-regional** — draw it outside or spanning multiple region boxes.
- BigQuery is **serverless and multi-regional** — draw it outside the VPC boundary with a `"Private Google Access"` or `"public endpoint"` connection.
- Cloud Run (without Direct VPC egress) goes **outside the VPC** — it's a Google-managed service.
- Cloud Run (with Direct VPC egress configured) goes **inside the VPC** with a subnet attachment.
- If the user hasn't specified the region name, default to `us-central1`.
- Always label subnets with CIDR ranges if the user has specified them; otherwise label them `"Public Subnet"` / `"Private Subnet"`.
