# Act-by-Act Implementation Guide

Detailed specifications for each of the 12 acts in the technical storybook methodology. Each act includes purpose, required elements, visual specification, narrative beat, speaker delivery notes, domain translation guidance, common mistakes, and worked examples from the pharmaceutical (drug interactions) and Netflix (movie recommendations) storyboards.

---

## Act 1: The Deceptively Simple Question

**Purpose:** Hook the audience with a question that sounds simple but requires multi-hop reasoning to answer. This question is the protagonist of the entire storyboard — every subsequent act tries to answer it.

**Required elements:**
- A natural-language question containing exactly 3 entities, 2 constraints, and 1 filter
- A mini knowledge graph showing the entities and their relationships
- A character (small, subordinate to the diagram) who represents the audience

**Visual specification:** Concept diagram. Whiteboard scene with mini knowledge graph, question text above, and validation checkboxes (3 entities, 2 constraints, 1 filter) below. Character at ~1/10 frame height with speech bubble: "Simple question..."

**Narrative beat:** Curiosity — "That sounds easy..." The audience should underestimate the complexity.

**Speaker delivery:** Pause after reading the question aloud. Let the audience mentally attempt it. Then say: "Sounds simple, right? Let's see what happens when we try to answer it."

**Domain translation:** The question changes entirely between domains. The structure (3/2/1) stays constant.

**Common mistakes:**
- Question too complex: more than 3 entities overwhelms Act 1. Save complexity for later.
- Question too simple: if it's answerable with a single table lookup, there's no story to tell.
- Character dominates the frame: the diagram is the star, not the person.

**Pharma example:**
- Question: "Which drugs interact with Metformin AND are contraindicated for renal patients flagged in post-market surveillance?"
- Entities: Metformin, Renal Impairment, Post-Market Surveillance
- Relationships: INTERACTS_WITH, CONTRAINDICATED_FOR, FLAGGED_IN
- Character: Pharmacist in lab coat

**Netflix example:**
- Question: "Movies similar to Inception, by Nolan actors, rated 4+ by similar users?"
- Entities: Inception, Christopher Nolan, User #42's Profile
- Relationships: DIRECTED, ACTED_IN, WATCHED, RATED
- Character: Viewer on couch with remote

---

## Act 2: The Brute Force Path (Failed Approach #1)

**Purpose:** Show that the audience's instinctive first approach (SQL/relational) fails at scale. Not because SQL is bad — because it's the wrong tool for this class of problem.

**Required elements:**
- The SQL query (or equivalent brute-force approach) visualized as structural complexity
- Quantified performance degradation (concrete numbers, not vague claims)
- A split panel: complexity on one side, latency/cost on the other

**Visual specification:** Split panel. Left: a tower/stack of joined tables (wobbly, about to fall). Right: an exponential staircase of latency bars with specific numbers at each step. An exhausted figure at the bottom.

**Narrative beat:** Overwhelm — "Oh no, that's ugly." The audience recognizes the pain from their own experience.

**Speaker delivery:** Build the tower verbally: "First JOIN... second JOIN... third... by the seventh, your query planner is in tears." Point to the latency staircase. "And every additional hop isn't linear — it's exponential."

