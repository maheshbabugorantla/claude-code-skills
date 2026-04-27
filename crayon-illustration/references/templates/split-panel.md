# Template: `split-panel`

**Layout:** Left 2/3 shows a horizontal architecture flow. Right 1/3 shows a sticky-note summary panel with colored background, hand-lettered title, and bullet points with crayon checkmarks.

**Requires:** Read `references/layout-rules.md` before generating.

## Prompt Template

```
Create a hand-drawn crayon-style technical illustration on a white background
showing {{DESCRIPTION}}.

CRITICAL LAYOUT RULE: The left two-thirds of the image contains a horizontal
architecture flow on a SINGLE row. All architecture components point strictly
RIGHT. No arrows curve downward. No diagonal arrows. The right one-third is
a separate sticky-note panel — no architecture components appear there.

LEFT PANEL (left 2/3 of image):
Horizontal architecture flow — all components on a single horizontal baseline:

Component 1 (pastel blue card, sketchy border):
- Drawing of {{icon description}}
- Label: "{{name}}"
- Sublabel: "{{description}}"

Component 2 (pastel green card):
- Drawing of {{icon description}}
- Label: "{{name}}"
- Sublabel: "{{description}}"

{{...more components...}}

Hand-drawn arrows between each component pointing strictly RIGHT:
- Between 1→2: "{{label}}"
{{...}}

All {{N}} components on the same horizontal level. All arrows horizontal,
pointing right. No downward arrows. No curved arrows.

RIGHT PANEL (right 1/3 of image):
A large sticky-note rectangle with {{pastel color}} background and sketchy border.
- Hand-lettered title at top: "{{PANEL_TITLE}}"
- Smaller subtitle: "{{PANEL_SUBTITLE}}"
- Bullet list with crayon checkmark (✓) bullets:
  ✓ {{bullet 1}}
  ✓ {{bullet 2}}
  ✓ {{bullet 3}}
  ✓ {{bullet 4}}

{{STYLE BLOCK}}
```
