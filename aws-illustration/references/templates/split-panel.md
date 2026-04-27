# Template: `split-panel`

**Layout:** Left 2/3 — horizontal architecture flow. Right 1/3 — summary/callout panel with bullet points. Best for "architecture + key takeaways" on a single slide.

**Requires:** Read `references/layout-rules.md` before generating.

---

## Prompt Template — Light Theme

```
Create a clean AWS split-panel architecture illustration on white (#FFFFFF) background
showing {{DESCRIPTION}}.

LEFT PANEL (2/3 of canvas width): Horizontal architecture flow.
CRITICAL LAYOUT RULE: All components in the left panel flow strictly LEFT TO RIGHT.
No component drops down to a second row. All arrows point strictly RIGHT. No downward
arrows. No diagonal arrows.

Left panel — {{N}} components:
Component 1 (white card, 8px radius, {{CATEGORY_COLOR_1}} top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Label: "{{service 1}}"
- Sublabel: "{{descriptor}}"

{{...more components same pattern...}}

Slate (#545B64) arrows between components, labeled: {{arrow labels}}.

CONFIRM: Left panel has all {{N}} components on a single horizontal row.

RIGHT PANEL (1/3 of canvas width): Summary callout panel.
Right panel card (white #FFFFFF, 1px #EAEDED border, 12px radius, category-color
4px top border, same height as left panel):
- Title in 20px bold #232F3E: "{{PANEL_TITLE}}"
- Divider line #EAEDED
- Bullet 1: Mars red #DD344C checkmark + 14px #232F3E text: "{{point 1}}"
- Bullet 2: checkmark + "{{point 2}}"
- Bullet 3: checkmark + "{{point 3}}"
- Bullet 4: checkmark + "{{point 4}}"
- Bullet 5: checkmark + "{{point 5}}"

Vertical divider line (1px #EAEDED) between left and right panels.

Style: Clean AWS split-panel on white (#FFFFFF). 2023 flat icons. NOT isometric, NOT
glass morphism. Amazon Ember-style sans-serif. AWS Blog style. Aspect ratio 16:9,
1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create an AWS re:Invent keynote split-panel on Squid Ink navy (#232F3E) showing
{{DESCRIPTION}}.

Left panel (2/3 width): architecture flow, same layout rules — single row, all arrows
right, dark cards #314050, category-color top borders, pale gray arrows.

Right panel (1/3 width, dark card #314050, 1px #414D5C border, Orbit teal #01A88D
top border):
- Title: "{{PANEL_TITLE}}" in 20px bold white
- Bullets: Orbit teal checkmarks, white 14px text

Style: AWS re:Invent keynote on #232F3E. Dark icons. Not glass morphism.
Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern

```xml
<!-- Left panel container (optional boundary box) -->
<mxCell id="left_panel" value="" vertex="1" parent="1"
  style="fillColor=none;strokeColor=#EAEDED;dashed=0;rounded=1;arcSize=3;">
  <mxGeometry x="40" y="60" width="1200" height="960" as="geometry"/>
</mxCell>
<!-- Right summary panel -->
<mxCell id="right_panel" value="" vertex="1" parent="1"
  style="fillColor=#FFFFFF;strokeColor=#EAEDED;rounded=1;arcSize=3;shadow=1;">
  <mxGeometry x="1280" y="60" width="600" height="960" as="geometry"/>
</mxCell>
<!-- Panel title -->
<mxCell id="panel_title" value="{{PANEL_TITLE}}" vertex="1" parent="1"
  style="text;html=1;strokeColor=none;fillColor=none;align=left;
         fontSize=18;fontStyle=1;fontColor=#232F3E;fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="1310" y="90" width="540" height="40" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{DESCRIPTION}}` | Architecture being illustrated |
| `{{N}}` | Number of architecture components in the left panel |
| `{{PANEL_TITLE}}` | Right panel title (e.g., "Why Serverless?", "Key Benefits") |
| `{{point 1..5}}` | Summary bullet points (short: under 10 words each) |
| `{{arrow labels}}` | Labels on arrows between components |
