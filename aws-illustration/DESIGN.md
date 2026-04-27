# Design System — AWS Technical Illustrations

> AWS illustration design spec. Follows the Google Stitch / VoltAgent `awesome-design-md` 9-section format.
> Not an official AWS design system — a practitioner reference for generating consistent AWS-style diagrams.

---

## 1. Visual Theme & Atmosphere

- **What this is:** A design spec for AWS architecture diagrams, blog headers, and re:Invent-style hero illustrations
- **Who it's for:** Engineers and technical writers creating AWS content — blogs, whitepapers, slide decks
- **Industry context:** Cloud infrastructure, developer tooling, ML/AI platforms
- **Dual mode:**
  - **Light / AWS Blog technical** — white background, flat category-colored icons, slate arrows, VPC/Region containers. Matches aws.amazon.com/blogs/architecture thumbnails. Enterprise-clean, schematic-precise.
  - **Dark / re:Invent hero** — Squid Ink Navy (#232F3E) background, AWS Orange (#FF9900) accents, dark-BG icon variants, subtle gradient glows. Matches AWS Console / re:Invent keynote aesthetic. Premium, product-marketing.
- **Decoration level:** Minimal-functional. Category color is information, not decoration. No isometric 3D. No glass morphism (not the 2023 AWS style).
- **Mood:** Authoritative and trustworthy. "This diagram was made by someone who reads the Well-Architected Framework."
- **Reference visuals:** aws.amazon.com/blogs/architecture (light), AWS re:Invent 2024 session slides (dark)

---

## 2. Color Palette & Roles

### Brand Colors
| Name | Hex | Role |
|---|---|---|
| Squid Ink | `#232F3E` | Page background (dark mode), primary text (light mode), nav chrome |
| AWS Orange (Smile brand) | `#FF9900` | Brand accent, CTAs, Amazon logo |
| White | `#FFFFFF` | Card background (light mode), text (dark mode) |

### 2023 AWS Service Category Palette
AWS introduced a new semantic palette in 2023, replacing "Arctic Blue" with category-specific colors. Each icon carries its category color.

| Category | Name | Hex | Roles |
|---|---|---|---|
| Compute, Containers, Blockchain, Media | **Smile** | `#ED7100` | Lambda, EC2, ECS, Fargate, App Runner |
| Storage, IoT, Cloud Financial | **Endor** | `#7AA116` | S3, EBS, Glacier, EFS, FSx |
| App Integration, Management & Governance | **Cosmos** | `#E7157B` | API Gateway, EventBridge, SQS, SNS, Step Functions, CloudWatch |
| Analytics, Games, Networking & CDN | **Galaxy** | `#8C4FFF` | Kinesis, Athena, OpenSearch, CloudFront, VPC, Route 53 |
| Business Apps, Security, Identity | **Mars** | `#DD344C` | IAM, Cognito, KMS, WAF, Shield, GuardDuty |
| AI/ML, Migration & Modernization | **Orbit** | `#01A88D` | Bedrock, SageMaker, Rekognition, DataSync, DMS |
| Database (primary accent) | **Cosmos** | `#E7157B` | RDS, DynamoDB, Aurora, ElastiCache, Redshift |
| Rare / accent | **Nebula** | `#C925D1` | Rarely used; specialized services only |

### Neutral Scale
| Name | Hex | Role |
|---|---|---|
| Navy / Squid Ink | `#232F3E` | Dark mode background |
| Slate | `#545B64` | Body text (light), arrow/connector color, borders |
| Cool Gray | `#879096` | Captions, secondary labels |
| Light Gray | `#EAEDED` | Dividers, input borders, AZ boundary fill |
| Snow | `#FAFAFA` | Light mode page background |
| White | `#FFFFFF` | Light mode card surface |

### Semantic / Status
| Semantic | Hex | Note |
|---|---|---|
| Success / healthy | `#1E8900` | Green — use sparingly |
| Warning | `#FF9900` | Reuses Smile/AWS Orange |
| Error / alarm | `#D13212` | CloudWatch alarm red |
| Info | `#0073BB` | Console link-blue |

### Theme-Aware Tokens
| Token | Light (`#FFFFFF` BG) | Dark (`#232F3E` BG) |
|---|---|---|
| Page background | `#FFFFFF` | `#232F3E` |
| Card surface | `#FAFAFA` | `#314050` |
| Card border | `#EAEDED` | `#414D5C` |
| Body text | `#16191F` | `#D5DBDB` |
| Arrow / connector | `#545B64` | `#D5DBDB` |
| Arrow label | `#545B64` | `#9EA8B0` |
| Region boundary (dashed) | `#545B64` | `#D5DBDB` |
| AZ boundary (dotted) | `#879096` | `#879096` |

### Accessibility
- All text colors: ≥ 4.5:1 contrast ratio against their background
- Icon lines and category colors: ≥ 3:1 contrast ratio
- 2023 category palette was designed by AWS to be accessible on both light and dark backgrounds — use the same mxgraph.aws4 stencil, just pick `_dark` suffix for dark mode

---

## 3. Typography Rules

### Font Stack
```
"Amazon Ember", Inter, "Noto Sans", "Open Sans", system-ui, sans-serif
```
Amazon Ember is AWS's proprietary custom typeface (designed by Dalton Maag). Use it when licensed; otherwise Inter is the closest open substitute. For AI image prompts, describe as **"clean humanist sans-serif, similar to Amazon Ember or Inter — geometric clarity with slight warmth, not condensed"**.

### Type Scale
| Role | Size | Weight | Usage |
|---|---|---|---|
| Hero / diagram title | 56px / clamp(32px, 3.5vw, 56px) | 700 Bold | Keynote title, hero banner |
| H1 | 40px | 700 Bold | Section header |
| H2 | 28px | 600 Semibold | Group / lane label |
| H3 | 20px | 600 Semibold | Card title, service name |
| H4 | 16px | 500 Medium | Subtitle, sublabel |
| Body | 16px | 400 Regular | Arrow labels, descriptions |
| Caption | 13px | 400 Regular | Port numbers, secondary info |
| Label / micro | 11px | 500 Medium | Badge text, subnet CIDR |

### Typography Rules
- All-caps sparingly: badges and category labels only
- Tabular numerals for any numeric data (token counts, costs, latency ms)
- Line height: 1.4 for body, 1.2 for headings
- No decorative typefaces — Amazon Ember's personality is its neutrality

---

## 4. Component Stylings

### Service Icon Card
- **Size:** 80×100px (icon 48px + label 2-line beneath)
- **Icon:** mxgraph.aws4 stencil in its category color (see catalog). `sketch=0` always.
- **Label:** H3 (20px, semibold), official AWS marketing name ("AWS Lambda", "Amazon S3", "Amazon OpenSearch Service" — never bare "Lambda" or "S3" alone)
- **Sublabel:** Caption (13px), optional descriptor ("us-east-1a", "8x2048MB")
- **Card surface (light):** White `#FFFFFF`, 1px `#EAEDED` border, 4px radius, 0 2px 8px rgba(0,0,0,0.08) shadow
- **Card surface (dark):** `#314050`, 1px `#414D5C` border, 4px radius, no shadow; category-color 3px top border instead

### Arrow / Connector
- **Weight:** 1.5px
- **Color:** `#545B64` (light) / `#D5DBDB` (dark)
- **Arrowhead:** Classic filled, 4px
- **Label:** 11px caption, centered on midpoint, white pill background (light) / dark pill (dark)
- **Direction:** ALWAYS left-to-right within a horizontal flow; top-to-bottom within region containers

### Region Boundary
- **Style:** Dashed 1px `#545B64` (light) / `#D5DBDB` (dark)
- **Label:** H2 (28px semibold) top-left inside the boundary box, prefixed with AWS icon `group_region`
- **Fill:** Transparent (light) / rgba(49,64,80,0.3) (dark)
- **Minimum padding:** 24px inset from children

### Availability Zone Boundary
- **Style:** Dotted 1px `#879096`
- **Label:** Caption (13px) top-left: "us-east-1a"
- **Fill:** Transparent (both modes)
- **Contains:** Public subnet (top half) + Private subnet (bottom half)

### Subnet Container
- **Public:** Pale green `#E9F3E6` fill, 1px `#7AA116` border (light) / rgba(122,161,22,0.2) fill (dark)
- **Private:** Pale gray `#F0F0F0` fill, 1px `#879096` border (light) / rgba(135,144,150,0.2) fill (dark)
- **Label:** 11px label top-left: "Public Subnet" / "Private Subnet"

### VPC Container
- **Style:** Solid 1px `#8C4FFF` (Galaxy / Networking color)
- **Fill:** rgba(140,79,255,0.04) (light) / rgba(140,79,255,0.08) (dark)
- **Label:** H3 top-left with VPC icon

### Well-Architected Pillar Card
- **Width:** Spans grid column equally (6 pillars = 6 even columns)
- **Top accent bar:** 6px, pillar-specific color (see well-architected template)
- **Icon:** 48px pillar icon centered
- **Label:** H3 pillar name
- **Body:** 3–5 bullet points at Caption size

### OU / Account Card (multi-account)
- **Root (Organizations):** Navy `#232F3E` fill, white text, 8px radius
- **OU box:** Light mode: white with 1px `#EAEDED` border and category-colored left border (4px). Dark mode: `#314050` with colored left accent.
- **Member account:** Smaller card, icon = mxgraph.aws4.management_console or custom
- **Hierarchy lines:** 1px `#545B64`, right-angle connectors (not diagonal)

---

## 5. Layout Principles

### Spacing
- **Base unit:** 4px
- **Scale:** 4 / 8 / 16 / 24 / 40 / 64 / 96px
- **Component gap (horizontal flow):** 40px minimum between service cards
- **Region/AZ inset:** 24px padding inside boundary boxes
- **No element within 16px of another element** — generous whitespace is a key AWS Blog characteristic

### Canvas
- **Standard:** 1920×1080 (16:9) for presentation slides and AI image output
- **AWS Blog export:** 1024×576 crop from the same canvas
- **Grid:** 12 columns at 1920px; gutters 24px

### Flow Direction
- **Horizontal architecture:** Strictly left → right. Sources on left, targets on right.
- **Region/AZ layouts:** Top → bottom for tier stacking (public subnet on top of private subnet); within each tier, left → right.
- **Organizational hierarchy:** Top → bottom (root → OUs → accounts)

### Balance
- Odd number of components (3, 5) tends to feel more natural than even (4)
- If more than 6 services, consider a two-lane layout (ask user for lane names)
- White/Navy background must be visible — minimum 10% of canvas should be background color

---

## 6. Depth & Elevation

### Light Mode
- **Page:** flat `#FFFFFF`
- **Cards:** 0 2px 8px rgba(0,0,0,0.08) — barely-there shadow for depth
- **Boundary boxes:** no shadow, dashed border differentiates them
- **NO:** drop shadows on icons, glows, gradients

### Dark Mode
- **Page:** flat `#232F3E`
- **Cards:** no shadow; 3px category-color top accent bar provides visual hierarchy
- **Boundary boxes:** no glow, just border lightening
- **NO:** glass morphism, heavy drop shadows, neon glows (these are not 2023 AWS icon deck style)

---

## 7. Do's and Don'ts

> For the full anti-pattern reference with stable IDs (AP-01 … AP-14) used by `--verify`, see `references/anti-patterns.md`.

### ✅ Do
- Use each service's category color FROM its mxgraph.aws4 stencil — don't override it (AP-04)
- Use official AWS marketing names: "AWS Lambda" not "Lambda" alone; "Amazon S3" not "S3" alone; "Amazon OpenSearch Service" (three words); "AWS Fargate" not "Amazon Fargate" (AP-03, AP-10)
- Use dashed Region boundary → dotted AZ boundary → solid VPC boundary (three distinct line styles) (AP-08)
- Public subnet on top, Private subnet on bottom — always, consistently
- Use exhaustive-negation language in AI prompts to control arrow direction (AP-05)
- Describe icons concretely with marketing names: "a rounded-square AWS Lambda icon in Smile orange #ED7100"
- Cross-reference `aws-service-catalog.jsonl` for correct stencil names (AP-12)
- Specify `sketch=0` in every mxgraph.aws4 style string for crisp rendering (AP-11)

### ❌ Don't
- Don't use the old "Arctic Blue" (#1A9C3E or old #1B73BE) from pre-2023 AWS icon decks (AP-02)
- Don't recolor official AWS service icons away from their category color
- Don't use isometric 3D perspective (not the current AWS 2023 flat-icon style) (AP-01)
- Don't use glass morphism for service cards (that's the SaaS aesthetic, not AWS Blog) (AP-09)
- Don't add drop shadows in dark mode — use category top-border accent instead (AP-13)
- Don't mix "Squid Ink" and "Pure Black" (#000000) — always use `#232F3E` (AP-07)
- Don't label an AZ "Availability Zone A" — use "us-east-1a" (real names)
- Don't stack AZs horizontally — always stack them vertically (2 AZs = 2 rows) (AP-06)

