# Layout Rules

Apply these rules to all AWS illustration types that have directional flows or container hierarchies.
Extends the layout-rules pattern from dimensional-illustration with AWS-specific additions.

---

## Universal Flow Direction Rules

- **State flow direction at the TOP of the prompt** — before describing any components.
- **Exhaustive negation** — "All arrows point strictly RIGHT" is insufficient alone. Always add:
  > "No arrows point downward. No arrows point left. No diagonal arrows. No curved arrows that change direction."
- **Fallback instruction** — always include:
  > "If components don't fit on one row, shrink them or reduce label font size — never wrap to a second row."

---

## Single-Row Enforcement (architecture type)

- Default to ONE horizontal row. State this three times:
  1. As a rule block at the top of the prompt
  2. Inline after listing each component
  3. As a closing constraint after all components
- Number components in sequence (Component 1, Component 2, …) for unambiguous ordering.
- After listing all: "All N components sit on the same horizontal level."

---

## Two-Lane Layouts (when intentional)

- Only use two-lane layouts when the user explicitly confirms it.
- **Always ask the user for lane names** — never invent generic labels like "Top Lane" / "Bottom Lane".
  Suggest 2–3 context-appropriate options, e.g.:
  - Cloud infra → "Data Plane" / "Control Plane"
  - CI/CD → "Build Pipeline" / "Deployment Subsystem"
  - Async processing → "Hot Path" / "Background Workers"
- Cross-lane arrows: only one cross-lane arrow is typical (from rightmost top component to leftmost bottom component). State which one it is.
- Within each lane: strictly left-to-right. The cross-lane arrow points **downward only**.

---

## Redundancy Strategy

State layout constraints **THREE times**:
1. As an opening rule block before any component description
2. Inline with each component's placement ("sits in position N on the horizontal row")
3. As a summary after all components

This is not excessive — single-mention layout instructions are routinely ignored by image generation models.

---

## AWS Region / AZ Hierarchy Rules

These rules apply specifically to `region-diagram` illustrations.

### Region boundary
- Drawn as a **dashed** border box.
- Label at **top-left** inside the box, prefixed with the region icon: e.g., `▣ us-east-1`.
- The Region box **spans all AZ children** horizontally.
- In AI prompts: state explicitly "The Region boundary box contains all Availability Zones."
- **Never cross the region boundary** with an arrow that starts AND ends outside it — arrows either enter from outside (internet, user) or stay within.

### Availability Zone boundaries
- Drawn as a **dotted** border box (distinct from Region's dashed).
- Label at top: `us-east-1a`, `us-east-1b`, etc.
- **Stack AZs vertically** — one AZ per row, stacked top to bottom. NEVER place AZs side by side horizontally.
  > "AZ us-east-1a is in the TOP row. AZ us-east-1b is in the BOTTOM row. They are stacked vertically, NOT side by side."
- Each AZ contains: Public Subnet (top half) + Private Subnet (bottom half).

### Subnet rules
- **Public subnet always on top** within an AZ.
- **Private subnet always on bottom** within an AZ.
- This layout is consistent across all AZs — never put Private above Public in any AZ.
- In AI prompts: state this rule 3 times using the same redundancy strategy.

### VPC boundary
- Drawn as a **solid** border box (third line style).
- Color: Galaxy purple `#8C4FFF` at 1px (it's a networking construct).
- Nested inside the Region boundary.
- Label: "My VPC" or the user-specified name.

### Nesting order
```
[AWS Cloud boundary]
  └── [Region boundary — dashed]
        └── [VPC boundary — solid purple]
              └── [AZ boundary — dotted]
                    ├── [Public Subnet — green border]
                    │     └── Services (Application Load Balancer, NAT Gateway, bastion host)
                    └── [Private Subnet — gray border]
                          └── Services (AWS Lambda, Amazon ECS, Amazon RDS, Amazon EC2)
```

Services that live OUTSIDE VPC: Amazon CloudFront, Amazon Route 53, Amazon S3 (conceptually), AWS IAM, Amazon API Gateway (sometimes).
Always ask the user where each service belongs before placing.

---

## Multi-Account Hierarchy Rules

Applies to `multi-account` illustrations.

- Flow is **top-to-bottom** (root → OUs → accounts).
- Organization root at the top center.
- OUs below root, connected with **right-angle connectors** (not diagonal).
- Member accounts below OUs, same connector style.
- Maximum depth: 4 levels (Root → OU → Sub-OU → Account).
- If more than 5 OUs, split into two columns with Root spanning both.
- Never use curved or diagonal hierarchy lines.

---

## Grouping / Boundary Box Rules

- Boundary boxes (Region, AZ, VPC, OU) use **three distinct line styles**:
  - Dashed = Region
  - Dotted = AZ
  - Solid = VPC / OU / Security Group
- No two nested boxes use the same line style.
- In draw.io XML: use the correct `mxgraph.aws4.group_*` stencil for each container type (see `aws-service-catalog.md`).

---

## Arrow Labeling Rules

- Arrows between architecture components should carry a **protocol or payload label** when known:
  - REST API call → `REST`
  - Amazon S3 event → `S3 Event`
  - Amazon SQS message → `SQS`
  - Amazon Kinesis stream → `Kinesis stream`
  - HTTPS → `HTTPS`
  - gRPC → `gRPC`
- Keep labels ≤ 3 words.
- Place label on the midpoint of the arrow, not overlapping components.
- In draw.io XML: set the label on the `mxCell edge` element's `value` attribute.

---

## Whitespace Rules

- **No component within 40px of another component** (in draw.io logical units, where 1 unit ≈ 1px at 100% zoom).
- **16px minimum clearance** between a component and its containing boundary box.
- **24px inset** for boundary box labels from the box edge.
- Region + AZ boundaries should look "roomy" — a tight layout that clips the boundaries looks unprofessional.
- Leave at least **10% of the canvas as background color** (don't fill edge-to-edge).
