# Template: `process-flow`

**Layout:** 3–5 tall rounded-rectangle panels arranged left-to-right. Each panel represents a phase or actor in a process. Arrows with labels connect the panels. Good for multi-step user journeys, handoff flows, and request/response sequences.

**Requires:** Read `references/layout-rules.md` before generating.

---

## Prompt Template — Light Theme

```
Create a clean AWS process-flow illustration on white (#FFFFFF) background showing
{{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All panels are on a SINGLE horizontal row, left to right. There is
only ONE row. All arrows point strictly RIGHT. No downward arrows. No diagonal arrows.
No curved arrows. If panels don't fit, shrink them — never add a second row.

Layout: {{N}} tall rounded-rectangle panels, equal width, left to right. Connected by
labeled arrows.

Panel 1 (white #FFFFFF, 1px #EAEDED border, 16px radius, {{CATEGORY_COLOR_1}} 6px top bar):
- AWS icon (48px): {{icon description}} in {{CATEGORY_COLOR_1}}
- Title (20px bold #232F3E): "{{panel 1 title}}"
- Body (13px #545B64): {{2–3 lines of content}}

Labeled arrow from Panel 1 to Panel 2: "{{label}}" (slate #545B64, 1.5px, bold label)

Panel 2 ({{CATEGORY_COLOR_2}} 6px top bar):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_2}}
- Title: "{{panel 2 title}}"
- Body: {{content}}

Labeled arrow: "{{label}}"

Panel 3 ({{CATEGORY_COLOR_3}} 6px top bar):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_3}}
- Title: "{{panel 3 title}}"
- Body: {{content}}

{{...up to 5 panels...}}

CONFIRM: All {{N}} panels sit on the same horizontal row. All arrows point strictly RIGHT.
No panel is above or below another panel.

Style: Clean AWS process-flow on white (#FFFFFF). 2023 AWS flat-icon style. NOT isometric,
NOT glass morphism. Category-color 6px top bars. Amazon Ember-style sans-serif. AWS Blog
style. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create an AWS re:Invent keynote process-flow on Squid Ink navy (#232F3E) showing
{{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All panels on a SINGLE horizontal row. All arrows RIGHT. No down or
diagonal arrows.

{{N}} panels (dark cards #314050, 1px #414D5C border, 16px radius, {{CATEGORY_COLOR_N}}
6px top bar, NO shadows):

Panel 1 ({{CATEGORY_COLOR_1}} top bar):
- AWS dark-BG icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Title: "{{title}}" in 20px bold white (#FFFFFF)
- Body: 13px #D5DBDB

Labeled arrow: pale gray (#D5DBDB) 1.5px, label in 12px bold white.

{{...more panels...}}

Style: AWS re:Invent keynote on #232F3E. 2023 flat icons dark-BG. NOT glass morphism.
Category-color top bars. White text. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern

```xml
<!-- Process panel -->
<mxCell id="panel1" value="&lt;b&gt;{{Title}}&lt;/b&gt;&lt;br/&gt;{{Body}}"
  vertex="1" parent="1"
  style="rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#FFFFFF;
         strokeColor=#EAEDED;fontSize=14;verticalAlign=middle;align=center;
         fontFamily=Amazon Ember,Inter,sans-serif;shadow=1;">
  <mxGeometry x="{{X}}" y="120" width="260" height="320" as="geometry"/>
</mxCell>
<!-- Top accent bar -->
<mxCell id="bar1" vertex="1" parent="1"
  style="fillColor={{CATEGORY_HEX}};strokeColor=none;rounded=1;arcSize=8;">
  <mxGeometry x="{{X}}" y="120" width="260" height="8" as="geometry"/>
</mxCell>
<!-- Icon -->
<mxCell id="icon1" value="{{Label}}" vertex="1" parent="1"
  style="sketch=0;outlineConnect=0;gradientColor=none;fillColor={{CATEGORY_HEX}};
         strokeColor=none;aspect=fixed;shape=mxgraph.aws4.resourceIcon;
         resIcon=mxgraph.aws4.{{STENCIL}};verticalLabelPosition=bottom;verticalAlign=top;">
  <mxGeometry x="{{X+91}}" y="144" width="78" height="78" as="geometry"/>
</mxCell>
<!-- Labeled arrow -->
<mxCell id="arrow1" value="{{Label}}" edge="1" source="panel1" target="panel2" parent="1"
  style="endArrow=classic;html=1;strokeColor=#545B64;strokeWidth=1.5;
         fontSize=12;fontStyle=1;fontColor=#232F3E;edgeStyle=none;exitX=1;exitY=0.5;">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{DESCRIPTION}}` | What the flow shows (e.g., "ML inference request lifecycle") |
| `{{N}}` | Number of panels (3–5) |
| `{{panel N title}}` | Short panel name (1–3 words) |
| `{{label}}` | Arrow label between panels (3 words max: "HTTPS POST", "Amazon SQS event") |
| `{{CATEGORY_COLOR_N}}` | Category color name + hex |
| `{{STENCIL}}` | mxgraph.aws4 stencil name |
