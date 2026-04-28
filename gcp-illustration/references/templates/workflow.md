# Template: `workflow`

**Layout:** Horizontal phases showing a GCP data/event/processing pipeline. Each phase is a labeled tall card with a GCP service icon. Bold labeled arrows connect phases left-to-right. Phase labels appear above each card. Best for: data pipelines (Pub/Sub → Dataflow → BigQuery), CI/CD flows (Cloud Build → Artifact Registry → Cloud Deploy), event processing.

**Requires:** Read `references/layout-rules.md` (arrow rules).
**Anti-patterns:** AP-06 (reversed arrows), AP-03 (short-form labels), AP-15 (canvas too large)

---

## Prompt Template — Light Theme

```
Create a clean Google Cloud workflow diagram on white (#FFFFFF) showing the
{{WORKFLOW_NAME}} pipeline with {{N}} phases.

CRITICAL LAYOUT RULE: All phases arranged on a SINGLE horizontal row left to right.
All arrows point strictly RIGHT. No arrows point left, down, or diagonally.
No curved arrows.

Phases (each is a tall rectangular card with phase label above and service icon below):

Phase 1 — {{PHASE_LABEL_1}} ({{CATEGORY_COLOR_1}} top accent):
- Card: white (#FFFFFF), 1px #DADCE0 border, 4px radius, ~240px wide × ~320px tall.
- Phase label above card in 12px Google Sans uppercase, #5F6368: "{{PHASE_LABEL_1}}"
- GCP icon centered in card: {{icon 1}} in {{CATEGORY_COLOR_1}}
- Service label below icon in 16px Google Sans semibold, #202124: "{{Service 1}}"
- Sublabel in 13px Google Sans, #5F6368: "{{descriptor 1}}"

→ Arrow (Slate #5F6368, 3px, bold arrowhead, label "{{arrow label 1→2}}")

Phase 2 — {{PHASE_LABEL_2}}:
- Same card structure, {{CATEGORY_COLOR_2}} accent.
- Icon: {{icon 2}} in {{CATEGORY_COLOR_2}}
- Label: "{{Service 2}}"
- Sublabel: "{{descriptor 2}}"

→ Arrow (label "{{arrow label 2→3}}")

{{...repeat for all N phases...}}

CONFIRM: All {{N}} phase cards on the same horizontal baseline. All arrows point RIGHT.

Style: Clean Google Cloud workflow diagram on white (#FFFFFF). Material Design aesthetic.
Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Bold phase-label text above each card. Google Sans font. Slate arrows.
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create a Google Cloud workflow diagram on Deep Gray (#202124) background showing the
{{WORKFLOW_NAME}} pipeline with {{N}} phases.

CRITICAL LAYOUT RULE: All phases arranged on a SINGLE horizontal row left to right.
All arrows point strictly RIGHT. No arrows point left, down, or diagonally.
No curved arrows.

Phases (each is a tall rectangular card with phase label above and service icon below):

Phase 1 — {{PHASE_LABEL_1}} ({{CATEGORY_COLOR_1}} top accent):
- Card: dark (#303134), 1px #5F6368 border, 4px radius, ~240px wide × ~320px tall.
- Phase label above card in 12px Google Sans uppercase, #9AA0A6: "{{PHASE_LABEL_1}}"
- GCP icon centered in card: {{icon 1}} in {{CATEGORY_COLOR_1}}
- Service label below icon in 16px Google Sans semibold, white (#FFFFFF): "{{Service 1}}"
- Sublabel in 13px Google Sans, #9AA0A6: "{{descriptor 1}}"

→ Arrow (Pale Gray #9AA0A6, 3px, bold arrowhead, label "{{arrow label 1→2}}")

Phase 2 — {{PHASE_LABEL_2}}:
- Same dark card structure, {{CATEGORY_COLOR_2}} accent.
- Icon: {{icon 2}} in {{CATEGORY_COLOR_2}}
- Label: "{{Service 2}}"
- Sublabel: "{{descriptor 2}}"

→ Arrow (label "{{arrow label 2→3}}")

{{...repeat for all N phases...}}

CONFIRM: All {{N}} phase cards on the same horizontal baseline. All arrows point RIGHT.
Background: Deep Gray (#202124) — NOT pure black (#000000).

Style: Google Cloud workflow diagram on Deep Gray (#202124) dark background. Material Design
dark aesthetic. Official Google Cloud service icons. FLAT 2D icons. NOT isometric.
NOT glass morphism. NOT neon glows. Bold phase-label text above each card.
Google Sans font. Pale Gray (#9AA0A6) arrows and sublabels. White titles.
Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (4 phases, light)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=workflow, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="480">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Phase 1 card (x=200, width=240, height=320) -->
        <mxCell id="card1" value="" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#DADCE0;">
          <mxGeometry x="200" y="100" width="240" height="320" as="geometry"/>
        </mxCell>
        <!-- Phase 1 label above card -->
        <mxCell id="label1" value="1. {{PHASE_LABEL_1}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=center;
                 fontFamily=Google Sans,Roboto;fontSize=12;fontStyle=1;fontColor=#5F6368;">
          <mxGeometry x="200" y="64" width="240" height="32" as="geometry"/>
        </mxCell>
        <!-- Phase 1 icon -->
        <mxCell id="icon1" value="{{Service 1}}" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{STENCIL_1}};resIcon=mxgraph.gcp2.{{STENCIL_1}};
                 fillColor={{CATEGORY_HEX_1}};strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=14;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="268" y="160" width="104" height="104" as="geometry"/>
        </mxCell>

        <!-- Arrow 1→2 (place between x=440 and x=540) -->
        <mxCell id="e1" value="{{arrow label}}" edge="1" parent="1"
          style="endArrow=classic;html=1;strokeColor=#5F6368;strokeWidth=3;
                 fontFamily=Google Sans,Roboto;fontSize=12;fontColor=#5F6368;
                 fontStyle=1;labelBackgroundColor=#FFFFFF;labelBorderColor=none;">
          <mxGeometry relative="1" as="geometry">
            <Array as="points"/>
          </mxGeometry>
        </mxCell>

        <!-- Repeat cards at x=540, x=880, x=1220 (increment by 340) -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Common Pipelines

| Use case | Services |
|---|---|
| Streaming analytics | Pub/Sub → Dataflow → BigQuery → Looker |
| ML training pipeline | Cloud Storage → Vertex AI → Artifact Registry |
| CI/CD pipeline | Cloud Source Repositories → Cloud Build → Artifact Registry → Cloud Deploy |
| Event processing | Eventarc → Cloud Functions → Firestore → Pub/Sub |
| Data ingestion | Cloud Storage → Dataflow → BigQuery → Data Catalog |

---

## Variables

| Variable | Description |
|---|---|
| `{{WORKFLOW_NAME}}` | Pipeline name (e.g., "Streaming Analytics", "ML Training") |
| `{{N}}` | Number of phases (3–6) |
| `{{PHASE_LABEL_N}}` | Short phase name (e.g., "Ingest", "Transform", "Store") |
| `{{Service N}}` | GCP marketing name |
| `{{descriptor N}}` | Short descriptor (e.g., "streaming messages", "Apache Beam") |
| `{{arrow label N→N+1}}` | Arrow label (e.g., "Pub/Sub message", "gRPC", "batch insert") |
