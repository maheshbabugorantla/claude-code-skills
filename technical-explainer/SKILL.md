---
name: technical-explainer
description: Script a stepped explainer for a technical concept - a cast, a few gauges, and 6 to 12 steps that each change one thing on one persistent diagram. Writes a lesson.md file for /isometric-illustration to draw. Use for "explain how X works step by step", "stepped explainer", "interactive lesson", "walk through what happens when", or "/technical-explainer". For a 12-act argument with a separate picture per act, use /technical-storybook instead.
metadata:
  version: 0.1.0
  pairs-with: isometric-illustration
---

# technical-explainer

Write the script for a lesson the reader steps through: one diagram that stays on screen while each step changes one thing on it. You decide what the lesson means. `/isometric-illustration` decides where things stand and draws them.

The output is one file, `explainer/<slug>/lesson.md`, in the format at [references/lesson-format.md](references/lesson-format.md).

## Invocation

```
/technical-explainer "Concept or question"
/technical-explainer "Concept" --audience "who it is for" --arc follow-one-request
```

## Four words this skill thinks with

- **Cast**: every thing that will stand on the diagram. Each has one name, used everywhere.
- **Beat**: one step. A beat changes exactly one thing the reader can see.
- **Gauge**: a number on screen that a beat moves. Gauges are how a consequence becomes visible.
- **Arc**: the shape of the whole lesson. Four are in [references/arcs.md](references/arcs.md).

## Steps

### 1. Find the lesson

Ask up to three questions, skipping any the request already answers. Use your agent's question tool if it has one; otherwise ask all three in one message.

1. **Audience**: who is this for, and what do they already know?
2. **Takeaway**: what one sentence should they be able to say afterwards?
3. **Opening pain**: what goes wrong for them today that this concept fixes?

Done when the takeaway is written as one sentence of 25 words or fewer, and you can state the opening pain as something the audience has felt.

### 2. Check the facts

Look up anything the lesson asserts about how a real protocol, product or system behaves, from its own documentation or specification. Decide the lesson's numbers: either every figure has a source you can name in the text (`numbers: sourced`), or the figures are invented to show a shape and the lesson says so (`numbers: illustrative`).

Done when each factual claim in your notes has a source beside it, and the `numbers` choice is made.

### 3. Choose the arc and the cast

Read [references/arcs.md](references/arcs.md) and pick the arc whose skeleton fits the takeaway. Then list the cast: at most nine things that take up space, each with one name of 22 characters or fewer and a one-line description of what it does.

Done when every noun the takeaway needs is in the cast, and no cast member could be removed without breaking a beat.

### 4. Outline the beats and get a yes

Write the lesson as a table before writing any prose, and show it to the user:

| # | tag | The one change | Gauge it moves |
|---|---|---|---|
| 1 | problem | App calls three providers directly | keys = 3 |
| 2 | idea | Gateway enters; direct links leave | keys = 0 |

Six to twelve rows. Wait for the user to approve or redirect. In an unattended run, proceed and say at the top of your reply that the outline was not reviewed.

Done when the user has approved the table, and every row passes the beat test: you can say what changed without the word "and".

### 5. Write `lesson.md`

Follow [references/lesson-format.md](references/lesson-format.md) exactly: frontmatter, Cast, Gauges, then one `###` section per beat. A complete example is [references/examples/llm-gateway.lesson.md](references/examples/llm-gateway.lesson.md).

Apply every rule under **How to write a beat** below.

Done when the file exists and each approved row has a section with the same number and tag.

### 6. Read it as the audience

Go through the file once as the reader named in `audience`, checking each line of this list against every beat:

- Each term is described by what it does before it is named.
- Each cast member is called by its cast name and nothing else.
- The beat changes one thing; its fields name that thing.
- The prose is under 80 words and says why, not what moved.
- Every number is sourced in the text or the lesson is marked `illustrative`.
- The last beat lets the reader say the takeaway.

Fix what fails. Done when every beat passes every line.

### 7. Hand off

Print the path and the next command:

```
/isometric-illustration --from-lesson explainer/<slug>/lesson.md
```

## How to write a beat

**Function first, name second.** Say what the thing does in plain words, then attach its name: "a store of earlier prompts and their answers, a cache", in that order. A name the reader has not earned is noise.

**One name per thing.** The cast name is the only name. If the cast says "Gateway", the prose never says "proxy", "router" or "the service".

**One change per beat.** A beat adds one cast member, or breaks one link, or moves one gauge. Two changes are two beats. Split until the word "and" disappears from your description of what changed.

**The picture shows what; the prose says why.** The reader can see the request travel. Tell them why it goes there, what it costs, what would happen without it.

**State the condition.** Write "a cache pays only when prompts repeat". A claim with its condition can be checked; "caching makes it faster" cannot.

**Point first, number second.** Make the claim in words, then let a gauge carry the figure.

**Show a failure.** Somewhere after the mechanism is on the board, break something and let the design respond. A lesson where nothing goes wrong teaches the diagram, not the idea.

**End on the trade.** The last beat names what the design costs and when you would not use it.
