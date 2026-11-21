# Covers and social cards

A cover is a still image for the top of a post or a share card. It is the only output that comes from an image model. Diagrams stay SVG: an image model cannot keep a label exact or draw the same server the same way twice, and a lesson needs both.

## What the command does

```
node <skill-dir>/bin/iso.mjs cover scene.json [--aspect 16:9] [--size 2K] [--no-title] [--prompt-only]
```

1. Builds a prompt from the scene's title, its cast and the theme's colours, and writes it to `cover-prompt.md`.
2. If `GEMINI_API_KEY` is set and `--prompt-only` is absent, sends it to `gemini-3-pro-image` (Nano Banana Pro) and writes `cover.jpg`.

Without a key, hand the user `cover-prompt.md` to paste into any image model.

| Flag | Values | Default |
|---|---|---|
| `--aspect` | `1:1` `3:2` `2:3` `3:4` `4:3` `4:5` `5:4` `9:16` `16:9` `21:9` | `16:9` |
| `--size` | `1K` `2K` `4K` | `2K` |
| `--reference <png>` | A rendered still to restyle, for a cover that keeps the diagram's layout | none |
| `--model <id>` | Another image model id | `gemini-3-pro-image` |
| `--no-title` | Ask for no text at all | title is rendered |

Pick `16:9` for a blog header, `1:1` or `4:5` for a feed post.

## Before you send it

Read `cover-prompt.md` once. The prompt lists up to nine cast members as objects. If the scene has more, or the cover should show an idea the cast does not (a before and after, a single hero object), edit the prompt file by hand and send that text instead.

## After it returns

Look at the image. Three things go wrong often enough to check: extra text beyond the title, a perspective vanishing point where lines should stay parallel, and colours outside the palette. Rerun on a miss; each run is a new sample.

## Provenance

The request shape follows the Gemini API image-generation documentation (Interactions API: `POST /v1beta/interactions` with `model`, `input`, `response_format`). The repo's tests check the request body against that shape. They do not call the API.
