# Template: `grid`

**Layout:** Cards arranged in a grid (typically 2×2, 2×4, or 3×3). Each card has an AWS service icon, title, and brief description. No arrows — this is a catalog or feature overview layout.

---

## Prompt Template — Light Theme

```
Create a clean AWS service grid illustration on a white (#FFFFFF) background showing
{{TOPIC}} with {{ROWS}}×{{COLS}} cards.

Layout: {{N}} cards arranged in a {{ROWS}}-row by {{COLS}}-column grid. Even spacing
between all cards. No arrows or connectors.

Card format (white #FFFFFF, 1px #EAEDED border, 12px radius, 0 2px 8px shadow):
Each card contains:
- Top accent bar (6px, category color for that service)
- AWS icon centered (48px, in category color)
- Title below icon: 20px semibold #232F3E
- Body: 13px #545B64, 2–3 bullet points

{{Card 1 (Row 1, Col 1) — {{CATEGORY_COLOR_1}} top bar}}:
- Icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Title: "{{service/concept 1}}"
- Bullets: {{3 short bullet points}}

{{Card 2 (Row 1, Col 2) — {{CATEGORY_COLOR_2}} top bar}}:
- Icon: {{icon description}} in {{CATEGORY_COLOR_2}}
- Title: "{{service/concept 2}}"
- Bullets: {{3 short bullet points}}

{{...all {{N}} cards...}}

Style: Clean AWS grid illustration on white (#FFFFFF). 2023 AWS flat-icon style. NOT
isometric, NOT glass morphism. Icons in their 2023 category colors. Amazon Ember-style
sans-serif. AWS Blog reference style. Even whitespace between all cards (minimum 24px
gap). Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create an AWS re:Invent keynote service grid on Squid Ink navy (#232F3E) showing
{{TOPIC}} with {{ROWS}}×{{COLS}} cards.

Cards (dark #314050, 1px #414D5C border, 12px radius, category-color 6px top bar,
NO shadow):
{{N}} cards in a {{ROWS}}×{{COLS}} grid.

Each card:
- Top bar: 6px, category color
- Icon: 48px AWS dark-BG icon in category color
- Title: 20px semibold white (#FFFFFF)
- Body: 13px #D5DBDB, 2–3 bullets

{{...cards...}}

Style: AWS re:Invent keynote on #232F3E. 2023 flat icons dark-BG. NOT glass morphism.
Category-color top bars. White text. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern

```xml
<!-- Grid card -->
<mxCell id="card1" value="&lt;b&gt;{{Title}}&lt;/b&gt;&lt;br/&gt;{{Desc}}"
  vertex="1" parent="1"
  style="rounded=1;arcSize=5;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#EAEDED;
         strokeWidth=1;shadow=1;fontSize=13;align=center;verticalAlign=bottom;
         spacingTop=8;spacingBottom=8;fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="{{X}}" y="{{Y}}" width="200" height="180" as="geometry"/>
</mxCell>
<!-- Icon inside card -->
<mxCell id="icon1" value="{{Label}}" vertex="1" parent="1"
  style="sketch=0;outlineConnect=0;gradientColor=none;fillColor={{CATEGORY_HEX}};
         strokeColor=none;aspect=fixed;shape=mxgraph.aws4.resourceIcon;
         resIcon=mxgraph.aws4.{{STENCIL}};verticalLabelPosition=bottom;verticalAlign=top;">
  <mxGeometry x="{{X+61}}" y="{{Y+16}}" width="78" height="78" as="geometry"/>
</mxCell>
<!-- Category color top bar -->
<mxCell id="topbar1" vertex="1" parent="1"
  style="fillColor={{CATEGORY_HEX}};strokeColor=none;rounded=1;arcSize=5;
         fillOpacity=100;">
  <mxGeometry x="{{X}}" y="{{Y}}" width="200" height="6" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{TOPIC}}` | What is shown in the grid (e.g., "6 AWS ML services") |
| `{{ROWS}}` × `{{COLS}}` | Grid dimensions (e.g., 2×3, 2×4, 3×3) |
| `{{N}}` | Total card count = ROWS × COLS |
| `{{service/concept N}}` | Service name or concept for each card |
| `{{CATEGORY_COLOR_N}}` | Category color for that card |
| `{{STENCIL}}` | mxgraph.aws4 stencil name |
