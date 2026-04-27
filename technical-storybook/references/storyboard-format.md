# Storyboard File Format

The `/technical-storybook` skill writes its output to a markdown file with YAML frontmatter at a known path. Paired illustration skills (e.g., `/crayon-illustration --from-storyboard <path>`) read the file to generate per-act visuals.

This is the contract between methodology (storybook) and style (illustration). Any skill that knows this format can consume the storyboard.

---

## File location

| Mode | Path |
|---|---|
| Single storyboard | `storyboard/<slug>/storyboard.md` |
| Chapter mode (chapter N of M) | `storyboard/<slug>/chapter-N/storyboard.md` |
| Per-act prompts, single mode (written by illustration skill) | `storyboard/<slug>/act-01-prompt.md`, `act-02-prompt.md`, … |
| Per-act prompts, chapter mode | `storyboard/<slug>/chapter-N/act-01-prompt.md`, `act-02-prompt.md`, … |
| Per-act images (manually exported) | same directory as the prompt: `act-NN.png` |

The `<slug>` is a filesystem-safe slug derived from the concept name (e.g., `"Graph RAG for Pharma"` → `graph-rag-pharma`).

Each chapter lives in its own subdirectory so per-act prompts and images don't collide across chapters. The whole multi-chapter series is rooted at `storyboard/<slug>/`, which is what consumers point at when they want to auto-loop every chapter.

### Disk layout examples

**Single storyboard:**

```
storyboard/<slug>/
├── storyboard.md
├── act-01-prompt.md  …  act-12-prompt.md      (written by illustration skill)
└── act-01.png        …  act-12.png            (manually exported)
```

**Chapter series (3 chapters):**

```
storyboard/<slug>/
├── chapter-1/
│   ├── storyboard.md
│   ├── act-01-prompt.md  …  act-12-prompt.md
│   └── act-01.png        …  act-12.png
├── chapter-2/
│   ├── storyboard.md
│   └── …
└── chapter-3/
    ├── storyboard.md
    └── …
```

Consumers can be pointed at:
- A specific `storyboard.md` file (single chapter or single mode)
- The `<slug>/` root directory (auto-detects single vs. chapter and loops accordingly)

---

## YAML frontmatter

Every storyboard file begins with this frontmatter block:

```yaml
---
type: storyboard
concept: "Graph RAG for pharmaceutical interaction queries"
slug: graph-rag-pharma
domain: ml-ai
audience: "data scientists deploying RAG in regulated industries"
expertise: practitioner            # practitioner | technical-advocate | informed-learner
takeaway: "Graph traversal handles multi-hop queries that vector search misses"
chapter:
  position: 1                       # this chapter's index (1 in single mode)
  total: 1                          # total chapter count (1 in single mode)
  prev_callback: null               # Chapter (N-1)'s Act 12 callback, or null
  next_question: null               # Chapter (N+1)'s Act 1 question, or null
generated_at: "2026-04-27"
---
```

Fields are extracted by the consumer to drive global discovery (audience, takeaway) without re-asking the user.

---

## Body sections

### `## Discovery Summary`
One paragraph distilled from Step 1 of the storybook workflow — domain classification, audience description, evidence inventory.

### `## Act 1 Question`
The Act 1 question text plus its 3-entities / 2-constraints / 1-filter breakdown.

### `## Translation Table`
The full 13-slot translation table from Step 3 of the storybook workflow.

### `## Acts`
A subsection per act, in order, using this exact structure:

```markdown
### Act 01 — <Title>

- **Title:** <short evocative title — same as heading>
- **Chapter subtitle:** <one sentence describing the act's argument>
- **Key insight:** <the single idea the audience should retain>
- **Visual type:** <one of: concept-diagram | split-panel | fragment-diagram | pipeline | four-lane-comparison | architecture | grid-comparison | benchmark-cards | grid-industry | decision-flowchart | workflow | stat-circles>
- **Crayon layout:** <recommended /crayon-illustration type — see Visual Type Mapping below>
- **Visual description:** <layout, key elements, color assignments>
- **Components (L→R):** <if applicable: 3–7 ordered components with optional sublabels>
- **Arrow labels:** <if applicable: what each connection's label says>
- **Narrative beat:** <audience's emotional state at end of act>
- **Speaker note:** <2–3 sentences of delivery guidance>
```

