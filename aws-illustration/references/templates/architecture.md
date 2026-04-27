# Template: `architecture`

**Layout:** 4–7 AWS service components arranged left-to-right in a single horizontal row (default) or two-lane layout (when requested). Connected by labeled slate arrows. The most common AWS Blog reference architecture format.

**Requires:** Read `references/layout-rules.md` before generating.

---

## Prompt Template — Single Row, Light Theme

```
Create a clean AWS architecture diagram on a white (#FFFFFF) background showing
{{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All components must be arranged on a SINGLE horizontal row from
left to right. There is only ONE row. No component drops to a second row. All arrows
point strictly RIGHT. No arrows point downward. No arrows point left. No diagonal arrows.
No curved arrows. Space components evenly across the full width. If components don't fit,
shrink them or reduce label font size — never wrap to a second row.

Layout: {{N}} components left-to-right in a horizontal flow, connected by 1.5px slate
(#545B64) arrows with labeled arrowheads.

Component 1 (white card, 8px radius, 1px #EAEDED border, subtle 0 2px 8px shadow,
{{CATEGORY_COLOR_1}} 4px top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Label in 20px semibold Amazon Ember-style sans-serif, #232F3E: "{{service 1}}"
- Sublabel in 13px #545B64: "{{descriptor 1}}"

Component 2 ({{CATEGORY_COLOR_2}} top border):
- AWS icon: {{icon description}} in {{CATEGORY_COLOR_2}}
- Label: "{{service 2}}"
- Sublabel: "{{descriptor 2}}"

{{...more components...}}

Component {{N}} ({{CATEGORY_COLOR_N}} top border):
- AWS icon: {{icon description}}
- Label: "{{service N}}"
- Sublabel: "{{descriptor N}}"

CONFIRM: All {{N}} components sit on the same horizontal level. No component is above or
below another. All arrows point strictly RIGHT.

Arrows between each component (slate #545B64, 1.5px):
- Between 1→2: "{{protocol/label}}"
- Between 2→3: "{{protocol/label}}"
{{...}}

Optional: User/Internet icon to the left of Component 1 (outside the flow), with a
"HTTPS" arrow into Component 1.

Style: Clean AWS architecture illustration on white (#FFFFFF). 2023 AWS flat-icon style.
NOT isometric, NOT glass morphism, NOT dark mode. Icons in their 2023 category colors.
Amazon Ember-style humanist sans-serif. Slate (#545B64) arrows. AWS Blog reference
architecture style. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Single Row, Dark Theme

```
Create an AWS re:Invent keynote architecture diagram on Squid Ink navy (#232F3E)
background showing {{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All components on a SINGLE horizontal row, left to right. ONE row
only. All arrows point strictly RIGHT. No downward, leftward, diagonal, or curved arrows.

Layout: {{N}} components left-to-right.

Component 1 (dark card #314050, 1px #414D5C border, 8px radius, {{CATEGORY_COLOR_1}}
4px top border, NO drop shadow):
- AWS dark-BG icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Label in 20px semibold, white (#FFFFFF): "{{service 1}}"
- Sublabel in 13px #D5DBDB: "{{descriptor 1}}"

{{...more components, same dark-card styling with different top border colors...}}

CONFIRM: All {{N}} components on the same horizontal level.

Arrows: pale gray (#D5DBDB), 1.5px, classic arrowhead.
Arrow labels in 11px #D5DBDB, white pill background.

Style: AWS re:Invent keynote on #232F3E. 2023 flat-icon style, dark-BG variants.
NOT glass morphism. NOT neon glow. Category-color top borders. White text.
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Two-Lane (Light)

```
Create a clean AWS architecture diagram on white (#FFFFFF) showing {{DESCRIPTION}}
across two labeled lanes.

CRITICAL LAYOUT RULE: Exactly TWO horizontal lanes stacked vertically. Within each lane,
components flow strictly LEFT to RIGHT. All arrows inside each lane point right only. The
single cross-lane connector arrow points DOWNWARD from the rightmost component of the top
lane to the leftmost component of the bottom lane. No other downward arrows. No diagonal
arrows. No curved arrows within lanes.

Top lane (dashed 1px #545B64 boundary box, label top-left in 20px semibold #232F3E):
"{{TOP_LANE_NAME}}"

Top Lane Component 1 (white card, {{CATEGORY_COLOR}} top border):
- Icon + Label + Sublabel (same as single-row pattern)

{{...top lane components left-to-right...}}

Cross-lane connector arrow (slate #545B64, pointing DOWNWARD, labeled "{{label}}"):
From rightmost top-lane component → leftmost bottom-lane component.

Bottom lane (dashed 1px boundary box, label top-left):
"{{BOTTOM_LANE_NAME}}"

Bottom Lane Component 1 (white card, {{CATEGORY_COLOR}} top border):
{{...bottom lane components left-to-right...}}

All top-lane components on one horizontal baseline. All bottom-lane components on a
second horizontal baseline below. Only one arrow points downward (the cross-lane
connector). All other arrows point strictly right within their lane.

Style: Clean AWS architecture on white (#FFFFFF). 2023 flat icons. Aspect ratio 16:9.
```

---

## draw.io XML pattern (single row, light)

```xml
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="1" gridSize="10">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Component 1 -->
        <mxCell id="svc1" value="{{Service Name}}" vertex="1" parent="1"
          style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;
                 fillColor={{CATEGORY_HEX}};strokeColor=none;dashed=0;
                 verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;
                 fontSize=14;fontStyle=1;aspect=fixed;
                 shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.{{STENCIL_1}};">
          <mxGeometry x="120" y="280" width="78" height="78" as="geometry"/>
        </mxCell>

        <!-- Repeat for each component, incrementing x by ~200 -->

        <!-- Arrow 1→2 -->
        <mxCell id="e1" value="{{label}}" edge="1" source="svc1" target="svc2" parent="1"
          style="endArrow=classic;html=1;strokeColor=#545B64;strokeWidth=1.5;
                 fontSize=11;fontColor=#545B64;edgeStyle=none;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{DESCRIPTION}}` | Short architecture description (e.g., "serverless REST API with DynamoDB") |
| `{{N}}` | Number of components (4–7) |
| `{{service N}}` | AWS marketing service name (e.g., "AWS Lambda", "Amazon API Gateway") |
| `{{descriptor N}}` | Short sublabel (e.g., "business logic", "NoSQL store") |
| `{{protocol/label}}` | Arrow label (e.g., "REST", "SQS", "HTTPS", "gRPC") |
| `{{TOP_LANE_NAME}}` / `{{BOTTOM_LANE_NAME}}` | Two-lane labels (user-specified, never generic) |
| `{{CATEGORY_COLOR_N}}` | Category color name + hex |
| `{{CATEGORY_HEX}}` | Hex for draw.io fillColor |
| `{{STENCIL_N}}` | mxgraph.aws4 stencil name |
