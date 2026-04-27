# Template: `concept-cards`

**Layout:** 3–5 AWS-style cards arranged horizontally, each with a service icon or concept icon, title, and sublabel. Connected by slate arrows pointing left-to-right. Works for both light and dark themes.

---

## Prompt Template — Light Theme

```
Create a clean AWS architecture concept card illustration on a white (#FFFFFF)
background explaining {{TOPIC}}.

Layout: {{N}} concept cards arranged horizontally, connected by slate (#545B64)
1.5px arrows with 4px arrowheads, pointing left to right.

Card 1 (white #FFFFFF background, 1px #EAEDED border, 8px radius, subtle shadow,
{{CATEGORY_COLOR_1}} 4px top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Title in 20px semibold Amazon Ember-style sans-serif, #232F3E: "{{concept 1}}"
- Sublabel in 13px #545B64: "{{brief explanation}}"

Card 2 ({{CATEGORY_COLOR_2}} top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_2}}
- Title: "{{concept 2}}"
- Sublabel: "{{brief explanation}}"

Card 3 ({{CATEGORY_COLOR_3}} top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_3}}
- Title: "{{concept 3}}"
- Sublabel: "{{brief explanation}}"

Arrows between cards: slate (#545B64), 1.5px, 4px classic arrowhead.

Style: Clean AWS architecture illustration on white (#FFFFFF). 2023 AWS flat-icon style.
NOT isometric, NOT glass morphism, NOT dark mode. Icons in their official 2023 AWS
category colors (Smile #ED7100 Compute, Endor #7AA116 Storage, Cosmos #E7157B App
Integration/DB, Galaxy #8C4FFF Networking/Analytics, Mars #DD344C Security, Orbit
#01A88D AI/ML). Text in Amazon Ember-style clean humanist sans-serif. AWS Blog
reference architecture style. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create an AWS re:Invent keynote concept card illustration on Squid Ink navy
(#232F3E) background explaining {{TOPIC}}.

Layout: {{N}} concept cards arranged horizontally, connected by pale gray (#D5DBDB)
1.5px arrows with 4px arrowheads, pointing left to right.

Card 1 (dark card #314050, 1px #414D5C border, 8px radius, {{CATEGORY_COLOR_1}}
4px top border, NO drop shadows):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_1}} (dark-BG variant)
- Title in 20px semibold, white (#FFFFFF): "{{concept 1}}"
- Sublabel in 13px #D5DBDB: "{{brief explanation}}"

Card 2 ({{CATEGORY_COLOR_2}} top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_2}}
- Title: "{{concept 2}}"
- Sublabel: "{{brief explanation}}"

Card 3 ({{CATEGORY_COLOR_3}} top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_3}}
- Title: "{{concept 3}}"
- Sublabel: "{{brief explanation}}"

Arrows: pale gray (#D5DBDB), 1.5px, 4px arrowhead.

Style: AWS re:Invent keynote-style on Squid Ink navy (#232F3E). 2023 AWS flat-icon style,
dark-BG icon variants. NOT glass morphism. NOT neon glow. White text. Category-color top
borders. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern

```xml
<!-- Card cell (light mode example) -->
<mxCell id="card1" value="&lt;b&gt;{{Title}}&lt;/b&gt;&lt;br/&gt;{{Sublabel}}"
  vertex="1" parent="1"
  style="rounded=1;arcSize=5;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#EAEDED;
         strokeWidth=1;shadow=1;fontFamily=Amazon Ember,Inter,sans-serif;fontSize=14;
         verticalAlign=bottom;spacingBottom=8;">
  <mxGeometry x="100" y="250" width="140" height="160" as="geometry"/>
</mxCell>
<!-- Icon cell on top of card -->
<mxCell id="icon1" value="" vertex="1" parent="1"
  style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;
         fillColor={{CATEGORY_HEX}};strokeColor=none;dashed=0;verticalLabelPosition=bottom;
         verticalAlign=top;align=center;html=1;fontSize=12;aspect=fixed;
         shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.{{STENCIL}};">
  <mxGeometry x="131" y="258" width="78" height="78" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{TOPIC}}` | What the cards explain (e.g., "the three layers of AWS Well-Architected Security") |
| `{{N}}` | Number of cards (3, 4, or 5; odd numbers balance better) |
| `{{concept N}}` | Short 1–2 word concept name |
| `{{icon description}}` | Concrete icon description: "a rounded-square AWS Lambda symbol", "a shield outline" |
| `{{CATEGORY_COLOR_N}}` | Category color name + hex (e.g., "Smile orange #ED7100") |
| `{{CATEGORY_HEX}}` | Hex code for fillColor in draw.io |
| `{{STENCIL}}` | mxgraph.aws4 stencil name from aws-service-catalog.md |
