---
name: gcp-illustration
description: |
  Generate high-fidelity Google Cloud Platform (GCP) architecture illustrations —
  paired Gemini AI image prompt (PNG) + draw.io XML using mxgraph.gcp2 stencils.
  Dual light/dark themes, 10 illustration types, full Google core palette
  (Blue/Red/Yellow/Green), official marketing-name labels enforced.
triggers:
  - "GCP architecture diagram"
  - "Google Cloud illustration"
  - "Cloud Run pipeline"
  - "GKE deployment"
  - "BigQuery data flow"
  - "Google Cloud SQL architecture"
  - "VPC network diagram"
  - "GCP region diagram"
  - "Google Cloud Next slide"
  - "GCP blog illustration"
  - "/gcp-illustration"
proactively_suggest_when:
  - User describes a GCP architecture in prose and a visual would clarify
  - User asks "how does this flow work" about a Google Cloud service chain
  - User is drafting a GCP Blog post, Confluence page, or presentation slide
  - User mentions preparing a reference architecture or design review doc for GCP
  - User writes out a multi-service data flow (e.g., Pub/Sub → Dataflow → BigQuery) in chat
allowed-tools:
  - Read
  - Write
  - Bash
  - WebFetch
---

# gcp-illustration

Generate high-fidelity Google Cloud architecture illustrations with two outputs:
1. **AI image prompt** — Gemini-optimized, paste into Gemini/DALL-E/Midjourney → PNG
2. **draw.io XML** — `mxgraph.gcp2` stencils → open in diagrams.net → export 1920×1080 PNG

Design spec: read `DESIGN.md` (colocated in this skill folder) for the authoritative Google Cloud palette, typography, and layout rules.

