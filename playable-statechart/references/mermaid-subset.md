# The Mermaid subset the renderer accepts

Reference dialect: what pstack's `/statechart` skill writes to `chart/chart.mmd`. Hand-written charts in the same subset render identically. Anything else is rejected with a line number.

## Accepted

```
---
title: "the stale token bug"          # optional frontmatter; `config:` lines are ignored
---
stateDiagram-v2
  direction LR                         # LR | TB | RL | BT, top level only; default TB
  %% comments are ignored

  s0: freshly issued                   # id: label
  state "valid" as s1                  # state "label" as id
  state "running" as running {         # composite (parent) state
    init: init containers run
    [*] --> init                       # the child entered when `running` is entered
    init --> ready: all containers up
  }
  state "At the same time" as all {    # parallel state: regions separated by --
    state "leader election" as r0 {
      [*] --> follower
      follower --> leader: the lease is won
    }
    --
    state "the reconcile loop" as r1 {
      [*] --> idle
      idle --> reconciling: an event arrives [when leader]
    }
  }

  [*] --> s0                           # top-level start
  s0 --> s1: a minute passes           # transition with label
  s1 --> s1: a minute passes           # self-transition
  s3 --> s5: a request is served [during a burst]   # trailing [..] is a guard
  s5 --> [*]                           # final state (drawn with a double outline)

  state "Legend" as legend {           # pstack's legend block; rendered as the legend panel
    lg0: Breaks NeverServeExpiredToken
  }
  class lg0 breaks
  class s5 breaks                      # state classes: breaks | mayBreak | bugPath
  class s0,s1 bugPath                  # comma lists are fine
  classDef breaks fill:#ffecee,stroke:#e72e3b   # accepted and ignored (the style is the renderer's)
```

## Semantics the player applies

- `[*] --> X` inside a block sets that block's (or region's) initial child; a block without one enters its first child.
- A transition from a composite is enabled while any of its descendants is active; firing it exits the whole subtree.
- A transition into a composite enters its initial child (and, for a parallel state, every region's initial).
- Guards: `[when X]`, `[while X]`, `[if X]` → enabled only when an active state's label is `X` (exact, case-insensitive) or contains `X` as a whole phrase (leaf labels only). `[unless X]` → the negation. Any other bracket text is shown, not evaluated.
- A state with no enabled transition ends the walk ("nothing can happen next").

## Rejected (with a line number)

- `note left of X … end note` blocks are skipped silently; everything else that does not parse is an error.
- `<<choice>>`, `<<fork>>`, `<<join>>`, `state X <<…>>`
- `:::className` shorthand
- Transitions inside the legend block
- An unclosed `{`, a stray `}`, `--` outside a block, `class` on an undeclared state

## pstack `report.md` fields read

```
## <Rule> breaks
0. <start state label>
1. <step label>: <state label>
…
## Rules that hold
A, B
## Rules not checked
C
```

Step and state labels are matched against the chart by text (case- and whitespace-insensitive). Everything above the first `##` is kept as the summary.
