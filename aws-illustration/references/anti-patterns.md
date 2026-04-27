# AWS Illustration Anti-Patterns

Stable IDs for known failure modes. `--verify` cites these IDs in findings.
Each entry: **symptom**, **detection signal**, **fix**.

---

## AP-01 — Isometric 3D service boxes

**Reject:** Any 3D perspective, isometric tile, "layered card deck," or axonometric layout.
**Detection:** Prompt contains "isometric", "3D", "perspective", "axonometric", "layered", or "depth".
**Fix:** Add to prompt: `"FLAT 2D icons. NOT isometric. NOT 3D perspective. NOT layered cards."`
Also add: `"2023 AWS flat-icon style — identical to aws.amazon.com/architecture/icons/"`

---

## AP-02 — Old Arctic Blue / pre-2023 palette

**Reject:** Pre-2023 AWS icons (blue gradient fills, gray rounded squares, 3D shading).
**Detection:** Generated PNG shows blue-gradient tiled icons; or prompt lacks "2023 AWS flat-icon style".
**Fix:** Add to prompt: `"2023 AWS flat-icon style. NOT the pre-2023 Arctic Blue palette. NOT blue gradient icons."`

---

## AP-03 — Short-form service labels in draw.io XML

**Reject:** `value="Lambda"`, `value="S3"`, `value="OpenSearch"`, `value="Fargate"`, etc.
**Detection:** `--verify` reads every `value="…"` on cells where `shape=mxgraph.aws3.*`. Flags values not matching the `marketing` field in `aws-service-catalog.jsonl`.
**Fix:** Replace with the exact `marketing` field from the catalog: `value="AWS Lambda"`, `value="Amazon S3"`.
**Common misses:** `value="API Gateway"` → `"Amazon API Gateway"` · `value="EventBridge"` → `"Amazon EventBridge"` · `value="CloudWatch"` → `"Amazon CloudWatch"` · `value="Fargate"` → `"AWS Fargate"`

---

## AP-04 — Uniform orange for all services

**Reject:** Gemini painting every icon with `#FF9900` or `#ED7100` (Smile orange) regardless of category.
**Detection:** Prompt says "each icon in its AWS color" or "correct AWS colors" without per-service hex codes.
**Fix:** Spell out each service's category hex explicitly. Never say "use its AWS color" — always provide the hex: `"AWS Lambda icon in Smile orange (#ED7100)"`, `"Amazon S3 icon in Endor green (#7AA116)"`.

---

## AP-05 — Curved or reversed arrows

**Reject:** Arrows that curve, bend diagonally, point leftward, or loop back.
**Detection:** Generated PNG shows curved arcs or backward flow; or prompt lacks exhaustive negation.
**Fix:** Add exhaustive-negation block:
```
All arrows point strictly RIGHT. No arrows point LEFT. No arrows point DOWN.
No diagonal arrows. No curved arrows. No arcs. No arrows that reverse direction.
```
State this rule 3 times (opening rule block + inline per component + closing confirm).

---

## AP-06 — AZs placed side by side horizontally

**Reject:** Two AZ boxes sitting left-right instead of top-bottom.
**Detection:** Generated PNG shows AZ-A and AZ-B at the same Y position.
**Fix:** State vertical stacking 3 times (opening + inline + closing):
```
CRITICAL: AZs are stacked VERTICALLY. AZ us-east-1a is in the TOP ROW.
AZ us-east-1b is in the BOTTOM ROW. They are NOT side by side horizontally.
```

---

## AP-07 — Pure black dark-mode background

**Reject:** Background renders as `#000000` instead of Squid Ink navy `#232F3E`.
**Detection:** Generated PNG background is pure black, or `mxGraphModel background="#000000"`.
**Fix:** Specify `"Squid Ink navy (#232F3E) background, NOT pure black"` and add `"very dark navy-blue, like the AWS Management Console, not pure black"`.

---

## AP-08 — All-solid boundary lines (no visual hierarchy)

**Reject:** Region, AZ, and VPC boundaries all rendered as identical solid lines.
**Detection:** XML uses `dashed=0` for all three boundary types; or generated PNG shows no visual difference.
**Fix:** Enforce distinct styles per layer:
- Region: `dashed=1` (dashed line)
- AZ: `dashed=1; strokeDashPattern=4 4` (dotted, shorter gaps)
- VPC: `dashed=0; strokeColor=#8C4FFF` (solid purple)

---

## AP-09 — Glass morphism / neon glow effects

**Reject:** Frosted glass, translucent panels, neon outlines, bloom effects.
**Detection:** Prompt lacks explicit negation; generated PNG shows glow or transparency.
**Fix:** Add to prompt: `"NO glass morphism. NO frosted glass. NO neon glows. NO bloom effects. Flat, clean, solid."`

---

## AP-10 — Wrong Amazon/AWS prefix (brand error)

