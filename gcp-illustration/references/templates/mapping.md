# Template: `mapping`

**Layout:** Two-column mapping showing left-side concepts (source) mapped to right-side GCP services (destination) via dotted connectors. Most common use: AWS → GCP service equivalents, on-premises → GCP migration, or concept → GCP implementation.

**Does not require:** `layout-rules.md` (no directional flow arrows).
**Anti-patterns:** AP-03 (short-form labels), AP-09 (wrong prefix)

---

## Prompt Template — Light Theme

```
Create a clean Google Cloud concept mapping illustration on white (#FFFFFF) showing
{{DESCRIPTION}}: mapping {{LEFT_LABEL}} on the left to {{RIGHT_LABEL}} on the right.

Layout: Two vertical columns. Left column: {{N}} source items. Right column: {{N}} target
GCP services. Dotted horizontal connectors between each matching pair.

Left column header (bold, 18px Google Sans, #202124): "{{LEFT_LABEL}}"
Right column header (bold, 18px Google Sans, #202124): "{{RIGHT_LABEL}}"

Left item {{N}} (gray pill #F1F3F4, border #DADCE0, 4px radius):
- Text label: "{{left item N}}" in 14px Google Sans, #202124

Right item {{N}} (white card, brand-color left border, 4px radius):
- GCP icon: {{icon N}} in {{CATEGORY_COLOR_N}}
- Label: "{{Service N}}" in 14px Google Sans semibold, #202124
- Sublabel: "{{short equivalence note}}" in 12px #5F6368

Connector: dotted 1px #9AA0A6 line between Left {{N}} and Right {{N}}.

{{...repeat for all N pairs...}}

Style: Clean mapping diagram on white (#FFFFFF). Material Design aesthetic.
Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Dotted gray connectors only — no filled arrowheads. Google Sans font.
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create a Google Cloud concept mapping illustration on Deep Gray (#202124) background
showing {{DESCRIPTION}}: mapping {{LEFT_LABEL}} on the left to {{RIGHT_LABEL}} on the right.

Layout: Two vertical columns. Left column: {{N}} source items. Right column: {{N}} target
GCP services. Dotted horizontal connectors between each matching pair.

Left column header (bold, 18px Google Sans, white #FFFFFF): "{{LEFT_LABEL}}"
Right column header (bold, 18px Google Sans, white #FFFFFF): "{{RIGHT_LABEL}}"

Left item {{N}} (dark pill #303134, border #5F6368, 4px radius):
- Text label: "{{left item N}}" in 14px Google Sans, white (#FFFFFF)

Right item {{N}} (dark card #303134, category-color left border, 4px radius):
- GCP icon: {{icon N}} in {{CATEGORY_COLOR_N}}
- Label: "{{Service N}}" in 14px Google Sans semibold, white (#FFFFFF)
- Sublabel: "{{short equivalence note}}" in 12px #9AA0A6

Connector: dotted 1px #5F6368 line between Left {{N}} and Right {{N}}.

{{...repeat for all N pairs...}}

Style: Mapping diagram on Deep Gray (#202124) — NOT pure black. Material Design dark
aesthetic. Official Google Cloud service icons. FLAT 2D icons. NOT isometric.
NOT glass morphism. Dotted gray connectors only — no filled arrowheads. Google Sans font.
Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (3 rows, light)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=mapping, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="640">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Column headers -->
        <mxCell id="hdr_left" value="{{LEFT_LABEL}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=center;
                 fontFamily=Google Sans,Roboto;fontSize=18;fontStyle=1;fontColor=#202124;">
          <mxGeometry x="200" y="60" width="400" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="hdr_right" value="{{RIGHT_LABEL}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=center;
                 fontFamily=Google Sans,Roboto;fontSize=18;fontStyle=1;fontColor=#202124;">
          <mxGeometry x="1200" y="60" width="400" height="40" as="geometry"/>
        </mxCell>

        <!-- Row 1: left pill -->
        <mxCell id="left1" value="{{left item 1}}" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F1F3F4;strokeColor=#DADCE0;
                 fontFamily=Google Sans,Roboto;fontSize=14;fontColor=#202124;">
          <mxGeometry x="200" y="160" width="400" height="60" as="geometry"/>
        </mxCell>

        <!-- Row 1: right GCP service icon -->
        <mxCell id="right1" value="{{Service 1}}" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{STENCIL_1}};resIcon=mxgraph.gcp2.{{STENCIL_1}};
                 fillColor={{CATEGORY_HEX_1}};strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="1232" y="148" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Row 1: dotted connector -->
        <mxCell id="conn1" value="" edge="1" source="left1" target="right1" parent="1"
          style="endArrow=none;strokeColor=#9AA0A6;strokeWidth=1;dashed=1;html=1;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Repeat rows at y=280, y=400 (increment by 120) -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Common Use Cases

| Left column | Right column | Example |
|---|---|---|
| AWS services | GCP equivalents | "Amazon S3" → "Cloud Storage" |
| On-prem components | GCP services | "MySQL on VM" → "Cloud SQL" |
| Generic concepts | GCP implementations | "Container registry" → "Artifact Registry" |
| Architecture patterns | GCP patterns | "Serverless function" → "Cloud Functions" |

---

## Variables

| Variable | Description |
|---|---|
| `{{LEFT_LABEL}}` | Left column header (e.g., "AWS Services", "On-Premises") |
| `{{RIGHT_LABEL}}` | Right column header (e.g., "GCP Equivalents", "Google Cloud") |
| `{{N}}` | Number of mapping pairs (3–8) |
| `{{left item N}}` | Source label text |
| `{{Service N}}` | GCP marketing name (right side) |
| `{{short equivalence note}}` | One-line equivalence note (e.g., "Managed relational DB") |
