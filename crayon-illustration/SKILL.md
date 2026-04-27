---
name: crayon-illustration
description: Generate a detailed AI image generation prompt in the hand-drawn crayon style for use with Gemini, DALL-E, Midjourney, or other AI image tools. Supports 7 layout types for technical concepts — concept-cards, mapping, architecture, workflow, grid, split-panel, process-flow. Runs a brief discovery (audience, slide context, takeaway), scope triage (detects topics too dense for one image and recommends /technical-storybook), and auto type recommendation (suggests a layout when none is given) before layout selection. Enters plan mode for component-list approval on multi-component layouts (architecture/workflow ≥5 components, split-panel, process-flow) before writing the full prompt. Also supports a `--from-storyboard <path>` mode where `<path>` is either a single storyboard file (12 prompts) or a series root directory (auto-loops through every chapter subdirectory). Reads the storyboard produced by /technical-storybook and generates one prompt per act in batch. Use when the user says "create a crayon illustration", "hand-drawn diagram", "sketch-style visual", "crayon-style prompt", or "/crayon-illustration". Pairs well with /technical-storybook to generate visuals for each act.
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
/crayon-illustration "Topic"
/crayon-illustration --from-storyboard <file>           # one storyboard.md → 12 prompts
/crayon-illustration --from-storyboard <series-root>    # directory → loop every chapter
```

**Types:** `concept-cards`, `mapping`, `architecture`, `workflow`, `grid`, `split-panel`, `process-flow`

`<type>` is optional in the second form (Step 3 recommends one). The third and fourth forms skip discovery entirely and read a storyboard file or directory produced by `/technical-storybook` — see the [Storyboard Mode](#storyboard-mode--alternate-invocation) section below.

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

**Decision rule:** if 2+ signals fire, notify the user with both concrete commands:

> The concept "`<topic>`" looks too dense for a single crayon illustration. I'd recommend producing a 12-act storyboard first, then rendering each act as its own crayon illustration. Concretely, run these in order:
>
> ```
> /technical-storybook "<topic>"
> ```
> → saves the storyboard to `storyboard/<slug>/storyboard.md` (single mode) or `storyboard/<slug>/chapter-N/storyboard.md` (chapter mode)
>
> ```
> /crayon-illustration --from-storyboard storyboard/<slug>/storyboard.md
> ```
> → reads the file, generates one prompt per act, saves them to `storyboard/<slug>/act-NN-prompt.md`
>
> Want to (a) hand off to `/technical-storybook` now, (b) narrow the topic and stay in single-image mode here, or (c) override and continue with a single dense image anyway?

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

## Storyboard Mode — alternate invocation

When invoked as `/crayon-illustration --from-storyboard <path>`, the skill reads a storyboard file produced by `/technical-storybook` (or any compatible methodology skill) and generates one prompt per act in batch.

This is the consumer side of the methodology+style handoff: the storybook produces the file, this skill consumes it. The file format is defined in [`../technical-storybook/references/storyboard-format.md`](../technical-storybook/references/storyboard-format.md) — including the Visual Type Mapping table that says how each storyboard `Visual type` maps to a crayon layout.

### Workflow

1. **Resolve `<path>`.** If `<path>` ends in `.md` or points at a file, treat it as **single-pass mode** — read just that storyboard file. Otherwise treat it as a directory and auto-detect:
   - If `<path>/storyboard.md` exists → single-pass on that file.
   - Else glob `<path>/chapter-*/storyboard.md`. Sort the matches numerically by integer N (chapter-1, chapter-2, …, chapter-10 — not lexicographically). Loop through each chapter file as if it were a single-pass invocation. This is **chapter auto-loop mode**.
   - If neither matches → error: print the expected layouts (single: `<dir>/storyboard.md`; chapter series: `<dir>/chapter-*/storyboard.md`) and exit without writing anything.

   In all modes, parse the storyboard file's YAML frontmatter to extract `concept`, `slug`, `audience`, `expertise`, `takeaway`, and `chapter` position. The directory containing the file is `<storyboard-dir>` — that's where per-act prompts will be written.

2. **Skip Steps 1–3 of the standard workflow.** Discovery is taken from the frontmatter; scope triage is moot (the storybook already produced 12 acts × 1 visual each); type recommendation is moot (each act records its own `Crayon layout`).

3. **For each `### Act NN — <Title>` section in the file**, do the following:
   - Extract `Title`, `Visual type`, `Crayon layout`, `Visual description`, `Components (L→R)` (if listed), `Arrow labels` (if listed)
   - If `Crayon layout` is missing, look up the `Visual type` in the Visual Type Mapping table from `storyboard-format.md` and use that
   - Run Step 6 of the standard workflow (Generate Prompt) using these inputs:
     - **Audience, takeaway, expertise** → from frontmatter (apply globally to every act)
     - **Slide context** → `"Per-act visual"` (always)
     - **Layout type** → the resolved Crayon layout
     - **Components / arrow labels / sublabels** → from the act section
     - **Title for the prompt** → the act's `Title` field
   - Save the prompt to `<storyboard-dir>/act-NN-prompt.md` (NN = zero-padded, matching the act heading)

4. **Skip the Step 5 plan-mode gate.** The storyboard was already approved upstream in `/technical-storybook`'s Step 4 plan-mode gate; the per-act prompts inherit that approval. If the user wants per-act review, they can re-run with `--review-each` and the gate fires per act.

5. **Display a final summary** when prompts are saved:
   - **Single-pass:** `Generated 12 act prompts at <storyboard-dir>/act-NN-prompt.md. Export each as PNG (1920×1080) and save alongside as act-NN.png.`
   - **Chapter auto-loop:** One section per chapter listing its 12 prompt paths, then a top-line total: `Generated N×12 prompts across N chapters at storyboard/<slug>/chapter-*/act-NN-prompt.md`. Remind the user to export each as PNG (1920×1080) alongside as `act-NN.png`.

### Chapter mode

When `<path>` is a series root containing `chapter-*/storyboard.md` files, the workflow auto-loops every chapter in numerical order. Each chapter's per-act prompts save to `storyboard/<slug>/chapter-N/act-NN-prompt.md` so they don't collide with sibling chapters.

If the user wants per-chapter approval rather than a full series sweep, they can invoke once per chapter file:

```
/crayon-illustration --from-storyboard storyboard/<slug>/chapter-1/storyboard.md
```

The chapter file's frontmatter `chapter.position` and `chapter.total` are parsed and surfaced in the summary so the user knows which chapter just rendered.

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
