---
name: playable-statechart
description: Render a statechart as a hand-drawn, tap-to-play single-file HTML plus a 1920×1080 PNG, drawn by code from a Mermaid `stateDiagram-v2` — not by an image model. Takes the chart that pstack's `/statechart` skill writes from a TLA+ model (with its report.md, so the bug path replays and the plate says "checked by TLC"), or any hand-written chart in the same subset (rendered with a visible "sketch, not a checked model" mark). Crayon palette shared with /crayon-illustration, so it slots into a /technical-storybook act as `act-NN.png`. Use when the user says "playable statechart", "render this statechart", "state machine diagram I can step through", "tap to play chart", "draw the TLA+ chart", or "/playable-statechart"; and when a storyboard act has `Visual type: statechart`.
metadata:
  version: 0.1.0
  pairs-with: technical-storybook, crayon-illustration
allowed-tools:
  - Read
  - Write
  - Bash
---

# playable-statechart

The picture is a function of the model. `/crayon-illustration` writes a prompt and fights an image model for layout; this skill takes a statechart as data and draws it deterministically — same input, same picture — so a state-machine visual can be checked, stepped through, and regenerated.

## Invocation

```
/playable-statechart <chart.mmd> [--report report.md] [--out DIR] [--name SLUG] [--png] [--svg] [--title T] [--subtitle S]
/playable-statechart "<description of a system that moves between states>"
```

- `chart.mmd` — a Mermaid `stateDiagram-v2` in the subset described in `references/mermaid-subset.md`. The charts pstack's `/statechart` writes (`chart/chart.mmd`) are in that subset.
- `--report` — pstack's `report.md` for that chart. Turns on bug-path replay, red bug-path marks, and the "checked by TLC" footer.
- `--png` — also export `<name>.png` at 1920×1080 (needs Playwright; see Setup).
- `--out` defaults to `img/`, `--name` defaults to the chart's file stem.

## Workflow

### Step 0 — Setup check (every run)

The renderer is TypeScript run directly by Node (type stripping; no build step). Before the first render in a session:

1. `node --version` must be ≥ 22.18. Below that, stop and say so — the scripts will not run.
2. If `<skill dir>/scripts/node_modules` is missing, run `npm install` in `<skill dir>/scripts` (installs `elkjs`, `roughjs`, the OFL handwriting font). No network is needed afterwards.
3. `--png` needs Playwright with Chromium. If the export fails with the Playwright message, offer the two routes it names (install into `scripts/`, or open the HTML and screenshot it) — do not fake the PNG.

Run everything through the wrapper, which does these checks itself: `<skill dir>/bin/playable-statechart render …`.

### Step 1 — Get a chart

Three ways in, in order of how much the result can claim:

| Input | What the plate says | How |
|---|---|---|
| `chart.mmd` + `report.md` from pstack `/statechart` | "checked by TLC · N rules hold · M break" + replayable bug path | Pass both files. This is the Tinycharts path: TLA+ → TLC → chart → drawing. |
| `chart.mmd` only | "a sketch, not a checked model" | Pass the file. Honest about being unverified. |
| A prose description | same sketch mark | You write the chart (Step 2), show it as a `mermaid` block, get a nod, then render. |

Do not write a TLA+ model from a vague description and present the result as checked. A model checker that checks your imagination of the system gives false confidence; if the user wants a checked chart, point them at `/statechart` (pstack) with a spec written from the real code or protocol, then bring its output here.

### Step 2 — Write or tidy the chart (only when there is no `.mmd` yet)

Follow `references/mermaid-subset.md`. The rules that matter for the drawing:

- Label states and arrows in the reader's words ("the lease is won"), never code identifiers. Keep labels under ~22 characters per line; longer ones wrap.
- Declaration order is reading order: declare states in the order the story moves through them. The layout points arrows to later-declared states with the flow and bends arrows back to earlier ones as loops.
- Guards go in trailing brackets. `[when X]` / `[unless X]` where `X` is another state's label are evaluated during play (parallel regions); any other bracket text is shown but not evaluated.
- Aim for ≤ 20 arrows. A busier chart is a sign to split the act or coarsen the states.
- Parallel regions: a parent block with `--` between region blocks, each region with its own `[*]`.

### Step 3 — Render

```sh
<skill dir>/bin/playable-statechart render path/to/chart.mmd --report path/to/report.md --out img --name <slug> --png
```

Writes `img/<slug>.html` (self-contained: inlined font, geometry, and runtime; no network) and `img/<slug>.png`. Read the command's last line back to the user: state and transition counts, direction, checked/unchecked, and any "bug-path step did not match" warning — that warning means the report and the chart disagree, and the replay will skip the step; say so rather than hiding it.

### Step 4 — Look at it

Open the PNG (Read tool) before declaring done. Check: every label legible, no arrow crossing through a box, regions separated by the dashed divider, the breaking state in pink with a red outline when there is a report. If a label wraps badly or a loop is tangled, fix the chart (shorter label, different declaration order), not the renderer.

### Storyboard mode

When `/crayon-illustration --from-storyboard` meets an act with `Visual type: statechart`, it calls this skill with the act's `Chart` and optional `Report` fields and `--name act-NN --out <storyboard-dir> --png`. The PNG lands where the manually exported Gemini image would have, so the rest of the storyboard pipeline is unchanged. The HTML sits beside it for a live talk or a blog embed.

## What the output is

- **Plate** (`<svg class="plate">`, 1920×1080): title top-left, legend top-right when the chart has one, the chart scaled to fit, footer stating what was checked. Crayon palette (`#A8D8EA #B5EAD7 #FFDAC1 #C7CEEA #FFB7B2`), sketchy black outlines, hachure fills, handwritten face (Patrick Hand, OFL, embedded).
- **Play**: the active state(s) carry a yellow crayon halo; enabled arrows are blue and clickable; keys `1–9` fire the nth enabled step, `Backspace` undoes, `R` resets, `Space` auto-walks. Parent states enter their `[*]` child; leaving a parent exits its whole subtree; parallel regions are active together. `?static` in the URL hides the controls (that is how the PNG is taken).
- **Bug replay**: with a report, a button per breaking rule walks the shortest counterexample step by step and ends on the breaking state.

## Known limits (v0.1)

- Guards other than `[when <label>]` / `[unless <label>]` are not evaluated — the arrow is always enabled and the bracket text is shown.
- Bug paths are matched by label text; a report whose state labels do not appear in the chart (e.g. after you coarsened labels) replays with gaps, and the CLI warns.
- One style. The nine-way gallery in Tinycharts is a showcase, not a feature; add a second style only when a real deck needs it.
- Mermaid features outside the subset (notes, choice/fork/join pseudo-states, `:::` class shorthand) are rejected with a line number.

## References

- `references/mermaid-subset.md` — exactly what the parser accepts, with the pstack output as the reference dialect.
- `references/style.md` — the crayon style decisions and why each one is there.
- `references/examples/` — four charts (flat, parent state, parallel regions, checked bug with report) that the tests render.
