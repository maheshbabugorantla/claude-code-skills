# Consultation Script

The `gcp-illustration` skill uses a progressive-disclosure consultation before generating any illustration.
This provides a clear, guided experience — progress headers, options that explain *why* each choice matters.

## Core Principle

Every question shows `[Step N/M]` and every option has a "why this matters" note.
Skip questions whose answers are already clear from the user's invocation text.
Shorter invocations = more questions; detailed invocations = fewer.

## Step Detection

Always check the invocation before starting:
- If user named specific GCP services → skip the **Services** step
- If user passed `--theme=light` or `--theme=dark` → skip the **Theme** step
- If type is `concept-cards`, `mapping`, or `grid` → shorter consultation (see per-type scripts)
- If `--from=<file>` → skip Services step (parse from file)

---

## Universal Steps (used by most types)

### [Step S1] — Theme
> Skip if `--theme` flag is present in the invocation

**Header:** `[Step 1/N — Visual theme]`

**Question:** "Which visual theme suits this illustration's purpose?"

| Option | Label | Why it matters |
|---|---|---|
| A | Light — Google Cloud Blog / architecture review | White background. Material Design aesthetic. Best for engineering docs, blog post illustrations, and architecture reviews. Clear and readable at any size. |
| B | Dark — Console / keynote dark mode | Deep Gray (#202124) background. Best for keynote slides, product marketing, or social cards. More dramatic; less readable at small sizes. |

---

### [Step S2] — Services
> Skip if user already named GCP services in the topic description

**Header:** `[Step 2/N — GCP services involved]`

**Question:** "Which GCP services appear in this illustration?" (multi-select)

Offer the top services grouped by category. Always include "Other — I'll describe" as the last option.

```
Compute (Blue 🔵):    [ ] Compute Engine  [ ] Google Kubernetes Engine  [ ] Cloud Run  [ ] Cloud Functions  [ ] App Engine
Storage (Green 🟢):   [ ] Cloud Storage  [ ] Persistent Disk  [ ] Filestore
Database (Red 🔴):    [ ] Cloud SQL  [ ] Firestore  [ ] Cloud Spanner  [ ] Cloud Bigtable  [ ] Memorystore
Analytics (Yellow 🟡): [ ] BigQuery  [ ] Pub/Sub  [ ] Dataflow  [ ] Dataproc  [ ] Cloud Composer  [ ] Looker
Networking (Blue 🔵): [ ] VPC Network  [ ] Cloud Load Balancing  [ ] Cloud CDN  [ ] Cloud DNS  [ ] Cloud NAT  [ ] Cloud Armor
Security (Blue 🔵):   [ ] Cloud IAM  [ ] Secret Manager  [ ] Identity-Aware Proxy  [ ] Cloud KMS  [ ] Security Command Center
AI/ML (Blue 🔵):      [ ] Vertex AI  [ ] Cloud Vision API  [ ] Speech-to-Text  [ ] Dialogflow  [ ] Document AI
DevTools (Blue 🔵):   [ ] Cloud Build  [ ] Cloud Deploy  [ ] Artifact Registry  [ ] Cloud Workflows  [ ] Eventarc
Other — I'll describe (the skill will confirm the official marketing name before generating)
```

**Note:** If the user types a short-form name, confirm back with the marketing form:
> "You said 'GKE' → using **Google Kubernetes Engine** (Google Blue #4285F4, Compute category)"
> "You said 'GCS' → using **Cloud Storage** (Google Green #34A853, Storage category)"
> "You said 'BQ' → using **BigQuery** (Google Yellow #FBBC04, Analytics category)"

Why it matters: Each service automatically gets its correct brand color and `mxgraph.gcp2` stencil name — no manual lookup needed.

---

### [Step S3] — Data flow / primary direction
> Skip for `gcp-architecture-framework`, `resource-hierarchy`, `concept-cards`, `grid`, `mapping`

**Header:** `[Step 3/N — Traffic or data flow]`

**Question:** "What is the primary flow direction?"

| Option | Label | Why it matters |
|---|---|---|
| A | Ingress-heavy — user traffic flows in from the left | Request-response pattern (API, web app). Left side: users/internet; right side: databases/storage. Most common GCP Blog architecture. |
| B | Event-driven — no fixed left/right entry point | Events trigger processing asynchronously. Good for Pub/Sub-driven pipelines, Eventarc triggers. Layout centers on the event bus. |
| C | Data pipeline — data flows left to right (ingest → process → store) | Batch or streaming data processing. Source on left (Pub/Sub, Cloud Storage), sink on right (BigQuery, Cloud Spanner). |
| D | Bidirectional — read and write both matter | Sync vs async paths, CQRS. Arrows go both directions; the skill will use dashed arrows for return paths. |

---

### [Step S4] — Audience / complexity level
> Used to calibrate label density, callout count, and protocol labels

**Header:** `[Step 4/N — Audience and detail level]`

**Question:** "Who reads this diagram, and how much detail do they need?"

| Option | Label | Why it matters |
|---|---|---|
| A | General audience (blog header / social) | Minimal labels, larger icons, simple flow. Optimized for thumbnail communication. |
| B | Engineering team (architecture review) | Service names, arrow labels with protocols, CIDR/port callouts. Full technical detail. |
| C | Executive / leadership (deck slide) | Very sparse labels, large icons, bold title. No protocol labels. |
| D | Workshop / tutorial (step-by-step) | Numbered steps on arrows, annotations explaining why each component exists. |

---

## Per-Type Consultation Scripts

### `architecture` — Left-to-right component flow

Steps: S2 (services) → [layout] → S3 (flow direction) → S1 (theme) → S4 (audience)
Total: up to 5 steps.

**[architecture-specific] Layout step:**

"Should all services sit on a single horizontal row, or do you need two lanes?"

| Option | Label | Why it matters |
|---|---|---|
| A | Single row — one horizontal pipeline | Clean, simple. Best for ≤6 services in a clear sequence. Most Google Cloud Blog reference architectures use this. |
| B | Two lanes — ask me for lane names | Use when you have a main path plus a secondary system (e.g., "Data Plane" + "Control Plane", or "Happy Path" + "Error Handling"). Always name the lanes clearly. |

If two lanes: ask "What should the top lane and bottom lane be called? Suggestions based on your services: [X] / [Y] — or something else?"

---

### `region-diagram` — VPC / Region / Zone layout

Steps: S2 (services) → [scope] → [subnet placement] → S1 (theme) → S4 (audience)
Total: up to 5 steps.

**[region-specific] Scope step:**

"How much GCP network scope should the diagram show?"

| Option | Label | Why it matters |
|---|---|---|
| A | Single region, 2 zones — HA basic (default) | One VPC → one Region containing 2 Zone boxes, each with representative services. Most common GCP reference architecture layout. |
| B | Single region, 3 zones — HA production | Three Zones for production multi-zone redundancy (e.g., 3-zone GKE node pools). Canvas gets tighter. |
| C | Multi-region, 2 regions — DR / geographic spread | Single global VPC containing 2 Region boxes. Good for disaster recovery, read replicas, or multi-region Cloud Spanner. |
| D | VPC only, no zone breakdown | VPC boundary with subnets only, no zone grouping. Good for VPC peering, Private Service Connect, or security group diagrams. |

**[region-specific] Subnet placement step:**

"Where should each service sit?" (list each service and ask: Public subnet, Private subnet, or Outside VPC?)

Defaults:
- Cloud Load Balancing → At VPC edge (global)
- Cloud Run → Outside VPC (unless Direct VPC egress)
- GKE nodes, Compute Engine, Cloud SQL → Private subnet inside a Zone
- Pub/Sub, Cloud Storage, BigQuery → Outside VPC (Google-managed)
- Cloud NAT → Regional subnet layer

---

### `gcp-architecture-framework` — Pillar card grid

Steps: [pillar selection] → S1 (theme) → S4 (audience)
Total: 3 steps.

**[framework-specific] Pillar selection step:**

"The Google Cloud Architecture Framework has 6 pillars. Which do you want to include?"

Multi-select:

| Pillar | Why include |
|---|---|
| Operational Excellence | Automated operations, runbooks, CI/CD. Relevant for DevOps/SRE content. |
| Security, Privacy, and Compliance | IAM, encryption, VPC Service Controls, compliance posture. Relevant for regulated industries. |
| Reliability | Multi-zone deployments, load balancing, managed instance groups, SLOs. Key for HA architecture discussions. |
| Cost Optimization | Committed use discounts, right-sizing, spot VMs, BigQuery slot pricing. Essential for FinOps or leadership decks. |
| Performance Optimization | Caching (Memorystore), CDN, right-instance types, Cloud Spanner scaling. Good for throughput-focused content. |
| Sustainability | Carbon footprint, Google-matched renewables, efficient regions. Include for green-cloud or 2024+ content. |

---

### `resource-hierarchy` — GCP Org / Folder / Project tree

Steps: [hierarchy structure] → [policy scope] → S1 (theme) → S4 (audience)
Total: 4 steps.

**[hierarchy-specific] Structure step:**

"What GCP Resource Hierarchy structure should the diagram show?"

| Option | Label | Why it matters |
|---|---|---|
| A | Single project | Just one Project with its key resources. Good for onboarding or introductory content. |
| B | Org → 2 Folders → 2 Projects each | A realistic small-enterprise layout with Dev and Prod folders. Common landing zone pattern. |
| C | Org → dept Folders → projects | Business-unit organized hierarchy. Name the department folders explicitly. |
| D | Custom — I'll describe | If you have a specific org/folder/project structure, describe it and the skill will arrange the tree. |

**[hierarchy-specific] Policy scope step (optional):**

"Should the diagram show IAM bindings or Org Policy scopes on any nodes?"

Options:
- No — just the structural hierarchy
- Yes, at Org level (applies to all projects)
- Yes, at Folder level (applies to the folder's projects)
- Yes, at Project level (project-specific IAM)

---

### `concept-cards`, `grid`, `mapping`

Simpler types — shorter consultation.

Steps: S2 (services or concepts) → S1 (theme)
Total: 2 steps.

For `concept-cards`: ask "How many cards? (3, 4, or 5 — odd numbers look more balanced)"
For `grid`: ask "How many rows and columns? (2×2, 2×4, 3×3, etc.)"
For `mapping`: ask "What are the two sides of the mapping? (e.g., 'AWS services' → 'GCP equivalents' OR 'on-prem concepts' → 'GCP services')"

---

### `workflow` — Timeline / Gantt bars

Steps: S2 (services) → [workflow name + phases] → S1 (theme)
Total: 3 steps.

"What are the major phases or stages in this workflow? Give each a short name (e.g., 'Ingest → Process → Transform → Store → Visualize')."

---

### `split-panel` — Architecture flow + summary panel

Uses the same steps as `architecture`, plus:

"What should the summary panel on the right say? Give a panel title and up to 5 bullet points."

---

### `process-flow` — Tall vertical panels

"What label should appear on each arrow between panels? (e.g., 'Pub/Sub message', 'HTTPS', 'BigQuery query', 'gRPC')"

---

## Progress Header Format

Always format the step header as:
```
[Step N/M — Topic]
```

Example: `[Step 2/4 — GCP services]`

Where M = total number of steps for this type, given what's already known from the invocation.
If the user's invocation already answers 2 of 4 steps, start at `[Step 3/4]` (don't restart numbering).

---

## Skip Logic Reference

| If invocation contains… | Skip step |
|---|---|
| `--theme=light` or `--theme=dark` | S1 (theme) |
| Named GCP services (Cloud Storage, BigQuery, etc.) | S2 (services) |
| "left to right" or describes flow direction | S3 (flow) |
| "blog" or "exec" or "engineering" | S4 (audience) |
| `--from=<file>` | S2 (services) — parsed from file |
| Type is `gcp-architecture-framework` | S2, S3 |
| Type is `resource-hierarchy` | S2, S3 |
| Type is `concept-cards` or `grid` or `mapping` | S3 |
