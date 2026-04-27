# Consultation Script

The `aws-illustration` skill uses a progressive-disclosure consultation before generating any illustration.
This provides the "great consultation experience" feel — clear progress, descriptions that explain *why* each option matters.

## Core Principle

Every question shows `[Step N/M]` and every option has a "why this matters" note.
Skip questions whose answers are already clear from the user's invocation text.
Shorter invocations = more questions; detailed invocations = fewer.

## Step Detection

Always check the invocation before starting:
- If user named specific AWS services → skip the **Services** step
- If user passed `--theme=light` or `--theme=dark` → skip the **Audience** step
- If type is `concept-cards`, `mapping`, or `grid` → fewer required steps (see per-type scripts below)

---

## Universal Steps (used by most types)

### [Step S1] — Theme
> Skip if `--theme` flag is present in the invocation

**Header:** `[Step 1/N] — Visual theme`

**Question:** "Which visual theme suits this illustration's purpose?"

| Option | Label | Why it matters |
|---|---|---|
| A | Light — AWS Blog technical | White background. Best for engineering docs, blog post illustrations, architecture reviews. Readers focus on the diagram, not the aesthetic. |
| B | Dark — re:Invent / keynote hero | Squid Ink navy background. Best for keynote slides, product marketing, social cards. More dramatic, less readable for detailed reference. |

---

### [Step S2] — Services
> Skip if user already named AWS services in the topic description

**Header:** `[Step 2/N] — AWS services involved`

**Question:** "Which AWS services appear in this illustration?" (multi-select)

Offer the top-20 grouped by category. Always include "Other — I'll describe" as last option.

```
Compute (Smile 🟠):  [ ] AWS Lambda  [ ] Amazon EC2  [ ] Amazon ECS / AWS Fargate  [ ] AWS App Runner
Storage (Endor 🟢):  [ ] Amazon S3  [ ] Amazon EBS  [ ] Amazon EFS  [ ] Amazon S3 Glacier
Database (Cosmos 🩷): [ ] Amazon DynamoDB  [ ] Amazon RDS / Aurora  [ ] Amazon ElastiCache  [ ] Amazon Redshift
App Integration (Cosmos 🩷): [ ] Amazon API Gateway  [ ] Amazon EventBridge  [ ] Amazon SQS / SNS  [ ] AWS Step Functions
Networking (Galaxy 🟣): [ ] Amazon CloudFront  [ ] Amazon Route 53  [ ] Amazon VPC  [ ] Elastic Load Balancing  [ ] AWS Global Accelerator
Security (Mars 🔴):  [ ] AWS IAM  [ ] Amazon Cognito  [ ] AWS KMS  [ ] AWS WAF / AWS Shield
AI/ML (Orbit 🩵):    [ ] Amazon Bedrock  [ ] Amazon SageMaker  [ ] Amazon OpenSearch Service  [ ] Amazon Rekognition
Observability:       [ ] Amazon CloudWatch  [ ] AWS X-Ray  [ ] AWS CloudTrail
Other — I'll describe below (if not in the list, the skill will web-search docs.aws.amazon.com to confirm the official marketing name before generating)
```

**Note:** If the user types a short-form name (e.g., "Lambda", "S3"), confirm back with the marketing form:
> "You said 'Lambda' → using **AWS Lambda** (Smile orange #ED7100, Compute category)"
> "You said 'OpenSearch' → using **Amazon OpenSearch Service** (Galaxy purple #8C4FFF, Analytics category)"

Why it matters: Each service automatically gets its correct 2023 AWS category color and mxgraph.aws4 stencil name — so the diagram is brand-accurate without you having to look them up.

---

### [Step S3] — Data flow / primary direction
> Skip for `well-architected`, `multi-account`, `concept-cards`, `grid`, `mapping`

**Header:** `[Step 3/N] — Traffic or data flow`

**Question:** "What is the primary flow direction?"

| Option | Label | Why it matters |
|---|---|---|
| A | Ingress-heavy — user traffic flows in from the left | Request-response pattern (API, web app). Left side: users/internet; right side: databases/storage. Most common AWS Blog architecture. |
| B | Event-driven — no fixed left/right entry point | Events trigger processing asynchronously. Good for EventBridge, SQS-driven pipelines. Layout centers on the event bus. |
| C | Egress-heavy — data flows out (export, streaming) | Batch jobs, data pipelines, Kinesis streams. Source on left, destination on right. |
| D | Bidirectional — read and write both matter | Sync vs async paths, CQRS. Arrows will go both directions; the skill will use dashed arrows for the return path. |

---

### [Step S4] — Audience / complexity level
> Used to calibrate how many labels, callouts, and subtext elements to include

**Header:** `[Step 4/N] — Audience and detail level`

**Question:** "Who reads this diagram, and how much detail do they need?"

| Option | Label | Why it matters |
|---|---|---|
| A | General audience (AWS Blog header) | Minimal labels, larger icons, simple flow. Optimized for a blog post thumbnail that must communicate in a thumbnail. |
| B | Engineering team (architecture review) | Service names, arrow labels with protocols, port/CIDR callouts. Full technical detail. |
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
| A | Single row — one horizontal pipeline | Clean, simple. Best for ≤6 services in a clear sequence. Most AWS Blog reference architectures use this. |
| B | Two lanes — ask me for lane names | Use when you have a main path plus a secondary system (e.g., "Data Plane" + "Control Plane", or "Happy Path" + "Error Handling"). Always name the lanes clearly. |

