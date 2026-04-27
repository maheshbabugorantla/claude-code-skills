# Template: `process-flow`

**Layout:** 3-5 tall rounded-rectangle panels left-to-right, each with a colored background, centered icon, bold title, and subtitle. Labeled arrows between panels. Small annotation in bottom-right corner.

**Requires:** Read `references/layout-rules.md` before generating.

## Prompt Template

```
Create a hand-drawn crayon-style process diagram on a white background
showing {{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All panels must be arranged on a SINGLE horizontal
row from left to right. There is only one row. No panel drops to a second
row. No arrows curve downward. No arrows point left. Every arrow points
strictly to the RIGHT. Space panels evenly across the full width of the image.

Layout: {{N}} tall rounded-rectangle panels arranged in a single horizontal
row, connected by labeled hand-drawn arrows pointing right.

Panel 1 ({{pastel color}} background, rounded corners, sketchy border):
- Centered crayon drawing of {{icon description}}
- Bold title below icon: "{{PANEL_TITLE}}"
- Subtitle in smaller text: "{{subtitle}}"

Panel 2 ({{pastel color}} background):
- Centered crayon drawing of {{icon description}}
- Bold title: "{{PANEL_TITLE}}"
- Subtitle: "{{subtitle}}"

{{...more panels...}}

Hand-drawn arrows between panels with labels above the arrow line:
- Between Panel 1→2: "{{label}}"
- Between Panel 2→3: "{{label}}"
{{...}}

Small hand-written annotation in the bottom-right corner: "{{annotation}}"

All {{N}} panels sit on the same horizontal level. All arrows horizontal and
pointing right. No diagonal arrows. No curved arrows. No downward arrows.

{{STYLE BLOCK}}
```
