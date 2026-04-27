# aws-illustration

> Generate high-fidelity AWS architecture illustrations — both AI-ready image prompts and production-quality draw.io XML diagrams — using the official 2023 AWS service-category color palette and `mxgraph.aws4` stencils.

---

## What it does

One invocation produces **two outputs simultaneously**:

| Output | File | Use case |
|---|---|---|
| **AI image prompt** | `img/<slug>-prompt.md` | Paste into Gemini / DALL-E / Midjourney → export 1920×1080 PNG for blog headers, slide decks |
| **draw.io XML** | `diagrams/<slug>.drawio` | Open in diagrams.net (free) → pixel-perfect AWS icons, fully editable, export at any resolution |

The skill walks you through a progressive-disclosure consultation before generating — asking only the questions that are relevant to your specific type, with `[Step N/M]` progress indicators and "why this matters" explanations for every option.

---

## Quick start

```
/aws-illustration architecture "API Gateway → Lambda → DynamoDB with CloudFront CDN"
```

That's it. The skill will ask 2–4 targeted questions (theme, flow direction, audience), then produce both files.

To skip the consultation for specific axes:

```bash
# Force dark theme (skips theme question)
/aws-illustration architecture "ECS + Fargate microservices" --theme=dark

# Parse services from an existing doc (skips services question)
/aws-illustration architecture "my app" --from=./docs/architecture.md

# Verify all draw.io stencil names before writing (catches typos)
/aws-illustration region-diagram "Multi-AZ RDS with bastion" --verify
```

---

## Illustration types

### Standard types (shared with other illustration skills)

| Type | Description | Best for |
|---|---|---|
| `concept-cards` | 3–5 service cards in a horizontal row with arrows | Explainer slides, feature overviews |
| `mapping` | Two-column concept mapping with dotted connectors | On-prem → AWS migration diagrams |
| `architecture` | Left-to-right component flow (4–7 services) | Reference architectures, AWS Blog headers |
| `workflow` | Nested Gantt/trace-style bars | Step Functions flows, CI/CD pipelines |
| `grid` | N×M card grid, no arrows | Service catalog overviews, feature matrices |
| `split-panel` | Architecture flow + summary bullets panel | "Architecture + why we chose this" slide |
| `process-flow` | 3–5 tall panels with bold labeled arrows | Request lifecycle, data pipeline stages |

### AWS-specific types (new)

| Type | Description | Best for |
|---|---|---|
| `region-diagram` | Region → VPC → AZs (stacked) → public/private subnets → services | Standard AWS reference architecture |
| `well-architected` | 1–6 AWS Well-Architected pillar cards, user-selected | Architecture review decks, compliance slides |
| `multi-account` | AWS Organizations hierarchy: Root → OUs → accounts | Landing zone docs, Control Tower diagrams |

---

## Themes

Every type supports two themes via the `--theme` flag:

