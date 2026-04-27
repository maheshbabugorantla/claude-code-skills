# Template: `workflow`

**Layout:** Nested horizontal bars showing a trace/workflow execution timeline with parallel groups.

## Prompt Template

```
Create a hand-drawn crayon-style diagram on a white background showing a
{{DESCRIPTION}} as a nested waterfall/timeline.

Title at top in handwritten text: "{{WORKFLOW_TITLE}}"
Subtitle: "{{SUBTITLE}}"

The diagram shows nested horizontal bars (like a waterfall trace view):

Level 0 (full width, light gray bar):
"{{root_span_name}}" — spans the entire width

Level 1 (pastel blue bar, offset right):
"{{step 1 name}}"
Small crayon drawing of {{icon}}
Label: "{{executor/model}}"

Level 1 (group of parallel bars):
"{{parallel group name}}" bracket
  - {{N}} pastel green bars stacked vertically, same x-start (parallel):
    "{{parallel task name}}" x {{N}}

{{...more levels...}}

Legend at bottom:
- Blue = {{category 1}}
- Green = {{category 2}}
Hand-drawn note: "{{footer note}}"

{{STYLE BLOCK}}
```
