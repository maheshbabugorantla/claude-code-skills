# Case Studies and Translation Checklist

Two complete worked examples showing the 12-act technical storybook applied to different domains, plus a structural comparison and validation checklist.

---

## 1. Pharmaceutical Storyboard: Drug Interaction Safety

**Domain:** Pharmacovigilance — monitoring drug interactions and adverse events
**Concept argued for:** Graph RAG over SQL, Vector RAG, and Agentic RAG for multi-hop drug safety queries
**Target audience:** Pharmaceutical data scientists and clinical informaticists

**Opening question:** "Which drugs interact with Metformin AND are contraindicated for renal patients flagged in post-market surveillance?"

**Entity model:**

| Entity | Examples | Color (crayon) |
|--------|----------|----------------|
| Drug | Metformin, Drug X | Green #B5EAD7 |
| Condition | Renal Impairment | Pink-Coral #FFB7B2 |
| Surveillance | Post-Market Surveillance | Purple #C7CEEA |

**Relationship types:** INTERACTS_WITH, CONTRAINDICATED_FOR, FLAGGED_IN

**Act-by-act summary:**

| Act | Title | Key Visual | Domain Content |
|-----|-------|-----------|---------------|
| 1 | The Question | Whiteboard + mini KG | Pharmacist asks 3-entity drug safety question |
| 2 | Brute Force | JOIN tower + latency staircase | 7-table JOIN across drugs, interactions, contraindications, conditions, surveillance, flags |
| 3 | The Shortcut | Floating cards + missing links | 5 pharma text chunks with high cosine similarity but no INTERACTS_WITH edges |
| 4 | Expensive Guide | Pipeline + accuracy funnel | Search → Filter → Re-search → Cross-ref → Synthesize (0.95^5 = 0.77) |
| 5 | The Thread | Four-lane comparison | "What is Metformin CONNECTED to?" → 3 hops, done |
| 6 | Following Thread | 3-step architecture | Extract entities → Traverse INTERACTS_WITH/CONTRAINDICATED_FOR → Synthesize |
| 7 | The Traversal | Trade-off matrix | 4×5 grid, Graph RAG yellow on "Schema flexibility" |
| 8 | The Evidence | 3 benchmark cards | Microsoft 96/96, Lettria +25pp, arXiv hybrid +12pp |
| 9 | Real Threads | 2×3 industry grid | Drug discovery, fraud, enterprise, legal, financial + summary |
| 10 | Choosing Path | Decision flowchart | 4 branches + hybrid convergence |
| 11 | First Thread | 4-step roadmap | Find question → Model domain → Choose stack → Measure delta |
| 12 | Connects Everything | Stat circles + callback | Pharmacist's question answered as graph traversal |

**Generated outputs** _(produced when the skill runs)_: `storybook/img/prompts/01-the-question-prompt.md` through `storybook/img/prompts/12-connects-everything-prompt.md`

---

## 2. Netflix Storyboard: Movie Recommendations

**Domain:** Entertainment recommendations — personalized content discovery
**Concept argued for:** Graph RAG over SQL, Vector RAG, and Agentic RAG for multi-hop recommendation queries
**Target audience:** Software engineers who know SQL but not graph databases

**Opening question:** "Movies similar to Inception, by Nolan actors, rated 4+ by similar users?"

**Entity model:**

| Entity | Examples | Color (crayon) |
|--------|----------|----------------|
| Movie | Inception, Interstellar, Shutter Island | Green #B5EAD7 |
| Person | Christopher Nolan, Leonardo DiCaprio | Pink-Coral #FFB7B2 |
| Genre | Sci-Fi, Thriller | Yellow-Orange #FFDAC1 |
| User | User #42 | Purple #C7CEEA |

**Relationship types:** DIRECTED, ACTED_IN, IN_GENRE, WATCHED, RATED

**Key traversal paths:**
- Path A: Inception ←[ACTED_IN]— DiCaprio —[ACTED_IN]→ Shutter Island
- Path B: Inception ←[DIRECTED]— Nolan —[DIRECTED]→ Interstellar

**Act-by-act summary:**

| Act | Title | Key Visual | Domain Content |
|-----|-------|-----------|---------------|
| 1 | The Question | Whiteboard + mini KG | Viewer asks 3-entity recommendation question |
| 2 | Brute Force | JOIN tower + latency staircase | 7-table JOIN across users, watch_history, movies, movie_actors, actors, ratings, genres |
| 3 | The Shortcut | Floating cards + missing links | 5 movie/actor text chunks with high similarity but no ACTED_IN edges |
| 4 | Expensive Guide | Pipeline + accuracy funnel | Search → Filter → Re-search → Cross-ref → Synthesize (0.95^5 = 0.77) |
| 5 | The Thread | Four-lane comparison | "What is Inception CONNECTED to?" → 2 hops, done |
| 6 | Following Thread | 3-step architecture | Extract entities → Traverse ACTED_IN/DIRECTED/RATED → Synthesize |
| 7 | The Traversal | Trade-off matrix | Identical to pharma (domain-agnostic act) |
| 8 | The Evidence | 3 benchmark cards | Identical to pharma (domain-agnostic act) |
| 9 | Real Threads | 2×3 industry grid | Identical to pharma (domain-agnostic act) |
| 10 | Choosing Path | Decision flowchart | Identical to pharma (domain-agnostic act) |
| 11 | First Thread | 4-step roadmap | Find question → Model domain → Choose stack → Measure delta |
| 12 | Connects Everything | Stat circles + callback | Viewer's question answered as graph traversal |

