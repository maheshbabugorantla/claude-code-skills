# Template: `process-flow`

**Layout:** 3–5 tall vertical panels arranged left-to-right, each panel representing a stage or system. Bold labeled arrows connect panels. Best for: multi-system integration flows, request lifecycles (user → LB → service → DB → cache), or showing responsibility boundaries.

**Requires:** Read `references/layout-rules.md` (arrow rules).
**Anti-patterns:** AP-06 (reversed arrows), AP-03 (short-form labels)

---

## Prompt Template — Light Theme

```
Create a clean Google Cloud process-flow illustration on white (#FFFFFF) showing
{{DESCRIPTION}} across {{N}} stages.

CRITICAL LAYOUT RULE: All panels arranged on a SINGLE horizontal row left to right.
All arrows between panels point strictly RIGHT. No arrows point left, down, or diagonally.
No curved arrows.

Panel design: each panel is a tall vertical rectangle (~240px wide × ~560px tall) with:
- {{CATEGORY_COLOR}} 4px top accent border.
- White (#FFFFFF) fill, 1px #DADCE0 border, 4px radius.
- Bold panel title at top in 16px Google Sans, #202124.
- GCP service icon(s) centered in the panel.
- Short description text in 13px Google Sans, #5F6368.

Panel 1 — "{{PANEL_TITLE_1}}" ({{CATEGORY_COLOR_1}} top border):
- Icon: {{icon 1}} in {{CATEGORY_COLOR_1}}
- Service: "{{Service 1}}"
- Description: "{{desc 1}}"

→ Bold arrow (Slate #5F6368, 3px, label "{{arrow label 1→2}}")

Panel 2 — "{{PANEL_TITLE_2}}" ({{CATEGORY_COLOR_2}} top border):
- Icon: {{icon 2}} in {{CATEGORY_COLOR_2}}
- Service: "{{Service 2}}"
- Description: "{{desc 2}}"

→ Bold arrow (label "{{arrow label 2→3}}")

{{...repeat for all N panels...}}

CONFIRM: All {{N}} panels on the same horizontal baseline. All arrows point RIGHT.

Style: Clean Google Cloud process-flow on white (#FFFFFF). Material Design aesthetic.
Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Bold arrows with protocol labels between panels. Google Sans font.
Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (4 panels, light)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=process-flow, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="720">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Panel 1 (x=160, width=240, height=560) -->
        <mxCell id="panel1" value="{{PANEL_TITLE_1}}" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#DADCE0;
                 fontFamily=Google Sans,Roboto;fontSize=16;fontStyle=1;fontColor=#202124;
                 verticalAlign=top;spacingTop=16;">
          <mxGeometry x="160" y="80" width="240" height="560" as="geometry"/>
        </mxCell>
        <!-- Panel 1 top accent -->
        <mxCell id="panel1top" value="" vertex="1" parent="1"
          style="rounded=0;fillColor={{CATEGORY_HEX_1}};strokeColor=none;">
          <mxGeometry x="160" y="80" width="240" height="4" as="geometry"/>
        </mxCell>
        <!-- Panel 1 icon -->
        <mxCell id="icon1" value="{{Service 1}}" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{STENCIL_1}};resIcon=mxgraph.gcp2.{{STENCIL_1}};
                 fillColor={{CATEGORY_HEX_1}};strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="248" y="240" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Arrow 1→2 (x midpoint ~460) -->
        <mxCell id="e1" value="{{arrow label}}" edge="1" parent="1"
          style="endArrow=classic;html=1;strokeColor=#5F6368;strokeWidth=3;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontStyle=1;fontColor=#5F6368;
                 labelBackgroundColor=#FFFFFF;labelBorderColor=none;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Repeat panels at x=500, x=840, x=1180 (increment by 340) -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Common Flows

| Scenario | Panels |
|---|---|
| API request lifecycle | User → Cloud Load Balancing → Cloud Run → Firestore |
| Batch data job | Cloud Storage → Dataflow → BigQuery → Looker |
| Build and deploy | Cloud Source Repositories → Cloud Build → Artifact Registry → Cloud Deploy → GKE |
| Event-driven | Eventarc → Cloud Functions → Pub/Sub → Dataflow |

---

## Variables

| Variable | Description |
|---|---|
| `{{N}}` | Number of panels (3–5) |
| `{{PANEL_TITLE_N}}` | Panel title (e.g., "Ingest", "Process", "Store") |
| `{{Service N}}` | GCP marketing name |
| `{{desc N}}` | Short descriptor |
| `{{arrow label N→N+1}}` | Arrow label (e.g., "HTTPS request", "Pub/Sub message", "SQL query") |
