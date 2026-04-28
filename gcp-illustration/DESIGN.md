# Design System — Google Cloud Platform Illustrations

> GCP illustration design spec. Follows the Google Stitch / VoltAgent `awesome-design-md` 9-section format.
> Not an official Google design system — a practitioner reference for generating consistent GCP-style diagrams.

---

## 1. Visual Theme & Atmosphere

- **What this is:** A design spec for GCP architecture diagrams, blog headers, and Next.js-style hero illustrations
- **Who it's for:** Engineers and technical writers creating GCP content — blogs, whitepapers, slide decks, design reviews
- **Industry context:** Cloud infrastructure, data analytics, ML/AI platforms (Vertex AI, BigQuery, Gemini ecosystem)
- **Dual mode:**
  - **Light / Google Cloud Blog technical** — white `#FFFFFF` background, Material Design aesthetic, flat Google-colored icons, slate arrows. Matches cloud.google.com/blog architecture thumbnails. Enterprise-clean, schematic-precise.
  - **Dark / Google Next keynote** — Deep Gray `#202124` background, Google Blue `#4285F4` accents, subtle border styling. Matches Google Cloud Next keynote aesthetic. Premium, product-marketing.
- **Decoration level:** Minimal-functional. Google brand color is information, not decoration. No isometric 3D. No glass morphism (not current GCP style). No neon glows.
- **Mood:** Authoritative and modern. "This diagram was made by someone who knows the Architecture Framework."
- **Reference visuals:** cloud.google.com/blog/products/gcp (light), Google Cloud Next session slides (dark)

---

## 2. Color Palette & Roles

### Brand Colors
| Name | Hex | Role |
|---|---|---|
| Google Blue | `#4285F4` | Compute, Networking, Security, DevTools, AI/ML — primary accent |
| Google Red | `#EA4335` | Databases, CI/CD release |
| Google Yellow | `#FBBC04` | Analytics, Big Data |
| Google Green | `#34A853` | Storage, Serverless |

### GCP Service Category → Color Mapping
| Category | Color | Hex | Services |
|---|---|---|---|
| Compute | Google Blue | `#4285F4` | Compute Engine, GKE, Cloud Run, App Engine, Cloud Functions |
| Networking | Google Blue | `#4285F4` | Cloud Load Balancing, Cloud DNS, Cloud CDN, Cloud NAT, Cloud VPN |
| Security | Google Blue | `#4285F4` | Cloud IAM, Cloud KMS, Secret Manager, Identity-Aware Proxy, Security Command Center |
| DevTools | Google Blue | `#4285F4` | Cloud Build, Cloud Deploy, Artifact Registry, Source Repositories |
| AI / ML | Google Blue | `#4285F4` | Vertex AI, Gemini API, Vision AI, Speech-to-Text, Document AI |
| Storage | Google Green | `#34A853` | Cloud Storage, Filestore, Persistent Disk |
| Serverless | Google Green | `#34A853` | Cloud Run, Cloud Functions |
| Database | Google Red | `#EA4335` | Cloud SQL, Cloud Spanner, Firestore, Bigtable, Memorystore, AlloyDB |
| CI/CD Release | Google Red | `#EA4335` | Cloud Build, Cloud Deploy (deployment phase) |
| Analytics | Google Yellow | `#FBBC04` | BigQuery, Dataflow, Pub/Sub, Looker, Dataform, Dataproc |
| Big Data | Google Yellow | `#FBBC04` | Cloud Composer, Dataform, Analytics Hub |
| Management / Ops | Slate | `#5F6368` | Cloud Monitoring, Cloud Logging, Cloud Trace, Error Reporting, Cloud Scheduler, Cloud Tasks |

### Neutral Scale
| Name | Hex | Role |
|---|---|---|
| Deep Gray | `#202124` | Dark mode background |
| Dark Card | `#303134` | Dark mode card surface |
| Slate | `#5F6368` | Body text (light), arrow/connector color, secondary labels |
| Pale Gray | `#9AA0A6` | Captions, secondary labels, zone boundaries (dark) |
| Border | `#DADCE0` | Card borders (light), dividers |
| Light Gray | `#F1F3F4` | Card backgrounds (light), summary panel fills |
| White | `#FFFFFF` | Page background (light), text (dark) |

