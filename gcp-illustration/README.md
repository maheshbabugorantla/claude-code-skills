# gcp-illustration

> Generate high-fidelity Google Cloud Platform architecture illustrations — both AI-ready image prompts and production-quality draw.io XML diagrams — using the official Google brand palette and `mxgraph.gcp2` stencils.

---

## What it does

One invocation produces **two outputs simultaneously**:

| Output | File | Use case |
|---|---|---|
| **AI image prompt** | `img/<slug>-prompt.md` | Paste into Gemini / DALL-E / Midjourney → export 1920×1080 PNG for blog headers, slide decks |
| **draw.io XML** | `diagrams/<slug>.drawio` | Open in diagrams.net (free) → pixel-perfect GCP icons, fully editable, export at any resolution |

The skill walks you through a progressive-disclosure consultation before generating — asking only the questions relevant to your specific type, with `[Step N/M]` progress indicators and "why this matters" explanations for every option.

---

## Quick start

```
/gcp-illustration architecture "Cloud Load Balancing → Cloud Run → Firestore"
```

That's it. The skill will ask 2–4 targeted questions (theme, flow direction, audience), then produce both files.

To skip the consultation for specific axes:

```bash
# Force dark theme (skips theme question)
/gcp-illustration architecture "GKE microservices with Pub/Sub" --theme=dark

# Parse services from an existing doc (skips services question)
/gcp-illustration architecture "my app" --from=./docs/architecture.md

# Verify all draw.io stencil names before writing (catches typos)
/gcp-illustration region-diagram "Multi-zone GKE with Cloud SQL" --verify
```

---

## Illustration types

### Standard types (shared with other illustration skills)

| Type | Description | Best for |
|---|---|---|
| `concept-cards` | 3–5 service cards in a horizontal row with arrows | Explainer slides, feature overviews |
| `mapping` | Two-column concept mapping with dotted connectors | On-prem → GCP migration diagrams, AWS → GCP equivalence |
| `architecture` | Left-to-right component flow (4–7 services) | Reference architectures, GCP Blog headers |
| `workflow` | Horizontal pipeline stages with process bars | Dataflow pipelines, CI/CD flows, data processing |
| `grid` | N×M card grid, no arrows | Service catalog overviews, feature matrices |
| `split-panel` | Architecture flow + summary bullets panel | "Architecture + why we chose this" slide |
| `process-flow` | 3–5 tall panels with bold labeled arrows | Request lifecycle, data pipeline stages |

### GCP-specific types

| Type | Description | Best for |
|---|---|---|
| `region-diagram` | Global VPC → Region → Zones (stacked) → services | Standard GCP reference architecture, VPC layout docs |
| `gcp-architecture-framework` | 1–6 Architecture Framework pillar cards, user-selected | Architecture review decks, design principle slides |
| `resource-hierarchy` | Organization → Folders → Projects → Resources | Landing zone docs, IAM hierarchy overviews |

---

## Themes

Every type supports two themes via the `--theme` flag:

