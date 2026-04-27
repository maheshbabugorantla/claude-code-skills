# Template: `workflow`

**Layout:** Nested horizontal bars (Gantt/trace style) showing a process execution timeline. Primary steps as colored bars, parallel groups as indented sub-bars. Good for Step Functions workflows, CI/CD pipelines, and multi-phase async processing.

**Requires:** Read `references/layout-rules.md` before generating.

---

## Prompt Template — Light Theme

```
Create a clean AWS workflow timeline diagram on a white (#FFFFFF) background showing
{{DESCRIPTION}} as a nested Gantt-style execution trace.

Title at top in 28px bold Amazon Ember-style sans-serif, #232F3E: "{{WORKFLOW_TITLE}}"
Subtitle in 16px #545B64: "{{SUBTITLE}}"

The diagram shows nested horizontal bars (like a Gantt chart or distributed trace):

Root bar (full width, navy #232F3E fill, white text, 1px #EAEDED border):
"{{ROOT_NAME}}" — spans the entire canvas width
Sublabel: "Total duration / span"

Level 1 Step 1 ({{CATEGORY_COLOR_1}} fill, white text, left-aligned within canvas):
"{{step 1 name}}"
AWS icon: {{icon description}} on left side of bar, white
Sublabel: "{{executor / service name}}"

Level 1 Step 2 ({{CATEGORY_COLOR_2}} fill):
"{{step 2 name}}"
AWS icon on left side

Level 1 Parallel Group (border-only bar, dashed #545B64 outline, category-colored label):
"{{parallel group name}}" — bracket indicates N parallel tasks
  - Sub-bar N items ({{CATEGORY_COLOR_3}} fill, indented, same x-start):
    "{{parallel task}}" × {{N}}

{{...more steps...}}

Legend at bottom (13px #545B64):
- {{CATEGORY_COLOR_1}} bar = {{category 1 meaning}}
- {{CATEGORY_COLOR_2}} bar = {{category 2 meaning}}
- Dashed bracket = parallel execution

Style: Clean AWS workflow on white (#FFFFFF). 2023 AWS flat-icon style. NOT isometric,
NOT glass morphism. Amazon Ember-style sans-serif. AWS Blog technical style.
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create an AWS re:Invent keynote workflow diagram on Squid Ink navy (#232F3E) background
showing {{DESCRIPTION}} as a Gantt-style trace.

Title: "{{WORKFLOW_TITLE}}" in 28px bold white.
Subtitle: "{{SUBTITLE}}" in 16px #D5DBDB.

Root bar (#545B64 fill, white text, full width):
"{{ROOT_NAME}}"

Step bars (each with category-color fill, white text):
Level 1 Step 1 ({{CATEGORY_COLOR_1}} fill, white icon on left): "{{step 1}}"
Level 1 Step 2 ({{CATEGORY_COLOR_2}} fill): "{{step 2}}"

Parallel group (pale gray #D5DBDB dashed outline, label in category color):
{{N}} sub-bars with same category color, indented.

Legend (13px #D5DBDB): color → meaning.

Style: AWS re:Invent keynote on #232F3E. 2023 flat icons dark-BG. NOT glass morphism.
Category-color bars. White text. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern

```xml
<!-- Root bar -->
<mxCell id="root_bar" value="{{ROOT_NAME}}" vertex="1" parent="1"
  style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#232F3E;
         fontColor=#FFFFFF;fontSize=14;fontStyle=1;align=left;spacingLeft=12;">
  <mxGeometry x="60" y="120" width="1800" height="40" as="geometry"/>
</mxCell>
<!-- Step bar -->
<mxCell id="step1" value="{{Step Name}}" vertex="1" parent="1"
  style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor={{CATEGORY_HEX}};
         strokeColor=none;fontColor=#FFFFFF;fontSize=13;align=left;spacingLeft=12;">
  <mxGeometry x="80" y="175" width="{{WIDTH}}" height="36" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{DESCRIPTION}}` | What process is shown (e.g., "Step Functions order processing workflow") |
| `{{WORKFLOW_TITLE}}` | Diagram title |
| `{{SUBTITLE}}` | Short subtitle (e.g., "p99: 850ms, 3 parallel branches") |
| `{{ROOT_NAME}}` | Root/parent span name |
| `{{step N name}}` | Short step name |
| `{{parallel task}}` | Name of parallel sub-tasks |
| `{{CATEGORY_COLOR_N}}` | Category color for each step type |