If two lanes: ask "What should the top lane and bottom lane be called? Suggestions based on your services: [X] / [Y] — or something else?"

---

### `region-diagram` — Region / AZ / VPC layout

Steps: S2 (services) → [scope] → [subnet placement] → S1 (theme) → S4 (audience)
Total: up to 5 steps.

**[region-specific] Scope step:**

"How much AWS infrastructure scope should the diagram show?"

| Option | Label | Why it matters |
|---|---|---|
| A | Single region, 2 AZs — HA basic (default) | One region box containing 2 AZ boxes, each with public+private subnets. The most common AWS reference architecture layout. Fits in one 16:9 canvas comfortably. |
| B | Single region, 3 AZs — HA production | Three AZs. Use when your workload requires 3-AZ redundancy (e.g., RDS Multi-AZ, EKS node pools). Canvas gets tight — fewer services per AZ. |
| C | Multi-region, 2 regions — DR / failover | Two region boxes side by side with Route 53 or Global Accelerator routing between them. Use for disaster recovery architectures. |
| D | VPC only, no AZ breakdown | Just a VPC boundary with subnets, no AZ grouping. Good for simpler VPC peering or security group diagrams. |

**[region-specific] Subnet placement step:**

"Where should each service sit?"

List each service the user selected and ask: Public subnet, Private subnet, or Outside VPC (internet-facing)?
- Defaults: ALB/API Gateway → Public; Lambda/ECS/RDS/DB → Private; CloudFront/Route 53 → Outside

---

### `well-architected` — Pillar card grid

Steps: [pillar selection] → S1 (theme) → S4 (audience)
Total: 3 steps.

**[wa-specific] Pillar selection step:**

"The AWS Well-Architected Framework has 6 pillars. Which do you want to include?"

Multi-select:

| Pillar | Why include |
|---|---|
| Operational Excellence | Runbooks, monitoring, continuous improvement. Relevant for DevOps/SRE content. |
| Security | IAM, encryption, GuardDuty. Always relevant; often #1 for compliance-focused content. |
| Reliability | Multi-AZ, backups, retries. Key for HA architecture discussions. |
| Performance Efficiency | Right-sizing, caching, horizontal scaling. Good for cost/performance trade-off content. |
| Cost Optimization | Savings Plans, reserved instances, rightsizing. Essential for FinOps or leadership decks. |
| Sustainability | Carbon footprint, efficient instances. Include for green-cloud or 2024+ content. |

---

### `multi-account` — Org hierarchy

Steps: [OU structure] → [account names] → S1 (theme) → S4 (audience)
Total: 4 steps.

**[multi-account] OU structure step:**

"Which Organizational Units (OUs) should appear in the diagram?"

| Option | Label | Why it matters |
|---|---|---|
| A | AWS Control Tower default | Root → Security OU (Log Archive + Audit) + Sandbox OU + Workloads OU (Prod + Dev). The landing zone most AWS customers start with. |
| B | Custom — I'll name them | If you have a specific OU hierarchy, name the OUs and the tool will arrange them in the tree. |
| C | Flat — just Root + accounts | No OUs, just direct member accounts under Root. Simplest layout, good for small organizations. |
| D | MSSP / multi-tenant | Root → Partner OU → Customer OUs → Customer accounts. Good for MSP or SaaS multi-tenancy diagrams. |

**[multi-account] Account names step (if Custom chosen):**
"List your OUs, and how many member accounts each OU contains (e.g., 'Prod: 3 accounts, Dev: 2 accounts, Security: 2 accounts')."

---

### `concept-cards`, `grid`, `mapping`

Simpler types — shorter consultation.

Steps: S2 (services or concepts) → S1 (theme)
Total: 2 steps.

For `concept-cards`: ask "How many cards? (3, 4, or 5 — odd numbers look more balanced)"
For `grid`: ask "How many rows and columns? (2×2, 2×4, 3×3, etc.)"
For `mapping`: ask "What are the two sides of the mapping? (e.g., 'On-prem components' → 'AWS equivalents')"

---

### `workflow` — Timeline / Gantt bars

Steps: S2 (services) → [workflow name + phases] → S1 (theme)
Total: 3 steps.

"What are the major phases or stages in this workflow? Give each a short name (e.g., 'Ingest → Process → Store → Notify')."

---

### `split-panel` — Architecture + summary panel

Uses the same steps as `architecture`, plus:

"What should the summary panel on the right say? Give a panel title and up to 5 bullet points."

---

### `process-flow` — Tall vertical panels

"What label should appear on each arrow between panels? (e.g., 'HTTPS request', 'SQS message', 'DynamoDB put')"

---

## Progress Header Format

Always format the step header as:

```
[Step N/M — Topic]
```

Example: `[Step 2/4 — AWS services]`

Where M = total number of steps for this type, given what's already known from the invocation.
If the user's invocation already fills in 2 of 4 steps, start at `[Step 3/4]` (don't restart numbering).

---

## Skip Logic Reference

| If invocation contains... | Skip step |
|---|---|
| `--theme=light` or `--theme=dark` | S1 (theme) |
| Named AWS services (AWS Lambda, Amazon S3, etc.) | S2 (services) |
| "left to right" or describes flow direction | S3 (flow) |
| "blog" or "exec" or "engineering" | S4 (audience) |
| `--from=<file>` | S2 (services) — parsed from file |
| Type is `well-architected` | S2, S3 (no services/flow needed) |
| Type is `concept-cards` or `grid` or `mapping` | S3 (no flow direction needed) |