### Theme-Aware Tokens
| Token | Light (`#FFFFFF` BG) | Dark (`#202124` BG) |
|---|---|---|
| Page background | `#FFFFFF` | `#202124` |
| Card surface | `#FFFFFF` | `#303134` |
| Card border | `#DADCE0` | `#5F6368` |
| Body text | `#202124` | `#FFFFFF` |
| Arrow / connector | `#5F6368` | `#9AA0A6` |
| Arrow label | `#5F6368` | `#9AA0A6` |
| VPC boundary (solid) | `#4285F4` | `#4285F4` |
| Region boundary (dashed) | `#5F6368` | `#9AA0A6` |
| Zone boundary (dotted) | `#9AA0A6` | `#5F6368` |

### Accessibility
- All text colors: ≥ 4.5:1 contrast ratio against their background
- Google Blue `#4285F4` on white: 3.07:1 — use for icons and borders (≥ 3:1 required for graphical elements)
- Slate `#5F6368` on white: 5.74:1 — passes for body text
- Google brand palette was designed for accessibility on both light and dark backgrounds

---

## 3. Typography Rules

### Font Stack
```
"Google Sans", Roboto, Inter, "Noto Sans", system-ui, sans-serif
```
Google Sans is Google's custom typeface used in all GCP product interfaces. Use it when available; Roboto is the closest open substitute. For AI image prompts, describe as **"Google Sans — a clean geometric humanist sans-serif with open apertures and uniform stroke weight, not condensed"**.

### Type Scale
| Role | Size | Weight | Usage |
|---|---|---|---|
| Hero / diagram title | 56px | 700 Bold | Keynote title, hero banner |
| H1 | 40px | 700 Bold | Section header |
| H2 | 24px | 600 Semibold | Group / lane label, boundary label |
| H3 | 18px | 600 Semibold | Card title, service name |
| H4 | 14px | 500 Medium | Subtitle, sublabel |
| Body | 14px | 400 Regular | Arrow labels, descriptions |
| Caption | 12px | 400 Regular | Port numbers, secondary info |
| Label / micro | 10px | 500 Medium | Badge text, zone names |

### Typography Rules
- All-caps sparingly: badges and category labels only
- Tabular numerals for any numeric data
- Line height: 1.4 for body, 1.2 for headings
- Google Sans feels slightly more circular than Roboto — in AI prompts, specify "circular open letterforms" for fidelity

---

## 4. Component Stylings

### Service Icon Card
- **Size:** 64×88px (icon 64px + label 1–2 lines beneath via `verticalLabelPosition=bottom`)
- **Icon:** `mxgraph.gcp2.*` stencil in its category color. `sketch=0` always. `aspect=fixed` always.
- **Label:** H3 (18px, semibold), official GCP marketing name (see § 9 for prefix rules)
- **Sublabel:** Caption (12px), optional descriptor (region, slot count, tier)
- **Card surface (light):** White `#FFFFFF`, 1px `#DADCE0` border, 4px radius
- **Card surface (dark):** `#303134`, 1px `#5F6368` border, 4px radius, category-color 3px top border

### Arrow / Connector
- **Weight:** 1.5–2px
- **Color:** `#5F6368` (light) / `#9AA0A6` (dark)
- **Arrowhead:** Classic filled, 4px
- **Label:** 12px caption, centered on midpoint, white pill background (light)
- **Direction:** ALWAYS left-to-right within a horizontal flow; top-to-bottom within region/hierarchy diagrams

### VPC Network Boundary
- **Style:** Solid 2px `#4285F4` (Google Blue — Networking color)
- **Fill:** Transparent (both modes) / rgba(66,133,244,0.04) (light)
- **Label:** H2 (24px semibold) top-left with VPC Network icon
- **Critical:** In GCP, VPC Networks are **GLOBAL** — the boundary wraps multiple regions. Never draw a VPC as a single-region container.