**Reject:** "Amazon Lambda", "Amazon Fargate", "Amazon X-Ray", "AWS API Gateway", "AWS EventBridge", "AWS S3", "AWS DynamoDB", "AWS CloudWatch".
**Detection:** marketing-name-audit.md compares every label against the `prefix` field in `aws-service-catalog.jsonl`. Wrong-prefix match = AP-10.
**Fix:** Use the correct prefix:
| ❌ Wrong | ✅ Correct |
|---|---|
| Amazon Lambda | **AWS Lambda** |
| Amazon Fargate | **AWS Fargate** |
| Amazon X-Ray | **AWS X-Ray** |
| AWS API Gateway | **Amazon API Gateway** |
| AWS EventBridge | **Amazon EventBridge** |
| AWS CloudWatch | **Amazon CloudWatch** |
| AWS DynamoDB | **Amazon DynamoDB** |
| AWS S3 | **Amazon S3** |

---

## AP-11 — Sketchy / rough icon rendering (`sketch=1`)

**Reject:** Icons rendered in draw.io with a hand-drawn / rough style.
**Detection:** Any `sketch=1` in an mxgraph.aws4 style string.
**Fix:** Replace `sketch=1` with `sketch=0` in every service icon style string.

---

## AP-12 — Blank gray placeholder boxes

**Reject:** Service icons rendered as plain gray or white rectangles in draw.io.
**Detection:** Opening the `.drawio` file shows placeholder boxes; or `shape=mxgraph.aws3.UNKNOWN`.
**Fix:**
1. Run `--verify` to find the stencil name mismatch.
2. Check the `stencil` field in `aws-service-catalog.jsonl` for the correct name.
3. In draw.io: Extras → Edit Diagram → correct the `shape=` value manually.
4. Ensure the AWS shape library is loaded (Sidebar → `+` → AWS).

---

## AP-13 — Missing category-color top border in dark mode

**Reject:** Dark-mode cards with no colored top border (should replace drop shadows).
**Detection:** Dark theme XML uses `shadow=1` instead of a 4px category-color top border.
**Fix:** For dark mode, remove shadows. Add a top-border rectangle cell with `fillColor=<CATEGORY_HEX>; height=4` positioned above the card.

---

## AP-14 — Region boundary as a plain rectangle (no AWS icon badge)

**Reject:** Region or AZ boundary rendered as a featureless rectangle with no label badge.
**Detection:** XML uses `shape=mxgraph.aws4.group` instead of the correct group stencil.
**Fix:** Use `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_region` for Region and `grIcon=mxgraph.aws4.group_availability_zone` for AZ. See the XML boilerplate in DESIGN.md §9.

---

## AP-15 — Canvas larger than its content (blank space around diagram)

**Reject:** `pageWidth`/`pageHeight` set to a standard presentation size (e.g., 1920×1080) when the diagram content fills a much smaller area, leaving visible blank margins.
**Detection:** Generated PNG shows large empty regions above/below/beside the diagram. Card heights/icon sizes inflated beyond content needs to "fill" the canvas.
**Fix:** Size the canvas to the content bounding box + consistent margins (~70px all sides). Content drives canvas dimensions — never the reverse. Do NOT inflate cards, icons, or font sizes to fill empty space.
**Rule:** For a 5-card horizontal flow with 300×320px cards, the correct page is ~1920×560, not 1920×1080.

---

## AP-16 — Arrow with no arrowhead (`endArrow=none`)

**Reject:** Edges rendered as plain lines with no arrowhead, making data-flow direction ambiguous.
**Detection:** XML contains `endArrow=none` on any edge in an architecture or flow diagram; or generated PNG shows lines without arrowheads.
**Fix:** Replace `endArrow=none` with `endArrow=classic;strokeWidth=3;` (light mode) or `endArrow=classic;strokeWidth=1.5;` (dark mode). The default draw.io edge style is `endArrow=none` — always override it explicitly.

---

## AP-17 — Arrow label text overlapping the arrow line

**Reject:** Edge label text sits directly on top of the arrow line, making both unreadable.
**Detection:** Generated PNG shows arrow labels without a white pill/background behind them; or XML edge style lacks `labelBackgroundColor`.
**Fix:** Add `labelBackgroundColor=#FFFFFF;labelBorderColor=none;` to the edge style (light mode) or `labelBackgroundColor=#232F3E;labelBorderColor=none;` (dark mode). To raise the label above the arrow line, also add `<mxGeometry relative="1" y="-26" as="geometry">` on the edge.

---

## AP-18 — Editing user-modified .drawio files without re-reading first

**Reject:** Using a previously-generated XML version as the basis for an edit after the user has opened and saved the file in the draw.io app.
**Detection:** Edit tool fails with "old_string not found"; or cell IDs in file look like auto-generated hashes (`DWI07qY1gQkEyFEA6n7L-N`) rather than semantic names.
**Fix:** Always Read the .drawio file immediately before any Edit. The draw.io app mutates cell IDs to auto-generated strings, injects HTML wrappers (`<div><br></div>`) into `value=` attributes, and may silently revert text changes. Last-known state is never current state after a user save.
