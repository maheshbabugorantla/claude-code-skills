---
name: isometric-illustration
description: Draw a technical system as an isometric SVG scene with the bundled engine - a still diagram, one frame per step, or a stepped lesson page where packets travel and the picture changes one thing at a time. Use for "isometric diagram", "isometric illustration", "stepped explainer", "animate this architecture", "/isometric-illustration", or to illustrate a lesson.md written by /technical-explainer (--from-lesson). Also writes a matching cover image prompt, and the image itself through Nano Banana Pro when GEMINI_API_KEY is set (--cover).
compatibility: Needs Node 18 or newer on PATH. No packages to install. PNG previews use rsvg-convert, resvg, ImageMagick or Inkscape when one is present.
metadata:
  version: 0.1.0
  pairs-with: technical-explainer
---

# isometric-illustration

Turn a system into a **scene**: entities on a board, links between them, packets that travel. The bundled engine draws the scene in 2:1 isometric SVG. One `scene.json` gives a still, a frame per step, and a self-contained lesson page.

`<skill-dir>` is the folder that holds this file. Every command below is `node <skill-dir>/bin/iso.mjs <command> <scene.json>`.

## Invocation

```
/isometric-illustration "What to draw"                      one still
/isometric-illustration --from-lesson <path/to/lesson.md>    stepped lesson
    --theme daylight | blueprint | print     default: daylight
    --frames                                 also write one SVG per step
    --cover                                  also write the cover prompt (and image, with a key)
```

## The one rule of a scene

**State is cumulative. Motion is per-step.** `show`, `hide`, `set` and `gauges` persist into every later step until a later step changes them. `focus` and `packets` belong to their own step and vanish at the next. A badge you set in step 3 is still on the board in step 9 unless you clear it.

## Steps

### 1. Settle the input

- **From a lesson** (`--from-lesson`): read `lesson.md`. Its Cast, Gauges and Steps are the brief. Carry its wording into the scene unchanged: titles, body text, key ideas and change lists are the writer's. Its format is [references/lesson-format.md](references/lesson-format.md).
- **From a description**: draw one still with no steps. If the request is really a sequence ("show how X happens"), say so and offer `/technical-explainer` to script it first; proceed with a still unless the user takes the offer.

Done when you can name every entity that will stand on the board and, for a lesson, the one thing each step changes.

### 2. Write `scene.json`

Read [references/scene-spec.md](references/scene-spec.md) before writing: its field tables are the whole contract. Place the cast by [references/layout-rules.md](references/layout-rules.md). When the lesson follows one request through a system, start from [references/examples/llm-gateway.scene.json](references/examples/llm-gateway.scene.json).

Save it beside the lesson (`explainer/<slug>/scene.json`), or as `diagrams/<slug>/scene.json` for a still.

Done when every lesson step has a scene step with the same title, and every cast row has an entity.

### 3. Validate until clean

```
node <skill-dir>/bin/iso.mjs validate scene.json
node <skill-dir>/bin/iso.mjs explain scene.json
```

`validate` is the layout critic. Each warning names the ids to move, reroute or shorten: fix every one, then rerun. `explain` prints what each step resolves to. Read every `persists` line and ask whether it is still true in that step; clear what is not with `"badge": null` or `"state": "ok"`.

Done when `validate` prints `ok, 0 warning(s)` and every `persists` line is true where it appears.

### 4. Render and look

```
node <skill-dir>/bin/iso.mjs render scene.json --step all --png
```

This writes `steps/step-NN.svg` and `.png`. Open the PNGs for step 1, the busiest step and the last step. Check four things: no entity hides another's caption; each link meets its entity where the eye expects; the story reads along the links without crossing back; the focused entities are the ones the step is about. Fix the scene and rerun step 3 after any change.

When no rasteriser is installed the command says so. Then the clean validator run is your evidence: tell the user the picture was checked by the validator and not by eye.

Done when you have looked at those three frames, or said plainly that you could not.

### 5. Build what was asked for

| Asked for | Command | Writes |
|---|---|---|
| A still | `render scene.json` | `still.svg` (add `--png` for a raster copy) |
| A stepped lesson | `build scene.json` | `lesson.html`: one file, no network |
| Frames for slides (`--frames`) | `render scene.json --step all --png` | `steps/step-01.svg` ... |

Add `--theme <name>` to override the scene's theme. A theme is a token file in `<skill-dir>/themes/`; pass a path to use one of your own.

### 6. Cover, when asked (`--cover`)

The diagrams are SVG. The cover is the one place an image model is used. Read [references/cover.md](references/cover.md), then:

```
node <skill-dir>/bin/iso.mjs cover scene.json --aspect 16:9
```

It always writes `cover-prompt.md`. With `GEMINI_API_KEY` set it also calls Nano Banana Pro and writes `cover.jpg`.

### 7. Hand over

List the files written and the theme used. For a lesson, say how to open it: `lesson.html` opens in any browser from disk; arrow keys step, `R` replays. In the Claude app, publish `lesson.html` as an artifact so it opens on a phone.

## Reference

### The eight kinds

| Kind | Draw it for | Notes |
|---|---|---|
| `node` | A service, function, model, any box that does work | `size` s, m, l. `shape` block, slab, tower. `icon` paints a glyph on top. |
| `store` | Anything that keeps data: database, cache, bucket, ledger | A cylinder. |
| `client` | Where a person or program starts a request | An upright screen on a tile. |
| `actors` | Many callers at once: users, tenants, devices | `count` 1 to 9. |
| `queue` | Work waiting in order | `slots`, `fill`, `axis`. Items leave from the high end. |
| `zone` | A boundary: region, network, team, trust level | A dashed floor area. Links may cross it. |
| `note` | A rule, formula or short list the step needs in view | A flat card pinned to a grid point. Six lines at most. |
| `ring` | A cycle or hash ring | `marks` sit on it by angle; `arcs` highlight a stretch. |

Any kind can carry `"state": "ghost"` (planned or removed: dashed outline), `"warn"` or `"down"`.

### Themes

| Theme | Looks like | Reach for it when |
|---|---|---|
| `daylight` | Cool grey page, flat three-tone tiles, no outlines | Screens, blog posts, the default |
| `blueprint` | Deep blue with pale line-work | Dark slides, talks |
| `print` | White, black outlines, one blue ink, serif labels | Papers, documents, greyscale printing |