### Region Boundary
- **Style:** Dashed 1px `#5F6368` (light) / `#9AA0A6` (dark)
- **Label:** Caption (13px) top-left: region name (e.g., "us-central1")
- **Fill:** Transparent (both modes)
- **Minimum padding:** 24px inset from children

### Zone Boundary
- **Style:** Dotted 1px `#9AA0A6` (short dash pattern `4 4`)
- **Label:** Caption (12px) top-left: zone name (e.g., "us-central1-a")
- **Fill:** Transparent (both modes)
- **Critical:** Zones are STACKED VERTICALLY within a region — never side by side horizontally

### Resource Hierarchy Node
- **Organization:** Cloud Resource Manager icon, Slate `#5F6368` fill, bold label below
- **Folder:** Rounded rectangle `#E8F0FE` fill (light), `#4285F4` stroke, 1px border
- **Project:** Rounded rectangle `#FFFFFF` fill, `#4285F4` stroke, 1px border
- **Hierarchy lines:** 1px `#5F6368` right-angle connectors (orthogonal edge style, `rounded=0`)

### Architecture Framework Pillar Card
- **Width:** Spans grid column equally; 3 pillars per row for 6-pillar grid (3×2)
- **Top accent bar:** 4px, pillar-specific color (Blue for most, Yellow for Cost, Green for Sustainability)
- **Icon:** 64px GCP stencil centered
- **Label:** H3 pillar name
- **Body:** 3 bullet points at Caption size (12px)

---

## 5. Layout Principles

### Spacing
- **Base unit:** 4px
- **Scale:** 4 / 8 / 16 / 24 / 40 / 64 / 96px
- **Component gap (horizontal flow):** 40px minimum between service cards
- **Region/Zone inset:** 24px padding inside boundary boxes
- **No element within 16px of another element** — generous whitespace is a key GCP Blog characteristic

### Canvas
- **Standard:** 1920×1080 (16:9) for presentation slides and AI image output
- **GCP Blog export:** 1024×576 crop from the same canvas
- **Grid:** 12 columns at 1920px; gutters 24px

### Flow Direction
- **Horizontal architecture:** Strictly left → right. Sources on left, targets on right.
- **Region/Zone layouts:** Top → bottom (zones stacked vertically, Zone A on top)
- **Resource hierarchy:** Top → bottom (Organization → Folders → Projects → Resources)
- **Two-lane architecture:** Top lane = primary data path; bottom lane = secondary (cache, async, monitoring)

### GCP-Specific Layout Rules
- **VPC is GLOBAL:** One VPC boundary wraps multiple region boxes — not one VPC per region
- **Zones are VERTICAL:** Zone A (top), Zone B (bottom) — NEVER side by side horizontally
- **Hierarchy depth:** Max 4 levels: Organization → Folder → Project → Resource
- **Cloud-managed services outside VPC:** BigQuery, Pub/Sub, Cloud Storage, Cloud Run (default) connect via dotted arrows labeled "Private Google Access"

### Balance
- Odd number of components (3, 5) tends to feel more natural than even
- If more than 6 services in a horizontal flow, consider two-lane layout
- White/Deep Gray background must be visible — minimum 10% of canvas should be background color

---

## 6. Depth & Elevation

### Light Mode
- **Page:** flat `#FFFFFF`
- **Cards:** no shadow (unlike AWS Blog); 1px `#DADCE0` border provides definition
- **Boundary boxes:** no shadow, border style differentiates them (solid vs dashed vs dotted)
- **NO:** drop shadows on icons, isometric glows, gradients on service icons

### Dark Mode
- **Page:** flat `#202124`
- **Cards:** no shadow; 3px category-color top accent bar provides visual hierarchy
- **Boundary boxes:** border lightening only
- **NO:** glass morphism, heavy drop shadows, neon glows (not current GCP style)

---

## 7. Do's and Don'ts

> For the full anti-pattern reference with stable IDs (AP-01 … AP-18) used by `--verify`, see `references/anti-patterns.md`.