---

## 8. Responsive Behavior

Illustrations are **static exports**, not responsive components. Target dimensions:

| Use case | Export size | Aspect ratio |
|---|---|---|
| Presentation slide | 1920×1080 | 16:9 |
| AWS Blog inline | 1024×576 | 16:9 (crop/resize from 1920) |
| AWS Blog header | 1600×900 | 16:9 |
| re:Invent keynote | 3840×2160 | 16:9 (scale up from 1920) |
| Twitter/LinkedIn card | 1200×628 | 1.91:1 (slight crop) |

For draw.io exports: always export at 1920×1080, `dpi=144`, PNG format, transparent background off.

---

## 9. Agent Prompt Guide

### Naming Convention Summary

**Always use the official AWS marketing name** in every AI prompt and every draw.io `value=""` label.

| Prefix | Rule | Examples |
|---|---|---|
| **Amazon** | Managed services providing a domain capability | Amazon S3, Amazon EC2, Amazon DynamoDB, Amazon RDS, Amazon Aurora, Amazon OpenSearch Service, Amazon CloudWatch, Amazon CloudFront, Amazon Route 53, Amazon Bedrock, Amazon SageMaker, Amazon API Gateway, Amazon ElastiCache, Amazon Redshift, Amazon Kinesis Data Streams, Amazon SQS, Amazon SNS, Amazon EventBridge, Amazon Cognito, Amazon GuardDuty |
| **AWS** | Platform / tooling / governance / framework | AWS Lambda, AWS Fargate, AWS IAM, AWS CloudFormation, AWS Control Tower, AWS Organizations, AWS WAF, AWS Shield, AWS KMS, AWS Step Functions, AWS Glue, AWS Config, AWS Batch, AWS CloudTrail, AWS Systems Manager, AWS App Runner, AWS Secrets Manager, AWS Global Accelerator, AWS Direct Connect, AWS X-Ray, AWS Data Prepper, AWS Elastic Beanstalk |
| **Elastic ___** | Legacy Elastic family — no prefix | Elastic Load Balancing (ALB/NLB) |

