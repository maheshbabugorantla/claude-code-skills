# Template: `architecture`

**Layout:** 4–7 GCP service components arranged left-to-right in a single horizontal row (default) or two-lane layout (when requested). Connected by labeled Slate arrows. The most common Google Cloud Blog reference architecture format.

**Requires:** Read `references/layout-rules.md` before generating.
**Anti-patterns:** AP-06 (reversed arrows), AP-03 (short-form labels), AP-09 (wrong prefix)

---

## Prompt Template — Single Row, Light Theme

```
Create a clean Google Cloud architecture diagram on a white (#FFFFFF) background showing
{{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All components must be arranged on a SINGLE horizontal row from
left to right. There is only ONE row. No component drops to a second row. All arrows
point strictly RIGHT. No arrows point downward. No arrows point left. No diagonal arrows.
No curved arrows. Space components evenly across the full width. If components don't fit,
shrink them or reduce label font size — never wrap to a second row.

Layout: {{N}} components left-to-right in a horizontal flow, connected by 2px Slate
(#5F6368) arrows with labeled arrowheads.

Component 1 (white card #FFFFFF, 4px radius, 1px #DADCE0 border):
- GCP icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Label in 14px Google Sans, #202124: "{{service 1}}"
- Sublabel in 12px #5F6368: "{{descriptor 1}}"

Component 2 (same card style, {{CATEGORY_COLOR_2}} icon):
- GCP icon: {{icon description}} in {{CATEGORY_COLOR_2}}
- Label: "{{service 2}}"
- Sublabel: "{{descriptor 2}}"

{{...more components...}}

Component {{N}}:
- GCP icon: {{icon description}}
- Label: "{{service N}}"
- Sublabel: "{{descriptor N}}"

CONFIRM: All {{N}} components sit on the same horizontal level. No component is above or
below another. All arrows point strictly RIGHT.

Arrows between each component (Slate #5F6368, 2px):
- Between 1→2: "{{protocol/label}}"
- Between 2→3: "{{protocol/label}}"
{{...}}

Optional: User/Internet icon to the left of Component 1 (outside the flow), with an
"HTTPS" arrow into Component 1.

Style: Clean Google Cloud architecture diagram on white (#FFFFFF). Material Design
aesthetic. Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass
morphism. NOT neon glows. Icons in their official Google Cloud category colors: Blue
(#4285F4) Compute/Networking/Security/AI, Green (#34A853) Storage/Serverless, Red
(#EA4335) Database/CI-CD, Yellow (#FBBC04) Analytics. Google Sans or Roboto font.
Slate (#5F6368) arrows. Google Cloud architecture diagram style. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Single Row, Dark Theme

```
Create a Google Cloud architecture diagram on Deep Gray (#202124) background showing
{{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All components on a SINGLE horizontal row, left to right. ONE row
only. All arrows point strictly RIGHT. No downward, leftward, diagonal, or curved arrows.

Layout: {{N}} components left-to-right.

Component 1 (dark card #303134, 1px #5F6368 border, 4px radius):
- GCP icon: {{icon description}} in {{CATEGORY_COLOR_1}}
- Label in 14px Google Sans, white (#FFFFFF): "{{service 1}}"
- Sublabel in 12px #9AA0A6: "{{descriptor 1}}"

{{...more components, same dark-card styling...}}

CONFIRM: All {{N}} components on the same horizontal level.

Arrows: Pale gray (#9AA0A6), 1.5px, classic arrowhead.
Arrow labels in 11px #9AA0A6, dark pill background (#202124).

Style: Google Cloud architecture diagram on Deep Gray (#202124). Material Design
aesthetic, dark mode. FLAT 2D icons. NOT isometric. NOT glass morphism. NOT neon glows.
NOT pure black background. White text. Pale gray arrows. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Two-Lane (Light)

```
Create a clean Google Cloud two-lane architecture diagram on white (#FFFFFF) background
showing {{DESCRIPTION}}.

LAYOUT: Two horizontal lanes, stacked top-to-bottom. Each lane has its own label on the
left edge. All arrows point strictly RIGHT within each lane. Vertical connections
between lanes (top → bottom) are allowed, but keep them minimal and clearly labeled.

Top lane — "{{TOP_LANE_LABEL}}" (e.g., "Primary data path", "User-facing services"):
Component 1 → Component 2 → Component 3 {{...}}

Bottom lane — "{{BOTTOM_LANE_LABEL}}" (e.g., "Async / offline", "Observability"):
Component A → Component B {{...}}

Lane labels: 16px Google Sans bold, Slate (#5F6368), left-aligned on a 1px #DADCE0
vertical divider separating label column from content.

Arrows within lanes: Slate (#5F6368), 2px, classic arrowhead, point RIGHT.
Arrows crossing lanes (when present): Slate (#5F6368), 1.5px, dashed, labeled.

Component style (same as single-row):
- White (#FFFFFF) card, 4px radius, 1px #DADCE0 border.
- GCP icon in its official category color.
- Label: 14px Google Sans, #202124.
- Sublabel: 12px Google Sans, #5F6368.

CONFIRM: Top lane components all at the same y. Bottom lane components all at the same y.
No component from the top lane drops to the level of the bottom lane or vice versa.
All horizontal arrows point strictly RIGHT.

Style: Clean Google Cloud two-lane architecture diagram on white (#FFFFFF). Material Design
aesthetic. Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass
morphism. Google Sans font. Slate (#5F6368) arrows. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (single row, light)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=architecture, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="560">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Component 1 — increment x by ~200 for each subsequent component -->
        <mxCell id="svc1" value="{{Service Name}}" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{STENCIL_1}};resIcon=mxgraph.gcp2.{{STENCIL_1}};
                 fillColor={{CATEGORY_HEX_1}};strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=12;fontStyle=0;
                 verticalLabelPosition=bottom;verticalAlign=top;align=center;
                 aspect=fixed;sketch=0;">
          <mxGeometry x="200" y="230" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Repeat for each component -->

        <!-- Arrow 1→2 -->
        <mxCell id="e1" value="{{label}}" edge="1" source="svc1" target="svc2" parent="1"
          style="endArrow=classic;html=1;strokeColor=#5F6368;strokeWidth=2;
                 fontSize=11;fontColor=#5F6368;fontFamily=Google Sans,Roboto;
                 labelBackgroundColor=#FFFFFF;labelBorderColor=none;edgeStyle=none;">
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
| `{{DESCRIPTION}}` | Short architecture description (e.g., "serverless API with Firestore") |
| `{{N}}` | Number of components (4–7) |
| `{{service N}}` | GCP marketing service name (e.g., "Cloud Run", "Firestore", "Cloud Load Balancing") |
| `{{descriptor N}}` | Short sublabel (e.g., "containerized API", "NoSQL database") |
| `{{protocol/label}}` | Arrow label (e.g., "HTTPS", "gRPC", "Pub/Sub", "SQL") |
| `{{CATEGORY_COLOR_N}}` | Color name + hex (e.g., "Google Blue #4285F4") |
| `{{CATEGORY_HEX_N}}` | Hex for draw.io fillColor |
| `{{STENCIL_N}}` | mxgraph.gcp2 stencil suffix (e.g., `cloud_run`, `firestore`) — from `resicon` field in catalog |