### ✅ Do
- Use `mxgraph.gcp2.*` stencils — never `mxgraph.aws4.*` or `mxgraph.azure.*` in a GCP diagram (AP-12)
- Always set `sketch=0` in every `mxgraph.gcp2` style string — critical for clean icon rendering (AP-11)
- Always set `aspect=fixed` for icon cells to prevent distortion (AP-11)
- Use the correct GCP marketing name: "Cloud Storage" not "Google Cloud Storage"; "Firestore" not "Cloud Firestore"; "BigQuery" one word; "Pub/Sub" with slash (AP-09)
- Draw VPC as a GLOBAL boundary wrapping multiple regions — not per-region (AP-04)
- Stack zones VERTICALLY (Zone A on top, Zone B below) — never side by side (AP-05)
- Use three distinct boundary line styles: Solid Blue VPC / Dashed Slate Region / Dotted Pale Gray Zone (AP-08)
- Use Google brand colors per service category — Blue for Compute, Green for Storage, Red for Database, Yellow for Analytics (AP-13)
- Cross-reference `gcp-service-catalog.jsonl` for correct stencil names before writing XML (AP-15)
- Use `edgeStyle=orthogonalEdgeStyle;rounded=0` for hierarchy connectors (right-angle lines) (AP-14)

### ❌ Don't
- Don't use `mxgraph.aws4.*` stencils in a GCP diagram (AP-12)
- Don't recolor service icons to arbitrary colors — respect the category color mapping (AP-13)
- Don't use isometric 3D perspective (not current GCP flat-icon style) (AP-01)
- Don't use glass morphism for service cards (that's a SaaS aesthetic, not GCP Blog) (AP-10)
- Don't draw VPC as regional — GCP VPCs are global (AP-04)
- Don't place zones side by side horizontally — they stack vertically (AP-05)
- Don't mix Deep Gray (`#202124`) and Pure Black (`#000000`) — always use `#202124` for dark mode (AP-07)
- Don't write "Google Cloud Storage", "Cloud Firestore", "Big Query" (two words), or "PubSub" — use the canonical marketing names (AP-09)
- Don't draw Folder as a child of Project — hierarchy is strictly Org → Folder → Project (AP-14)

---

## 8. Responsive Behavior

Illustrations are **static exports**, not responsive components. Target dimensions:

| Use case | Export size | Aspect ratio |
|---|---|---|
| Presentation slide | 1920×1080 | 16:9 |
| GCP Blog inline | 1024×576 | 16:9 (crop/resize from 1920) |
| GCP Blog header | 1600×900 | 16:9 |
| Google Cloud Next keynote | 3840×2160 | 16:9 (scale up from 1920) |
| Twitter/LinkedIn card | 1200×628 | 1.91:1 (slight crop) |

For draw.io exports: always export at 1920×1080, `dpi=144`, PNG format, transparent background off.

---

## 9. Agent Prompt Guide

### Naming Convention Summary

**Always use the official GCP marketing name** in every AI prompt and every draw.io `value=""` label.

GCP service names follow three prefix patterns:

| Prefix | Rule | Examples |
|---|---|---|
| **Cloud ___** | Most GCP services | Cloud Storage, Cloud Run, Cloud SQL, Cloud Spanner, Cloud Build, Cloud Deploy, Cloud Functions, Cloud DNS, Cloud CDN, Cloud NAT, Cloud VPN, Cloud IAM, Cloud KMS, Cloud Logging, Cloud Monitoring |
| **Google Kubernetes Engine / Google Cloud Armor** | Specific named products | Google Kubernetes Engine (GKE), Google Cloud Armor, Google Cloud VMware Engine |
| **No prefix** | Standalone brand names | BigQuery, Firestore, Looker, Vertex AI, Pub/Sub, Dataflow, Dataproc, Bigtable, Memorystore, AlloyDB, Apigee, Anthos, Eventarc |

