# technical-explainer

Scripts a stepped explainer: one diagram that stays on screen while each step changes one thing on it.

```
/technical-explainer "How does a rate limiter decide?"
```

It asks who the lesson is for and what they should take away, checks the facts, shows you a one-row-per-step outline to approve, then writes `explainer/<slug>/lesson.md`. Hand that file to [`isometric-illustration`](../isometric-illustration) to draw it:

```
/isometric-illustration --from-lesson explainer/<slug>/lesson.md
```

## How it differs from technical-storybook

| | technical-storybook | technical-explainer |
|---|---|---|
| Shape | 12 acts, a new picture per act | 6 to 12 steps on one persistent diagram |
| Argues by | Showing alternatives fail first | Changing one thing and showing the consequence |
| Pairs with | crayon-illustration | isometric-illustration |
| Good for | Why this approach beats the others | How this mechanism works |

## Files

- `SKILL.md`: the workflow and the rules for writing a step
- `references/lesson-format.md`: the file format both skills share
- `references/arcs.md`: four lesson shapes
- `references/examples/llm-gateway.lesson.md`: a complete lesson

No runtime needed. The skill only reads and writes text.