**Generated outputs** _(produced when the skill runs; shown here as a reference example of what the skill generates)_:
- Prompt files: `storybook/img/prompts/netflix/01-the-question-prompt.md` through `storybook/img/prompts/netflix/12-connects-everything-prompt.md`
- Context document: `storybook/img/prompts/netflix/CONTEXT.md` — comprehensive context file covering narrative arc, domain model, visual style bible, benchmark numbers, and cross-image consistency rules. Pass this alongside each individual prompt to your image generation AI for visual consistency.

---

## 3. Structural Comparison: Domain-Agnostic vs Domain-Specific

Comparing the pharma and Netflix storyboards reveals which acts translate between domains and which require full rewriting:

| Act | Classification | What Changes | What Stays |
|-----|---------------|-------------|-----------|
| 1 | **Domain-specific** | Question, entities, relationships, character | 3/2/1 structure, whiteboard layout, "Simple question..." |
| 2 | **Domain-specific** | Table names, SQL query | JOIN tower visual, latency staircase, exponential numbers |
| 3 | **Domain-specific** | Document card content | Floating cards layout, similarity scores, missing-link pattern |
| 4 | **Domain-agnostic** | Pipeline step names (minor) | Accuracy funnel, 0.95^5 formula, cost calculator, $500-$2,500/day |
| 5 | **Domain-specific** | Entities in graph lane, approach questions | Four-lane structure, 1.3x height emphasis, "Relationships ARE retrieval" |
| 6 | **Domain-specific** | Entities, edge types, question text | 3-step pipeline structure, "1 LLM call", "<200ms", audit trail |
| 7 | **Domain-agnostic** | Tiny labels in cells (optional) | Entire 4×5 matrix, cell colors, "Trade-offs not grades" |
| 8 | **Domain-agnostic** | Nothing | All three benchmark cards, caveat, numbers |
| 9 | **Domain-agnostic** | Nothing | All five industry mini-graphs, summary cell |
| 10 | **Domain-agnostic** | Nothing | Decision flowchart, branch criteria, hybrid convergence |
| 11 | **Domain-specific** | Step examples, tool recommendations | 4-step structure, "Find → Model → Choose → Measure" |
| 12 | **Domain-specific** | Callback question, entity highlights | Stat circles, "+12pp / <1s / 100%", visual structure |

**Summary:** 5 acts are domain-agnostic (4, 7, 8, 9, 10), 7 require domain-specific translation (1, 2, 3, 5, 6, 11, 12).

To create a new domain storyboard: reuse Acts 4, 7, 8, 9, 10 as-is. Translate Acts 1, 2, 3, 5, 6, 11, 12 using the 13-slot translation table from SKILL.md Section 3.

---

## 4. Domain Translation Checklist

Validate before finalizing any new storyboard:

### Content Validation

- [ ] **Act 1 question passes the 3/2/1 test:** exactly 3 entities, 2 constraints, 1 filter. Not more, not fewer.
- [ ] **Each failed approach (Acts 2-4) is one the audience has actually used.** If they haven't tried SQL for this problem, Act 2 won't resonate. Pick failures that match the audience's real experience.
- [ ] **Act 5's reframe is categorical, not incremental.** Test: does the paradigm shift change the *type* of question being asked, or just the *speed* of the answer? "What is connected?" vs "What is similar?" is categorical. "Graph is faster than SQL" is incremental.
- [ ] **Act 7 has at least one honest yellow/red cell for the proposed solution.** If you can't find a genuine weakness, you don't understand the technology well enough.
- [ ] **Act 12's question is word-for-word identical to Act 1.** Check character-by-character. Any deviation breaks the narrative loop.

### Visual Validation (Concreteness Test)

For each of the 12 acts, answer: "Could someone who knows nothing about this domain understand the visual without reading the text?"

- [ ] Act 1: Can they see that multiple entities are connected by different relationship types?
- [ ] Act 2: Can they see that the tower of tables is wobbly and the staircase is exponential?
- [ ] Act 3: Can they see high scores next to disconnected fragments?
- [ ] Act 4: Can they see the funnel narrowing and money falling?
- [ ] Act 5: Can they see one lane simpler/taller than the others?
- [ ] Act 6: Can they see a left-to-right pipeline with the middle step largest?
- [ ] Act 7: Can they see a grid with mostly-green and some-yellow/red cells?
- [ ] Act 8: Can they see three cards with bar charts and a caveat?
- [ ] Act 9: Can they see five mini-graphs with a summary cell?
- [ ] Act 10: Can they see a flowchart with convergence?
- [ ] Act 11: Can they see four numbered steps with progression?
- [ ] Act 12: Can they see large stat numbers and a callback to the opening?

### Structural Validation

- [ ] **Domain-agnostic acts (4, 7, 8, 9, 10) are truly reused**, not subtly modified in ways that introduce inconsistency.
- [ ] **Domain-specific acts (1, 2, 3, 5, 6, 11, 12) use real domain terminology**, not generic placeholders.
- [ ] **Entity and relationship names are consistent** across all acts where they appear (especially Acts 1, 5, 6, 12).
- [ ] **Benchmark numbers (Act 8) are exact** — not rounded, not paraphrased, with proper source attribution.
- [ ] **Emotional arc progresses correctly:** Curiosity → Overwhelm → Deception → Frustration → Revelation → Clarity → Trust → Conviction → Recognition → Empowerment → Motivation → Resolution.