**Domain translation:** The brute-force approach changes (it's SQL for data queries, exhaustive search for optimization, manual review for compliance). The visual pattern (complexity tower + exponential cost) stays constant.

**Common mistakes:**
- Making SQL look stupid: the audience knows and loves SQL. Respect it. Show it failing *specifically on multi-hop queries*, not generally.
- Vague performance claims: "it gets slow" is unconvincing. Use numbers: "50ms → 200ms → 2s → 8s → timeout."
- Forgetting the emotional hook: the wobbly tower, the exhausted figure — these aren't decoration, they're the emotional vector.

**Pharma example:**
- Tables: drugs, interactions, contraindications, conditions, surveillance, flags (7 JOINs)
- Latency: 1 hop 50ms → 2 hops 200ms → 3 hops 2s → 4 hops 8s → 5 hops timeout

**Netflix example:**
- Tables: users, watch_history, movies, movie_actors, actors, ratings, genres (7 JOINs)
- Same latency staircase pattern

---

## Act 3: The Shortcut That Misses the Point (Failed Approach #2)

**Purpose:** Show that the fashionable approach (vector/semantic search) finds relevant-looking content but misses structural connections. High similarity scores mask the absence of real relationships.

**Required elements:**
- Retrieved chunks/documents with high similarity scores
- Missing connections (dashed lines with red X marks) between the chunks
- The key insight: "Similarity ≠ Connectivity"

**Visual specification:** Fragment diagram. 5 document cards floating in space with similarity scores (0.88-0.91). Dashed lines between cards marked with red X — connections that should exist but don't. An LLM brain icon at the bottom guessing at connections.

**Narrative beat:** Deception — "Looks right, but isn't." The scores look confident, but the structural knowledge is missing.

**Speaker delivery:** "Vector search finds text that *talks about* the same things. Cosine similarity: 0.91 — looks great. But look at the connections... [pause] ...there aren't any. The LLM has to *guess* how these pieces relate."

**Domain translation:** The retrieved documents change. The visual pattern (floating cards + missing connections + similarity scores) stays constant.

**Common mistakes:**
- Making vector search look useless: it's genuinely good at semantic retrieval. The failure is *specifically* on structural/relational queries.
- Similarity scores too low: scores like 0.3 wouldn't fool anyone. Use high scores (0.88-0.91) to show that *even good retrieval* misses connections.

**Pharma example:**
- Cards: Metformin text, renal impairment text, surveillance text, drug interaction text, biguanide mechanism text
- Scores: 0.91, 0.90, 0.90, 0.89, 0.88
- Missing: no INTERACTS_WITH, CONTRAINDICATED_FOR, or FLAGGED_IN links

**Netflix example:**
- Cards: Inception plot summary, Nolan filmography, DiCaprio biography, sci-fi genre description, user rating history
- Scores: 0.92, 0.91, 0.90, 0.89, 0.87
- Missing: no ACTED_IN, DIRECTED, or RATED links

---

## Act 4: The Expensive Guide (Failed Approach #3)

**Purpose:** Show that the sophisticated approach (agentic RAG / multi-step orchestration) works but costs too much and compounds errors. It's correct in theory but impractical at scale.

**Required elements:**
- A multi-step pipeline (5 steps) with accuracy loss at each step
- Compounding accuracy formula: 0.95^5 = 0.77
- Cost calculation with concrete dollar amounts
- The accuracy funnel narrowing from 100% to 77%

**Visual specification:** Pipeline + cost diagram. Top: 5 connected boxes with accuracy gauges and falling dollar signs. Bottom-left: accuracy funnel narrowing from 100% → 77%. Bottom-right: cost calculator box ($500-$2,500/day).

**Narrative beat:** Frustration — "There must be a better way." The approach works but the economics don't.

**Speaker delivery:** "Step 1: search — 95% accurate. Step 2: filter — 95% again. But 0.95 times 0.95 is 0.90. Five steps later? 0.77. And you're paying for five LLM calls per query. At a thousand queries a day, that's $500 to $2,500 daily."

**Domain translation:** The pipeline steps change (search/filter/cross-ref for data, review/validate/escalate for compliance). The cost/accuracy funnel pattern stays constant.

**Common mistakes:**
- Accuracy per step too low (< 90%): makes the approach look unreasonable. Use 95% — each step is individually excellent. The failure is in *compounding*.
- Missing the cost angle: accuracy degradation alone isn't enough. The dual failure (worse results AND more expensive) makes the argument.
- No concrete numbers: "$$$" is vague. "$500-$2,500/day" lands.

**Pharma example:**
- Pipeline: Search drugs → Filter interactions → Re-search contraindications → Cross-ref surveillance → Synthesize
- Same cost/accuracy numbers (0.95^5 = 0.77, $500-$2,500/day)

**Netflix example:**
- Pipeline: Search movies → Filter actors → Re-search ratings → Cross-ref genres → Synthesize
- Same cost/accuracy numbers

---

## Act 5: The Paradigm Shift

**Purpose:** Reframe the problem entirely. The previous three acts asked "how do I find the data?" The paradigm shift asks "what is this entity connected to?" This is the most important act — the "aha moment."

**Required elements:**
- Side-by-side comparison of all four approaches (including the solution)
- Each approach's core question in quotes
- The solution lane visually dominant (1.3x height of others)
- The key insight: "Relationships ARE the retrieval mechanism"

**Visual specification:** Four-lane comparison. Four horizontal swim lanes stacked vertically, each with a different background color. Each lane has: label, quoted question, and visual. The solution lane is 1.3x taller and visually brighter than the others.

**Narrative beat:** Revelation — "Just ask what's connected!" This is the dopamine hit. The entire failure cascade builds to this moment.

**Speaker delivery:** Long pause before this act. Read each approach's question slowly: "SQL asks: 'Which tables have my data?' Vector asks: 'What text looks similar?' Agent asks: 'What tool should I call next?'" Pause. "Graph asks: 'What is this entity CONNECTED to?'" Let the room react.

**Domain translation:** The questions in each lane translate. The four-lane comparison structure and the 1.3x height emphasis stay constant. This act is the most domain-specific — it must feel like a genuine reframe, not a rebranding.

**Common mistakes:**
- The reframe is incremental, not categorical: "Graph is faster" is not a paradigm shift. "Ask what's connected instead of what's similar" is.
- Solution lane isn't visually dominant: if all four lanes look the same, the shift doesn't register visually.
- Missing the key insight callout: "Relationships ARE the retrieval mechanism" must be explicitly stated.

**Pharma example:**
- SQL: "Which tables?" → 7 tangled JOINs
- Vector: "What text looks similar?" → floating cards, no links
- Agent: "What tool next?" → 5-step chain, $$$
- Graph: "What is Metformin CONNECTED to?" → Metformin → Drug X → Renal Impairment (3 hops, done)

**Netflix example:**
- SQL: "Which tables?" → 7 tangled JOINs
- Vector: "What text looks similar?" → floating cards, no links
- Agent: "What tool next?" → 5-step chain, $$$
- Graph: "What is Inception CONNECTED to?" → Inception → DiCaprio → Shutter Island (2 hops, done)

---

## Act 6: The Solution Architecture

**Purpose:** Show how the solution actually works as a concrete, implementable pipeline. Move from "why" to "how."

**Required elements:**
- A 3-step pipeline: Entity Recognition → Graph Traversal → LLM Synthesis
- Concrete details at each step (1 LLM call, <200ms traversal, audit trail)
- The domain-specific question flowing through the pipeline

**Visual specification:** Architecture diagram (left-to-right pipeline). Three large boxes connected by arrows. Step 1: question → entity extraction. Step 2: entity nodes traversing typed edges (largest box — this is the core). Step 3: subgraph → LLM → answer with citations.

**Narrative beat:** Clarity — "Now I see how it works." The audience transitions from understanding *why* to understanding *how*.

**Speaker delivery:** Walk through each step slowly: "Step 1: extract the entities from the question — that's one LLM call. Step 2: follow the typed edges in the graph — that's pure database traversal, under 200 milliseconds. Step 3: feed the subgraph to the LLM for natural language synthesis — one more call. Two LLM calls total, not five."

**Domain translation:** The entities and edges in Step 2 change entirely. The 3-step structure and performance claims stay constant.

**Common mistakes:**
- Architecture too complex: more than 3 steps overwhelms. Save implementation details for documentation.
- No concrete numbers: "<200ms" and "1 LLM call" are what make this credible, not abstract "fast" claims.
- Step 2 too small: the graph traversal is the core innovation — it should be the largest box.

**Pharma example:**
- Step 1: Extract "Metformin", "Renal Impairment", "Post-Market Surveillance" from question
- Step 2: Traverse INTERACTS_WITH → CONTRAINDICATED_FOR → FLAGGED_IN
- Step 3: Synthesize with citations

**Netflix example:**
- Step 1: Extract "Inception", "Christopher Nolan", "User #42" from question
- Step 2: Traverse ACTED_IN → DIRECTED → RATED (filter ≥ 4.0)
- Step 3: Synthesize recommendations with citation trail

---

## Act 7: The Honest Comparison

**Purpose:** Build trust by showing honest trade-offs. The solution is not perfect at everything — and acknowledging this makes the argument stronger, not weaker.

**Required elements:**
- 4-column comparison matrix (the 3 failed approaches + the solution)
- At least 5 comparison dimensions
- At least one yellow/red cell for the solution (honest weakness)
- Bottom note: "Trade-offs, not grades"

**Visual specification:** Grid / comparison matrix. 4 columns × 5 rows with color-coded cells (green check, yellow tilde, red X). The solution column has a subtle background highlight but is NOT all-green.

**Narrative beat:** Trust — "They're being honest about limits." This act converts skeptics.

**Speaker delivery:** "Let me be honest about trade-offs. Graph RAG wins on multi-hop traversal, latency, cost, and explainability. But look at schema flexibility — yellow, not green. You need to design an ontology upfront. That's real work."

**Domain translation:** This act is largely domain-agnostic. The comparison dimensions and cell values stay the same regardless of domain. Only the examples in tiny labels might change.

**Common mistakes:**
- All-green column: this destroys credibility instantly. Every approach has weaknesses.
- Too many dimensions: more than 6 rows causes information overload.
- Missing the "not grades" framing: this is about fit-for-purpose, not ranking.

**Both examples use identical matrix:**

| Dimension | SQL | Vector RAG | Agentic RAG | Graph RAG |
|-----------|-----|-----------|-------------|-----------|
| Multi-hop (3+) | Red (exponential) | Red (no connections) | Yellow (costly) | Green (native) |
| Latency | Yellow (OK 1-2 hops) | Green (fast retrieval) | Red (5+ calls) | Green (<200ms) |
| Cost per query | Green (cheap) | Green (1 LLM call) | Red ($$$) | Green (1 LLM call) |
| Explainability | Green (query plan) | Red (black box) | Yellow (chain visible) | Green (audit trail) |
| Schema flexibility | Red (rigid) | Green (schemaless) | Green (flexible tools) | **Yellow (needs ontology)** |

---

## Act 8: The Evidence

**Purpose:** Back up the argument with real benchmark data from published research. Move from logic to proof.

**Required elements:**
- 3 benchmark citations with exact numbers (not rounded, not paraphrased)
- Visual bar charts or comparison visuals for each
- An honest caveat (the solution isn't magic — quality matters)

**Visual specification:** Benchmark cards. 3 horizontal cards, each with title, bar chart visualization, key number, and source attribution. Below all cards: a caveat box with warning icon.

**Narrative beat:** Conviction — "The data backs it up." The audience moves from "I think this makes sense" to "I know this works."

**Speaker delivery:** Read the numbers slowly. Let them land. "Microsoft: 96 out of 96 comparisons, Graph RAG wins. Lettria: 90.6% versus 65.6% — that's 25 percentage points, human-evaluated. ArXiv: hybrid vector plus graph reaches 77.6%, beating either alone. [Pause] But here's the caveat..."

**Domain translation:** This act is fully domain-agnostic. The same benchmark numbers apply regardless of the domain being discussed.

**Common mistakes:**
- Rounding numbers: "about 90%" is less credible than "90.6%". Precision signals rigor.
- Skipping the caveat: "Only 65.8% of answer entities exist in auto-constructed graphs" is the most important sentence. It shows the bottleneck and sets up Act 11's implementation guidance.
- Misattributing sources: cite the actual papers, not blog summaries.

**Benchmark data (used in both examples):**
1. Microsoft LazyGraphRAG: 96/96 wins vs naive RAG, 5,590 articles (2024)
2. Lettria: Graph 90.6% vs Vector 65.6%, +25pp, human-evaluated (2024)
3. arXiv Hybrid: Vector 65.8%, Graph 71.2%, Hybrid 77.6%, +12pp (2024)
4. Caveat: only 65.8% of entities found in auto-constructed graphs

---

## Act 9: The Industry Grid

**Purpose:** Show that the pattern generalizes beyond the running example. The audience recognizes their own domain in one of the cells.

**Required elements:**
- 2×3 grid with 5 domain-specific mini knowledge graphs + 1 summary cell
- Each mini-graph uses domain-specific entity names and relationship labels (not generic)
- A summary cell showing the universal pattern: "Entities + Typed Edges + Multi-hop Traversal"

**Visual specification:** Grid (2×3 industry). Each cell has: industry label, 4-5 domain-specific nodes, 2-3 labeled edges showing a traversal pattern. The 6th cell summarizes the pattern.

**Narrative beat:** Recognition — "This applies to my domain too." The audience starts mentally translating.

**Speaker delivery:** Don't explain every cell. Hit 2-3 that match the audience demographic, then gesture at the pattern: "Drug discovery, fraud detection, enterprise knowledge, legal research, financial risk — different entities, different edges, same pattern. Entities plus typed edges plus multi-hop traversal."

**Domain translation:** This act is domain-agnostic — it shows the same pattern across ALL domains. The five industries in the grid might shift to match the audience, but the structure stays constant.

**Common mistakes:**
- Generic labels: "Entity A → Entity B" is invisible. "Corp → Sub A → Sub B → Shell Co (OWNS, 30%)" tells a story.
- Too many nodes per cell: each mini-graph should have 4-5 nodes max. Complexity belongs in the full architecture, not here.
- Missing the summary cell: without it, the audience sees five examples but doesn't extract the pattern.

**Industries used in both examples:**
1. Drug Discovery: Drug → Protein → Pathway → Side Effect (TARGETS, INHIBITS, CAUSES)
2. Fraud Detection: Acct A → Acct B → Acct C → Acct D (TRANSFERS_TO cycle)
3. Enterprise Knowledge: Alice → Project X → Skill: ML → Design Doc (WORKS_ON, REQUIRES, DOCUMENTED_IN)
4. Legal Research: Case A → Case B → Case C (CITES, with "overturned" annotation)
5. Financial Risk: Corp → Sub A → Sub B → Shell Co (OWNS, 100%/51%/30%)
6. Summary: "Entities + Typed Edges + Multi-hop Traversal = Every industry above"

---

## Act 10: The Decision Framework

**Purpose:** Empower the audience to choose the right tool for their problem. Replace "Graph RAG is always better" with "here's how to decide."

**Required elements:**
- A decision flowchart starting with "What kind of question?"
- 4 branches, one per approach, each with its sweet spot
- A convergence point showing hybrid (vector + graph) as the best-of-both option
- Bottom note: "They complement, not compete"

**Visual specification:** Decision flowchart. Top-down branching from a central decision node. Four branches lead to four colored boxes (one per approach). Vector and Graph branches converge into a Hybrid box at the bottom.

**Narrative beat:** Empowerment — "I know how to decide." The audience has a mental model for tool selection.

**Speaker delivery:** Walk through each branch with a question type: "Aggregations and transactions? SQL. Semantic search and single-entity lookup? Vector. Actions and orchestration? Agent. Multi-hop relationships and explainability? Graph. And the best part — vector and graph converge into hybrid for the best benchmark results."

**Domain translation:** This act is domain-agnostic. The decision criteria stay the same regardless of domain. Only the convergence point example might use domain-specific framing.

**Common mistakes:**
- Missing the convergence: without the hybrid box, the flowchart implies mutual exclusion. The benchmark evidence (Act 8) already showed hybrid wins.
- Decision criteria too vague: "complex questions" doesn't help. "3+ hops with explainability requirement" does.
- Forgetting to affirm SQL: the audience uses SQL daily. The flowchart must validate that SQL is the right choice for its sweet spot.

---

## Act 11: The Action Plan

**Purpose:** Give the audience concrete, achievable next steps. Convert understanding into action.

**Required elements:**
- 4 numbered steps (not 3, not 5 — 4 is the sweet spot for actionability)
- Each step has a clear deliverable, not just a concept
- A connecting thread between steps showing progression

**Visual specification:** Workflow (4-step horizontal roadmap). Four numbered boxes connected by a dotted arrow with labels between steps (Define → Build → Test). Each box has: number, title, visual, and one-sentence deliverable.

**Narrative beat:** Motivation — "I can start tomorrow." The audience leaves with a plan.

**Speaker delivery:** "Step 1: Find your question. If your SQL has four or more JOINs, you have a graph question. Step 2: Model the domain. Nouns become nodes, verbs become edges. Step 3: Choose your stack — Neo4j or Kuzu for the database, LangChain or LlamaIndex for orchestration. Step 4: Measure the delta — 50 questions, same test set, before and after."

**Domain translation:** The specific tools and examples in each step change. The 4-step structure and the progression logic stay constant.

**Common mistakes:**
- Too abstract: "Design an ontology" is a concept. "Map nouns to nodes and verbs to edges for your top-5 entity types" is a step.
- Too many steps: more than 4 overwhelms. Each step should take roughly one work session.
- Missing the measurement step: without Step 4, there's no way to know if the effort was worthwhile.

**Pharma example steps:**
1. Find your question (look for 4+ JOIN queries in your drug interaction pipeline)
2. Model the domain (Drug, Protein, Condition, Surveillance → TARGETS, INHIBITS, CONTRAINDICATED_FOR)
3. Choose your stack (Neo4j + LangChain + FDA data pipeline)
4. Measure the delta (50 pharmacovigilance queries, accuracy before/after)

**Netflix example steps:**
1. Find your question (look for 4+ JOIN queries in recommendation engine)
2. Model the domain (Movie, Person, Genre, User → DIRECTED, ACTED_IN, IN_GENRE, RATED)
3. Choose your stack (Neo4j + LlamaIndex + content metadata pipeline)
4. Measure the delta (50 recommendation queries, relevance before/after)

---

## Act 12: The Thread That Connects Everything

**Purpose:** Close the narrative loop by returning to Act 1's question and showing it was answerable as a graph traversal all along. This is the most powerful retrieval practice moment.

**Required elements:**
- The exact question from Act 1, repeated word-for-word
- The question's entities highlighted and connected to graph nodes
- 3 summary statistics (from Act 8 benchmarks)
- The closing insight: "Your data already knows the answer"

**Visual specification:** Stat circles + callback. Top half: three large circles in an inverted triangle with key stats (+12pp, <1s, 100% audit trail). Center: a mini knowledge graph echoing Act 1. Bottom half: Act 1's question with entities highlighted and connected to the graph.

**Narrative beat:** Resolution — "It all comes together." Narrative closure signals schema completion.

**Speaker delivery:** Re-read the original question from Act 1. Pause. "We've seen SQL try to answer this with seven JOINs. We've seen vector search find similar text but miss the connections. We've seen agents chain five calls and still only reach 77% accuracy. [Pause] The answer was one traversal away."

**Domain translation:** The callback question and entities change (they match Act 1). The stat circles and visual structure stay constant.

**Common mistakes:**
- Different question than Act 1: the callback MUST be word-for-word identical. Any change breaks the narrative loop.
- No visual connection between question entities and graph nodes: the dashed lines linking entities to nodes are what make the callback visual, not just textual.
- Forgetting the stats: the stats anchor the emotional resolution in evidence, preventing it from feeling like empty rhetoric.

**Pharma example:**
- Question callback: "Which drugs interact with Metformin AND are contraindicated for renal patients flagged in post-market surveillance?"
- Entities highlighted: Metformin (green), renal patients (pink), surveillance (purple)
- Stats: +12pp hybrid accuracy, <1s traversal, 100% audit trail

**Netflix example:**
- Question callback: "Movies similar to Inception, by Nolan actors, rated 4+ by similar users?"
- Entities highlighted: Inception (green), Nolan actors (pink), similar users (purple)
- Stats: +12pp hybrid accuracy, <1s traversal, 100% audit trail
