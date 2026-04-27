---
name: technical-storybook
description: Design and generate 12-act narrative storyboards that explain technical concepts through contrastive argumentation. Teaches the methodology AND generates domain-specific storyboards on demand. Use when user says "create a storybook", "explain using storybook method", "technical storybook", "narrative explanation", "12-act explanation", "storyboard for", "argue why X beats Y", or "/technical-storybook". Style-agnostic — pairs with /crayon-illustration, /finserv-illustration, /healthcare-illustration, or plain text.
metadata:
  author: maheshbabugorantla
  version: 1.0.0
  pairs-with: crayon-illustration, finserv-illustration, healthcare-illustration
allowed-tools:
  - Read
  - Write
  - WebFetch
  - WebSearch
---

# Technical Storybook

A methodology for building 12-act narrative storyboards that argue for a technical approach by showing why alternatives fail first. Grounded in learning science, tested across pharmaceutical and entertainment domains.

---

## 1. Philosophy

Four principles govern every storyboard. Violating any one produces a weaker result.

**Argue through failure, not assertion.** Show why alternatives fail before presenting the solution. The failure cascade (Acts 2-4) creates cognitive space for the paradigm shift (Act 5). Without the valley, the peak has no height. Contrastive learning produces stronger category boundaries than positive examples alone (Gentner & Markman, 1997). See [references/pedagogy.md](references/pedagogy.md) for the full theoretical grounding.

**Honesty builds trust.** Act 7's trade-off matrix must have honest weaknesses for the proposed solution. All-green cells destroy credibility. The audience knows no technology is perfect — showing that you know it too converts skeptics into allies. One genuine yellow cell builds more trust than five green cells.

**One concept per act, one visual per act.** Working memory handles 4±1 chunks simultaneously (Sweller, 1988). Each act introduces exactly one new idea and pairs it with exactly one visual that encodes the same concept in a different modality (Paivio, 1971). The visual must pass the concreteness test: "Could someone who knows nothing about this domain understand the visual without reading the text?"

**The question is the character.** Act 1's question is the protagonist of the story. Every act tries to answer it. Act 12 resolves it. If the question doesn't feel like it matters, no amount of evidence or architecture will save the storyboard. The question must sound deceptively simple — the kind of thing someone would ask casually, not realizing it requires multi-hop reasoning.

---

## 2. The 12-Act Arc

The storyboard follows a dramatic structure mapped to Bloom's Revised Taxonomy and an emotional arc that primes cognitive engagement at each phase.

### Phase-to-Act Mapping

| Phase | Acts | Bloom's Level | Emotional Beat |
|-------|------|---------------|----------------|
| Setup | 1 | Remember | Curiosity |
| Failure Cascade | 2-4 | Understand | Frustration |
| Paradigm Shift | 5-6 | Analyze | Revelation |
| Evaluation | 7-8 | Evaluate | Trust |
| Generalization | 9-10 | Apply | Confidence |
| Action | 11-12 | Create | Resolve |

### Act Summaries

**Act 1 — The Deceptively Simple Question.** Hook the audience with a question containing 3 entities, 2 constraints, and 1 filter. The question sounds simple but requires multi-hop reasoning. Visual: concept diagram with mini knowledge graph. Emotional target: curiosity. Common mistake: question too complex (save complexity for later) or too simple (no story to tell).

