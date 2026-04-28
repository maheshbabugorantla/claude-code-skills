---
name: gcp-illustration-anti-slop-audit
description: Audit the AI image prompt in img/<slug>-prompt.md for common Gemini drift patterns. Catches isometric requests, glass morphism, neon glows, missing style anchors, generic color instructions, and GCP-specific prompt failures before the prompt is submitted to Gemini.
type: specialist
parent: gcp-illustration
---

# Anti-Slop Audit Specialist

Audits `img/<slug>-prompt.md` for known Gemini drift patterns that cause the generated image to deviate from the Google Cloud Material Design architecture style.

## Checks to perform

Scan the full prompt text for each of the following patterns. Each match is a finding.

### AP-01 — Isometric / 3D language
**Pattern:** prompt contains any of: `isometric`, `3D`, `three-dimensional`, `perspective view`, `axonometric`, `layered cards`, `depth`, `angled`
**Finding:** AP-01 (unless the word appears in an explicit negation like "NOT isometric" — in that case, PASS)

### AP-02 — Non-Google icon style
**Pattern:** prompt contains: `AWS icon`, `Azure icon`, `generic cloud`, `material icon` without "Google Cloud" qualifier, or lacks both `"Google Cloud architecture diagram style"` AND `"Material Design aesthetic"`
**Finding:** AP-02 if both style anchors are absent from the prompt

### AP-04 — Generic color instruction without hex
**Pattern:** prompt says `"in its GCP color"`, `"in the correct GCP color"`, `"in its Google Cloud color"`, `"each in their Google color"` WITHOUT specifying a hex code for that specific service
**Finding:** AP-04 — Gemini will default to uniform Google Blue for everything without explicit hex

### AP-06 — Missing Zone vertical stacking confirmation (`region-diagram` type only)
**Pattern:** prompt contains "Zone" or "zone" but lacks BOTH `"VERTICALLY"` stacking instruction AND a closing CONFIRM block
**Finding:** AP-06

### AP-04 (VPC scope) — Missing global VPC declaration (`region-diagram` type only)
**Pattern:** prompt mentions "VPC" but does NOT include `"GLOBAL"` or `"global resource"` near the VPC description
**Finding:** AP-04 subtype — omitting the global-scope declaration lets Gemini draw per-region VPCs (AWS pattern)

### AP-07 — Dark mode lacks Deep Gray specification
**Pattern (dark theme only):** prompt says "dark background" or "dark mode" but does NOT say `"#202124"` AND does NOT say `"NOT pure black"`
**Finding:** AP-07

### AP-10 — Glass morphism / neon glows / futuristic aesthetics
**Pattern:** prompt contains: `glass`, `frosted`, `blur`, `translucent`, `neon`, `glow`, `bloom`, `luminous`, `gradient glow`, `futuristic`, `sci-fi`
**Finding:** AP-10 (unless inside a negation phrase such as "NO glass morphism")

### AP-06 (arrows) — Missing exhaustive-negation block
**Pattern:** prompt describes arrows or flow but does NOT contain ALL of: `strictly RIGHT`, `No arrows point LEFT`, `No arrows point DOWN`, `No curved arrows`
**Finding:** AP-06 (advisory — add the exhaustive-negation block from layout-rules.md)

### General — GCP style block missing
**Pattern:** prompt does NOT contain both `"Google Cloud architecture diagram style"` AND `"Material Design aesthetic"` (or equivalent phrasing)
**Finding:** `{"ap_id":null,"issue":"GCP style block missing — embed the full style block from SKILL.md","severity":"error"}`

### General — Short-form service names in prompt text
**Pattern:** prompt contains bare short forms: ` GCS `, ` GKE `, ` BQ ` (standalone acronyms without surrounding quote or marketing context)
**Finding:** AP-03 (in prompt text — leads to Gemini labeling icons with acronyms)

### General — Wrong marketing name in prompt text
**Pattern:** prompt contains: `Google Cloud Storage`, `Cloud Firestore`, `Big Query`, `Cloud Pub/Sub`, `Google Vertex AI`, `Cloud BigQuery`
**Finding:** AP-09 — these are wrong-prefix forms (see `gcp-service-catalog.md` Marketing-Name Rules table)

## Output format

```json
{"ap_id":"AP-01","location":"line 14","excerpt":"isometric layout","issue":"Isometric language present — add 'NOT isometric' negation","severity":"error"}
{"ap_id":"AP-04","location":"line 31","excerpt":"each in its GCP color","issue":"Generic color instruction without hex — Gemini will default to uniform Google Blue","severity":"error"}
{"ap_id":"AP-09","location":"line 22","excerpt":"Google Cloud Storage","issue":"Wrong marketing name: use 'Cloud Storage', not 'Google Cloud Storage'","severity":"error"}
{"ap_id":"AP-06","location":"arrows section","issue":"Missing exhaustive-negation block for arrow direction","severity":"warn"}
{"ap_id":"AP-02","location":"style block","issue":"GCP style block missing 'Material Design aesthetic' anchor","severity":"error"}
```

If no issues:
```json
{"ap_id":null,"status":"PASS","message":"Prompt is clean — no Gemini drift patterns detected"}
```

## Completion Status

- `## Completion Status: PASS` — prompt is clean
- `## Completion Status: WARN` — advisory findings (style improvements available but not critical)
- `## Completion Status: FAIL` — critical drift patterns that will cause visible failures (AP-01, AP-02, AP-04, AP-09 errors)
