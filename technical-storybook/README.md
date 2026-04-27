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

Optionally generates a per-act visual prompt (one per act) compatible with any illustration skill.

## Pairs well with

- [`/crayon-illustration`](../crayon-illustration/) — whimsical, approachable visuals for each act
- `/finserv-illustration`, `/healthcare-illustration`, `/saas-illustration` — domain-specific visual styles

## Style-agnostic

The storyboard methodology works standalone (text only) or paired with any illustration skill. The act structure, argumentation pattern, and output format are independent of the visual style chosen.

## Install

```bash
npx @maheshbabugorantla/cc-skills@latest --global
```
