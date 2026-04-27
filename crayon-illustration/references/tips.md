# Tips

Lessons learned from generating crayon-style illustrations.

- Ask the user what specific concepts/cards they want if the topic is broad.
- Use concrete, visual icon descriptions ("a funnel receiving arrows", "stacked disks like a database") — not abstract concepts.
- Keep card text short — titles 1-2 words, subtitles under 10 words.
- For architecture diagrams, include port numbers and protocol labels on arrows.
- For workflow diagrams, clearly indicate parallel vs sequential execution.
- **Arrow direction is the #1 failure mode.** Always state arrow direction with exhaustive negation, not just the positive case ("no downward arrows, no curved arrows, no diagonal arrows" — not just "arrows point right").
- **Redundancy beats brevity** for layout constraints. State the same spatial rule 3 times in different locations within the prompt — single mentions are routinely ignored by image models.
- **Whitespace is semantic.** For simpler diagrams (fewer components), explicitly instruct "space components far apart to fill the width" — otherwise the model clusters them in the center.
- **Use numbered component lists.** "Component 1... Component 2..." gives the model an unambiguous ordering that "Box A, Box B" does not.
- **Sublabels prevent clutter.** Use a main label + a smaller sublabel (e.g., label: "Data Prepper", sublabel: "(ECS Service)") instead of cramming everything into one label.
- **Fallback instructions matter.** Tell the model what to do when it can't fit components: "shrink the components, don't wrap" prevents silent layout breakage into a Z-shaped two-row layout.

## Type Selection

Avoid the most common wrong-tool-for-the-job mistakes:

- **`process-flow` vs `concept-cards`** — use `concept-cards` when the items are peers with no transformation between them ("three flavors of caching"). Use `process-flow` only when each stage transforms its input ("raw → tokenized → embedded → indexed").
- **`architecture` vs `workflow`** — `architecture` shows components-with-flow at a single moment in time. `workflow` shows time-based parallel execution (Gantt-style nested bars). If your topic has no time axis, you want `architecture`.
- **`grid` vs `concept-cards`** — `grid` implies the cards are peers in a taxonomy (8 things in a 4×2 with no flow). `concept-cards` implies a left-to-right reading order with connecting arrows. Don't use `grid` for sequential things.
- **`split-panel` only when you genuinely need a summary panel** — a key-takeaways sticky note on the right. If you don't need the panel, use plain `architecture` and save the screen real estate.
- **`mapping` is for two-domain translations** — concept-A-in-domain-X ↔ concept-B-in-domain-Y. Don't use it for one-to-many or hierarchical relationships.
- **If the topic naturally produces 8+ components, it's in storyboard territory** — see the Scope Triage step and consider `/technical-storybook` instead of cramming.