> **Requirements:** `jq` for service lookup (`brew install jq` / `apt-get install jq`); `sha256sum`, `shasum`, or `openssl` for catalog integrity (pre-installed on macOS/Linux). Outputs are opened in [draw.io / diagrams.net](https://app.diagrams.net).

---

## When NOT to use

- NOT for non-GCP clouds (use `aws-illustration` for AWS, `dimensional-illustration` for generic cloud)
- NOT for UI mockups of the Google Cloud Console (use `saas-illustration`)
- NOT for editable Visio or Lucidchart files (output is draw.io XML only)
- NOT for marketing one-pagers without technical architecture content (use `crayon-illustration`)

---

## Critical Rules

- **Always read `DESIGN.md`** before generating — it is the source of truth for colors, typography, and Do's/Don'ts
- Every AI prompt MUST include the full GCP style block (see DESIGN.md § Agent Prompt Guide)
- Every draw.io XML MUST use `mxgraph.gcp2.*` stencils — NEVER `mxgraph.aws4.*` or `mxgraph.azure.*`
- **Always set `sketch=0`** in every mxgraph.gcp2 style string — critical for clean icon rendering
- **Always set `aspect=fixed`** in every icon cell to prevent distortion
- Run the **consultation flow** from `references/consultation.md` before generating (with `[Step N/M]` progress indicators)
- Verify stencil names against `references/gcp-service-catalog.jsonl` if `--verify` is set
- See `references/anti-patterns.md` for the full list of issues and their stable AP-IDs

---

## Invocation

```
/gcp-illustration <type> "Topic" [--theme=light|dark] [--from=<file>] [--verify] [--preview]
```

**Types:** `concept-cards`, `mapping`, `architecture`, `workflow`, `grid`, `split-panel`, `process-flow`, `region-diagram`, `gcp-architecture-framework`, `resource-hierarchy`

**Flags:**
- `--theme=light` (default) — white background, Material Design aesthetic
- `--theme=dark` — Deep Gray `#202124` background, Google Next keynote aesthetic
- `--from=<file>` — parse a text file for GCP service names, pre-fill consultation Step 1
- `--verify` — run 4 parallel specialist audits (palette, marketing-names, stencils, anti-slop) and aggregate findings; see `references/specialists/`
- `--preview` (alias `--dry-run`) — write outputs to `~/.gcp-illustration/projects/$SLUG/<YYYY-MM-DD>/` scratch dir and ask for confirmation before copying to the working repo

---

## Implementation Steps

1. **Read** `DESIGN.md` → load palette, typography, Do's and Don'ts

2. **Parse flags** from the invocation (theme, from-file, verify, preview)

3. **If `--from=<file>`**: read the file, extract GCP service names (compare against `references/gcp-service-catalog.md`), pre-fill the consultation's services step

4. **Run consultation** from `references/consultation.md`:
   - Show `[Step N/M — Topic]` progress header for each question
   - Every option must include a "why this matters" explanation
   - Skip steps already answered by the invocation (named services, explicit `--theme`, named flow direction, etc.)
   - Use `AskUserQuestion` tool with multi-select where appropriate

5. **Read template** from `references/templates/<type>.md`

6. **For types with directional flow** (`architecture`, `workflow`, `split-panel`, `process-flow`, `region-diagram`, `resource-hierarchy`): read `references/layout-rules.md`

7. **Generate two outputs**:

   **Output A — AI image prompt** saved to `img/<slug>-prompt.md`:
   - Use the template + consultation answers + DESIGN.md style block
   - Gemini-first phrasing (per `references/tips.md`)
   - Full GCP style block verbatim from DESIGN.md § Agent Prompt Guide
   - Exhaustive-negation language for arrows (see layout-rules.md)
   - State layout constraints 3 times (opening rule block + inline + closing confirm)

   **Output B — draw.io XML** saved to `diagrams/<slug>.drawio`:
   - Use the XML skeleton from the template
   - Look up every service in `references/gcp-service-catalog.jsonl` → use the `resicon` field as the draw.io style attribute value:
     ```
     style="shape=mxgraph.gcp2.SERVICE;resIcon=mxgraph.gcp2.SERVICE;sketch=0;aspect=fixed;
            fillColor=HEX;strokeColor=none;fontColor=#202124;
            fontFamily=Google Sans,Roboto;fontSize=13;fontStyle=1;
            verticalLabelPosition=bottom;verticalAlign=top;"
     ```
   - **CRITICAL: resIcon values use underscores, NEVER spaces.** `mxgraph.gcp2.cloud_run` is correct; `mxgraph.gcp2.cloud run` silently fails (draw.io style parser truncates at the space, rendering a blank box). All multi-word entries in the JSONL catalog use underscores. Source of truth: `Sidebar-GCP2.js` in the jgraph/drawio repo.
   - Set `value="<Marketing Name>"` (full GCP marketing name) on every service icon cell
   - Light: `background="#FFFFFF"`, `fontColor=#202124`
   - Dark: `background="#202124"`, `fontColor=#FFFFFF`, card surface `#303134`, `strokeColor=#5F6368`
   - Always include `sketch=0` and `aspect=fixed` in every icon style string
   - Use boundary stencils for VPC (solid Blue) / Region (dashed Slate) / Zone (dotted Pale Gray)

7c. **Marketing name enforcement** — before writing outputs, look up every service in `references/gcp-service-catalog.jsonl` (machine-readable) or `references/gcp-service-catalog.md` (human-readable) and replace any short-form service references with the `marketing` field value. Apply to BOTH the AI prompt text AND every draw.io `value="…"` label. Examples:
   - User typed "GCS" → use "Cloud Storage"
   - User typed "GKE" → use "Google Kubernetes Engine"
   - User typed "Cloud Firestore" → use "Firestore"
   - User typed "Big Query" → use "BigQuery"
   - User typed "PubSub" → use "Pub/Sub"

7d. **Unlisted service lookup** — if a service named by the user is NOT in `references/gcp-service-catalog.jsonl`, or if a stencil entry has `"note":"Verify resicon"`, do not guess. Take both steps:

   **Step A — find the marketing name:**
   - Fetch the official GCP product page or docs page for the service
   - The first `<h1>` or page title on the official Google Cloud docs page is the definitive marketing name

   **Step B — find the authoritative resIcon value from the draw.io repo:**
   - Primary: fetch `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/diagramly/sidebar/Sidebar-GCP2.js` and search for the service name. The `resIcon=` values defined there are authoritative for what the draw.io app actually renders.
   - Fallback: fetch the GCP2 stencil XML `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/stencils/gcp2.xml`, find the `<shape name="mxgraph.gcp2/SERVICE NAME">`, then **convert spaces to underscores** to get the resIcon value.
   - **NEVER use spaces in resIcon values** — the draw.io style parser treats spaces as delimiters and silently truncates the value, causing a blank placeholder box.

   **Step C — update the catalog:**
   - Confirm the discovered name with the user (e.g., "You mentioned 'Chronicle' — the correct marketing name is **Google Security Operations**. Shall I use that?")
   - After confirming, append the new entry to `references/gcp-service-catalog.jsonl` AND add a row to `references/gcp-service-catalog.md`
   - Remove any `"note":"Verify resicon"` flag once the resicon is confirmed

7e. **Self-check marker** — prepend the following HTML comment as the very first line of every generated `diagrams/<slug>.drawio` file (before `<mxfile>`):
   ```xml
   <!-- gcp-illustration: v=1, catalog-hash=HASH, theme=THEME, type=TYPE, generated=ISO8601, slug=SLUG -->
   ```
   Where `HASH` = first 12 chars of SHA256 of `references/gcp-service-catalog.jsonl` (run `bin/gcp-catalog-hash.sh` to get it). This allows future `--verify` runs and regenerations to detect catalog drift.

8. **If `--verify`**: dispatch 4 audits in **parallel** using Agent(Explore) calls, one per specialist:
   - `references/specialists/palette-audit.md` — checks every `fillColor` hex against authorized GCP palette
   - `references/specialists/marketing-name-audit.md` — checks every `value="…"` on service cells
   - `references/specialists/stencil-verifier.md` — checks every `shape=mxgraph.gcp2.*` token
   - `references/specialists/anti-slop-audit.md` — checks the AI prompt for Gemini drift patterns
   Wait for all 4 to complete, aggregate their JSON-line findings (deduped by `{cell_id, ap_id}`), and print a summary table. Each finding cites an `AP-NN` ID from `references/anti-patterns.md`.
   Also check the self-check marker's `catalog-hash` against the current catalog; warn if stale.
   **3-strike rule:** if the same anti-pattern appears for the 3rd time in succession (same AP-ID, same run), switch to draw.io-only mode and tell the user that Gemini is not converging on this axis.

9. **If `--preview`**: write outputs to `~/.gcp-illustration/projects/<SLUG>/<YYYY-MM-DD>/` instead of the working repo's `img/` and `diagrams/`. Print a summary of what would be written, then ask via `AskUserQuestion`: "Copy to working repo `img/` + `diagrams/`? (Yes / No — keep in scratch / Iterate first)". Scratch dirs older than 30 days are safe to delete.

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
Style: Clean Google Cloud architecture diagram on a white (#FFFFFF) background.
Material Design aesthetic — NOT isometric, NOT glass morphism, NOT dark mode.
FLAT 2D icons only. Service icons in their official Google Cloud category colors:
Compute/Networking/Security/AI icons in Google Blue (#4285F4), Storage icons in
Google Green (#34A853), Database icons in Google Red (#EA4335), Analytics icons
in Google Yellow (#FBBC04), Management icons in Slate (#5F6368).
Label every service with its official Google Cloud marketing name — "Cloud Storage",
"Google Kubernetes Engine", "Cloud Run", "BigQuery", "Cloud SQL", "Pub/Sub",
"Vertex AI", "Firestore". Never shorten to bare "GCS", "GKE", "Cloud Firestore",
"Big Query" (two words), or "PubSub".
Text in Google Sans or Roboto (clean geometric humanist sans-serif).
Slate (#5F6368) arrows, 1.5px weight, classic arrowhead.
VPC boundary solid Blue (#4285F4). Region boundary dashed Slate (#5F6368).
Zone boundary dotted Pale Gray (#9AA0A6). Zones stacked VERTICALLY.
Aspect ratio 16:9, 1920x1080.
```

### Dark theme:
```
Style: Google Cloud Next keynote-style illustration on Deep Gray (#202124) background.
Material Design dark aesthetic — flat icons, NO glass morphism, NO neon glows,
NOT isometric. FLAT 2D icons only. Service icons in their official Google Cloud
category colors (Blue #4285F4, Green #34A853, Red #EA4335, Yellow #FBBC04).
White (#FFFFFF) text. Pale Gray (#9AA0A6) arrows. Deep Gray (#202124) background —
NOT pure black (#000000). Dark card surface: #303134, 1px #5F6368 border.
Category-color 4px top border on cards.
Label every service with its official Google Cloud marketing name — "Cloud Storage",
"Google Kubernetes Engine", "Cloud Run", "BigQuery", "Cloud SQL", "Pub/Sub",
"Vertex AI", "Firestore". Never shorten to bare "GCS", "GKE", or "PubSub".
Aspect ratio 16:9, 1920x1080.
```

---

## Illustration Types

### `concept-cards` — 3–5 cards with icons and titles
**Layout:** Cards left-to-right, slate arrows. Category-color top borders.
**Template:** `references/templates/concept-cards.md`

### `mapping` — Two-column concept mapping
**Layout:** Left column (source) → Right column (GCP equivalents). Dotted connectors.
**Template:** `references/templates/mapping.md`

### `architecture` — Left-to-right component flow
**Layout:** 4–7 service components left-to-right. Labeled arrows. Single-row default; two-lane when user confirms.
**Template:** `references/templates/architecture.md`
**Requires:** `references/layout-rules.md`

### `workflow` — Horizontal pipeline diagram
**Layout:** Horizontal phases/stages with process bars. Primary pipeline + optional parallel branches.
**Template:** `references/templates/workflow.md`
**Requires:** `references/layout-rules.md`

### `grid` — Card grid with icons
**Layout:** N×M card grid with category-color top bars. No arrows.
**Template:** `references/templates/grid.md`

### `split-panel` — Architecture flow + summary panel
**Layout:** Left 70% = architecture flow. Right 30% = summary card with bullets.
**Template:** `references/templates/split-panel.md`
**Requires:** `references/layout-rules.md`

### `process-flow` — Tall panels with labeled arrows
**Layout:** 3–5 tall panels left-to-right, category-color top bars, bold labeled arrows.
**Template:** `references/templates/process-flow.md`
**Requires:** `references/layout-rules.md`

### `region-diagram` — GCP VPC / Region / Zone layout
**Layout:** Global VPC boundary (solid Blue) → Region boundary (dashed Slate) → Zone boundaries (dotted Pale Gray, stacked VERTICALLY) → services.
**Default:** Single region, 2 zones (Zone A top, Zone B bottom). Global-managed services (BigQuery, Cloud Storage) shown outside VPC.
**Template:** `references/templates/region-diagram.md`
**Requires:** `references/layout-rules.md` (especially GCP Network/Region/Zone Hierarchy Rules)

### `gcp-architecture-framework` — Pillar cards
**Layout:** 1–6 pillar cards, user-selected. Pillar-specific colors. 3 bullets per pillar.
**Template:** `references/templates/gcp-architecture-framework.md`
**Note:** Ask the user which pillars to include at `[Step 1/3 — Pillar selection]`.

### `resource-hierarchy` — GCP Resource Hierarchy tree
**Layout:** Organization (top) → Folders → Projects → Resources. Right-angle connectors only. Top-to-bottom.
**Default:** 1 org, 2 folders, 2 projects per folder, representative resources.
**Template:** `references/templates/resource-hierarchy.md`
**Requires:** `references/layout-rules.md`

---

## Output File Format

Save AI prompt to `img/<slug>-prompt.md`:

```markdown
# GCP Illustration Prompt: {{Topic}}

**Type:** {{type}}
**Theme:** {{light|dark}}
**Output file:** `img/{{slug}}.png`
**Resolution:** 1920x1080 (16:9)

## Prompt

{{The full prompt text — ready to copy-paste into Gemini}}

## Notes

- Generated with `/gcp-illustration {{type}} "{{Topic}}" --theme={{theme}}`
- Export as PNG at 1920x1080
- Save to `img/{{slug}}.png`
- For better color fidelity, attach `~/.claude/skills/gcp-illustration/assets/palette.svg`
  as a reference image in Gemini before pasting this prompt
```

Save draw.io XML to `diagrams/<slug>.drawio` (plain text XML, no encoding).

Then display the prompt text directly.

---

## Tips

Read `references/tips.md` for full guidance. Quick rules:
- Use official GCP marketing names — "Cloud Storage" not "GCS"; "Google Kubernetes Engine" not "GKE" alone; "BigQuery" one word; "Pub/Sub" with slash
- Always specify the category color explicitly with hex — don't say "its GCP color"
- Add "Material Design aesthetic" and "FLAT 2D icons" to every prompt
- Use `sketch=0` and `aspect=fixed` in all mxgraph.gcp2 style strings
- For Gemini: attach `assets/palette.svg` as a reference image for category-color fidelity
- VPC is GLOBAL in GCP — one VPC wraps multiple regions (unlike AWS)
- Zones stack VERTICALLY — never say "side by side" for zones in a region

## Examples

See `references/examples.md` for 3 full worked examples:
1. Serverless Web App (`architecture`, light) — Cloud Load Balancing → Cloud Run → Firestore + Cloud Storage
2. Data Pipeline (`workflow`, dark) — Pub/Sub → Dataflow → BigQuery → Looker
3. Multi-Region GKE (`region-diagram`, light) — global VPC, us-central1 + us-east1, Cloud SQL replica

## Troubleshooting

See `references/troubleshooting.md` for fixes. Most common issues:
- Old GCP palette rendered → add "Material Design aesthetic, current Google Cloud icon style, NOT old Google Cloud icons"
- Zones side by side → state vertical stacking 3 times in the prompt
- Blank draw.io boxes → stencil name typo or space in resIcon; run `--verify`
- Dark mode = pure black → specify "Deep Gray (#202124), NOT pure black (#000000)"
- VPC drawn as regional → add "VPC Network is GLOBAL — one boundary wraps all regions"