**Gotchas** (wrong prefix = brand error):
- `Cloud Storage` — NOT "Google Cloud Storage" or "GCS"
- `Firestore` — NOT "Cloud Firestore" (dropped the prefix)
- `BigQuery` — one word, NOT "Big Query" or "Google BigQuery"
- `Pub/Sub` — slash, NOT "PubSub", "Cloud Pub/Sub", or "Google Pub/Sub"
- `Google Kubernetes Engine` — full name, NOT "GKE" alone in labels
- `Vertex AI` — NOT "Vertex" alone or "Google Vertex AI"
- `Identity-Aware Proxy` — hyphenated, NOT "Identity Aware Proxy"
- `Speech-to-Text` / `Text-to-Speech` — hyphenated
- `AlloyDB for PostgreSQL` — full name in formal diagrams
- `Artifact Registry` — NOT "Container Registry" (deprecated by Google)

---

### Quick Service → Color Reference
| Marketing Name | Category | Hex |
|---|---|---|
| Compute Engine, Google Kubernetes Engine, Cloud Run, App Engine, Cloud Functions | Compute (Blue) | `#4285F4` |
| Cloud Load Balancing, Cloud CDN, Cloud DNS, Cloud NAT, Cloud VPN | Networking (Blue) | `#4285F4` |
| Cloud IAM, Cloud KMS, Secret Manager, Identity-Aware Proxy, Security Command Center | Security (Blue) | `#4285F4` |
| Cloud Build, Cloud Deploy, Artifact Registry | DevTools (Blue) | `#4285F4` |
| Vertex AI, Gemini API, Vision AI, Speech-to-Text, Document AI | AI/ML (Blue) | `#4285F4` |
| Cloud Storage, Filestore, Persistent Disk | Storage (Green) | `#34A853` |
| Cloud SQL, Cloud Spanner, Firestore, Bigtable, Memorystore, AlloyDB | Database (Red) | `#EA4335` |
| BigQuery, Dataflow, Pub/Sub, Looker, Dataform | Analytics (Yellow) | `#FBBC04` |
| Cloud Monitoring, Cloud Logging, Cloud Trace, Cloud Scheduler | Management (Slate) | `#5F6368` |

### Ready-to-Paste Style Blocks

**Light / Google Cloud Blog technical:**
```
Style: Clean Google Cloud architecture diagram on a white (#FFFFFF) background.
Material Design aesthetic — NOT isometric, NOT glass morphism, NOT dark mode.
FLAT 2D icons only. Service icons in their official Google Cloud category colors:
Compute/Networking/Security/AI icons in Google Blue (#4285F4), Storage icons in
Google Green (#34A853), Database icons in Google Red (#EA4335), Analytics icons
in Google Yellow (#FBBC04), Management icons in Slate (#5F6368).
Label every service with its official Google Cloud marketing name — "Cloud Storage",
"Google Kubernetes Engine", "Cloud Run", "BigQuery", "Cloud SQL", "Pub/Sub",
"Vertex AI", "Firestore". Never shorten to bare "GCS", "GKE", "Cloud Firestore",
"Big Query" (two words), or "PubSub".
Text in Google Sans or Roboto (clean geometric humanist sans-serif).
Slate (#5F6368) arrows, 1.5px weight, classic arrowhead.
VPC boundary solid Blue (#4285F4). Region boundary dashed Slate (#5F6368).
Zone boundary dotted Pale Gray (#9AA0A6). Zones stacked VERTICALLY.
Aspect ratio 16:9, 1920x1080.
```

**Dark / Google Cloud Next keynote:**
```
Style: Google Cloud Next keynote-style illustration on Deep Gray (#202124) background.
Material Design dark aesthetic — flat icons, NO glass morphism, NO neon glows,
NOT isometric. FLAT 2D icons only. Service icons in their official Google Cloud
category colors (Blue #4285F4, Green #34A853, Red #EA4335, Yellow #FBBC04).
White (#FFFFFF) text. Pale Gray (#9AA0A6) arrows. Deep Gray (#202124) background —
NOT pure black (#000000). Dark card surface: #303134, 1px #5F6368 border.
Category-color 4px top border on cards.
Label every service with its official Google Cloud marketing name — "Cloud Storage",
"Google Kubernetes Engine", "Cloud Run", "BigQuery", "Cloud SQL", "Pub/Sub",
"Vertex AI", "Firestore". Never shorten to bare "GCS", "GKE", or "PubSub".
Aspect ratio 16:9, 1920x1080.
```

