# Template: `mapping`

**Layout:** Two-column concept mapping. Left column = source concepts (e.g., "On-premises component"). Right column = AWS equivalents. Horizontal dotted lines connect matching pairs. Works well for "lift-and-shift" comparisons and migration diagrams.

---

## Prompt Template — Light Theme

```
Create a clean AWS two-column concept mapping illustration on a white (#FFFFFF)
background showing {{MAPPING_TITLE}}.

Layout: Two columns with dotted connector lines linking matching concepts.
Left column header card (navy #232F3E background, white text): "{{LEFT_TITLE}}"
Right column header card (Cosmos pink #E7157B background, white text): "{{RIGHT_TITLE}}"

Left column items (white cards, 1px #EAEDED border, 8px radius, slate left accent border 4px):
{{N}} items, each card:
- Icon in Slate #545B64: {{left icon N}}
- Label 16px semibold #232F3E: "{{left concept N}}"
- Sublabel 13px #545B64: "{{brief description N}}"

Right column items (white cards, 1px #EAEDED border, 8px radius, {{CATEGORY_COLOR_N}} right accent border 4px):
{{N}} items matching each left item, each card:
- AWS icon in {{CATEGORY_COLOR_N}}: {{right icon N}}
- Label 16px semibold #232F3E: "{{AWS service N}}"
- Sublabel 13px #545B64: "{{brief description N}}"

Dotted connector lines (slate #545B64, 1px dotted) linking each left card to its right partner.

Style: Clean AWS mapping illustration on white (#FFFFFF). 2023 AWS flat-icon style.
NOT isometric, NOT glass morphism. Amazon Ember-style sans-serif. AWS Blog technical
style. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create an AWS re:Invent keynote two-column mapping illustration on Squid Ink navy
(#232F3E) background showing {{MAPPING_TITLE}}.

Left header (bright navy #314050 card, Squid Ink top border): "{{LEFT_TITLE}}"
Right header (Cosmos pink #E7157B top border, dark card): "{{RIGHT_TITLE}}"

Left column (dark cards #314050, white text, slate #545B64 left accent):
{{N}} items.

Right column (dark cards #314050, white text, {{CATEGORY_COLOR_N}} right accent):
{{N}} AWS service items.

Connectors: pale gray (#D5DBDB) dotted 1px lines.

Style: AWS re:Invent keynote on #232F3E. Dark-BG icon variants. No glass morphism.
Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern

```xml
<!-- Left header -->
<mxCell id="left_header" value="{{LEFT_TITLE}}" vertex="1" parent="1"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#232F3E;
         fontColor=#FFFFFF;fontStyle=1;fontSize=16;fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="60" y="80" width="220" height="60" as="geometry"/>
</mxCell>
<!-- Right header -->
<mxCell id="right_header" value="{{RIGHT_TITLE}}" vertex="1" parent="1"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E7157B;strokeColor=#E7157B;
         fontColor=#FFFFFF;fontStyle=1;fontSize=16;fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="640" y="80" width="220" height="60" as="geometry"/>
</mxCell>
<!-- Dotted connector -->
<mxCell id="c1" edge="1" source="left1" target="right1" parent="1"
  style="endArrow=none;dashed=1;strokeColor=#545B64;strokeWidth=1;">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{MAPPING_TITLE}}` | What is being mapped (e.g., "On-premises → AWS equivalents") |
| `{{LEFT_TITLE}}` | Left column header (e.g., "On-Premises") |
| `{{RIGHT_TITLE}}` | Right column header (e.g., "AWS Equivalent") |
| `{{N}}` | Number of pairs (3–6 pairs recommended) |
| `{{left concept N}}` | Source concept name |
| `{{AWS service N}}` | AWS service name |
| `{{CATEGORY_COLOR_N}}` | Category color for each AWS service |
