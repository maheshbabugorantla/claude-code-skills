# Troubleshooting

> For the canonical anti-pattern list with stable IDs, see `references/anti-patterns.md`.
> `--verify` cites these IDs (e.g., "AP-03: value='Lambda' on cell c3").

## AI Image Generation Issues

### Gemini generates old AWS icons (blue gradient, 3D isometric) — AP-01, AP-02
**Cause:** Gemini recognizes "AWS" and defaults to the pre-2023 or generic cloud icon style.
**Fix:** Add these phrases to the prompt:
> "2023 AWS flat-icon style. NOT isometric. NOT blue gradient icons. NOT 3D perspective. Flat, clean, rounded-square icons in official 2023 AWS category colors."

Also add: "Use the style from current aws.amazon.com/architecture/icons/ — flat 2D icons in their category color."

---

### AZs are placed side by side horizontally instead of stacked vertically — AP-06
**Cause:** Horizontal placement is the model's default for "multiple of the same thing."
**Fix:** Add 3 explicit instructions:
1. Rule block at top: "AZs must be stacked VERTICALLY. AZ us-east-1a is in the TOP ROW. AZ us-east-1b is in the BOTTOM ROW. They are NOT side by side."
2. Inline: For each AZ description, state its row position ("this is the TOP AZ, positioned above AZ us-east-1b").
3. Closing summary: "Confirm: AZ us-east-1a is in row 1, AZ us-east-1b is in row 2. They are stacked vertically."

---

### Services use generic orange for everything instead of category colors — AP-04
**Cause:** Gemini knows AWS = orange and applies it uniformly.
**Fix:** Call out each service with its marketing name + specific color explicitly:
> "AWS Lambda icon in Smile orange #ED7100 (Compute category). Amazon S3 icon in Endor green #7AA116 (Storage category). Amazon CloudFront icon in Galaxy purple #8C4FFF (Networking category). Amazon GuardDuty icon in Mars red #DD344C (Security category)."

Never say "each icon in its AWS color" — be specific.

---

### Arrows curve or go backwards — AP-05
**Cause:** Model reinterprets flow direction.
**Fix:** Use exhaustive negation + redundancy (see layout-rules.md):
> "All arrows point strictly RIGHT. No arrows point LEFT. No arrows point DOWN. No diagonal arrows. No curved arrows. No arrows that reverse direction."

---

### Text labels are illegible or misspelled
**Cause:** AI image models have limited text rendering accuracy.
**Fix:** For draw.io XML, always use the full AWS marketing name in `value=""` — this renders perfectly as SVG text. For AI image (Gemini) output, label legibility is limited by the model; if text is unreadable, add text overlays manually in Figma/Keynote. The draw.io `.drawio` file is the authoritative artifact for correct labels.

---

### Dark mode background renders as pure black instead of navy — AP-07
**Cause:** "dark background" defaults to #000000 in AI model training data.
**Fix:** Specify "Squid Ink navy (#232F3E) background, NOT pure black" and add "the background is a very dark navy-blue, like the AWS Management Console, not pure black."

---

### Region boundary isn't dashed / AZ boundary isn't dotted — AP-08
**Cause:** Model defaults to all solid borders.
**Fix:** Describe each border style concretely: "Region boundary: dashed 1px gray line. AZ boundary: dotted (smaller dots) 1px gray line. VPC boundary: solid 1px purple line. These three border styles are DIFFERENT from each other."

---

## Draw.io XML Issues

### Service icon renders as a blank gray placeholder box — AP-12
**Cause:** mxgraph.aws4 stencil name is incorrect or the shape library isn't loaded.
**Fix:**
1. Run `--verify` to check all stencil names against `aws-service-catalog.jsonl` (stencil-verifier specialist).
2. Check common aliases — see the Short-Name Alias Index in aws-service-catalog.md, or `bin/aws-service-lookup.sh <name>`.
3. In draw.io, go to Extras → Edit Diagram, and manually verify the style string. Open the "AWS" shape library (click + in sidebar, select "AWS").
4. Ensure `sketch=0` is in the style string — some older stencil names use different capitalization.

---

### Icons look "rough" or sketchy in draw.io — AP-11
**Cause:** `sketch=1` is set (default for some imported XML).
**Fix:** Set `sketch=0` in every service icon's style string. This switches from sketch/rough mode to the clean 2023 icon rendering.

---

### Region or AZ boundary shows as a plain rectangle without the AWS icon badge — AP-14
**Cause:** Using `shape=mxgraph.aws4.group` instead of `shape=mxgraph.aws4.groupCenter` with `grIcon=...`
**Fix:** Use the correct group stencil format:
```
style="...shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_region;..."
```
See the XML boilerplate in DESIGN.md Section 9 for the full correct style string.

---

### draw.io file opens with wrong background color in dark mode — AP-07
**Cause:** Background isn't set in the mxGraphModel element.
**Fix:** Set `background="#232F3E"` in the `<mxGraphModel>` tag for dark mode, `background="#FFFFFF"` for light mode.

---

### `--verify` reports unknown stencils for services I know exist — AP-12
**Cause:** `aws-service-catalog.jsonl` covers the top 60 services. A service you're using may not be in the catalog yet.
**Fix:** Check the official draw.io AWS shape library or the aws-icons-for-plantuml AWSSymbols.md for the correct stencil name, then:
1. Append a new JSON line to `references/aws-service-catalog.jsonl`
2. Add a corresponding row to `references/aws-service-catalog.md`

---

## --from File Ingest Issues

### Ingest didn't detect a service from the file
**Cause:** The service name in your text omitted the AWS marketing prefix or was misspelled (e.g., "S3" instead of "Amazon S3", "Lamba" misspelling instead of "AWS Lambda", "OpenSearch" instead of "Amazon OpenSearch Service").
**Fix:** The ingest parser uses the `aliases` array in `aws-service-catalog.jsonl` to normalize common short forms to their marketing names. You can also test it: `bin/aws-service-lookup.sh "OpenSearch"` → returns the full Amazon OpenSearch Service row. If ingest still misses the service, add the alias to the JSONL entry.

---

### Gemini renders a service with the wrong prefix (e.g., "Amazon Lambda" or "AWS S3") — AP-10
**Cause:** The prompt used a short or wrong-prefix form, and Gemini guessed the prefix.
**Fix:** Always write the full official marketing name in the prompt — "AWS Lambda" and "Amazon S3", never bare "Lambda" or "S3". See the gotchas table in `aws-service-catalog.md` (Naming Convention section) for the most common wrong-prefix errors (API Gateway, EventBridge, Fargate, X-Ray).
