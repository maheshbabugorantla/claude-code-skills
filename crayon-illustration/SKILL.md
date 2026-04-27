---
name: crayon-illustration
description: Generate a detailed AI image generation prompt in the hand-drawn crayon style for use with Gemini, DALL-E, Midjourney, or other AI image tools. Supports 7 layout types for technical concepts — concept-cards, mapping, architecture, workflow, grid, split-panel, process-flow. Runs a brief discovery (audience, slide context, takeaway), scope triage (detects topics too dense for one image and recommends /technical-storybook), and auto type recommendation (suggests a layout when none is given) before layout selection. Enters plan mode for component-list approval on multi-component layouts (architecture/workflow ≥5 components, split-panel, process-flow) before writing the full prompt. Use when the user says "create a crayon illustration", "hand-drawn diagram", "sketch-style visual", "crayon-style prompt", or "/crayon-illustration". Pairs well with /technical-storybook to generate visuals for each act.
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

## Workflow

When invoked, follow these 7 steps (Step 5 enters plan mode for multi-component layouts before the prompt is written):

### Step 1 — Discovery

Ask up to three questions before touching the layout. Skip any already answered by the invocation:

**Audience:** Who will see this?
> (a) **Technical practitioners** — engineers, data scientists, architects
> (b) **Mixed** — engineers presenting to management or product
> (c) **Non-technical stakeholders** — product, business, executives

**Slide context:** Where will this illustration appear?
> (a) **Per-act visual** — part of a `/technical-storybook` 12-act storyboard
> (b) **Deck slide** — one slide in a presentation
> (c) **Standalone hero** — blog post inline or standalone explainer
> (d) **Other** — describe

**Takeaway:** "What single idea should the viewer remember after 5 seconds of looking at this?"

*Why it matters:* Audience shapes label density and jargon level. Context shapes callout weight (large bold titles for deck slides; subtle for inline). Takeaway determines which component to visually emphasize (largest box, highest-contrast color).

### Step 2 — Scope Triage

Assess whether the topic is too dense for a single crayon illustration. Evaluate these signals:

1. **Component count blowout** — natural decomposition exceeds 7 boxes (the architecture/process-flow ceiling)
2. **Multiple paradigm shifts** — topic spans more than one mental model (e.g., "OAuth + JWT + RBAC" — three different identity primitives)
3. **Prerequisite stack** — understanding the topic requires explaining 2+ foundational concepts first
4. **System + flow + data + outcomes** — the topic asks for the architecture AND the request flow AND the data model AND the user journey in a single frame
5. **Comparison across N>5 dimensions** — e.g., "compare 6 caching strategies across 4 properties"

**Decision rule:** if 2+ signals fire, notify the user:

> The concept "<topic>" looks too dense for a single crayon illustration. I'd recommend running `/technical-storybook` first to get a 12-act storyboard, then invoke `/crayon-illustration` for each act.
> Want to (a) hand off to `/technical-storybook`, (b) narrow the topic and stay here, or (c) override and continue with a single image anyway?

The user can override and continue; the skill respects the choice. If 0–1 signals fire, proceed directly to Step 3.

### Step 3 — Type Recommendation — conditional

**Fires only when the user invoked without a `<type>` argument** (e.g., `/crayon-illustration "Topic"` instead of `/crayon-illustration architecture "Topic"`). If the user supplied a type, skip this step and proceed to Step 4.

Recommend one layout based on the topic shape, with a one-line reason, then ask the user to confirm or redirect:

| Topic shape | Recommended type |
|---|---|
| 3–5 distinct, peer-level concepts (no transformation between them) | `concept-cards` |
| Two-domain mapping (term in domain A ↔ term in domain B) | `mapping` |
| Component system with left-to-right data flow | `architecture` |
| Time-based workflow with parallel execution tracks (Gantt-style) | `workflow` |
| 6–10 peer items in a taxonomy or category overview | `grid` |
| Architecture diagram that needs a key-takeaways summary panel | `split-panel` |
| Sequential transformation pipeline (3–5 stages, each transforms the input) | `process-flow` |

State the recommendation as: "Based on the topic, I'd recommend `<type>` because <one-line reason>. Want to (a) go with that, (b) pick a different type, or (c) see the full table?"

See `references/tips.md` (Type Selection section) for anti-pattern callouts on common wrong-tool-for-the-job mistakes.

### Step 4 — Type Confirmation & Component Selection

Confirm the layout type. If the user picked a type that doesn't serve the takeaway, suggest a better fit with a one-line reason.

For multi-component types (`architecture`, `workflow`, `split-panel`, `process-flow`), enumerate before generating:

- **Components** — list 3–7 items in the order they'll appear left-to-right on screen
- **Arrow labels** — for each connection, what does the label say? (e.g., "HTTP request", "batch job", "real-time stream")
- **Sublabels** — optional secondary label under each box (e.g., technology name, latency target)
- **Two-row decision** — if there are 5+ components or a main pipeline + side subsystem: single row or two rows? If two rows, name each (e.g., "Ingestion Pipeline" / "Monitoring Subsystem"; "Data Plane" / "Control Plane"; "Hot Path" / "Async Workers")
- **Panel title + bullets** — (`split-panel` only) what goes in the sticky-note panel on the right?
- **Arrow panel labels** — (`process-flow` only) what label appears on each arrow between the tall panels?

Skip items already answered by the user's invocation.

### Step 5 — Plan Approval (plan mode) — conditional

**Gate fires when ANY of these are true:**
- Type is `architecture` or `workflow` AND component count ≥ 5
- Type is `split-panel`
- Type is `process-flow`

For `concept-cards`, `mapping`, `grid`, and `architecture`/`workflow` with ≤ 4 components, skip this step and proceed directly to Step 6.

**When the gate fires,** compile a blueprint from Steps 1–4 and call `ExitPlanMode`:

```
Discovery: [audience] · [context] · [takeaway]
Layout: [type] · [row count] · [component count] components
Components (L→R): 1. [Name] (sublabel) → 2. [Name] (sublabel) → ...
Arrow labels: [1→2: label], [2→3: label], ...
[Split-panel sticky title + bullets, if applicable]
```

On approval, proceed to Step 6. On rejection, ask which Step (1, 2, 3, or 4) needs revision, update it, and re-enter the gate.

### Step 6 — Generate Prompt

1. Read `references/templates/<type>.md` for the requested layout type
2. For `architecture`, `workflow`, `split-panel`, `process-flow`: also read `references/layout-rules.md`
3. Read `references/tips.md` to apply quality guidance (exhaustive negation, numbered components, sublabels, repeat layout rules 3×)
4. Generate the full prompt text using all discovery + component decisions from Steps 1–4

See the [Style Requirements](#style-requirements-include-in-every-prompt) and [Layout Control Rules](#layout-control-rules) below — both apply to every generated prompt regardless of type.

### Step 7 — Save and Display

Save the prompt to `img/<slug>-prompt.md` using the [Output Format](#output-format) below. Display the prompt directly to the user for copy-paste. Remind the user to export as **PNG at 1920×1080** and save to `img/<slug>.png`.

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