The `Components (L→R)` and `Arrow labels` fields are required for visual types that the consumer renders as multi-component layouts (architecture, pipeline, decision-flowchart, workflow). They are optional for single-image types (concept-diagram, stat-circles, benchmark-cards).

---

## Visual Type Mapping

This is the canonical mapping from storyboard visual types to `/crayon-illustration` layout types. The storybook records both the abstract `Visual type` and the concrete `Crayon layout` so the file is portable across illustration styles (a future `/aws-illustration --from-storyboard` could use a different mapping).

| Storyboard visual type | Crayon layout | Notes |
|---|---|---|
| concept-diagram | `concept-cards` | Mini knowledge graph as 3–5 connected cards |
| split-panel | `split-panel` | Direct match |
| fragment-diagram | `grid` | Floating cards with similarity scores |
| pipeline | `process-flow` | Sequential transformation stages |
| four-lane-comparison | `grid` | 4×1 or 2×2 grid (one lane per approach) |
| architecture | `architecture` | Direct match |
| grid-comparison | `grid` | 4×5 trade-off matrix |
| benchmark-cards | `concept-cards` | 3 horizontal cards with bar charts |
| grid-industry | `grid` | 2×3 of mini domain graphs |
| decision-flowchart | `architecture` | Top-down branches converging |
| workflow | `process-flow` | 4-step horizontal roadmap |
| stat-circles | `concept-cards` | 3 stat circles + Act-1 callback |

Consumers that don't know how to render a given visual type should fall back to `concept-cards` and surface a warning to the user.

---

## Producer / consumer responsibilities

**Producers** (`/technical-storybook` and any future methodology skill):
- Always populate the YAML frontmatter completely
- Always populate `Visual type` and `Crayon layout` for every act
- Populate `Components (L→R)` and `Arrow labels` whenever the visual type is multi-component
- Use the file path conventions above so consumers can locate sibling chapters/prompts
- In chapter mode, write each chapter to its own subdirectory `chapter-N/` so per-chapter prompts are isolated from each other

**Consumers** (`/crayon-illustration --from-storyboard` and any future style skill):
- Accept either a `.md` file path or a directory path
- File path → single-pass (process that one storyboard file's 12 acts)
- Directory path → auto-detect:
  - If `<dir>/storyboard.md` exists → single-pass on that file
  - Else if `<dir>/chapter-*/storyboard.md` matches → loop through each chapter in numerical order (chapter-1, chapter-2, …, chapter-10 sorted as integers, not lexicographically)
- Read frontmatter to get audience, takeaway, expertise (skip discovery)
- Iterate the `## Acts` section in order
- Save per-act prompts adjacent to the storyboard file: `<dir-of-storyboard.md>/act-NN-prompt.md`
- Display a final summary listing all generated prompt paths (per-chapter summaries when looping)

---

## Example: minimal valid file

```markdown
---
type: storyboard
concept: "Why event sourcing beats CRUD for audit-heavy systems"
slug: event-sourcing-audit
domain: data-infrastructure
audience: "senior backend engineers using Postgres"
expertise: practitioner
takeaway: "Event sourcing makes the audit trail the source of truth, not a side effect"
chapter:
  position: 1
  total: 1
  prev_callback: null
  next_question: null
generated_at: "2026-04-27"
---

## Discovery Summary

[one paragraph]

## Act 1 Question

[question text + 3/2/1 breakdown]

## Translation Table

[13-slot table]

## Acts

### Act 01 — The Deceptively Simple Question

- **Title:** The Deceptively Simple Question
- **Chapter subtitle:** A pharmacist asks a question that takes 7 SQL JOINs to answer.
- **Key insight:** Multi-hop questions look simple but break under traditional retrieval.
- **Visual type:** concept-diagram
- **Crayon layout:** concept-cards
- **Visual description:** Whiteboard with mini knowledge graph; pharmacist character at 1/10 scale; 3-entities/2-constraints/1-filter checkboxes.
- **Components (L→R):** 1. Drug 2. Condition 3. Surveillance Report
- **Arrow labels:** [1→2: contraindicated for], [2→3: flagged in]
- **Narrative beat:** Curious, inviting
- **Speaker note:** Pause after reading the question. Let the audience try to mentally answer it before revealing the difficulty.

### Act 02 — The Brute Force Path

[…11 more acts…]
```
