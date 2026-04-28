# Template: `gcp-architecture-framework`

**Layout:** 1–6 pillar cards in a horizontal row (or 2-row 3×2 grid for all 6). Each card represents one pillar of the Google Cloud Architecture Framework. Analogous to the AWS Well-Architected template. Best for: architecture review slides, design principle decks, training material, executive overviews.

**Does not require:** `layout-rules.md`.
**Anti-patterns:** AP-03 (short-form labels), AP-13 (palette drift)

---

## Google Cloud Architecture Framework — 6 Pillars

| Pillar | Color | Icon |
|---|---|---|
| Operational Excellence | Google Blue `#4285F4` | `mxgraph.gcp2.cloud_monitoring` |
| Security, Privacy, and Compliance | Google Blue `#4285F4` | `mxgraph.gcp2.cloud_iam` |
| Reliability | Google Blue `#4285F4` | `mxgraph.gcp2.cloud_load_balancing` |
| Cost Optimization | Google Yellow `#FBBC04` | `mxgraph.gcp2.cloud_billing` |
| Performance Optimization | Google Blue `#4285F4` | `mxgraph.gcp2.compute_engine` |
| Sustainability | Google Green `#34A853` | `mxgraph.gcp2.cloud_monitoring` |

---

## Prompt Template — Light Theme (all 6 pillars)