**Act 2 — The Brute Force Path (Failed Approach #1).** Show the audience's instinctive first approach failing at scale. Visual: split panel with complexity tower and exponential latency staircase. Emotional target: overwhelm. Common mistake: disrespecting the approach — the audience uses it daily. Show it failing *specifically* on multi-hop queries.

**Act 3 — The Shortcut (Failed Approach #2).** Show the fashionable approach finding relevant-looking content but missing structural connections. Visual: fragment diagram with floating cards, high similarity scores, and broken connection lines. Emotional target: deception. Common mistake: similarity scores too low — use high scores (0.88-0.91) to show that even good retrieval misses connections.

**Act 4 — The Expensive Guide (Failed Approach #3).** Show the sophisticated approach working but costing too much with compounding errors. Visual: pipeline diagram with accuracy funnel (0.95^5 = 0.77) and cost calculator. Emotional target: frustration. Common mistake: accuracy per step too low — use 95% to show the failure is in compounding, not individual steps.

**Act 5 — The Paradigm Shift.** Reframe the problem categorically. The previous acts asked the wrong *type* of question. Visual: four-lane comparison with the solution lane 1.3x taller. Must include the key insight: "Relationships ARE the retrieval mechanism." Emotional target: revelation. Common mistake: incremental reframe ("faster") instead of categorical reframe ("different question entirely").

**Act 6 — The Solution Architecture.** Show how the solution works as a concrete 3-step pipeline. Visual: left-to-right architecture with the middle step (traversal/core innovation) as the largest box. Include concrete performance claims. Emotional target: clarity. Common mistake: more than 3 steps (save details for documentation).

**Act 7 — The Honest Comparison.** Build trust with a trade-off matrix. At least one yellow/red cell for the solution. Visual: 4-column × 5-row comparison grid. Bottom note: "Trade-offs, not grades." Emotional target: trust. Common mistake: all-green solution column.

**Act 8 — The Evidence.** Back the argument with real benchmark data. Visual: 3 benchmark cards with bar charts and exact numbers. Include an honest caveat. Emotional target: conviction. Common mistake: rounding numbers — "90.6%" is more credible than "about 90%."

**Act 9 — The Industry Grid.** Show the pattern generalizes across domains. Visual: 2×3 grid with 5 domain-specific mini knowledge graphs and 1 summary cell. Emotional target: recognition. Common mistake: generic labels — use domain-specific entity names and relationship types.

**Act 10 — The Decision Framework.** Empower the audience to choose the right tool. Visual: decision flowchart with branches per approach and a convergence point. Bottom note: "They complement, not compete." Emotional target: empowerment. Common mistake: missing the convergence — hybrid approaches often win.

**Act 11 — The Action Plan.** Give concrete next steps. Visual: 4-step horizontal roadmap. Each step has a deliverable, not just a concept. Emotional target: motivation. Common mistake: too abstract — "design an ontology" vs "map nouns to nodes and verbs to edges."

**Act 12 — The Callback.** Return to Act 1's question word-for-word. Show it was answerable all along. Visual: stat circles (from Act 8) plus the original question with entities highlighted and connected to graph nodes. Emotional target: resolution. Common mistake: different question text than Act 1.

For detailed specifications including required elements, visual layouts, speaker delivery notes, and worked examples for each act, see [references/act-by-act-guide.md](references/act-by-act-guide.md).

---

## 3. Domain Translation Method

A storyboard built for one domain can be adapted to another by filling in a 13-slot translation table and rewriting 7 of the 12 acts.

### The 13-Slot Translation Table

Fill in each slot with domain-specific content:

| # | Slot | Requirements | Example (Pharma) | Example (Netflix) |
|---|------|-------------|-------------------|-------------------|
| 1 | Opening question | 3 entities, 2 constraints, 1 filter | "Which drugs interact with Metformin AND are contraindicated for renal patients flagged in post-market surveillance?" | "Movies similar to Inception, by Nolan actors, rated 4+ by similar users?" |
| 2 | Entity types | 3-4 node labels | Drug, Condition, Surveillance | Movie, Person, Genre, User |
| 3 | Relationship types | 3-5 edge labels | INTERACTS_WITH, CONTRAINDICATED_FOR, FLAGGED_IN | DIRECTED, ACTED_IN, IN_GENRE, RATED |
| 4 | Failed approach #1 | The audience's instinct | SQL with 7 JOINs across drug/interaction tables | SQL with 7 JOINs across movie/actor tables |
| 5 | Failed approach #2 | The fashionable alternative | Vector search on pharma text chunks | Vector search on movie/actor text |
| 6 | Failed approach #3 | The sophisticated option | 5-step agent pipeline (search, filter, re-search, cross-ref, synthesize) | Same pipeline pattern |
| 7 | Paradigm reframe | Categorical, not incremental | "What is Metformin CONNECTED to?" | "What is Inception CONNECTED to?" |
| 8 | 3-step pipeline | Entity extraction → core traversal → synthesis | Extract drug/condition entities → traverse interaction/contraindication edges → synthesize | Extract movie/person entities → traverse ACTED_IN/DIRECTED edges → synthesize |
| 9 | Trade-off weakness | Honest limitation | Requires ontology design for drug domain | Requires ontology design for movie domain |
| 10 | Benchmark numbers | From published research | Microsoft 96/96, Lettria +25pp, arXiv +12pp | Same (domain-agnostic) |
| 11 | Industry examples | 5 domains for the grid | Drug discovery, fraud, enterprise, legal, financial | Same (domain-agnostic) |
| 12 | Implementation steps | 4 concrete actions | Find 4+ JOIN queries, model drug ontology, choose Neo4j + LangChain, measure accuracy | Find 4+ JOIN queries, model movie ontology, choose Neo4j + LlamaIndex, measure relevance |
| 13 | Closing stat callback | Connects to opening question | Pharmacist's question answered as traversal | Viewer's question answered as traversal |

### Domain-Agnostic vs Domain-Specific Acts

- **Domain-agnostic (reuse as-is):** Acts 4, 7, 8, 9, 10 — these use the same structural arguments, benchmark data, industry examples, and decision framework regardless of domain.
- **Domain-specific (translate using the table above):** Acts 1, 2, 3, 5, 6, 11, 12 — these reference the specific question, entities, relationships, and implementation details of the target domain.

### The Concreteness Test

For every visual in every act, ask: "Could someone who knows nothing about this domain understand the visual without reading the text?"

- Act 2: Can they see the tower wobbling and the staircase exploding? Yes — even without knowing what "JOINs" are.
- Act 7: Can they see a grid with mostly-green and some-yellow cells? Yes — the color coding is universal.
- Act 12: Can they see large numbers and a callback to an earlier image? Yes — the visual structure communicates closure.

If any visual fails this test, it's too abstract. Make it more concrete.

For complete validation criteria, see the checklist in [references/examples.md](references/examples.md).

---

## 4. Generation Workflow

When invoked, follow these 6 steps:

### Step 1: Consulting Discovery

#### 1a. Domain Research (run before asking any questions)

Parse the user's request to identify the concept being argued for, then fetch to build a factual foundation — do not skip this even if the user seems expert:

1. **Fetch the concept's authoritative source** — search for the primary paper, documentation page, or canonical blog post that defines the concept and its value proposition.
2. **Fetch the competitive landscape** — search for "[concept] vs alternatives" comparisons. Look for benchmark data, tradeoff articles, and practitioner adoption stories.
3. **Classify the primary domain** — assign one primary domain: `data-infrastructure`, `ml-ai`, `distributed-systems`, `devops-platform`, `security`, `database`, `organizational`, or `other`. Note if it spans two.
4. **Inventory standard competing approaches** — from what you fetched, identify the 2–4 alternatives the target audience most commonly reaches for first. Rank them by how instinctive each is to a practitioner who hasn't encountered the proposed concept yet.
5. **Flag any ambiguity** — note if the concept has meaningfully different interpretations (e.g., "microservices" could be framed as infrastructure, team topology, or API design). Surface at most two candidate framings.

#### 1b. Domain Hypothesis (present before asking questions)

Synthesize your research into a one-paragraph framing and present it to the user for confirmation. Use this structure:

> "From what I found, **[concept]** is a **[domain]** approach whose core argument is **[value proposition in one sentence]**. The most common competing approaches your audience is likely to try first are **[alternatives in ranked order]**. This storyboard would typically target **[audience type]** — practitioners who already know **[assumed knowledge]** but haven't yet seen why **[concept]** handles **[specific failure mode]** differently.
>
> Does this framing match your intent? Is there a specific use case, industry, or deployment context you want to center on?"

If ambiguity was detected in 1a, present the candidate framings and ask which one to pursue before continuing. Do not proceed to 1c until the domain is confirmed.

#### 1c. Consulting Qualification (ask before generating anything)

Once the domain is confirmed, work through these four discovery questions in sequence. If the user already provided the information upfront, extract it and skip that question — but do not skip a question where the answer would materially change the storyboard:

---

**Q1 — Domain expertise: What is your relationship to [concept]?**

> (a) **Practitioner** — I've deployed this in production and have first-hand results  
> (b) **Technical advocate** — I've evaluated it thoroughly and need to convince peers or leadership  
> (c) **Informed learner** — I understand it conceptually and want to help others articulate it  

_Why it matters:_ Determines depth of Acts 2–4 (how technically precise the failure analysis must be), the specificity of Act 7 (trade-off matrix), and whether to include hedging language vs. confident assertion throughout. A Practitioner's storyboard should have sharper failure descriptions and more specific failure numbers. An Informed Learner's storyboard needs more foundational setup before the frustration arc begins.

---

**Q2 — Audience calibration: Describe your target audience.**

Ask: "What do they know well going in, and what will they be most skeptical about?"

_Why it matters:_ Determines which failure modes (Acts 2–4) land hardest — a DBA audience will feel Act 2's SQL JOIN tower differently than a data scientist who barely writes SQL. Also shapes which analogies work in Acts 5–6 and how much background to build in Act 1 before beginning the frustration arc.

---

**Q3 — Evidence inventory: What specific evidence can you contribute?**

Ask the user to select all that apply:

> (a) Production benchmark numbers with context (latency, cost, accuracy delta)  
> (b) Published paper or case study citations  
> (c) A/B test results or controlled comparisons  
> (d) War stories / lessons-learned anecdotes  
> (e) None — synthesize from research I've already done  

_Why it matters:_ Shapes Act 8 (The Evidence). User-supplied numbers always produce stronger storyboards than synthesized benchmarks because they carry authenticity the audience can verify. If the user selects (e), do an additional web fetch specifically for benchmark data before building Act 8.

---

**Q4 — Competing approaches: Confirm the failure sequence.**

Present the alternatives you ranked in step 1a and ask: "Which of these will your audience have actually tried or be most tempted by, and in what order? The first alternative becomes Act 2 (the brute-force instinct), the second Act 3 (the fashionable shortcut), and the third Act 4 (the expensive guide that almost works)."

The order matters: Act 2 should be the most obvious first instinct (usually the simplest approach), Act 3 the currently fashionable alternative that seems to solve the problem but misses something structural, and Act 4 the sophisticated approach that works but at unsustainable cost or complexity.

---

After all four questions are answered and confirmed, proceed to Step 2.

If the user provides all context upfront (e.g., "create a storybook explaining why event sourcing beats CRUD for audit-heavy systems targeting senior engineers who already use Postgres"), still run 1a and 1b to validate your understanding, then skip any 1c questions already answered.

### Step 2: Question Design

Craft the Act 1 question collaboratively. Validate against these criteria:

- Contains exactly 3 entities (named, specific)
- Contains exactly 2 constraints (relationship types or conditions)
- Contains exactly 1 filter (temporal, numerical, or categorical)
- Sounds simple when read aloud
- Actually requires multi-hop reasoning to answer
- Uses domain terminology the target audience recognizes

Present the question to the user for approval before proceeding.

### Step 3: Translation Table

Fill all 13 slots of the translation table (Section 3) with domain-specific content. Present to the user for review. This is the blueprint for the entire storyboard.

### Step 4: Generate 12-Act Outline

For each act, produce:

- **Title** — short, evocative (e.g., "The Brute Force Path", "The Thread Was Always There")
- **Chapter subtitle** — one sentence describing the act's argument
- **Key insight** — the single idea the audience should retain
- **Visual description** — layout type, key elements, color assignments
- **Narrative beat** — the audience's emotional state at the end of this act
- **Speaker note** — 2-3 sentences of delivery guidance (pacing, pauses, emphasis)

Use the act-by-act guide in [references/act-by-act-guide.md](references/act-by-act-guide.md) for detailed specifications.

### Step 5: Visual Generation (Optional)

If the user wants illustrations, generate 12 image prompts compatible with any illustration style skill:

- `/crayon-illustration` — hand-drawn crayon style, children's book feel
- `/finserv-illustration` — flat design, consulting-quality infographics
- `/healthcare-illustration` — clinical precision, medical journal quality
- `/saas-illustration` — dark mode, glass morphism, modern tech feel

Each prompt follows the illustration skill's format and references the visual specification from Step 4. Include a CONTEXT.md companion document (see `references/examples.md` Section 2 for a worked example of its structure and contents) that provides narrative arc, domain model, visual consistency rules, and cross-image checklist.

### Step 6: Review

Validate the complete storyboard against:

1. The concreteness test (Section 3) for all 12 visuals
2. The domain translation checklist in [references/examples.md](references/examples.md)
3. The emotional arc progression: Curiosity → Overwhelm → Deception → Frustration → Revelation → Clarity → Trust → Conviction → Recognition → Empowerment → Motivation → Resolution

---

## 5. Illustration Pairing

Each act maps to a specific visual type. The mapping is style-agnostic — it works with any `/[style]-illustration` skill.

| Act | Visual Type | Key Elements | Emotional Tone |
|-----|-----------|-------------|----------------|
| 1 | concept diagram | Mini knowledge graph on whiteboard, character at 1/10 scale, 3/2/1 checkboxes | Curious, inviting |
| 2 | split panel | Complexity tower (wobbly) + exponential staircase with concrete numbers | Overwhelming, alarming |
| 3 | fragment diagram | Floating cards with similarity scores + missing-link markers (red X) | Deceptively confident |
| 4 | pipeline + cost | 5-step pipeline + accuracy funnel (100% → 77%) + cost calculator box | Expensive, diminishing |
| 5 | four-lane comparison | Swim lanes per approach, solution lane 1.3x height, key insight callout | Revelatory, clean |
| 6 | architecture (3-step) | Left-to-right pipeline, middle step largest, domain entities flowing through | Clear, architectural |
| 7 | grid (comparison matrix) | 4-col × 5-row, color-coded cells, honest yellow/red for solution | Analytical, trustworthy |
| 8 | benchmark cards | 3 horizontal cards with bar charts, exact numbers, caveat box at bottom | Evidence-based, rigorous |
| 9 | grid (2×3 industry) | 5 mini domain graphs with specific entity names + 1 summary cell | Pattern-recognizing |
| 10 | decision flowchart | Top-down branching, 4 approach boxes, convergence to hybrid at bottom | Empowering, practical |
| 11 | workflow (4-step) | Horizontal roadmap with numbered steps, connecting arrow, deliverables | Motivating, actionable |
| 12 | stat circles + callback | Inverted triangle of 3 stat circles + Act 1 question with entity highlights | Resolving, confident |

When generating illustration prompts, always include:
- The visual type from this table
- The emotional tone as a mood directive
- Domain-specific entity names and relationship labels (not generic)
- Cross-reference to the CONTEXT.md for visual consistency

---

## 6. Examples

### Example 1: Event Sourcing vs CRUD

**User request:** "Create a storybook explaining why event sourcing beats CRUD for audit-heavy systems"

**Intake extraction:**
- Concept: Event sourcing
- Domain: Financial audit systems
- Competitors: CRUD with audit tables, change data capture (CDC), manual audit logs

**Question design:** "Which trades modified portfolio P-2847, triggered compliance alerts, AND were later reversed during the Q3 audit window?"
- 3 entities: Portfolio P-2847, compliance alerts, Q3 audit window
- 2 constraints: modified (TRADE_MODIFIED), triggered (TRIGGERED_ALERT)
- 1 filter: reversed during Q3 (temporal)

**Translation highlights:**
- Failed #1 (CRUD): UPDATE overwrites previous state — the audit trail is gone
- Failed #2 (CDC): Captures changes but not intent — "why" is missing
- Failed #3 (manual audit log): Expensive to maintain, drifts from reality, accuracy compounds
- Paradigm reframe: "What HAPPENED to this entity?" instead of "What IS this entity?"
- Architecture: Event capture → Event store replay → Projection synthesis
- Honest weakness: Event store requires eventual consistency mindset — not all teams are ready

### Example 2: Adapting Graph RAG for Cybersecurity

**User request:** "Adapt the Graph RAG storyboard for cybersecurity threat intelligence"

**Approach:** Start from the pharma storyboard. Identify reusable acts, translate domain-specific acts.

**Reusable acts (as-is):** 4 (accuracy funnel), 7 (trade-off matrix), 8 (benchmarks), 9 (industry grid), 10 (decision flowchart)

**Translated acts:**
- Act 1 question: "Which threat actors targeting our financial sector clients also exploit CVE-2024-1234 AND overlap with APT groups flagged by CISA?"
- Entities: Threat actor, CVE-2024-1234, CISA advisory
- Relationships: TARGETS, EXPLOITS, ATTRIBUTED_TO
- Act 2: SQL JOINs across threat feeds, CVE databases, attribution tables
- Act 3: Vector search finds similar threat reports but misses EXPLOITS and ATTRIBUTED_TO connections
- Act 5: "What is this threat actor CONNECTED to?" — 3 hops through exploit → CVE → advisory
- Act 6: Extract threat entities → Traverse TARGETS/EXPLOITS/ATTRIBUTED_TO → Synthesize intelligence report
- Act 11: Find your question (4+ JOIN threat queries), model STIX ontology, choose Neo4j + threat feed pipeline, measure analyst time savings
- Act 12: Callback to Act 1 — the threat intelligence question answered as graph traversal

---

## 7. Troubleshooting

**Question too complex.** If Act 1's question has more than 3 entities, simplify. Move additional entities to the traversal path in Act 6 — they'll appear naturally during the architecture walkthrough. The opening question must sound simple enough that the audience underestimates it.

**Failure cascade feels forced.** Each failed approach in Acts 2-4 must be one the target audience has actually tried or seriously considered. If your audience has never used vector search, Act 3 won't resonate — replace it with a failure mode they recognize. The cascade works through recognition, not education.

**Act 5 doesn't feel like a paradigm shift.** Test: does the reframe change the *type* of question being asked, or just the *speed/cost* of the answer? "Our approach is faster" is an improvement claim. "Ask what's connected instead of what's similar" is a paradigm shift. The four-lane comparison in Act 5 should make the categorical difference visible — different questions, not just different answers.

**Trade-off matrix all green.** If you genuinely cannot find a weakness in the proposed solution, you don't understand it well enough yet. Every technology has constraints: schema rigidity, operational complexity, learning curve, ecosystem maturity, cold-start problems. Find the real one and show it. One honest yellow cell is worth more than five green cells.

**Industry grid looks generic.** Replace "Entity A → Entity B" with domain-specific names: "Corp → Sub A → Sub B → Shell Co (OWNS, 30%)" tells a story. Each mini-graph should use real entity types and relationship labels from that industry. If you can't name specific entities, research the domain before generating the act.
