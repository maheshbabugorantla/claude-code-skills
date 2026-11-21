# Lesson file format, `technical-explainer/v1`

`/technical-explainer` writes this file. `/isometric-illustration --from-lesson` reads it. It is the whole contract between the writer and the illustrator: the writer decides meaning, the illustrator decides geometry. Nothing here mentions coordinates.

## Location

```
explainer/<slug>/
  lesson.md        written by /technical-explainer
  scene.json       written by /isometric-illustration
  lesson.html      built from scene.json
  still.svg, steps/, cover-prompt.md, cover.jpg     on request
```

`<slug>` is the title in lowercase with dashes: `"How a prompt travels through an LLM gateway"` becomes `llm-gateway`. Keep it short.

## Frontmatter

```yaml
---
format: technical-explainer/v1
title: How a prompt travels through an LLM gateway
slug: llm-gateway
audience: Engineers who call model APIs directly and have not run a gateway
takeaway: A gateway is one door for every model call, and one door is what makes keys, budgets, routing and records possible.
arc: follow-one-request
numbers: illustrative
---
```

| Key | Meaning |
|---|---|
| `format` | Always `technical-explainer/v1`. |
| `title` | Shown at the top of the lesson. |
| `slug` | Folder name. |
| `audience` | Who it is for and what they already know. |
| `takeaway` | The one sentence the reader should be able to say afterwards. |
| `arc` | `follow-one-request`, `break-then-fix`, `scale-up` or `compare-two`. |
| `numbers` | `illustrative` when the figures are made up to show a shape; `sourced` when every figure has a source in the text. |

## The three sections

After the frontmatter the file has three sections, in this order and with these exact headings: `## Cast`, `## Gauges`, `## Steps`.

## Cast

Everything that will stand on the board, once, with one name each.

```markdown
## Cast

| id | name | what it is | kind |
|---|---|---|---|
| app | Your app | The program that needs an answer from a model | client |
| gw | Gateway | A service every model call passes through | node |
| book | Keys + budgets | Where the gateway keeps callers, limits and usage | store |
```

`kind` is a hint to the illustrator: `node`, `store`, `client`, `actors`, `queue`, `zone`, `note` or `ring`. `name` is at most 22 characters and is the only name the prose uses for that thing.

## Gauges

Numbers the reader watches change. Two to four is plenty.

```markdown
## Gauges

| id | label | why the reader watches it |
|---|---|---|
| keys | Provider keys in the app | It falls to zero when the gateway arrives |
```

## Steps

One `###` heading per step, numbered from 1. Under it: a field list, then the prose.

```markdown
### 7. Provider B says slow down

- tag: failure
- state: Provider B warns, badge "429"; the link from Gateway to Provider B is cut
- motion: an error returns from Provider B to Gateway
- focus: Gateway, Provider B

Provider B answers 429: too many requests. Without a gateway, the app has to notice, wait and retry by itself, in every code path that calls a model.

> A sentence here, in a blockquote, is the step's key idea. Optional.

Changed:
+ something this step added
~ something it altered
- something it removed
! something the reader must not miss
```

| Field | Scene field it becomes | Write it as |
|---|---|---|
| `tag` | `tag` | `problem` `idea` `mechanism` `failure` `fix` `tradeoff` `recap` |
| `enters` | `show` | Cast names that appear in this step |
| `leaves` | `hide` | Cast names that go away |
| `state` | `set` | What changes and stays changed: a badge, a failure, a filled queue |
| `motion` | `packets` | What travels, from whom to whom, and whether it is a request, response, event, data or error |
| `focus` | `focus` | The two to four cast names this step is about |
| `gauges` | `gauges` | `keys = 0 (good)`: id, new value, and `good`, `warn` or `bad` |

Only `tag` is required. Leave out a field that does not apply. Whatever is not named under some step's `enters` is on the board from step 1.

The prose under the fields becomes the step's `body`: one or two short paragraphs, under 80 words together. The blockquote becomes `idea`. The `Changed:` lines become `changes`.

## What the illustrator may and may not change

May: positions, sizes, colours, icons, link routes, which side a caption sits on.

May not: titles, body text, key ideas, change lists, cast names, the order of steps. If a step cannot be drawn as written (two changes at once, a cast member that never appears), the illustrator says so and the lesson is fixed, not the scene.
