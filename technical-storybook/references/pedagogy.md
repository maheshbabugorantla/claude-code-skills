# Learning Science Foundations

This document grounds the 12-act technical storybook methodology in established learning science. Each theory maps to specific acts and explains what breaks when violated.

---

## 1. Bloom's Revised Taxonomy

**Citation:** L. W. Anderson and D. R. Krathwohl, Eds., *A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives*, Complete ed. New York, NY, USA: Longman, 2001.

**Core claim:** Learning progresses through six cognitive levels: Remember, Understand, Analyze, Apply, Evaluate, Create. Higher levels require mastery of lower ones.

**Mapping to acts:**

| Bloom's Level | Acts | What the Audience Does |
|---------------|------|----------------------|
| Remember | 1 | Recall the opening question |
| Understand | 2-4 | Comprehend why each failed approach falls short |
| Analyze | 5-6 | Break down the paradigm shift and new architecture |
| Evaluate | 7-8 | Judge trade-offs and weigh evidence |
| Apply | 9-10 | Transfer the pattern to their own domain |
| Create | 11-12 | Plan their own implementation |

**What breaks if violated:** Jumping from Act 1 (Remember) directly to Act 6 (Analyze) — showing the architecture without first establishing why alternatives fail — leaves the audience without the cognitive scaffolding to understand *why* the solution works. They can memorize the pipeline but cannot evaluate when to use it.

---

## 2. Cognitive Load Theory

**Citation:** J. Sweller, "Cognitive load during problem solving: Effects on learning," *Cognitive Science*, vol. 12, no. 2, pp. 257–285, 1988.

**Core claim:** Working memory handles 4±1 chunks simultaneously. Extraneous cognitive load (irrelevant complexity) competes with germane load (schema construction). Instructional design must minimize extraneous load.

**Mapping to acts:** The one-concept-per-act rule directly implements Sweller's principle. Each act introduces exactly one new idea:

- Act 1: One question
- Act 2: One failed approach (SQL)
- Act 3: One failed approach (Vector RAG)
- Act 4: One failed approach (Agentic RAG)
- Act 5: One reframe (the paradigm shift)
- Act 6: One architecture (3-step pipeline)

**What breaks if violated:** Combining Acts 2-4 into a single "comparison" slide forces the audience to hold three new approaches in working memory simultaneously. They process none of them deeply. The failure cascade must be sequential — each failure adds exactly one chunk to the audience's schema before the next arrives.

---

## 3. Dual Coding Theory

**Citation:** A. Paivio, *Imagery and Verbal Processes*. New York, NY, USA: Holt, Rinehart & Winston, 1971.

**Core claim:** Information encoded both verbally and visually is retained and recalled significantly better than information encoded in only one modality. The verbal and visual systems are independent but interconnected.

**Mapping to acts:** Every act has both a narrative text (verbal channel) and an illustration (visual channel). The illustration is not decorative — it encodes the same concept in a different modality:

- Act 2 verbal: "SQL requires 7 JOINs that scale exponentially"
- Act 2 visual: A staircase of tables getting exponentially taller

The **concreteness test** enforces dual coding: "Could someone who knows nothing about this domain understand the visual without reading the text?" If yes, the visual carries independent meaning.

