# Template: `grid`

**Layout:** N×M grid of GCP service cards. Each cell has an icon, service name, and short description. No arrows or connectors. Best for: "GCP services for this use case", feature comparison matrices, service catalog overviews.

**Does not require:** `layout-rules.md`.
**Anti-patterns:** AP-03 (short-form labels), AP-13 (palette drift)

---

## Prompt Template — Light Theme

```
Create a clean Google Cloud service grid illustration on white (#FFFFFF) showing
{{DESCRIPTION}}.

Layout: {{ROWS}} rows × {{COLS}} columns grid of service cards. All cards the same
size. No arrows. No connectors between cards.

Card design (all cards):
- White (#FFFFFF) card, 4px radius, 1px #DADCE0 border.
- GCP service icon centered, top 50% of card.
- Service name below icon: {{size}}px Google Sans semibold, #202124.
- Short description: 12px Google Sans, #5F6368.

Row 1:
  Card (1,1): Icon {{icon}} in {{COLOR}}. Name: "{{Service}}". Desc: "{{desc}}"
  Card (1,2): Icon {{icon}} in {{COLOR}}. Name: "{{Service}}". Desc: "{{desc}}"
  {{...}}

Row 2:
  {{...}}

Style: Clean Google Cloud service grid on white (#FFFFFF). Material Design aesthetic.
Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Google Sans font. Each icon in its official Google Cloud category color (Blue #4285F4
for Compute/Networking/Security/AI, Green #34A853 for Storage/Serverless, Red #EA4335
for Database, Yellow #FBBC04 for Analytics).
Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (2×3 grid, light)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=grid, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="720">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Title (optional) -->
        <mxCell id="title" value="{{GRID_TITLE}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=center;
                 fontFamily=Google Sans,Roboto;fontSize=22;fontStyle=1;fontColor=#202124;">
          <mxGeometry x="0" y="30" width="1920" height="50" as="geometry"/>
        </mxCell>

        <!-- Card (1,1) — x=200, y=120. Increment x by 300 per column, y by 280 per row -->
        <mxCell id="card_1_1" value="" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#DADCE0;">
          <mxGeometry x="200" y="120" width="240" height="220" as="geometry"/>
        </mxCell>
        <mxCell id="icon_1_1" value="{{Service 1}}" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{STENCIL_1}};resIcon=mxgraph.gcp2.{{STENCIL_1}};
                 fillColor={{HEX_1}};strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="268" y="148" width="64" height="64" as="geometry"/>
        </mxCell>
        <mxCell id="desc_1_1" value="{{description 1}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=center;
                 fontFamily=Google Sans,Roboto;fontSize=12;fontColor=#5F6368;">
          <mxGeometry x="208" y="258" width="224" height="64" as="geometry"/>
        </mxCell>

        <!-- Repeat for remaining cells in the grid -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Recommended grid sizes

| Use case | Grid | Cards |
|---|---|---|
| 6-service overview | 2×3 | 6 |
| 9-pillar / 9-category | 3×3 | 9 |
| 8-service quadrant | 2×4 | 8 |
| 4-service highlight | 1×4 | 4 |

---

## Variables

| Variable | Description |
|---|---|
| `{{ROWS}}` × `{{COLS}}` | Grid dimensions |
| `{{GRID_TITLE}}` | Optional title above the grid |
| `{{Service N}}` | GCP marketing name |
| `{{description N}}` | 1–2 line service description |
| `{{STENCIL_N}}` | mxgraph.gcp2 stencil suffix |
| `{{HEX_N}}` | Brand color hex for the service |