**Gotchas** (wrong prefix = brand error):
- `AWS Lambda` — NOT "Amazon Lambda"
- `Amazon API Gateway` — NOT "AWS API Gateway"
- `Amazon EventBridge` — NOT "AWS EventBridge"
- `AWS Fargate` — NOT "Amazon Fargate"
- `AWS X-Ray` — NOT "Amazon X-Ray"
- `Amazon OpenSearch Service` — full three words, NOT bare "OpenSearch"

---

### Quick Service → Color Reference
| Marketing Name | Category color | Hex |
|---|---|---|
| AWS Lambda, Amazon ECS, Amazon EC2, AWS Fargate | Smile (Compute) | `#ED7100` |
| Amazon S3, Amazon EBS, Amazon S3 Glacier | Endor (Storage) | `#7AA116` |
| Amazon API Gateway, Amazon EventBridge, Amazon SQS, Amazon CloudWatch | Cosmos (App Integration/Mgmt) | `#E7157B` |
| Amazon CloudFront, Amazon VPC, Amazon Route 53, Amazon Kinesis Data Streams | Galaxy (Networking/Analytics) | `#8C4FFF` |
| AWS IAM, Amazon Cognito, AWS KMS, AWS WAF, Amazon GuardDuty | Mars (Security) | `#DD344C` |
| Amazon Bedrock, Amazon SageMaker, Amazon Rekognition, AWS X-Ray | Orbit (AI/ML) | `#01A88D` |
| Amazon RDS, Amazon DynamoDB, Amazon Aurora, Amazon Redshift | Cosmos (Database) | `#E7157B` |

