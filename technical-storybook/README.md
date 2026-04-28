# technical-storybook

Design 12-act narrative storyboards that teach technical concepts through contrastive argumentation — showing why alternatives fail before presenting the solution.

## Invocation

```
/technical-storybook "Topic"
```

Example: `/technical-storybook "Why Graph RAG beats Vector RAG for multi-hop queries"`

## What it produces

A complete storyboard outline following a 12-act dramatic arc mapped to Bloom's Revised Taxonomy:

| Phase | Acts | Emotional Beat |
|---|---|---|
| Setup | 1 | Curiosity |
| Failure Cascade | 2–4 | Frustration |
| Paradigm Shift | 5–6 | Revelation |
| Evaluation | 7–8 | Trust |
| Generalization | 9–10 | Confidence |
| Action | 11–12 | Resolve |

The workflow includes a consulting-style discovery intake (domain research, audience qualification) followed by a **plan-mode gate**: the skill presents the translation table + act-by-act blueprint for your approval before generating any detailed prose. Edit direction before paying for the full outline.

If the concept is too large for a single 12-illustration storyboard (multiple paradigm shifts, prerequisite stack, compound topic, mixed audiences, or entity/relationship inflation), the skill runs a **scope triage** in Step 1d, notifies you with the specific signals that fired, and offers to break the story into a **chapter series** — each chapter is its own 12-act storyboard (≤12 illustrations) sharing a meta-arc, with one plan-mode gate per chapter. You can accept the chapter series or pick a compressed single storyboard with the tradeoff documented explicitly.

The completed storyboard is **saved to disk** at `storyboard/<slug>/storyboard.md` (single mode) or `storyboard/<slug>/chapter-N/storyboard.md` (chapter mode). The file format is defined in [references/storyboard-format.md](references/storyboard-format.md) and is the contract paired illustration skills consume.

After saving, the skill prints the exact next-step command — for example:

```
/crayon-illustration --from-storyboard storyboard/<slug>/storyboard.md
```

The illustration skill reads the file, walks the 12 acts, and writes one prompt per act. The skill itself never invokes another skill silently — the handoff is always a command the user runs deliberately.

## Pairs well with

- [`/crayon-illustration`](../crayon-illustration/) — whimsical, approachable visuals for each act

## Style-agnostic

The storyboard methodology works standalone (text only) or paired with any illustration skill. The act structure, argumentation pattern, and output format are independent of the visual style chosen.

## Install

```bash
npx mbg-claude-code-skills@latest --global
```