**What breaks if violated:** Text-only acts (no visual) or decorative visuals (clip art that doesn't encode the concept) reduce retention by roughly 40% compared to properly dual-coded content, per Paivio's experimental findings.

---

## 4. Scaffolding and the Zone of Proximal Development

**Citation:** J. S. Bruner, "On knowing: Essays for the left hand," in *Toward a Theory of Instruction*. Cambridge, MA, USA: Harvard Univ. Press, 1966; L. S. Vygotsky, *Mind in Society: The Development of Higher Psychological Processes*. Cambridge, MA, USA: Harvard Univ. Press, 1978.

**Core claim:** Learners can solve problems slightly beyond their current ability with structured support (scaffolding). The "zone of proximal development" (ZPD) is the gap between what a learner can do alone and what they can do with guidance.

**Mapping to acts:** The failure cascade (Acts 2-4) scaffolds the paradigm shift (Act 5) by establishing what the audience already knows:

- Act 2 starts in their comfort zone (SQL — they know this)
- Act 3 extends to something they've heard of (Vector RAG)
- Act 4 pushes slightly further (Agentic RAG — newer concept)
- Act 5 arrives at the ZPD: they couldn't have reached "ask what's connected" on their own, but after seeing three failures, the scaffold is in place

**What breaks if violated:** Presenting Graph RAG first (no scaffold) places the concept outside the ZPD. The audience lacks the contrast needed to appreciate *why* following connections matters. They hear the words but don't internalize the insight.

---

## 5. Narrative Transportation Theory

**Citation:** M. C. Green and T. C. Brock, "The role of transportation in the persuasiveness of public narratives," *J. Personality and Social Psychology*, vol. 79, no. 5, pp. 701–721, 2000.

**Core claim:** When audiences are "transported" into a narrative, they process information with less resistance and form more persistent beliefs. Transportation requires: identifiable characters, a causal plot, and emotional engagement.

**Mapping to acts:** The 12-act arc provides all three transportation elements:

- **Character:** Act 1's question is the protagonist. The pharmacist/viewer asking the question is the stand-in for the audience.
- **Causal plot:** Each act causally follows the previous. Act 2 fails *because* of structural limitations, which motivates Act 3's attempt, which fails *because* of different limitations, and so on.
- **Emotional engagement:** The emotional arc (curiosity → frustration → revelation → confidence → resolve) keeps the audience invested in the outcome.

**What breaks if violated:** Presenting the same 12 concepts as a flat list (no narrative thread) eliminates transportation. The audience evaluates each claim critically in isolation rather than following the story to its conclusion. Persuasion drops significantly.

---

## 6. Contrastive Learning and Structure Mapping

**Citation:** D. Gentner and A. B. Markman, "Structure mapping in analogy and similarity," *American Psychologist*, vol. 52, no. 1, pp. 45–56, 1997.

**Core claim:** Humans learn category boundaries more effectively by comparing contrasting examples than by studying positive examples alone. Structure mapping — aligning the relational structure of two domains — enables analogical transfer.

**Mapping to acts:** The failure cascade (Acts 2-4) is pure contrastive learning. Each act presents a plausible approach that fails in a *specific, instructive way*:

- SQL fails on **structural complexity** (JOINs scale badly)
- Vector RAG fails on **semantic imprecision** (similar text ≠ connected entities)
- Agentic RAG fails on **economic viability** (accuracy compounds, cost explodes)

The paradigm shift (Act 5) then maps the structure: "All three asked the wrong question — they tried to *find* data instead of *following connections*."

The industry grid (Act 9) extends structure mapping further: the same pattern (entities + relationships + traversal) maps across pharma, finance, cybersecurity, supply chain, and healthcare.

**What breaks if violated:** Skipping the failure cascade and jumping to "Graph RAG is better because..." is assertion, not argumentation. Without contrastive examples, the audience cannot form the category boundary between "find data" and "follow connections." They remember the claim but cannot apply the distinction to new domains.

---

## 7. Elaborative Interrogation

**Citation:** M. Pressley, B. L. Symons, J. A. McDaniel, B. L. Snyder, and J. E. Turnure, "Elaborative interrogation facilitates acquisition of confusing facts," *J. Educational Psychology*, vol. 79, no. 3, pp. 268–278, 1987.

**Core claim:** Asking learners "why does this fact make sense?" during encoding produces significantly better retention and transfer than simply presenting the fact. The interrogation prompts integration with prior knowledge.

**Mapping to acts:** Several acts embed elaborative interrogation:

- Act 1 poses the opening question — the audience implicitly asks "why is this hard?"
- Act 5 answers "why does following connections work when finding data doesn't?"
- Act 7's trade-off matrix prompts "why isn't Graph RAG perfect at everything?"
- Act 10's decision flowchart prompts "which tool fits *my* use case and why?"

**What breaks if violated:** Presenting Graph RAG as uniformly superior (no trade-offs in Act 7, no decision framework in Act 10) eliminates elaborative interrogation. The audience accepts the claim passively rather than actively reasoning about *when and why* to apply it.

---

## 8. Testing Effect and Retrieval Practice

**Citation:** H. L. Roediger and A. C. Butler, "The critical role of retrieval practice in long-term retention," *Trends in Cognitive Sciences*, vol. 15, no. 1, pp. 20–27, 2011.

**Core claim:** Retrieving information from memory strengthens that memory more than re-studying does. Even unsuccessful retrieval attempts improve subsequent learning (the "pre-testing effect").

**Mapping to acts:** The storybook embeds retrieval practice at two levels:

- **Within the storybook:** Act 12 calls back to Act 1's question, forcing the audience to retrieve the original question and compare their understanding now vs. then. Act 9's industry grid prompts retrieval of the pattern learned in Acts 5-6 and applies it to new domains.
- **In workshop delivery:** The speaker notes for Acts 5, 9, and 12 prompt the presenter to pause and ask the audience to predict or recall before revealing the answer.

**What breaks if violated:** Ending at Act 11 (action plan) without Act 12's callback eliminates the most powerful retrieval opportunity — the moment the audience retrieves the opening question and sees it answered through everything they've learned. This is the act that converts short-term comprehension into long-term retention.

---

## The Emotional Arc as Cognitive Architecture

**Citation:** M. H. Immordino-Yang and A. R. Damasio, "We feel, therefore we learn: The relevance of affective and social neuroscience to education," *Mind, Brain, and Education*, vol. 1, no. 1, pp. 3–10, 2007.

**Core claim:** Emotion is not separate from cognition — it is a prerequisite for meaningful learning. Emotional engagement activates the ventromedial prefrontal cortex, which is essential for decision-making, social reasoning, and long-term memory formation. Learning that occurs without emotional engagement is "inert knowledge" — recallable on tests but never applied.

**Mapping to the 12-act arc:** The emotional arc is not decorative. Each phase produces a specific emotional state that primes the cognitive work of the next phase:

| Phase | Emotional State | Cognitive Function |
|-------|----------------|-------------------|
| Act 1 | Curiosity | Opens attentional gates — the brain flags what follows as "relevant" |
| Acts 2-4 | Frustration | Creates cognitive disequilibrium — the brain seeks resolution |
| Act 5 | Revelation ("aha") | Dopamine release reinforces the new mental model |
| Acts 7-8 | Trust | Reduces defensive processing — the audience stops looking for flaws |
| Acts 9-10 | Confidence | Self-efficacy enables transfer to the audience's own domain |
| Act 12 | Resolution | Narrative closure signals to the brain that the schema is complete |

**What breaks if violated:** Removing the frustration phase (Acts 2-4) and jumping directly to the revelation (Act 5) eliminates the cognitive disequilibrium that makes the "aha" meaningful. Without the emotional valley, the peak has no height.

---

## Why 12 Acts (Not 8 or 16)

The 12-act structure is not arbitrary. It emerges from three constraints:

1. **Bloom's taxonomy requires 6 cognitive levels.** Each level needs at least one act, giving a minimum of 6.

2. **The failure cascade requires 3 acts.** Contrastive learning with fewer than 3 contrasts produces weak category boundaries (Gentner & Markman). One failure looks like a special case. Two could be coincidence. Three establishes a pattern — and the pattern is what the paradigm shift breaks.

3. **The evaluation phase requires 2 acts.** Trade-offs (Act 7) and evidence (Act 8) serve different functions: Act 7 builds trust through honesty, Act 8 builds conviction through data. Combining them overloads working memory (Sweller).

These constraints give: 1 (setup) + 3 (failure) + 2 (paradigm shift) + 2 (evaluation) + 2 (generalization) + 2 (action) = 12.

Reducing to 8 means cutting either failures (weakening contrastive learning) or evaluation acts (weakening trust). Expanding to 16 means adding acts that don't correspond to distinct cognitive levels — violating the one-concept-per-act rule and introducing extraneous cognitive load.

The sweet spot is 12.
