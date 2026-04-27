---
name: crayon-illustration
description: Generate a detailed AI image generation prompt in the hand-drawn crayon style for use with Gemini, DALL-E, Midjourney, or other AI image tools. Supports 7 layout types for technical concepts — concept-cards, mapping, architecture, workflow, grid, split-panel, process-flow. Use when the user says "create a crayon illustration", "hand-drawn diagram", "sketch-style visual", "crayon-style prompt", or "/crayon-illustration". Pairs well with /technical-storybook to generate visuals for each act.
triggers:
  - "crayon illustration"
  - "hand-drawn diagram"
  - "sketch-style visual"
  - "crayon-style prompt"
  - "whimsical technical diagram"
  - "children's book style diagram"
  - "/crayon-illustration"
proactively_suggest_when:
  - User asks for a technical illustration and wants a friendly, non-corporate visual style
  - User is creating blog posts, slide decks, or educational content that would benefit from a hand-drawn visual
  - User has run /technical-storybook and wants to generate visuals for each act
metadata:
  pairs-with: technical-storybook, aws-illustration
allowed-tools:
  - Read
  - Write
---

# crayon-illustration

Generate a detailed AI image generation prompt in the hand-drawn crayon style for use in Gemini, DALL-E, Midjourney, or other AI image tools.

## Invocation

```
/crayon-illustration <type> "Topic"
```

**Types:** `concept-cards`, `mapping`, `architecture`, `workflow`, `grid`, `split-panel`, `process-flow`

## Implementation Instructions

1. **Ask clarifying questions before generating** when the topic is ambiguous or a two-lane layout may be needed:
   - For `architecture` / `workflow` types with 5+ components, ask: "Should all components sit on a single row, or does this need two rows (e.g., a main pipeline + a side subsystem)? If two rows, what should the top row be called and what should the bottom row be called?"
   - Suggest context-appropriate names based on the topic, e.g.:
     - Data pipeline → "Ingestion Pipeline" / "Monitoring Subsystem"
     - Cloud infra → "Data Plane" / "Control Plane"
     - Request flow → "Hot Path" / "Async Workers"
   - For `split-panel`, ask: "What should the sticky-note panel title and bullets say?"
   - For `process-flow`, ask: "What label should appear on each arrow between panels?"
   - Skip questions if the user's description already answers them.
2. Read the template file for the requested type from `references/templates/<type>.md`
3. For `architecture`, `workflow`, `split-panel`, `process-flow` types: also read `references/layout-rules.md`
4. Generate a detailed prompt based on the type and topic
5. Save the prompt to `img/<slug>-prompt.md` (slugify the topic)
6. Display the prompt to the user for copy-paste into their AI image tool
7. Remind user to export as **PNG at 1920x1080** and save to `img/<slug>.png`

## Style Requirements (Include in EVERY prompt)

Every generated prompt MUST include these style elements:

```
Style: hand-drawn crayon-style illustration on a white background. Whimsical,
friendly feel — like illustrations in a children's educational book but for a
technical audience. All text in handwritten/crayon font style. No digital or
clean vector look — everything should feel sketched by hand with colored crayons.

Pastel color palette:
- Blue: #A8D8EA
- Green: #B5EAD7
- Yellow/Orange: #FFDAC1
- Purple: #C7CEEA
- Pink/Coral: #FFB7B2

All cards/boxes have sketchy black borders. Aspect ratio 16:9, presentation
slide format.
```

## Layout Control Rules

For `architecture`, `workflow`, `split-panel`, `process-flow` types: read `references/layout-rules.md` before generating. Key principle: state layout constraints 3 times with exhaustive negation.

## Illustration Types

### `concept-cards` — Horizontal cards with connecting arrows
**Layout:** 3-5 pastel-colored cards arranged horizontally, connected by arrows.
**Template:** See `references/templates/concept-cards.md`

### `mapping` — Two-column concept mapping
**Layout:** Two columns with dotted lines connecting matching concepts.
**Template:** See `references/templates/mapping.md`

### `architecture` — Left-to-right component flow
**Layout:** 4-7 components left-to-right with labeled arrows. Includes CRITICAL LAYOUT RULE block.
**Template:** See `references/templates/architecture.md`
**Requires:** `references/layout-rules.md`

### `workflow` — Nested waterfall/Gantt bars
**Layout:** Nested horizontal bars showing trace/workflow timeline with parallel groups.
**Template:** See `references/templates/workflow.md`

### `grid` — Card grid with icons
**Layout:** Cards in a grid (typically 4x2) with icons and descriptions.
**Template:** See `references/templates/grid.md`

### `split-panel` — Architecture diagram + sticky-note summary
**Layout:** Left 2/3 horizontal architecture flow, right 1/3 sticky-note panel.
**Template:** See `references/templates/split-panel.md`
**Requires:** `references/layout-rules.md`

### `process-flow` — Tall panels with labeled arrows
**Layout:** 3-5 tall rounded-rectangle panels left-to-right with labeled arrows.
**Template:** See `references/templates/process-flow.md`
**Requires:** `references/layout-rules.md`

## Output Format

Save to `img/<slug>-prompt.md`:

```markdown
# AI Illustration Prompt: {{Topic}}

**Type:** {{type}}
**Output file:** `img/{{slug}}.png`
**Resolution:** 1920x1080 (16:9)

## Prompt

{{The full prompt text — ready to copy-paste into AI image tool}}

## Notes

- Generated with `/crayon-illustration {{type}} "{{Topic}}"`
- Export as PNG at 1920x1080
- Save to `img/{{slug}}.png`
- Then update the slide: change `placeholder` to `image` type, or update `src` attribute
```

Then display the prompt text directly to the user so they can copy-paste it.

## Tips

For prompt quality tips and common pitfalls, see `references/tips.md`. Key tips: use exhaustive negation for arrow direction, number components, use sublabels, state layout rules 3 times.
