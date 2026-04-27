# Template: `architecture`

**Layout:** 4-7 components arranged left-to-right with labeled arrows between them. Includes a CRITICAL LAYOUT RULE block.

**Requires:** Read `references/layout-rules.md` before generating.

## Prompt Template

```
Create a hand-drawn crayon-style technical architecture diagram on a white
background showing {{DESCRIPTION}}.

CRITICAL LAYOUT RULE: All components must be arranged on a SINGLE horizontal
row from left to right. There is only one row. No component drops to a second
row. No arrows curve downward. No arrows point left. Every arrow points
strictly to the RIGHT. The flow is a straight horizontal line. If components
are too wide to fit, shrink them or reduce label font size — never wrap to a
second row.

Layout: {{N}} components arranged left-to-right in a horizontal flow,
connected by hand-drawn arrows. All components on the same horizontal baseline.

Component 1 (pastel blue card, sketchy border):
- Drawing of {{icon description}}
- Label: "{{name}}"
- Subtitle: "{{description}}"
{{- Small note: "port {{N}}" if applicable}}

Component 2 (pastel green card):
- Drawing of {{icon description}}
- Label: "{{name}}"
- Subtitle: "{{description}}"

{{...more components...}}

Hand-drawn arrows between each component, with labels on the arrows:
- Between 1→2: "{{protocol/label}}"
- Between 2→3: "{{protocol/label}}"
{{...}}

All {{N}} components sit on the same horizontal level. All connecting arrows
are horizontal, pointing right. No diagonal arrows. No curved arrows. No
downward arrows.

{{STYLE BLOCK}}
```
