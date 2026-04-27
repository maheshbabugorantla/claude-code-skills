# Layout Control Rules

Image generation models frequently misinterpret spatial layout instructions. Apply these rules to prevent common failures.

## Flow Direction

- State the flow direction at the TOP of the prompt, before describing any components.
- Use exhaustive negation — "All arrows point strictly RIGHT" is not enough alone. Add: "No arrows point downward. No arrows point left. No diagonal arrows. No curved arrows that change direction."
- If components might overflow horizontally, instruct: "shrink components or reduce label font size — never wrap to a second row."

## Single-Row Enforcement (architecture type)

- Default to a SINGLE horizontal row. State this explicitly: "All components on a single horizontal row. One row only."
- Number the components in sequence (1, 2, 3...) so the model has an unambiguous ordering.
- After listing all components, restate the constraint: "All N components sit on the same horizontal level."

## Multi-Row / Two-Lane (when intentional)

- If a layout genuinely needs two rows (e.g., a main pipeline + a subsystem below it), **ask the user what to name each row** before generating — never invent generic labels like "Top Lane" / "Bottom Lane".
- Suggest 2-3 context-appropriate options based on the topic, e.g.: "What should the two rows be called? Suggestions for a data pipeline: 'Ingestion Pipeline' / 'Monitoring Subsystem' — or 'Hot Path' / 'Async Workers' — or something else?"
- Label each row with the confirmed name and specify which arrows cross between rows.
- Keep the primary flow strictly left-to-right within each lane.

## Grouping Boundaries

- Dashed-outline rectangles (e.g., "ECS Task", "EKS Cluster") must contain their child components WITHOUT interrupting the horizontal flow.
- State: "The boundary box encloses Components X and Y on the same horizontal baseline as the other components."

## Redundancy Strategy

- State layout constraints THREE times: (1) as a rule block before components, (2) inline with component placement, (3) as a summary after all components.
- This is not excessive — single mentions are routinely ignored by image models.
