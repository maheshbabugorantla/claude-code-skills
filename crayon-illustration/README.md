# crayon-illustration

Generate hand-drawn crayon-style illustration prompts for technical concepts — ready to paste into Gemini, DALL-E, Midjourney, or any AI image tool.

## Invocation

```
/crayon-illustration <type> "Topic"
```

**Types:** `concept-cards` · `mapping` · `architecture` · `workflow` · `grid` · `split-panel` · `process-flow`

## What it produces

A detailed, copy-pasteable prompt saved to `img/<slug>-prompt.md`. The prompt specifies:

- Hand-drawn crayon style on white background (children's educational book feel for technical audiences)
- Fixed pastel palette: Blue `#A8D8EA`, Green `#B5EAD7`, Yellow/Orange `#FFDAC1`, Purple `#C7CEEA`, Pink/Coral `#FFB7B2`
- Sketchy black borders, 16:9 aspect ratio, 1920×1080 export target

## Pairs well with

- [`/technical-storybook`](../technical-storybook/) — generate crayon visuals for each of the 12 acts
- [`/aws-illustration`](../aws-illustration/) — crayon style for lighter AWS explainers vs. formal architecture diagrams

## Install

```bash
npx @maheshbabugorantla/cc-skills@latest --global
```