### Ready-to-Paste Style Blocks

**Light / AWS Blog technical:**
```
Style: Clean AWS architecture diagram on a white (#FFFFFF) background.
2023 AWS flat-icon style — NOT isometric, NOT glass morphism, NOT dark mode.
Service icons in their official AWS category colors: Compute icons in Smile
orange (#ED7100), Storage icons in Endor green (#7AA116), Security icons in
Mars red (#DD344C), Networking icons in Galaxy purple (#8C4FFF), AI/ML icons
in Orbit teal (#01A88D), Database icons in Cosmos pink (#E7157B).
Label every service with its official AWS marketing name — "Amazon S3",
"AWS Lambda", "Amazon OpenSearch Service", "Amazon CloudFront",
"Amazon API Gateway", "Amazon DynamoDB", "AWS Fargate", "AWS X-Ray".
Never shorten to bare "S3", "Lambda", "OpenSearch", or "Fargate" alone.
Text in Amazon Ember-style clean humanist sans-serif (fallback: Inter / Noto
Sans). Slate (#545B64) arrows, 1.5px weight, classic arrowhead.
Region boundary dashed. AZ boundary dotted. VPC boundary solid.
Aspect ratio 16:9, 1920x1080.
```

**Dark / re:Invent hero:**
```
Style: AWS re:Invent keynote-style illustration on Squid Ink navy
background (#232F3E). AWS 2023 dark-BG icon style — flat icons with slight
brightness boost for dark-mode visibility, NO glass morphism, NO neon glows.
Service icons in their 2023 category colors (same palette as light mode,
icons are the dark-BG variants). Orange (#FF9900) AWS brand accent used
sparingly on primary CTA element only. White (#FFFFFF) text. Pale gray
(#D5DBDB) arrows. Category-color 3px top border on cards instead of shadows.
Label every service with its official AWS marketing name — "Amazon S3",
"AWS Lambda", "Amazon OpenSearch Service", "Amazon CloudFront",
"Amazon API Gateway", "Amazon DynamoDB", "AWS Fargate", "AWS X-Ray".
Never shorten to bare "S3", "Lambda", "OpenSearch", or "Fargate" alone.
Aspect ratio 16:9, 1920x1080.
```