```
Create a clean Google Cloud Architecture Framework illustration on white (#FFFFFF)
showing all {{N}} selected pillars as horizontal cards.

Layout: {{N}} cards left-to-right in a horizontal row (or 3×2 grid if N=6). No arrows.

Card design (same for all pillars):
- White (#FFFFFF) card, 4px radius, 1px #DADCE0 border, 280px wide × 360px tall.
- {{PILLAR_COLOR}} 4px top accent border.
- GCP service icon representing the pillar: centered, {{PILLAR_COLOR}}, top 40% of card.
- Pillar name in 18px Google Sans bold, #202124: "{{PILLAR_NAME}}"
- 3 bullet points in 13px Google Sans, #5F6368 describing key practices:
  • {{practice 1}}
  • {{practice 2}}
  • {{practice 3}}

Pillar 1 — Operational Excellence (Google Blue #4285F4 top border):
- Icon: Cloud Monitoring or Cloud Build icon in Google Blue #4285F4
- Name: "Operational Excellence"
- Practices:
  • Automated runbooks and SRE practices
  • Continuous improvement with CI/CD
  • Observability: Cloud Logging, Cloud Monitoring, Cloud Trace

Pillar 2 — Security, Privacy, and Compliance (Google Blue #4285F4):
- Icon: Cloud IAM icon
- Name: "Security, Privacy, and Compliance"
- Practices:
  • Zero-trust with IAM and Identity-Aware Proxy
  • Encryption at rest (Cloud KMS) and in transit
  • VPC Service Controls for data exfiltration prevention

Pillar 3 — Reliability (Google Blue #4285F4):
- Icon: Cloud Load Balancing icon
- Name: "Reliability"
- Practices:
  • Multi-zone deployments and managed instance groups
  • SLO definition and error budget management
  • Disaster recovery with Cloud SQL replicas and Spanner

Pillar 4 — Cost Optimization (Google Yellow #FBBC04):
- Icon: Cloud Billing icon
- Name: "Cost Optimization"
- Practices:
  • Committed Use Discounts (CUDs) and Spot VMs
  • Right-sizing with Cloud Recommender
  • BigQuery slot pricing and reservation management

Pillar 5 — Performance Optimization (Google Blue #4285F4):
- Icon: Compute Engine icon
- Name: "Performance Optimization"
- Practices:
  • Caching with Memorystore (Redis/Memcached)
  • Cloud CDN for global content delivery
  • Horizontal scaling with GKE and managed instance groups

Pillar 6 — Sustainability (Google Green #34A853):
- Icon: Green-colored Cloud Monitoring icon
- Name: "Sustainability"
- Practices:
  • Deploy to Google's renewable-energy-matched regions
  • Use serverless (Cloud Run, Cloud Functions) to avoid idle capacity
  • Cloud Carbon Footprint reporting and optimization

CONFIRM: All {{N}} pillar cards are the same size. No arrows. No connectors.
The layout is a balanced horizontal row (or 3×2 grid if N=6).

Style: Clean Google Cloud Architecture Framework cards on white (#FFFFFF).
Material Design aesthetic. Official Google Cloud service icons. FLAT 2D icons.
NOT isometric. NOT glass morphism. Google Sans font.
Google Blue (#4285F4) pillar accent colors (except Cost = Yellow, Sustainability = Green).
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme (N selected pillars)

```
Create a Google Cloud Architecture Framework illustration on Deep Gray (#202124) background
showing {{N}} selected pillars as horizontal cards.

Layout: {{N}} cards left-to-right in a horizontal row (or 3×2 grid if N=6). No arrows.

Card design (same for all pillars):
- Dark card (#303134), 4px radius, 1px #5F6368 border, 280px wide × 360px tall.
- {{PILLAR_COLOR}} 4px top accent border.
- GCP service icon representing the pillar: centered, {{PILLAR_COLOR}}, top 40% of card.
- Pillar name in 18px Google Sans bold, white (#FFFFFF): "{{PILLAR_NAME}}"
- 3 bullet points in 13px Google Sans, #9AA0A6 describing key practices:
  • {{practice 1}}
  • {{practice 2}}
  • {{practice 3}}

{{...same 6-pillar structure as light theme, with dark card colors...}}

CONFIRM: All {{N}} pillar cards are the same size. No arrows. No connectors.
The layout is a balanced horizontal row (or 3×2 grid if N=6).

Style: Google Cloud Architecture Framework on Deep Gray (#202124) — NOT pure black.
Material Design dark aesthetic. Official Google Cloud service icons. FLAT 2D icons.
NOT isometric. NOT glass morphism. NOT neon glows. Google Sans font.
Google Blue (#4285F4) pillar accent colors (except Cost = Yellow, Sustainability = Green).
White text. Pale gray descriptions. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (3 pillars, light)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=gcp-architecture-framework, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="500">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Pillar card 1 (x=160, increment x by 520 for 3 pillars; 320 for 6) -->
        <mxCell id="pillar1" value="{{PILLAR_NAME_1}}" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#DADCE0;
                 fontFamily=Google Sans,Roboto;fontSize=18;fontStyle=1;fontColor=#202124;
                 verticalAlign=top;spacingTop=88;">
          <mxGeometry x="160" y="80" width="480" height="360" as="geometry"/>
        </mxCell>
        <!-- Pillar 1 top accent -->
        <mxCell id="pillar1_top" value="" vertex="1" parent="1"
          style="rounded=0;fillColor={{PILLAR_COLOR_HEX_1}};strokeColor=none;">
          <mxGeometry x="160" y="80" width="480" height="4" as="geometry"/>
        </mxCell>
        <!-- Pillar 1 icon -->
        <mxCell id="pillar1_icon" value="" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{PILLAR_STENCIL_1}};resIcon=mxgraph.gcp2.{{PILLAR_STENCIL_1}};
                 fillColor={{PILLAR_COLOR_HEX_1}};strokeColor=none;aspect=fixed;sketch=0;">
          <mxGeometry x="368" y="120" width="64" height="64" as="geometry"/>
        </mxCell>
        <!-- Pillar 1 bullets -->
        <mxCell id="pillar1_bullets" value="• {{practice 1}}&#xa;&#xa;• {{practice 2}}&#xa;&#xa;• {{practice 3}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontColor=#5F6368;spacingLeft=16;">
          <mxGeometry x="176" y="236" width="448" height="188" as="geometry"/>
        </mxCell>

        <!-- Repeat for additional pillar cards -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{N}}` | Number of pillars to show (1–6) |
| `{{PILLAR_NAME_N}}` | Pillar name — use exact official names from the table above |
| `{{PILLAR_COLOR_HEX_N}}` | Pillar accent color hex |
| `{{PILLAR_STENCIL_N}}` | Representative GCP service stencil for the pillar |
| `{{practice N}}` | 2–3 key practices for this pillar |
