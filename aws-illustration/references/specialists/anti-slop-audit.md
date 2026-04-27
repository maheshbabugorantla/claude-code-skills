---
name: aws-illustration-anti-slop-audit
description: Audit the AI image prompt text in img/<slug>-prompt.md for common Gemini drift patterns (slop). Catches isometric hints, old palette references, generic color instructions, glass morphism, and other failure modes before the prompt is submitted to Gemini.
type: specialist
parent: aws-illustration
---

# Anti-Slop Audit Specialist

Audits `img/<slug>-prompt.md` for known Gemini drift patterns that cause the generated image to deviate from the 2023 AWS Blog style.

## Checks to perform

Scan the full prompt text for each of the following patterns. Each match is a finding.

### AP-01 — Isometric / 3D language
**Pattern:** prompt contains any of: `isometric`, `3D`, `three-dimensional`, `perspective view`, `axonometric`, `layered cards`, `depth`
**Finding:** AP-01 (unless the word appears in an explicit negation like "NOT isometric" — in that case, PASS)

### AP-02 — Arctic Blue / pre-2023 palette
**Pattern:** prompt contains: `Arctic Blue`, `AWS blue`, `#1A73`, `#232F3E icon`, old blue-gradient, or lacks `"2023 AWS flat-icon style"`
**Finding:** AP-02 if style block is missing the 2023 marker

### AP-04 — Generic color instruction
**Pattern:** prompt says `"in its AWS color"`, `"in the correct AWS color"`, `"in the standard AWS color"`, `"each in their category color"` WITHOUT specifying a hex code for that service
**Finding:** AP-04 — Gemini will default to uniform Smile orange for everything

### AP-05 — Missing arrow negation
**Pattern:** prompt describes arrows/flow but does NOT contain ALL of: `strictly RIGHT`, `No arrows point LEFT`, `No arrows point DOWN`, `No curved arrows`
**Finding:** AP-05 (advisory — add the exhaustive-negation block)

### AP-06 — Missing AZ vertical stacking confirmation
**Pattern (region-diagram type only):** prompt contains "AZ" or "Availability Zone" but lacks `"VERTICALLY"` stacking instruction AND the closing CONFIRM block
**Finding:** AP-06

### AP-07 — Dark mode lacks Squid Ink specification
**Pattern (dark theme):** prompt says "dark background" or "dark mode" but does NOT say `"#232F3E"` AND does NOT say `"NOT pure black"`
**Finding:** AP-07

### AP-09 — Glass morphism / neon glows
**Pattern:** prompt contains: `glass`, `frosted`, `blur`, `translucent`, `neon`, `glow`, `bloom`, `luminous`, `gradient glow`
**Finding:** AP-09 (unless inside a negation phrase)

### General — Style block missing
**Pattern:** prompt does NOT contain the canonical AWS style block (missing `"2023 AWS flat-icon style"` AND `"AWS Blog reference architecture style"`)
**Finding:** `{ap_id: null, issue: "Style block missing — embed the full style block from SKILL.md", severity: "error"}`

### General — Marketing names absent
**Pattern:** prompt contains any of: `" Lambda "`, `" S3 "`, `" OpenSearch "` (bare short forms without Amazon/AWS prefix)
**Finding:** AP-03 (in prompt text — leads to Gemini labeling icons with short names)

## Output format

```json
{"ap_id":"AP-01","location":"line 14","excerpt":"isometric layout","issue":"Isometric language present — add 'NOT isometric' negation","severity":"error"}
{"ap_id":"AP-04","location":"line 31","excerpt":"each in its AWS color","issue":"Generic color instruction without hex — Gemini will default to uniform orange","severity":"error"}
{"ap_id":"AP-05","location":"arrows section","issue":"Missing exhaustive-negation block for arrow direction","severity":"warn"}
```

If no issues:
```json
{"ap_id":null,"status":"PASS","message":"Prompt is clean — no Gemini drift patterns detected"}
```

## Completion Status

- `## Completion Status: PASS` — prompt is clean
- `## Completion Status: WARN` — advisory findings (style improvements available)
- `## Completion Status: FAIL` — critical drift patterns that will cause visible failures (AP-01, AP-02, AP-04 errors)