### Light — Google Cloud Blog technical (default)
White `#FFFFFF` background, flat category-colored service icons, slate `#5F6368` arrows, subtle `#DADCE0` card borders. Matches the visual style of [cloud.google.com/blog](https://cloud.google.com/blog).

### Dark — Google Cloud Next keynote
Deep Gray `#202124` background (NOT pure black), `#9AA0A6` arrows, category-color 4px top-border accent on cards. Matches Google Cloud Next session slides.

---

## Google Cloud Color Palette

GCP uses four brand colors plus a slate for management services. Each service family has a canonical color.

| Category | Hex | Services |
|---|---|---|
| Compute, Networking, Security, DevTools, AI/ML | `#4285F4` Google Blue | Compute Engine, GKE, Cloud Run, Cloud Load Balancing, Cloud IAM, Vertex AI |
| Storage, Serverless | `#34A853` Google Green | Cloud Storage, Cloud Functions, Filestore |
| Database | `#EA4335` Google Red | Cloud SQL, Cloud Spanner, Firestore, Bigtable, Memorystore, AlloyDB |
| Analytics, Big Data | `#FBBC04` Google Yellow | BigQuery, Dataflow, Pub/Sub, Looker, Dataform |
| Management, Operations | `#5F6368` Slate | Cloud Monitoring, Cloud Logging, Cloud Scheduler, Cloud Tasks |

> **Tip:** Attach `assets/palette.svg` as a reference image in Gemini for dramatically better color fidelity than text-only palette descriptions.

---

## Typography

The skill uses the **Google Sans** type stack with open fallbacks:

```
"Google Sans", Roboto, Inter, "Noto Sans", system-ui, sans-serif
```

Google Sans is Google's custom typeface used in all GCP product interfaces. When unavailable, **Roboto** is the closest open substitute. In AI image prompts, this is described as *"Google Sans — clean geometric humanist sans-serif with open apertures and uniform stroke weight"*.

| Role | Size | Weight |
|---|---|---|
| Diagram title / hero | 56px | Bold 700 |
| Section / boundary label | 24px | Semibold 600 |
| Service card title | 18px | Semibold 600 |
| Arrow label / sublabel | 14px | Medium 500 |
| Badge / micro | 10px | Medium 500 |

---

## Consultation experience

The skill asks questions before generating — but only the ones you actually need. Each question includes a `[Step N/M]` progress indicator.

**Example session for `region-diagram`:**

```
[Step 1/4 — GCP services]
Which services appear in your architecture?
  ✓ Google Kubernetes Engine — Compute (Google Blue)
  ✓ Cloud SQL — Database (Google Red)
  ✓ Cloud Load Balancing — Networking (Google Blue)
  ✓ Cloud Monitoring — Management (Slate)

[Step 2/4 — Region scope]
How much infrastructure scope?
  → Single region, 2 zones — HA basic (default)
    Why: Most common GCP reference pattern. Two zones cover standard HA.
    
  ○ Single region, 3 zones — HA production
    Why: Three-zone redundancy for production GKE node pools.
    
  ○ Multi-region — DR / global
    Why: For global VPC diagrams with Cloud Spanner or multi-region Cloud Storage.

[Step 3/4 — Global-managed services]
Which services live outside the VPC (Google-managed)?
  ✓ BigQuery — outside VPC, Private Google Access
  ✓ Cloud Storage — outside VPC, Private Google Access

[Step 4/4 — Audience]
Who reads this?
  → Engineering team (architecture review) — full technical labels
```

**Skip logic:** If your invocation already provides information, those steps are skipped. `/gcp-illustration architecture "Cloud Run → Firestore → BigQuery" --theme=dark` skips both the services step and the theme step.

---

## draw.io XML details

The `.drawio` file uses **official `mxgraph.gcp2` stencils** — the same GCP-approved icons built into [diagrams.net](https://diagrams.net) and the draw.io desktop app.

### How to open and export

1. Go to [diagrams.net](https://diagrams.net) (free, no account needed) or open draw.io desktop
2. File → Open → select `diagrams/<slug>.drawio`
3. File → Export as → PNG
4. Set width to 1920, enable "Fit page", click Export
5. Save to `diagrams/<slug>.png`

### How stencils work

Every service icon cell uses this style pattern:

```xml
style="shape=mxgraph.gcp2.cloud_run;      ← GCP2 stencil name (underscores, no spaces)
       resIcon=mxgraph.gcp2.cloud_run;     ← must match shape= exactly
       sketch=0;                           ← MUST be 0 for clean icon rendering
       aspect=fixed;                       ← prevents icon distortion
       fillColor=#4285F4;                  ← Google Blue for Compute/Networking
       strokeColor=none;
       fontColor=#202124;
       fontFamily=Google Sans,Roboto;
       fontSize=13;
       fontStyle=1;
       verticalLabelPosition=bottom;
       verticalAlign=top;"
```

For dark mode, `fontColor` becomes `#FFFFFF`, page `background` is `#202124`, and card surface is `#303134`.

### VPC / Region / Zone boundaries

GCP diagrams use three distinct boundary line styles — never all the same:

| Container | Style | Line style | Notes |
|---|---|---|---|
| VPC Network | Solid 2px `#4285F4` | Solid Blue | **Global** — wraps multiple regions |
| Region | Dashed 1px `#5F6368` | Dashed Slate | Inside VPC, contains zones |
| Zone | Dotted 1px `#9AA0A6` (dashPattern=4 4) | Dotted Pale Gray | Stacked VERTICALLY inside region |

**Critical difference from AWS:** GCP VPC Networks are **global resources** — one VPC spans multiple regions. AWS VPCs are regional. This is the most common layout mistake when illustrating GCP.

### `--verify` flag

After generating XML, `--verify` runs 4 parallel audits across the generated files:

```
/gcp-illustration architecture "Pub/Sub → Dataflow → BigQuery" --verify

✅ palette      — all fillColor values authorized
⚠  marketing    — AP-09: value="Cloud Firestore" should be "Firestore"
✅ stencils     — all mxgraph.gcp2 tokens recognized
✅ anti-slop    — no isometric or glass-morphism language in prompt
```

Each finding cites a stable AP-ID from `references/anti-patterns.md`.

---

## Ingest mode (`--from=<file>`)

Parse an existing architecture description and pre-fill the consultation:

```bash
/gcp-illustration architecture --from=./docs/architecture.md
```

The skill scans the file for GCP service names (matching against `references/gcp-service-catalog.md`), maps each to its category color and stencil, and pre-fills Step 1 of the consultation. Great for auto-documenting existing repos from their READMEs or ADRs.

---

## Palette SVG — multi-modal color reference

`assets/palette.svg` is a labeled color swatch of the full GCP palette (4 brand colors + 6 neutrals). In Gemini (and other multi-modal models), attaching it as a reference image alongside your text prompt dramatically improves category-color accuracy compared to hex-code-only descriptions.

```
Attach: ~/.claude/skills/gcp-illustration/assets/palette.svg
Prompt: "Make the service icon colors consistent with this GCP palette swatch: [attached]"
```

---

## Region diagram conventions

The `region-diagram` type follows official GCP reference architecture conventions:

```
[Internet / User]  ──HTTPS──▶  [Cloud Load Balancing — global, at VPC edge]
                                  │
                                  ▼
                    [VPC Network: prod-vpc — GLOBAL, solid Blue]
                     └── [Region: us-central1 — dashed Slate]
                           ├── [Zone: us-central1-a — dotted Pale Gray] ← TOP
                           │     └── GKE node pool, Cloud SQL primary
                           └── [Zone: us-central1-b — dotted Pale Gray] ← BOTTOM
                                 └── GKE node pool, Cloud SQL replica

                    Outside VPC (dotted arrows, "Private Google Access"):
                    BigQuery, Cloud Storage, Pub/Sub, Cloud Monitoring
```

**Critical rules enforced:**
- VPC Network is always the **outermost** boundary (solid Blue) — and it is **global**
- Zones are always **vertically stacked** (top/bottom rows), never side by side
- Three distinct border styles: VPC=solid Blue, Region=dashed Slate, Zone=dotted Pale Gray
- Global-managed services (BigQuery, Cloud Storage, Pub/Sub) sit **outside the VPC**

Default placement for common services:

| Service | Where it goes |
|---|---|
| Cloud Load Balancing | At VPC edge (global resource) |
| Cloud NAT | Regional (between VPC and internet) |
| GKE node pools | Inside Zone |
| Compute Engine VMs | Inside Zone |
| Cloud SQL primary | Inside Zone (primary zone) |
| Cloud SQL replica | Inside Zone (secondary zone) |
| Cloud Run (default) | Outside VPC |
| Cloud Run (Direct VPC egress) | Inside VPC |
| Cloud Storage | Outside VPC — connect via Private Google Access |
| BigQuery | Outside VPC — connect via Private Google Access |
| Pub/Sub | Outside VPC (global managed service) |
| Cloud Monitoring, Cloud Logging | Outside VPC (bottom right) |

---

## GCP Architecture Framework type

The `gcp-architecture-framework` type supports any combination of the 6 current pillars:

| Pillar | Accent color | Representative icon |
|---|---|---|
| Operational Excellence | Google Blue `#4285F4` | Cloud Monitoring |
| Security, Privacy, and Compliance | Google Blue `#4285F4` | Cloud IAM |
| Reliability | Google Blue `#4285F4` | Cloud Load Balancing |
| Cost Optimization | Google Yellow `#FBBC04` | Cloud Billing |
| Performance Optimization | Google Blue `#4285F4` | Compute Engine |
| Sustainability | Google Green `#34A853` | Cloud Monitoring (green-tinted) |

You pick which pillars at `[Step 1/3]`. Choosing 3 pillars produces a clean horizontal row; 6 pillars auto-shifts to a 3×2 grid.

---

## Resource Hierarchy type

Defaults to a standard GCP landing zone structure:

```
Organization: acme.com
├── Folder: Production
│     ├── Project: prod-api
│     └── Project: prod-data
└── Folder: Development
      ├── Project: dev-api
      └── Project: dev-data

Resources under each Project: Compute Engine, Cloud Storage, BigQuery, etc.
```

All connectors are right-angle (orthogonal) lines — no diagonal or curved connectors.

**GCP hierarchy rules enforced:**
- Organization is always the root (top)
- Folders are always below Organization
- Projects are always below Folders (never contain Folders)
- Resources are always below Projects
- IAM policies inherit downward (org-level policy applies to all)

---

## GCP marketing name rules

GCP service names follow three prefix patterns. Using the wrong form is a brand error.

| Correct | Wrong |
|---|---|
| Cloud Storage | Google Cloud Storage, GCS |
| Firestore | Cloud Firestore |
| BigQuery | Big Query (two words), Google BigQuery |
| Pub/Sub | PubSub, Cloud Pub/Sub |
| Google Kubernetes Engine | GKE (alone in labels) |
| Vertex AI | Vertex, Google Vertex AI |
| Identity-Aware Proxy | Identity Aware Proxy (unhyphenated) |
| Speech-to-Text | Speech to Text (unhyphenated) |
| AlloyDB for PostgreSQL | AlloyDB (alone in formal diagrams) |
| Artifact Registry | Container Registry (deprecated) |

The `--verify` flag's marketing-name audit catches all of these automatically.

---

## Output file locations

All outputs land in the **invoking project's directory**:

```
<your-project>/
├── img/
│   ├── <slug>-prompt.md     ← Gemini-ready AI prompt
│   └── <slug>.png           ← export here after generating with Gemini
└── diagrams/
    ├── <slug>.drawio         ← draw.io XML (open in diagrams.net)
    └── <slug>.png            ← export here after opening in draw.io
```

---

## Common pitfalls

| Problem | Fix |
|---|---|
| Gemini generates old-style GCP icons (blue gradient, 3D isometric) | Add "current Google Cloud icon style, Material Design aesthetic, NOT isometric, NOT old gradient icons" |
| Zones render side by side instead of stacked | The skill states vertical stacking 3 times in the prompt — if still wrong, regenerate |
| VPC drawn as a single-region box | Add "VPC Network is GLOBAL — one VPC boundary wraps all regions, not one VPC per region" |
| All service icons are blue instead of category-specific | Name each service + its exact color explicitly: "BigQuery icon in Google Yellow #FBBC04" |
| draw.io shows blank gray boxes | Stencil name typo or space in resIcon value — run `--verify`, check `gcp-service-catalog.md` |
| Dark background renders as pure black | Specify "Deep Gray #202124 — NOT pure black #000000" in the prompt |
| draw.io icons look rough/sketchy | Missing `sketch=0` in the style string |
| "Cloud Firestore" label in diagram | Use "Firestore" — the "Cloud" prefix was dropped; `--verify` catches this |

See `references/troubleshooting.md` for full fixes.

---

## File structure

```
~/.claude/skills/gcp-illustration/
├── SKILL.md                          ← Claude skill entry point (auto-invoked)
├── DESIGN.md                         ← Authoritative design spec (9 Stitch sections)
├── README.md                         ← This file
├── assets/
│   └── palette.svg                   ← Multi-modal color reference swatch
├── bin/
│   ├── gcp-catalog-hash.sh           ← SHA256 → 12-char hash of JSONL catalog
│   └── gcp-service-lookup.sh         ← jq-based service name + alias lookup
└── references/
    ├── consultation.md               ← Progressive-disclosure Q-scripts per type
    ├── layout-rules.md               ← Arrow direction + GCP VPC/region/zone rules
    ├── tips.md                       ← Gemini prompt tips and anti-patterns
    ├── troubleshooting.md            ← Common AI + draw.io failure fixes
    ├── anti-patterns.md              ← AP-01..AP-18 stable IDs for --verify
    ├── gcp-service-catalog.jsonl     ← 78+ services → category → mxgraph.gcp2 stencil
    ├── gcp-service-catalog.md        ← Human-readable catalog companion
    ├── examples.md                   ← 3 worked examples with full prompts + XML
    ├── specialists/
    │   ├── anti-slop-audit.md        ← Scans AI prompt for Gemini drift patterns
    │   ├── marketing-name-audit.md   ← Scans value="" labels for wrong GCP prefixes
    │   ├── palette-audit.md          ← Scans fillColor= against authorized palette
    │   └── stencil-verifier.md       ← Scans shape=mxgraph.gcp2.* tokens
    └── templates/
        ├── architecture.md
        ├── concept-cards.md
        ├── gcp-architecture-framework.md
        ├── grid.md
        ├── mapping.md
        ├── process-flow.md
        ├── region-diagram.md
        ├── resource-hierarchy.md
        ├── split-panel.md
        └── workflow.md
```

---

## Extending the catalog

`references/gcp-service-catalog.jsonl` covers ~78 common services. To add a new service:

1. Find the mxgraph.gcp2 stencil name: open [diagrams.net](https://diagrams.net) → Extras → Edit Diagram, add a shape from the GCP2 library, inspect its style string for `resIcon=mxgraph.gcp2.<name>`
2. Determine its category and color from the GCP product page
3. Add a JSONL entry with the full schema: `{key, marketing, category, color, hex, resicon, aliases[], prefix, gotcha?}`
4. Add a corresponding row to `gcp-service-catalog.md`

Or use the lookup script to check existing entries:
```bash
bash bin/gcp-service-lookup.sh "Cloud Run"
bash bin/gcp-service-lookup.sh GKE
```

---

## Design spec

The full design system lives in `DESIGN.md`. It follows the [VoltAgent `awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) 9-section Stitch format:

1. Visual Theme & Atmosphere
2. Color Palette & Roles (4 brand + 6 neutrals + GCP category mapping)
3. Typography Rules (Google Sans stack + scale)
4. Component Stylings (service cards, VPC/Region/Zone boundaries, hierarchy nodes, arrows)
5. Layout Principles (4px grid, 16:9 canvas, global VPC rule, zone vertical rule)
6. Depth & Elevation (flat light mode, top-border dark mode)
7. Do's and Don'ts (with AP-ID cross-references)
8. Responsive Behavior (export targets for blog / keynote / social)
9. Agent Prompt Guide (naming convention, color reference, copy-paste style blocks + XML boilerplate)

The skill reads `DESIGN.md` on every invocation as its source of truth for colors and typography.

---

## Related skills

| Skill | Style | Best for |
|---|---|---|
| `/gcp-illustration` | GCP Material Design flat icons, dual light/dark | GCP Blog, Google Cloud Next, architecture docs |
| `/aws-illustration` | AWS 2023 flat icons, dual light/dark | AWS Blog, re:Invent, AWS architecture docs |
| `/saas-illustration` | Dark glass morphism, indigo/cyan | SaaS marketing, developer tool blogs |
| `/crayon-illustration` | Hand-drawn pastel whiteboard | Educational / playful explainers |

---

*Google Cloud service icons and trademarks belong to Google LLC. `mxgraph.gcp2` stencils are maintained by the [draw.io](https://github.com/jgraph/drawio) team. This skill is not affiliated with or endorsed by Google.*
