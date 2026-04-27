# crayon-illustration

Generate hand-drawn crayon-style illustration prompts for technical concepts — ready to paste into Gemini, DALL-E, Midjourney, or any AI image tool.

## Invocation

```
/crayon-illustration <type> "Topic"
/crayon-illustration "Topic"
```

**Types:** `concept-cards` · `mapping` · `architecture` · `workflow` · `grid` · `split-panel` · `process-flow`

The `<type>` is optional. If omitted, the skill recommends a layout based on the topic shape and asks you to confirm or redirect before proceeding.

## What it produces

A detailed, copy-pasteable prompt saved to `img/<slug>-prompt.md`. The prompt specifies:

- Hand-drawn crayon style on white background (children's educational book feel for technical audiences)
- Fixed pastel palette: Blue `#A8D8EA`, Green `#B5EAD7`, Yellow/Orange `#FFDAC1`, Purple `#C7CEEA`, Pink/Coral `#FFB7B2`
- Sketchy black borders, 16:9 aspect ratio, 1920×1080 export target

The skill runs a brief **discovery step** (audience, slide context, takeaway message) before layout selection so the generated prompt emphasizes the right component and uses the right label density. For multi-component layouts (`architecture`/`workflow` ≥5 components, `split-panel`, `process-flow`) it enters **plan mode** to review the component list + arrow labels before writing the full prompt — so you can redirect before rendering.

If the topic is too dense for a single illustration (e.g., spans multiple paradigm shifts, requires 8+ components, or asks for architecture + flow + data model in one frame), the skill flags it and recommends running `/technical-storybook` first. Each act in the storyboard can then become its own crayon image.

## Pairs well with

- [`/technical-storybook`](../technical-storybook/) — generate crayon visuals for each of the 12 acts
- [`/aws-illustration`](../aws-illustration/) — crayon style for lighter AWS explainers vs. formal architecture diagrams

## Install

```bash
npx @maheshbabugorantla/cc-skills@latest --global
```
