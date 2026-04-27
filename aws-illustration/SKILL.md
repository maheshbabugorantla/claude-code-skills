---
name: aws-illustration
description: |
  Generate high-fidelity AWS architecture illustrations — paired Gemini AI
  image prompt (PNG) + draw.io XML using mxgraph.aws4 stencils. Dual
  light/dark themes, 10 illustration types, full 2023 AWS service-category
  palette (Smile/Endor/Cosmos/Galaxy/Mars/Orbit), official marketing-name
  labels enforced.
triggers:
  - "AWS architecture diagram"
  - "AWS Blog illustration"
  - "re:Invent hero"
  - "Lambda architecture"
  - "AWS Lambda architecture"
  - "Bedrock architecture"
  - "Amazon Bedrock pipeline"
  - "ECS diagram"
  - "Amazon ECS / AWS Fargate deployment"
  - "S3 pipeline"
  - "CloudFront diagram"
  - "multi-account landing zone"
  - "Well-Architected review"
  - "VPC diagram"
  - "region-diagram"
  - "/aws-illustration"
proactively_suggest_when:
  - User describes an AWS architecture in prose and a visual would clarify
  - User asks "how does this flow work" about an AWS service chain
  - User is drafting an AWS Blog post, Confluence page, or re:Invent slide
  - User mentions preparing a reference architecture or design review doc
  - User writes out a multi-service data flow (API GW → Lambda → …) in chat
allowed-tools:
  - Read
  - Write
  - Bash
  - WebFetch
---

# aws-illustration

Generate high-fidelity AWS architecture illustrations with two outputs:
1. **AI image prompt** — Gemini-optimized, paste into Gemini/DALL-E/Midjourney → PNG
2. **draw.io XML** — `mxgraph.aws4` stencils → open in diagrams.net → export 1920×1080 PNG

Design spec: read `DESIGN.md` (colocated in this skill folder) for the authoritative AWS palette, typography, and layout rules.

