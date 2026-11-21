# Design notes

Why this skill is built the way it is. Decisions first, then the limits.

## The decision that shapes everything

**The scene spec is the product. Renderers are thin.** A lesson is a cast, links and steps. The isometric SVG, the per-step frames, the lesson page and the cover prompt are all readers of that one file. A skill that captured only a look would produce one-off pictures; a spec with a small closed vocabulary produces a series.

## Decisions

| Decision | Chosen | Why | Gave up |
|---|---|---|---|
| Who draws | A bundled engine, not an image model | Labels must be exact and an entity must look identical across steps. Image models do neither reliably. | Painterly variety |
| Runtime | Plain JavaScript modules, no build, no dependencies | The engine has to run in the lesson page, so it is JavaScript either way. No build step means the folder runs as copied, in any agent. | TypeScript's checks; types are in JSDoc comments instead |
| Step semantics | State is cumulative, motion is per-step | Lessons build up: a thing that broke stays broken until fixed. Spotlights and packets are moments. | Fully independent steps, which are longer to write and easy to make inconsistent |
| Guarding the semantics | `explain` prints what persists in every step | Cumulative state is where specs rot: a badge set in step 3 is still there in step 9. Making it readable is cheaper than making it impossible. | |
| Layout | The author places entities on a grid; `validate` criticises | Automatic layout of an isometric scene is a research problem. A critic that names the ids to move turns layout into a short loop that works without eyes. | One-shot layouts |
| Links | Routed along the lattice with rounded elbows and shared buses | Straight diagonals cross everything in a 2:1 projection. Lattice routes read as circuit traces and make fan-out tidy. | Arbitrary curves |
| Identity | Three token files: `daylight`, `blueprint`, `print` | Themes are data, so a brand palette is a file copy, not a code change. | |
| Phone view | The player frames the focused entities on narrow screens | A whole board on a 390 px screen makes 12 px labels unreadable. | A fixed stage |
| Writer and illustrator | Two skills joined by `lesson.md` | Meaning and geometry are different jobs and fail differently. The lesson file carries no coordinates, so it can be reviewed as prose. | One command |
| Cover | An image model, for the cover only | It is the one output where exactness does not matter and atmosphere does. | |
| Frontmatter | `name`, `description`, `compatibility`, `metadata` only | These are the fields the Agent Skills format defines. Keys specific to one agent (`triggers`, `allowed-tools`) are left out so Codex CLI and Gemini CLI read the same file. | Claude Code's `allowed-tools` restriction |

## What was argued and not settled

**How much to export.** One spec could also feed animated GIFs, video, an npm-published engine and domain icon packs. This version ships the still, the frames and the lesson page, because frames come free once a still can be drawn at any step and the others do not. The spec does not need to change to add them.

**Whether cumulative state is worth its risk.** It is the natural model for lessons that build up, and it is the main source of authoring mistakes. `explain` and the validator are the mitigation. If lessons keep shipping with stale badges, the next move is per-step snapshots with an explicit `carry` list.

## Limits

- **Verified in one runtime.** The engine, command line and tests ran under Node 22 and headless Chrome. The skill's installation paths for Codex CLI (`.agents/skills`) and Gemini CLI (`.agents/skills` or `.gemini/skills`) come from their documentation, not from a run in those agents.
- **The cover request has not been executed.** Tests check the request body against the documented Gemini Interactions API shape. No test calls the API.
- **Entities jump when `at` changes.** Entering and leaving animate; a moved entity is redrawn at its new position.
- **Text width is estimated.** Pills and notes are sized from a character-width table, since SVG cannot measure text without a browser. Estimates run slightly wide on purpose.
- **Fonts are the viewer's.** SVG and the lesson page name system font stacks. A still rasterised on a machine without those fonts falls back to its default sans or serif.
- **One link per route.** Two links that share a path draw on top of each other. Shared trunks are intended for fan-out; unrelated links should take different routes.