### mxgraph.aws4 XML Boilerplate

```xml
<mxfile>
  <diagram name="SLUG">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" background="#FFFFFF">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- SERVICE ICON CELL (light mode) -->
        <mxCell id="lambda1" value="AWS Lambda" vertex="1" parent="1">
          <mxGeometry x="200" y="200" width="78" height="78" as="geometry"/>
          <!-- style for light mode: -->
          <mxCell style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#ED7100;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;"/>
        </mxCell>

        <!-- REGION BOUNDARY -->
        <mxCell id="region1" value="us-east-1" vertex="1" parent="1" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_region;grStroke=1;verticalLabelPosition=top;verticalAlign=bottom;labelBackgroundColor=none;align=center;spacingTop=0;dashed=1;strokeColor=#545B64;fillColor=none;html=1;fontSize=14;fontColor=#545B64;fontStyle=1;">
          <mxGeometry x="100" y="100" width="800" height="500" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-24 | Full 2023 AWS palette (Smile/Endor/Cosmos/Galaxy/Mars/Orbit) | Correct, accessible, meets AWS brand standards; avoids deprecated Arctic Blue |
| 2026-04-24 | Amazon Ember + open fallbacks (Inter, Noto Sans, Open Sans) | Ember is proprietary; Inter is the closest visually available alternative |
| 2026-04-24 | No glass morphism, no isometric 3D | AWS 2023 flat-icon style doesn't use these; they belong to SaaS/fintech aesthetics |
| 2026-04-24 | Dual light/dark modes via --theme flag | AWS publishes both Light-BG and Dark-BG icon decks; both are legitimate use cases |
| 2026-04-24 | Cloudscape Design System cited as upstream | cloudscape.design is AWS's official product-UI system; aligning ensures diagrams harmonize with AWS Console screenshots |
| 2026-04-24 | Vertically stacked AZs (not side-by-side) | Matches the official AWS reference architecture diagram convention |
| 2026-04-24 | Public subnet on top, Private on bottom | Universal AWS convention; deviating would confuse AWS-fluent readers |