### mxgraph.gcp2 XML Boilerplate

```xml
<mxfile>
  <diagram name="SLUG">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="1080">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- SERVICE ICON CELL (light mode) -->
        <mxCell id="svc1" value="Cloud Run" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.cloud_run;resIcon=mxgraph.gcp2.cloud_run;
                 fillColor=#4285F4;strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="400" y="400" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- VPC NETWORK BOUNDARY (global, solid Blue) -->
        <mxCell id="vpc1" value="VPC Network: prod-vpc" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#4285F4;strokeWidth=2;
                 dashed=0;fontColor=#4285F4;fontFamily=Google Sans,Roboto;fontSize=14;fontStyle=1;
                 verticalAlign=top;spacingTop=8;">
          <mxGeometry x="200" y="100" width="1520" height="800" as="geometry"/>
        </mxCell>

        <!-- REGION BOUNDARY (dashed Slate) -->
        <mxCell id="region1" value="us-central1" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#5F6368;strokeWidth=1;
                 dashed=1;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=13;
                 verticalAlign=top;spacingTop=8;">
          <mxGeometry x="240" y="160" width="1440" height="700" as="geometry"/>
        </mxCell>

        <!-- ZONE BOUNDARY (dotted Pale Gray) -->
        <mxCell id="zone_a" value="Zone: us-central1-a" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#9AA0A6;strokeWidth=1;
                 dashed=1;dashPattern=4 4;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=12;
                 verticalAlign=top;spacingTop=8;">
          <mxGeometry x="280" y="220" width="1360" height="280" as="geometry"/>
        </mxCell>

        <!-- CONNECTOR (right-angle) -->
        <mxCell id="e1" value="HTTPS" edge="1" source="svc1" target="svc2" parent="1"
          style="endArrow=classic;html=1;strokeColor=#5F6368;strokeWidth=2;
                 edgeStyle=orthogonalEdgeStyle;rounded=0;
                 fontFamily=Google Sans,Roboto;fontSize=12;fontStyle=1;fontColor=#5F6368;
                 labelBackgroundColor=#FFFFFF;labelBorderColor=none;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-26 | Google Blue `#4285F4` for Compute / Networking / Security / AI | All these GCP families share the same blue — matches official GCP icon deck |
| 2026-04-26 | Google Green `#34A853` for Storage and Serverless | GCP icon deck convention |
| 2026-04-26 | Google Red `#EA4335` for Database / CI-CD | GCP icon deck convention |
| 2026-04-26 | Google Yellow `#FBBC04` for Analytics / Big Data | GCP icon deck convention |
| 2026-04-26 | Slate `#5F6368` for Management / Operations | Neutral management-plane services; avoids over-saturation |
| 2026-04-26 | Google Sans + Roboto open fallback | Google Sans is proprietary; Roboto is the closest accessible substitute |
| 2026-04-26 | VPC is GLOBAL — single boundary wraps multiple regions | GCP VPCs are global resources; AWS VPCs are regional — this is the #1 GCP vs AWS difference in network diagrams |
| 2026-04-26 | Zones stacked VERTICALLY | Matches official GCP reference architecture convention; deviating would confuse GCP-fluent readers |
| 2026-04-26 | Three distinct boundary line styles | Solid Blue VPC / Dashed Slate Region / Dotted Pale Gray Zone — three levels of visual hierarchy |
| 2026-04-26 | No glass morphism, no isometric 3D | Current GCP flat-icon style; these belong to fintech / SaaS aesthetics |
| 2026-04-26 | `sketch=0` always in stencil style strings | Prevents draw.io's sketchy-mode rendering of GCP icons |

---

## References

- `references/anti-patterns.md` — AP-01..AP-18 stable IDs, used by `--verify` specialists
- `references/layout-rules.md` — global VPC rule, zone stacking, hierarchy nesting, arrow rules
- `references/gcp-service-catalog.jsonl` — authoritative stencil names, hex values, marketing names
- `references/examples.md` — 3 worked illustrations with full prompts and XML
- `references/specialists/` — 4 audit prompts for `--verify` mode
- `references/templates/` — 10 illustration type skeletons
