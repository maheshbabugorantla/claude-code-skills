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
