# Template: `concept-cards`

**Layout:** 3–5 horizontal cards, each with a GCP service icon, title, and 2–3 bullet points. Brand-color card backgrounds (or icon-color top borders on white). Best for: "top N GCP services for X", comparison cards, feature highlight slides.

**Does not require:** `layout-rules.md` (no directional arrows).
**Anti-patterns:** AP-03 (short-form labels), AP-09 (wrong prefix), AP-13 (palette drift)

---

## Prompt Template — Light Theme

```
Create a clean Google Cloud concept card illustration on a white (#FFFFFF) background
showing {{DESCRIPTION}}.

Layout: {{N}} horizontal cards left to right. All cards the same width and height.
NO arrows between cards. Each card is self-contained.

Card design (repeat for each card):
- White (#FFFFFF) card background, 4px corner radius, 1px #DADCE0 border.
- {{CATEGORY_COLOR}} 4px top border accent.
- GCP service icon: {{icon}} in {{CATEGORY_COLOR}} centered in the top 40% of the card.
- Title below icon in 16px Google Sans semibold, #202124: "{{Service Name}}"
- 2–3 bullet points in 13px Google Sans regular, #5F6368:
  • {{bullet 1}}
  • {{bullet 2}}
  • {{bullet 3 (optional)}}

Card 1 ({{CATEGORY_COLOR_1}} top border):
- Icon: {{icon 1}} in {{CATEGORY_COLOR_1}}
- Title: "{{Service 1}}"
- Bullets: {{bullets 1}}

Card 2 ({{CATEGORY_COLOR_2}} top border):
- Icon: {{icon 2}} in {{CATEGORY_COLOR_2}}
- Title: "{{Service 2}}"
- Bullets: {{bullets 2}}

{{...repeat for all N cards...}}

Style: Clean Google Cloud concept cards on white (#FFFFFF). Material Design aesthetic.
Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Icons in their official Google Cloud category colors. Google Sans or Roboto font.
No arrows. No connectors. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create a Google Cloud concept card illustration on Deep Gray (#202124) background
showing {{DESCRIPTION}}.

Layout: {{N}} horizontal cards left to right. Same width and height. No arrows.

Card design:
- Dark card (#303134) background, 4px radius, 1px #5F6368 border.
- {{CATEGORY_COLOR}} 4px top border accent.
- GCP service icon in {{CATEGORY_COLOR}}, centered top 40%.
- Title in 16px Google Sans semibold, white (#FFFFFF): "{{Service Name}}"
- Bullets in 13px Google Sans, #9AA0A6.

{{...cards same as light, swap surface colors...}}

Style: Google Cloud concept cards on Deep Gray (#202124). Material Design dark mode.
FLAT 2D icons. NOT isometric. NOT glass morphism. NOT pure black. White text.
Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (light, 3 cards)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=concept-cards, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="560">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Card 1 container -->
        <mxCell id="card1" value="" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#DADCE0;strokeWidth=1;arcSize=4;">
          <mxGeometry x="200" y="120" width="400" height="320" as="geometry"/>
        </mxCell>
        <!-- Card 1 top accent border -->
        <mxCell id="card1top" value="" vertex="1" parent="1"
          style="rounded=0;whiteSpace=wrap;html=1;fillColor={{CATEGORY_HEX_1}};strokeColor=none;">
          <mxGeometry x="200" y="120" width="400" height="4" as="geometry"/>
        </mxCell>
        <!-- Card 1 icon -->
        <mxCell id="icon1" value="{{Service 1}}" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{STENCIL_1}};resIcon=mxgraph.gcp2.{{STENCIL_1}};
                 fillColor={{CATEGORY_HEX_1}};strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=14;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="368" y="160" width="64" height="64" as="geometry"/>
        </mxCell>
        <!-- Card 1 bullets (text cell) -->
        <mxCell id="card1text" value="• {{bullet 1}}&#xa;• {{bullet 2}}&#xa;• {{bullet 3}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontColor=#5F6368;spacingLeft=8;">
          <mxGeometry x="216" y="264" width="368" height="160" as="geometry"/>
        </mxCell>

        <!-- Repeat card pattern at x=660, x=1120 for cards 2 and 3 -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{N}}` | Number of cards (3–5; 3 or 5 for better visual balance) |
| `{{Service N}}` | GCP marketing name for the card (must use official name, AP-03) |
| `{{bullets N}}` | 2–3 bullet points for the card body |
| `{{CATEGORY_COLOR_N}}` | Category color name + hex |
| `{{CATEGORY_HEX_N}}` | Hex for draw.io fillColor and top border |
| `{{STENCIL_N}}` | mxgraph.gcp2 stencil suffix |
