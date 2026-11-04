# Style decisions

One style, chosen to sit next to `/crayon-illustration` output in the same deck. Each rule names the problem it solves; change the rule when the problem changes.

| Decision | Why |
|---|---|
| White background, 16:9 plate at 1920×1080 | Same frame as every other storyboard act; the PNG drops in as `act-NN.png`. |
| Palette `#A8D8EA` blue · `#B5EAD7` green · `#FFDAC1` orange · `#C7CEEA` purple · `#FFB7B2` pink | The crayon-illustration palette. Fills rotate by *group* (a composite and its children share a colour), so colour means "belongs together", not "is special". |
| Pink fill + red (`#cd2834`) outline reserved for `breaks` | Red means a rule broke here. Nothing else on the plate is red, so the eye finds the bug first. |
| Thin red underline for `bugPath` states, red arrows on the path | The counterexample reads as a trail without shouting over the chart. |
| Dashed red outline for `mayBreak` | "Some model states behind this label break" — weaker than `breaks`, drawn weaker. |
| Double outline for final states | UML convention; no extra symbol to learn. |
| rough.js strokes, roughness ≈1.25, hachure fills, every shape seeded | Hand-drawn feel that is still deterministic: the same chart renders pixel-identical across runs, so diffs are meaningful. |
| Patrick Hand (OFL) embedded as base64 | A handwriting face that ships inside the file; no CDN, no fallback drift between machines. |
| Yellow (`#f2b705`) crayon halo = active state; blue (`#1b6ca8`) = enabled arrow | Two play-time signals, both absent from the static palette, so the static PNG never looks "mid-play". Play styling is scoped to `.playing`; the static plate shows every arrow in full ink. |
| Footer always states the claim: "checked by TLC · …" or "a sketch, not a checked model" | The picture should never imply more verification than it has. |
| Header band on composites, dashed divider between regions | Mermaid/UML conventions readers already know; the band also gives the composite's label a home that cannot collide with children. |
| Declaration order drives flow direction | The author's reading order is the story; the layout engine is told to prefer it and to bend back-edges into loops. |

What is deliberately not here: a second style, animation beyond the fired-arrow flash, a paper texture (it fights projector contrast), and any per-node colour semantics beyond `breaks`.