> **Requirements:** `jq` for service lookup (`brew install jq` / `apt-get install jq`); `sha256sum`, `shasum`, or `openssl` for catalog integrity (pre-installed on macOS/Linux). Outputs are opened in [draw.io / diagrams.net](https://app.diagrams.net).

---

## When NOT to use

- NOT for non-AWS clouds (use `dimensional-illustration` or `saas-illustration` instead)
- NOT for UI mockups of the AWS Management Console (use `saas-illustration`)
- NOT for editable Visio or Lucidchart files (output is draw.io XML only)
- NOT for marketing one-pagers without technical architecture content (use `crayon-illustration`)

---

## Critical Rules

- **Always read `DESIGN.md`** before generating — it is the source of truth for colors, typography, and Do's/Don'ts
- Every AI prompt MUST include the full AWS style block (see DESIGN.md § Agent Prompt Guide)
- Every draw.io XML MUST use `mxgraph.aws4.*` stencils (light or dark variant based on `--theme`); never plain rectangles for services
- **Always set `sketch=0`** in every mxgraph.aws4 style string — critical for clean 2023 icon rendering
- Run the **consultation flow** from `references/consultation.md` before generating (with `[Step N/M]` progress indicators)
- Verify stencil names against `references/aws-service-catalog.jsonl` if `--verify` is set
- See `references/anti-patterns.md` for the full list of issues and their stable AP-IDs

---

## Invocation

```
/aws-illustration <type> "Topic" [--theme=light|dark] [--from=<file>] [--verify]
```

**Types:** `concept-cards`, `mapping`, `architecture`, `workflow`, `grid`, `split-panel`, `process-flow`, `region-diagram`, `well-architected`, `multi-account`

**Flags:**
- `--theme=light` (default) — white background, standard mxgraph.aws4 stencils
- `--theme=dark` — Squid Ink navy `#232F3E` background, `_dark` stencil suffix where available
- `--from=<file>` — parse a text file for AWS service names, pre-fill consultation Step 1
- `--verify` — run 4 parallel specialist audits (palette, marketing-names, stencils, anti-slop) and aggregate findings; see `references/specialists/`
- `--preview` (alias `--dry-run`) — write outputs to `~/.aws-illustration/projects/$SLUG/<YYYY-MM-DD>/` scratch dir and ask for confirmation before copying to the working repo

---

## Implementation Steps

1. **Read** `DESIGN.md` → load palette, typography, Do's and Don'ts
2. **Parse flags** from the invocation (theme, from-file, verify)
3. **If `--from=<file>`**: read the file, extract AWS service names (compare against service names in `references/aws-service-catalog.md`), pre-fill the consultation's services step
4. **Run consultation** from `references/consultation.md`:
   - Show `[Step N/M — Topic]` progress header for each question
   - Every option must include a "why this matters" explanation
   - Skip steps already answered by the invocation (named services, explicit `--theme`, named flow direction, etc.)
   - Use `AskUserQuestion` tool with multi-select where appropriate
5. **Read template** from `references/templates/<type>.md`
6. **For types with directional flow** (`architecture`, `workflow`, `split-panel`, `process-flow`, `region-diagram`, `multi-account`): read `references/layout-rules.md`
7. **Generate two outputs**:

   **Output A — AI image prompt** saved to `img/<slug>-prompt.md`:
   - Use the template + consultation answers + DESIGN.md style block
   - Gemini-first phrasing (per `references/tips.md`)
   - Full AWS style block verbatim from DESIGN.md § Agent Prompt Guide
   - Exhaustive-negation language for arrows (see layout-rules.md)
   - State layout constraints 3 times (opening rule block + inline + closing confirm)

   **Output B — draw.io XML** saved to `diagrams/<slug>.drawio`:
   - Use the XML skeleton from the template
   - Look up every service in `references/aws-service-catalog.jsonl` → use the `resicon` field as the draw.io style attribute value:
     ```
     style="shape=mxgraph.aws4.resourceIcon;resIcon=<resicon>;sketch=0;fillColor=<HEX>;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;"
     ```
   - **CRITICAL: resIcon values use underscores, NEVER spaces.** `mxgraph.aws4.elastic_beanstalk` is correct; `mxgraph.aws4.elastic beanstalk` silently fails (draw.io style parser truncates at the space, rendering a blank box). All multi-word entries in the JSONL catalog use underscores. Source of truth: `Sidebar-AWS4.js` in the jgraph/drawio repo.
   - Set `value="<Marketing Name>"` (full AWS marketing name) on every service icon cell
   - Light: `background="#FFFFFF"`, standard stencils, `fontColor=#232F3E`
   - Dark: `background="#232F3E"`, `_dark` stencil suffix where available, `fontColor=#FFFFFF`, `strokeColor=#D5DBDB`
   - Always include `sketch=0` in every icon style string
   - Use group stencils (`shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_*`) for Region/AZ/VPC/OU boundaries

7c. **Marketing name enforcement** — before writing outputs, look up every service in `references/aws-service-catalog.jsonl` (machine-readable) or `references/aws-service-catalog.md` (human-readable) and replace any short-form service references with the `marketing` field value. Apply to BOTH the AI prompt text AND every draw.io `value="…"` label. If a short name was typed by the user (e.g., "Lambda"), the consultation already confirmed → use "AWS Lambda" in outputs.

7d. **Unlisted service lookup** — if a service named by the user is NOT in `references/aws-service-catalog.jsonl`, or if a stencil entry has `"note":"Verify resicon"`, do not guess. Take both steps:

   **Step A — find the marketing name:**
   - Search query: `"<service name>" site:docs.aws.amazon.com`
   - Or fetch `https://aws.amazon.com/products/` to scan the official product catalog
   - The first `<h1>` or page title on the official AWS docs page is the definitive marketing name

   **Step B — find the authoritative resIcon value from the draw.io repo:**
   - Primary: fetch `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/diagramly/sidebar/Sidebar-AWS4.js` and search for the service name. The `resIcon=` values defined there are authoritative for what the draw.io app actually uses.
   - Fallback: fetch the AWS4 stencil XML `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/stencils/aws4.xml`, find `<shape name="mxgraph.aws4/SERVICE NAME">`, then **convert spaces to underscores** to get the resIcon value: `mxgraph.aws4/elastic beanstalk` → `resIcon=mxgraph.aws4.elastic_beanstalk`.
   - **NEVER use spaces in resIcon values** — the draw.io style parser treats spaces as delimiters and silently truncates the value, causing a blank orange/purple placeholder box instead of the icon.
   - If a future `aws5.xml` or later version appears at this repo, check it the same way — the namespace prefix must be updated to match.

   **Step C — update the catalog:**
   - Confirm the discovered name with the user (e.g., "You mentioned 'Data Prepper' — the AWS managed equivalent is **Amazon OpenSearch Ingestion**. Shall I use that?")
   - After confirming, append the new entry to `references/aws-service-catalog.jsonl` AND add a row to `references/aws-service-catalog.md` so the catalog grows organically
   - Remove any `"note":"Verify resicon"` flag once the resicon is confirmed against the repo

7e. **Self-check marker** — prepend the following HTML comment as the very first line of every generated `diagrams/<slug>.drawio` file (before `<mxfile>`):
   ```xml
   <!-- aws-illustration: v=1, catalog-hash=HASH, theme=THEME, type=TYPE, generated=ISO8601, slug=SLUG -->
   ```
   Where `HASH` = first 12 chars of SHA256 of `references/aws-service-catalog.jsonl` (run `bin/aws-catalog-hash.sh` to get it). This allows future `--verify` runs and regenerations to detect catalog drift.

8. **If `--verify`**: dispatch 4 audits in **parallel** using Agent(Explore) calls, one per specialist:
   - `references/specialists/palette-audit.md` — checks every `fillColor` hex
   - `references/specialists/marketing-name-audit.md` — checks every `value="…"` on service cells
   - `references/specialists/stencil-verifier.md` — checks every `shape=mxgraph.aws[34].*` token
   - `references/specialists/anti-slop-audit.md` — checks the AI prompt for Gemini drift patterns
   Wait for all 4 to complete, aggregate their JSON-line findings (deduped by `{cell_id, ap_id}`), and print a summary table. Each finding cites an `AP-NN` ID from `references/anti-patterns.md`.
   Also check the self-check marker's `catalog-hash` against the current catalog; warn if stale.
   **3-strike rule:** if the same anti-pattern appears for the 3rd time in succession (same AP-ID, same run), switch to draw.io-only mode and tell the user that Gemini is not converging on this axis.

9. **If `--preview`**: write outputs to `~/.aws-illustration/projects/<SLUG>/<YYYY-MM-DD>/` instead of the working repo's `img/` and `diagrams/`. Print a summary of what would be written, then ask via `AskUserQuestion`: "Copy to working repo `img/` + `diagrams/`? (Yes / No — keep in scratch / Iterate first)". Scratch dirs older than 30 days are safe to delete.

10. **Display** the AI prompt text so the user can copy-paste directly into Gemini
11. **Instruct** user:
    - Paste AI prompt → Gemini / DALL-E / Midjourney → export 1920×1080 PNG → save as `img/<slug>.png`
    - Open `diagrams/<slug>.drawio` in diagrams.net (free web or desktop) → File → Export as → PNG, 1920×1080 → save as `diagrams/<slug>.png`
    - For Gemini multi-modal: optionally attach `assets/palette.svg` as a reference image for better color fidelity

12. **Completion Status** — end EVERY run with exactly one of:

```
## Completion Status: DONE

**Generated:**
- img/<slug>-prompt.md (<size>)
- diagrams/<slug>.drawio (<size>)

**Verification:** ✅ palette · ✅ marketing-names · ✅ stencils · ✅ anti-slop

**Next steps:**
- Paste prompt into Gemini → export 1920×1080 PNG → img/<slug>.png
- Open diagrams/<slug>.drawio in diagrams.net → export 1920×1080 PNG
```

   Or `DONE_WITH_CONCERNS` (findings present but diagram usable — list AP-IDs), or `BLOCKED` (unresolved issue prevents correct output).

---

## Style Block (embed in EVERY AI prompt)

### Light theme:
```
Style: Clean AWS architecture diagram on a white (#FFFFFF) background.
2023 AWS flat-icon style — NOT isometric, NOT glass morphism, NOT dark mode.
Service icons in their official 2023 AWS category colors: Compute/Containers in
Smile orange (#ED7100), Storage/IoT in Endor green (#7AA116), App Integration and
Database in Cosmos pink (#E7157B), Networking/Analytics in Galaxy purple (#8C4FFF),
Security/Identity in Mars red (#DD344C), AI/ML/Migration in Orbit teal (#01A88D).
Label every service with its official AWS marketing name — "Amazon S3", "AWS Lambda",
"Amazon OpenSearch Service", "Amazon CloudFront", "Amazon API Gateway", "Amazon DynamoDB",
"AWS Fargate", "AWS X-Ray", "AWS Data Prepper". Never shorten to bare "S3", "Lambda",
"OpenSearch", or "Fargate" alone.
Text in Amazon Ember-style clean humanist sans-serif (fallback: Inter, Noto Sans).
Slate (#545B64) arrows, 1.5px weight, classic arrowhead. White (#FFFFFF) card
backgrounds, 1px #EAEDED borders, subtle 0 2px 8px shadow. AWS Blog reference
architecture style. Aspect ratio 16:9, 1920x1080.
```

### Dark theme:
```
Style: AWS re:Invent keynote-style illustration on Squid Ink navy background (#232F3E).
2023 AWS dark-BG icon style — flat icons, NO glass morphism, NO neon glows, NOT
isometric. Service icons in their 2023 category colors (same palette as light mode,
dark-BG icon variants). Squid Ink (#232F3E) background — NOT pure black. White
(#FFFFFF) text. Pale gray (#D5DBDB) arrows, 1.5px. Category-color 4px top border
on cards instead of drop shadows. Dark card surface: #314050.
Label every service with its official AWS marketing name — "Amazon S3", "AWS Lambda",
"Amazon OpenSearch Service", "Amazon CloudFront", "Amazon API Gateway", "Amazon DynamoDB",
"AWS Fargate", "AWS X-Ray", "AWS Data Prepper". Never shorten to bare "S3", "Lambda",
"OpenSearch", or "Fargate" alone.
AWS re:Invent keynote illustration style. Aspect ratio 16:9, 1920x1080.
```

---

## Illustration Types

### `concept-cards` — 3–5 cards with icons and titles
**Layout:** Cards left-to-right, slate arrows. Category-color top borders.
**Template:** `references/templates/concept-cards.md`

### `mapping` — Two-column concept mapping
**Layout:** Left column (source) → Right column (AWS equivalents). Dotted connectors.
**Template:** `references/templates/mapping.md`

### `architecture` — Left-to-right component flow
**Layout:** 4–7 service components left-to-right. Labeled arrows. Single-row default; two-lane when user confirms.
**Template:** `references/templates/architecture.md`
**Requires:** `references/layout-rules.md`

### `workflow` — Nested Gantt/trace bars
**Layout:** Nested horizontal bars showing execution timeline. Primary bars + parallel groups.
**Template:** `references/templates/workflow.md`
**Requires:** `references/layout-rules.md`

### `grid` — Card grid with icons
**Layout:** N×M card grid with category-color top bars. No arrows.
**Template:** `references/templates/grid.md`

### `split-panel` — Architecture flow + summary panel
**Layout:** Left 2/3 = architecture flow. Right 1/3 = summary card with bullets.
**Template:** `references/templates/split-panel.md`
**Requires:** `references/layout-rules.md`

### `process-flow` — Tall panels with labeled arrows
**Layout:** 3–5 tall panels left-to-right, category-color top bars, bold labeled arrows.
**Template:** `references/templates/process-flow.md`
**Requires:** `references/layout-rules.md`

### `region-diagram` — Region / VPC / AZ / Subnet layout *(NEW)*
**Layout:** Region boundary (dashed) → VPC (solid purple) → 2 AZ boundaries (dotted, STACKED VERTICALLY) → public+private subnets → services.
**Default:** Single region, 2 AZs, public on top / private on bottom.
**Template:** `references/templates/region-diagram.md`
**Requires:** `references/layout-rules.md` (especially AWS Region/AZ Hierarchy Rules)

### `well-architected` — Pillar cards *(NEW)*
**Layout:** 1–6 pillar cards, user-selected. Pillar-specific colors. 3 bullets per pillar.
**Template:** `references/templates/well-architected.md`
**Note:** Ask the user which pillars to include at `[Step 1/3 — Pillar selection]`.

### `multi-account` — AWS Organizations hierarchy *(NEW)*
**Layout:** Root → OUs → member accounts. Right-angle connectors only. Top-to-bottom hierarchy.
**Default:** AWS Control Tower standard (Security OU + Workloads OU + Sandbox OU).
**Template:** `references/templates/multi-account.md`
**Requires:** `references/layout-rules.md`

---

## Output File Format

Save AI prompt to `img/<slug>-prompt.md`:

```markdown
# AWS Illustration Prompt: {{Topic}}

**Type:** {{type}}
**Theme:** {{light|dark}}
**Output file:** `img/{{slug}}.png`
**Resolution:** 1920x1080 (16:9)

## Prompt

{{The full prompt text — ready to copy-paste into Gemini}}

## Notes

- Generated with `/aws-illustration {{type}} "{{Topic}}" --theme={{theme}}`
- Export as PNG at 1920x1080
- Save to `img/{{slug}}.png`
- For better color fidelity, attach `~/.claude/skills/aws-illustration/assets/palette.svg`
  as a reference image in Gemini before pasting this prompt
```

Save draw.io XML to `diagrams/<slug>.drawio` (plain text XML, no encoding).

Then display the prompt text directly.

---

## Tips

Read `references/tips.md` for full guidance. Quick rules:
- Name AWS marketing service names ("AWS Lambda", "Amazon S3"), not generic ("serverless compute", "object storage")
- Always specify the 2023 category color explicitly with hex — don't say "its AWS color"
- Add "2023 AWS flat-icon style" and "AWS Blog reference architecture style" to every prompt
- Use `sketch=0` in all mxgraph.aws4 style strings
- For Gemini: attach `assets/palette.svg` as a reference image for category-color fidelity

## Examples

See `references/examples.md` for 3 full worked examples:
1. Serverless Web App (`architecture`, light) — CloudFront → API GW → Lambda → DynamoDB + S3
2. Bedrock RAG Pipeline (`process-flow`, dark) — RAG pipeline with OpenSearch + S3
3. Multi-Account Landing Zone (`multi-account`, light) — Control Tower OU structure

## Troubleshooting

See `references/troubleshooting.md` for fixes. Most common issues:
- Old AWS palette rendered → add "2023 AWS icon style, NOT the old Arctic Blue palette"
- AZs side by side → state vertical stacking 3 times in the prompt
- Blank draw.io boxes → stencil name typo, run `--verify`
- Dark mode = pure black → specify "Squid Ink navy (#232F3E), NOT pure black"