### Light — AWS Blog technical (default)
White `#FFFFFF` background, flat category-colored service icons, slate `#545B64` arrows, subtle card shadows. Matches the visual style of [aws.amazon.com/blogs/architecture](https://aws.amazon.com/blogs/architecture/).

### Dark — re:Invent / Console
Squid Ink navy `#232F3E` background, dark-BG icon variants, `#D5DBDB` arrows, category-color top-border accent on cards (no drop shadows). Matches AWS re:Invent keynote slides and the AWS Management Console aesthetic.

---

## AWS 2023 Color Palette

AWS introduced a new semantic palette in 2023, replacing "Arctic Blue" with category-specific colors. This skill uses it throughout.

| Category | Color name | Hex | Services |
|---|---|---|---|
| Compute, Containers | **Smile** | `#ED7100` | Lambda, EC2, ECS, Fargate, App Runner |
| Storage, IoT | **Endor** | `#7AA116` | S3, EBS, EFS, Glacier |
| App Integration, Database, Mgmt | **Cosmos** | `#E7157B` | API Gateway, SQS, SNS, EventBridge, DynamoDB, RDS, CloudWatch |
| Networking, Analytics, CDN | **Galaxy** | `#8C4FFF` | CloudFront, VPC, Route 53, Kinesis, Athena, OpenSearch |
| Security, Identity | **Mars** | `#DD344C` | IAM, Cognito, KMS, WAF, GuardDuty, Shield |
| AI/ML, Migration | **Orbit** | `#01A88D` | Bedrock, SageMaker, Rekognition, DataSync |
| Rare accent | **Nebula** | `#C925D1` | Specialized services |
| Brand chrome | **Squid Ink** | `#232F3E` | Page background (dark mode), nav |
| Brand accent | **AWS Orange** | `#FF9900` | Logo, primary CTA only |

> **Tip:** Attach `assets/palette.svg` as a reference image in Gemini for dramatically better color fidelity than text-only palette descriptions.

---

## Typography

The skill uses the **Amazon Ember** type stack with open fallbacks:

```
"Amazon Ember", Inter, "Noto Sans", "Open Sans", system-ui, sans-serif
```

Amazon Ember is AWS's proprietary typeface. When unavailable, **Inter** is the closest open substitute. In AI image prompts, this is described as *"clean humanist sans-serif, similar to Amazon Ember or Inter — geometric clarity with slight warmth"*.

| Role | Size | Weight |
|---|---|---|
| Diagram title / hero | 56px | Bold 700 |
| Section / lane label | 28px | Semibold 600 |
| Service card title | 20px | Semibold 600 |
| Arrow label / sublabel | 16px | Medium 500 |
| Badge / micro | 11px | Medium 500 |

---

## Consultation experience

The skill asks questions before generating — but only the ones you actually need. Each question includes a `[Step N/M]` progress indicator so you always know how close you are to output.

**Example session for `region-diagram`:**

```
[Step 1/4 — AWS services]
Which services appear in your architecture?
  ✓ Lambda — Compute (Smile orange)
  ✓ RDS — Database (Cosmos pink)
  ✓ ALB — Networking (Galaxy purple)
  ✓ CloudWatch — Management (Cosmos pink)

[Step 2/4 — Region scope]
How much infrastructure scope?
  → Single region, 2 AZs — HA basic (default)
    Why: Most common AWS reference pattern. Two AZs cover standard HA.
    
  ○ Single region, 3 AZs — HA production
    Why: Three-AZ redundancy for production databases and EKS node pools.
    
  ○ Multi-region — DR / failover
    Why: For disaster recovery architectures with Route 53 failover.

[Step 3/4 — Subnet placement]
Where should each service go?
  ALB → Public subnet ✓ (default)
  Lambda → Private subnet ✓ (default)
  RDS → Private subnet ✓ (default)

[Step 4/4 — Audience]
Who reads this?
  → Engineering team (architecture review) — full technical labels
```

**Skip logic:** If your invocation already provides information, those steps are skipped. `/aws-illustration architecture "Lambda → S3 → DynamoDB" --theme=dark` skips both the services step and the theme step.

---

## draw.io XML details

The `.drawio` file uses **official `mxgraph.aws4` stencils** — the same AWS-approved icons built into [diagrams.net](https://diagrams.net) and the draw.io desktop app.

### How to open and export

1. Go to [diagrams.net](https://diagrams.net) (free, no account needed) or open draw.io desktop
2. File → Open → select `diagrams/<slug>.drawio`
3. File → Export as → PNG
4. Set width to 1920, enable "Fit page", click Export
5. Save to `diagrams/<slug>.png`

### How stencils work

Every service icon cell uses this style pattern:

```xml
style="sketch=0;                                    ← MUST be 0 for clean 2023 icons
       shape=mxgraph.aws4.resourceIcon;             ← resource icon container
       resIcon=mxgraph.aws4.lambda;                 ← specific service stencil
       fillColor=#ED7100;                           ← Smile orange for Lambda (Compute)
       strokeColor=none;
       fontColor=#232F3E;
       verticalLabelPosition=bottom;
       verticalAlign=top;
       align=center;
       aspect=fixed;"
```

For dark mode, the stencil name gains a `_dark` suffix where available (`mxgraph.aws4.lambda_dark`), `fontColor` becomes `#FFFFFF`, and the page `background` is `#232F3E`.

### Region/AZ boundaries

Group containers use dedicated group stencils — not plain rectangles:

| Container | Stencil | Line style |
|---|---|---|
| Region | `mxgraph.aws4.group_region` | Dashed |
| Availability Zone | `mxgraph.aws4.group_availability_zone` | Dotted |
| VPC | `mxgraph.aws4.group_vpc` | Solid purple |
| Public subnet | `mxgraph.aws4.group_public_subnet` | Solid green |
| Private subnet | `mxgraph.aws4.group_private_subnet` | Solid gray |

### `--verify` flag

After generating XML, `--verify` cross-checks every `mxgraph.aws4.*` token against `references/aws-service-catalog.md`. Any unknown stencil name is reported as a warning before the file is written — catching typos before you open draw.io.

```
/aws-illustration architecture "S3 → Lamba → DynomoDB" --verify
⚠ Unknown stencil: mxgraph.aws4.lamba (did you mean: lambda?)
⚠ Unknown stencil: mxgraph.aws4.dynamodb (did you mean: dynamodb? check capitalization)
```

---

## Ingest mode (`--from=<file>`)

Parse an existing architecture description and pre-fill the consultation:

```bash
/aws-illustration architecture --from=./docs/architecture.md
```

The skill scans the file for AWS service names (matching against `references/aws-service-catalog.md`), maps each to its category color and stencil, and pre-fills Step 1 of the consultation. You confirm and continue. Great for auto-documenting existing code repos from their READMEs or ADRs.

---

## Palette SVG — multi-modal color reference

`assets/palette.svg` is a labeled color swatch of the full 2023 AWS palette. In Gemini (and other multi-modal models), attaching it as a reference image alongside your text prompt dramatically improves category-color accuracy compared to hex-code-only descriptions.

```
Attach: ~/.claude/skills/aws-illustration/assets/palette.svg
Prompt: "Make the service icon colors consistent with this AWS palette swatch: [attached]"
```

---

## Region diagram conventions

The `region-diagram` type follows the official AWS reference architecture conventions:

```
[Internet / User]  ──HTTPS──▶  [Region boundary — dashed]
                                 └── [VPC — solid purple]
                                       ├── [AZ us-east-1a — dotted] ← TOP ROW
                                       │     ├── [Public Subnet]  → ALB, NAT GW, Bastion
                                       │     └── [Private Subnet] → Lambda, ECS, RDS primary
                                       └── [AZ us-east-1b — dotted] ← BOTTOM ROW
                                             ├── [Public Subnet]  → ALB replica
                                             └── [Private Subnet] → RDS standby
```

**Critical rules enforced:**
- AZs are always **vertically stacked** (top/bottom rows), never side by side
- Public subnet is always on **top** within each AZ
- Private subnet is always on **bottom**
- Three distinct border styles: Region=dashed, AZ=dotted, VPC=solid

Default placement for common services:

| Service | Where it goes |
|---|---|
| ALB / NLB | Public subnet |
| NAT Gateway | Public subnet |
| Bastion host | Public subnet |
| Lambda, ECS/Fargate | Private subnet |
| RDS primary | Private subnet (AZ-A) |
| RDS standby | Private subnet (AZ-B) |
| API Gateway | Outside VPC (right edge) |
| S3, DynamoDB | Outside VPC (managed services) |
| CloudFront, Route 53 | Outside Region (far left/right) |
| CloudWatch, CloudTrail | Outside VPC (bottom right) |

---

## Well-Architected type

The `well-architected` type supports any combination of the 6 current AWS pillars:

| Pillar | Accent color | Icon |
|---|---|---|
| Operational Excellence | Cosmos `#E7157B` | Monitoring gauge |
| Security | Mars `#DD344C` | Shield |
| Reliability | Orbit `#01A88D` | Redundant server |
| Performance Efficiency | Galaxy `#8C4FFF` | Speedometer |
| Cost Optimization | Endor `#7AA116` | Dollar over chart |
| Sustainability | Endor `#7AA116` | Leaf |

You pick which pillars at `[Step 1/3]`. Choosing 3 pillars produces a clean row; 6 pillars auto-shifts to a 2×3 grid.

---

## Multi-account type

Defaults to the **AWS Control Tower standard landing zone**:

```
Root (AWS Organizations)
├── Security OU → [Log Archive] [Audit]
├── Workloads OU → [Production] [Staging]
└── Sandbox OU → [Developer Sandbox]
```

Choose "Custom" at the OU structure step to name your own OUs and account counts. Each OU gets a distinct category-color left accent border to visually distinguish it in the hierarchy.

---

## Output file locations

All outputs land in the **invoking project's directory**:

```
<your-project>/
├── img/
│   ├── <slug>-prompt.md     ← Gemini-ready AI prompt
│   └── <slug>.png           ← export here after generating with Gemini
└── diagrams/
    ├── <slug>.drawio         ← draw.io XML (open in diagrams.net)
    └── <slug>.png            ← export here after opening in draw.io
```

---

## Common pitfalls

| Problem | Fix |
|---|---|
| Gemini generates old-style AWS icons (blue gradient, 3D isometric) | Add "2023 AWS flat-icon style, NOT isometric, NOT blue gradient icons" to the prompt |
| AZs render side by side instead of stacked | The skill states vertical stacking 3 times in the prompt — if still wrong, regenerate |
| All service icons are orange instead of category-specific | Name each service + its exact color explicitly: "Lambda icon in Smile orange #ED7100" |
| draw.io shows blank gray boxes | Stencil name typo — run `--verify`, check `aws-service-catalog.md` alias table |
| Dark background renders as pure black | Specify "Squid Ink navy #232F3E — NOT pure black" in the prompt |
| draw.io icons look rough/sketchy | Missing `sketch=0` in the style string |

See `references/troubleshooting.md` for full fixes.

---

## File structure

```
~/.claude/skills/aws-illustration/
├── SKILL.md                          ← Claude skill entry point (auto-invoked)
├── DESIGN.md                         ← Authoritative design spec (9 Stitch sections)
├── README.md                         ← This file
├── assets/
│   └── palette.svg                   ← Multi-modal color reference swatch
└── references/
    ├── consultation.md               ← Progressive-disclosure Q-scripts per type
    ├── layout-rules.md               ← Arrow direction + AWS container hierarchy rules
    ├── tips.md                       ← Gemini prompt tips and anti-patterns
    ├── troubleshooting.md            ← Common AI + draw.io failure fixes
    ├── aws-service-catalog.md        ← 60+ services → category → mxgraph.aws4 stencil
    ├── examples.md                   ← 3 worked examples with full prompts + XML
    └── templates/
        ├── concept-cards.md
        ├── mapping.md
        ├── architecture.md
        ├── workflow.md
        ├── grid.md
        ├── split-panel.md
        ├── process-flow.md
        ├── region-diagram.md
        ├── well-architected.md
        └── multi-account.md
```

---

## Extending the catalog

`references/aws-service-catalog.md` covers the 60 most common services. To add a new service:

1. Find the mxgraph.aws4 stencil name: open [diagrams.net](https://diagrams.net) → Extras → Edit Diagram, add a shape from the AWS library, inspect its style string for `resIcon=mxgraph.aws4.<name>`
2. Determine its category from [aws.amazon.com/architecture/icons](https://aws.amazon.com/architecture/icons/)
3. Add a row to the appropriate section in `aws-service-catalog.md`

---

## Design spec

The full design system lives in `DESIGN.md`. It follows the [VoltAgent `awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) 9-section Stitch format:

1. Visual Theme & Atmosphere
2. Color Palette & Roles (2023 AWS palette + brand + neutrals + semantic)
3. Typography Rules (Amazon Ember stack + scale)
4. Component Stylings (service cards, region/AZ/VPC boundaries, arrows)
5. Layout Principles (4px grid, 16:9 canvas, flow direction rules)
6. Depth & Elevation (flat light mode, top-border dark mode)
7. Do's and Don'ts
8. Responsive Behavior (export targets for blog / keynote / social)
9. Agent Prompt Guide (quick reference + copy-paste style blocks + XML boilerplate)

The skill reads `DESIGN.md` on every invocation as its source of truth for colors and typography.

---

## Related skills

| Skill | Style | Best for |
|---|---|---|
| `/aws-illustration` | AWS 2023 flat icons, dual light/dark | AWS Blog, re:Invent, architecture docs |
| `/saas-illustration` | Dark glass morphism, indigo/cyan | SaaS marketing, developer tool blogs |
| `/dimensional-illustration` | Institutional teal/red, glass morphism | Financial / investment content |
| `/crayon-illustration` | Hand-drawn pastel whiteboard | Educational / playful explainers |

---

*AWS service icons and trademarks belong to Amazon Web Services. `mxgraph.aws4` stencils are maintained by the [draw.io](https://github.com/jgraph/drawio) team. This skill is not affiliated with or endorsed by AWS.*
