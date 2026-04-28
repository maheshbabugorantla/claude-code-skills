# Template: `split-panel`

**Layout:** Left 2/3 is an architecture flow diagram (left-to-right GCP services). Right 1/3 is a summary panel with a bold title and up to 5 bullet points. Best for: conference slides, exec briefings, Google Cloud Blog hero images with key takeaways.

**Requires:** Read `references/layout-rules.md` (arrow rules for left panel).
**Anti-patterns:** AP-06 (reversed arrows), AP-03 (short-form labels), AP-15 (canvas padding)

---

## Prompt Template — Light Theme

```
Create a clean Google Cloud split-panel illustration on white (#FFFFFF) showing
{{DESCRIPTION}}.

LAYOUT: Two panels side by side.
- LEFT PANEL (70% of canvas width): Architecture flow — GCP services left-to-right.
- RIGHT PANEL (30% of canvas width): Summary card.
- A subtle 1px #DADCE0 vertical divider between the two panels.

LEFT PANEL — Architecture flow:
CRITICAL: All arrows in the left panel point strictly RIGHT. No left/down/diagonal arrows.

{{N}} components in a single horizontal row:

Component 1 (white card, {{CATEGORY_COLOR_1}} icon):
- GCP icon: {{icon 1}} in {{CATEGORY_COLOR_1}}
- Label: "{{Service 1}}"
- Sublabel: "{{descriptor 1}}"

→ Arrow "{{label 1→2}}" →

Component 2... (same pattern)

{{...}}

CONFIRM: All {{N}} components on a single horizontal line. All arrows point RIGHT.

RIGHT PANEL — Summary card:
- Panel background: Light Gray (#F1F3F4), full height of right panel.
- Panel title in 22px Google Sans bold, #202124: "{{PANEL_TITLE}}"
- Google Blue (#4285F4) 2px left border accent on the panel.
- Up to 5 bullet points in 14px Google Sans, #202124:
  • {{bullet 1}}
  • {{bullet 2}}
  • {{bullet 3}}
  • {{bullet 4 (optional)}}
  • {{bullet 5 (optional)}}

Style: Clean Google Cloud split-panel on white (#FFFFFF). Material Design aesthetic.
Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Google Sans font. Left panel: architecture with Slate (#5F6368) arrows.
Right panel: summary card with key takeaways. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=split-panel, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="1080">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Right summary panel background -->
        <mxCell id="summary_bg" value="" vertex="1" parent="1"
          style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F1F3F4;strokeColor=none;">
          <mxGeometry x="1344" y="0" width="576" height="1080" as="geometry"/>
        </mxCell>
        <!-- Blue accent border on right panel -->
        <mxCell id="summary_accent" value="" vertex="1" parent="1"
          style="rounded=0;whiteSpace=wrap;html=1;fillColor=#4285F4;strokeColor=none;">
          <mxGeometry x="1344" y="0" width="4" height="1080" as="geometry"/>
        </mxCell>

        <!-- Divider line -->
        <mxCell id="divider" value="" vertex="1" parent="1"
          style="line;strokeColor=#DADCE0;strokeWidth=1;fillColor=none;">
          <mxGeometry x="1344" y="0" width="1" height="1080" as="geometry"/>
        </mxCell>

        <!-- Panel title -->
        <mxCell id="panel_title" value="{{PANEL_TITLE}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;
                 fontFamily=Google Sans,Roboto;fontSize=22;fontStyle=1;fontColor=#202124;
                 spacingLeft=24;">
          <mxGeometry x="1348" y="80" width="520" height="60" as="geometry"/>
        </mxCell>
        <!-- Panel bullets -->
        <mxCell id="panel_bullets" value="• {{bullet 1}}&#xa;&#xa;• {{bullet 2}}&#xa;&#xa;• {{bullet 3}}&#xa;&#xa;• {{bullet 4}}&#xa;&#xa;• {{bullet 5}}" vertex="1" parent="1"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;
                 fontFamily=Google Sans,Roboto;fontSize=14;fontColor=#202124;
                 spacingLeft=24;spacingTop=8;">
          <mxGeometry x="1348" y="180" width="520" height="700" as="geometry"/>
        </mxCell>

        <!-- Left panel: architecture components (same as architecture.md pattern, within x=80..1280) -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{N}}` | Number of architecture components (3–5 for left panel fit) |
| `{{Service N}}` | GCP marketing names |
| `{{PANEL_TITLE}}` | Summary panel title (e.g., "Key Benefits", "Why Cloud Run?") |
| `{{bullet 1..5}}` | Summary panel bullets (2–5 bullets) |
| `{{label 1→2}}` | Arrow labels between components |
