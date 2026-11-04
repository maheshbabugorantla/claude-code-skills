# playable-statechart

Draws a statechart by code, in the crayon style of this skill pack, as a single-file HTML you can tap through and a 1920×1080 PNG for a slide. Feed it the chart that pstack's [`/statechart`](https://github.com/cursor/plugins/tree/main/pstack) writes from a TLA+ model and its `report.md`, and the plate says "checked by TLC", marks the breaking state, and replays the shortest bug path. Feed it a hand-written chart and it says "a sketch, not a checked model".

Inspired by April Zhu's [Tinycharts](https://april-zhu.com/tinycharts) and Kevin T. Ngo's [statechart-art](https://github.com/kevintngo/statechart-art) (MIT). This is a different implementation: SVG in the browser via [rough.js](https://github.com/rough-stuff/rough) and [ELK](https://github.com/kieler/elkjs) layout, one style, built to slot into `/technical-storybook`.

```
/playable-statechart chart.mmd --report report.md --png
```

## What you get

- `img/<name>.html` — self-contained (font, geometry and runtime inlined; no network). Tap an enabled arrow or press `1–9` to step; `Backspace` undoes; `R` resets; `Space` auto-walks; one "replay" button per rule that breaks.
- `img/<name>.png` — the same plate with controls hidden, 1920×1080.
- `img/<name>.svg` with `--svg`.

## Requirements

- Node ≥ 22.18 (the scripts are TypeScript run directly; no build step).
- `cd scripts && npm install` once (the `bin/` wrapper does this on first run): `elkjs`, `roughjs`, `@fontsource/patrick-hand`.
- For `--png`: Playwright with Chromium (`npm install playwright && npx playwright install chromium` inside `scripts/`), or open the HTML and screenshot it.

## Try it

```sh
bin/playable-statechart render references/examples/stale-token-bug.mmd \
  --report references/examples/stale-token-bug-report.md --out /tmp/out --png
bin/playable-statechart render references/examples/reconcile-regions.mmd --out /tmp/out
```

## Tests

```sh
cd scripts && npm test
```

Parser, execution semantics (parent states, parallel regions, guards, bug-path resolution), layout invariants and determinism, SVG/HTML output.

## Layout

```
SKILL.md                      how Claude uses it
bin/playable-statechart       wrapper: version check, first-run install, runs the CLI
scripts/cli.ts                render command
scripts/lib/parse.ts          Mermaid subset + report.md → Chart
scripts/lib/layout.ts         ELK layered layout (compound nodes, regions, labels)
scripts/lib/render.ts         rough.js SVG, palette, plate (title/legend/footer)
scripts/lib/html.ts           single-file HTML assembly
scripts/lib/png.ts            Playwright screenshot
scripts/runtime/play.mjs      pure statechart semantics (tested in Node, inlined in HTML)
scripts/runtime/ui.mjs        DOM wiring
references/mermaid-subset.md  what the parser accepts
references/style.md           the style decisions and why
references/examples/          four charts the tests render
```

## License

MIT, like the rest of this pack. Patrick Hand is © Patrick Wagesreiter, SIL Open Font License 1.1.
