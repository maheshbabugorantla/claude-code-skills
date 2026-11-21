# isometric-illustration

Draws a technical system as an isometric SVG scene: a still, a frame per step, or a stepped lesson page where packets travel and the picture changes one thing at a time.

```
/isometric-illustration "A load balancer in front of three API servers and one database"
/isometric-illustration --from-lesson explainer/llm-gateway/lesson.md --theme blueprint
```

Unlike the other illustration skills in this repo, this one does not write a prompt for an image model. It writes a `scene.json` and a bundled engine draws it, so labels are exact and the same entity looks the same in every step. An image model is used only for the optional cover.

## What you get

| Output | File | Use |
|---|---|---|
| Still | `still.svg` (and `.png`) | Docs, posts, READMEs |
| Frames | `steps/step-NN.svg` | One slide per step |
| Lesson | `lesson.html` | A single file with the step player. No network, opens from disk. |
| Cover | `cover-prompt.md`, `cover.jpg` | Post header or share card, through Nano Banana Pro |

## Use the engine directly

```bash
node bin/iso.mjs validate references/examples/llm-gateway.scene.json
node bin/iso.mjs explain  references/examples/llm-gateway.scene.json
node bin/iso.mjs render   references/examples/llm-gateway.scene.json --step all --png
node bin/iso.mjs build    references/examples/llm-gateway.scene.json --theme blueprint
node bin/iso.mjs cover    references/examples/llm-gateway.scene.json --aspect 16:9
node bin/iso.mjs themes
```

Node 18 or newer. No dependencies. PNG output uses `rsvg-convert`, `resvg`, ImageMagick or Inkscape if one is installed. `cover` calls the Gemini API only when `GEMINI_API_KEY` is set.

## Themes

`daylight` (default), `blueprint`, `print`. A theme is a JSON file of tokens in `themes/`. Copy one, change the values, pass `--theme ./mine.json`.

## Install for other agents

The skill folder is plain Agent Skills format. Claude Code reads it from `.claude/skills/`. Codex CLI and Gemini CLI both read `.agents/skills/`:

```bash
npx mbg-claude-code-skills@latest --global isometric-illustration technical-explainer            # Claude Code
npx mbg-claude-code-skills@latest --global --agents isometric-illustration technical-explainer   # Codex CLI, Gemini CLI
```

## Tests

```bash
node --test isometric-illustration/tests/engine.test.mjs
```

## Files

- `SKILL.md`: the workflow
- `engine/engine.mjs`: resolve, validate, layout, draw. Runs in Node and the browser.
- `engine/player.mjs`, `engine/player.css`: the step player inlined into `lesson.html`
- `engine/cover.mjs`: cover prompt and image request
- `bin/iso.mjs`: the command line
- `themes/`: token files
- `references/`: scene spec, layout rules, cover notes, lesson format, examples
- `DESIGN.md`: why it is built this way
