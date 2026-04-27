# Template: `well-architected`

**Layout:** 1–6 pillar cards arranged in a grid. Each card shows the pillar name, its icon, and 3–5 key principles. The user selects which pillars to include at invocation time.

---

## Pillar Reference

| Pillar | Short name | Top accent color | Icon description |
|---|---|---|---|
| Operational Excellence | Ops Ex | Cosmos pink `#E7157B` | Monitoring gauge / cog with checkmark |
| Security | Security | Mars red `#DD344C` | Shield with checkmark |
| Reliability | Reliability | Orbit teal `#01A88D` | Redundant server / failover symbol |
| Performance Efficiency | Performance | Galaxy purple `#8C4FFF` | Speedometer / benchmark gauge |
| Cost Optimization | Cost | Endor green `#7AA116` | Dollar sign over upward chart / Savings Plans icon |
| Sustainability | Sustainability | Endor green `#7AA116` | Leaf / eco-footprint symbol |

---

## Prompt Template — Light Theme (N selected pillars)

```
Create a clean AWS Well-Architected Framework illustration on white (#FFFFFF) background
showing {{N}} pillars: {{PILLAR_LIST}}.

Layout: {{N}} cards arranged in a single horizontal row (if N ≤ 4) or a 2-row grid
(if N = 5 or 6). Equal widths, even spacing (24px gap). No arrows between cards.

Title above all cards (28px bold #232F3E): "AWS Well-Architected Framework"
Subtitle (16px #545B64): "{{SUBTITLE — e.g., 'Pillars for {{YOUR_TOPIC}}' }}"

Card format (white #FFFFFF, 1px #EAEDED border, 12px radius, 0 2px 8px shadow):

{{For each selected pillar:}}
Card N ({{PILLAR_COLOR}} 6px top bar):
- Icon (48px, centered): {{icon description}} in {{PILLAR_COLOR}}
- Title (20px bold #232F3E): "{{PILLAR_NAME}}"
- Divider line (#EAEDED)
- 3 bullet points (13px #545B64):
  • {{principle 1}}
  • {{principle 2}}
  • {{principle 3}}

Style: Clean AWS Well-Architected illustration on white (#FFFFFF). 2023 AWS flat icons.
NOT isometric, NOT glass morphism. Amazon Ember-style sans-serif. Pillar-specific accent
colors per the 2024 AWS Well-Architected Framework. AWS Blog style.
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme (N selected pillars)

```
Create an AWS re:Invent keynote Well-Architected illustration on Squid Ink navy
(#232F3E) showing {{N}} pillars: {{PILLAR_LIST}}.

Layout: same grid as light theme.

Title (28px bold white): "AWS Well-Architected Framework"
Subtitle (16px #D5DBDB): "{{SUBTITLE}}"

Cards (dark #314050, 1px #414D5C, 12px radius, NO shadows, {{PILLAR_COLOR}} 6px top bar):
Icon (48px dark-BG variant) + Title (20px bold white) + Divider + 3 bullets (13px #D5DBDB)

Style: AWS re:Invent keynote on #232F3E. Dark-BG icons. Not glass morphism.
Pillar-specific colors. White text. Aspect ratio 16:9, 1920x1080.
```

---

## Default Pillar Principles (customize as needed)

### Operational Excellence
- Automate operations with IaC (CloudFormation, CDK)
- Implement observability (CloudWatch, X-Ray, CloudTrail)
- Evolve through small, frequent changes

### Security
- Apply the principle of least privilege (IAM)
- Protect data in transit and at rest (KMS, ACM)
- Detect and respond to threats (GuardDuty, Security Hub)

### Reliability
- Design for failure — multi-AZ, multi-region
- Implement automatic recovery (Auto Scaling, Route 53 health checks)
- Test recovery procedures regularly

### Performance Efficiency
- Choose the right resource type (Graviton, Inf2, GPU)
- Use caching and CDN (ElastiCache, CloudFront)
- Monitor and evolve based on performance metrics

### Cost Optimization
- Implement cloud financial management (Cost Explorer, Budgets)
- Use managed services to reduce operational overhead
- Right-size resources and leverage Savings Plans / Spot

### Sustainability
- Choose efficient instance types (Graviton, Lambda)
- Reduce idle time with event-driven architectures
- Measure and track carbon footprint (Customer Carbon Footprint Tool)

---

## draw.io XML pattern

```xml
<!-- Pillar card -->
<mxCell id="pillar1" value="&lt;b&gt;{{Pillar Name}}&lt;/b&gt;&lt;br/&gt;• {{p1}}&lt;br/&gt;• {{p2}}&lt;br/&gt;• {{p3}}"
  vertex="1" parent="1"
  style="rounded=1;arcSize=5;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#EAEDED;
         shadow=1;fontSize=13;align=center;verticalAlign=top;spacingTop=70;
         fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="{{X}}" y="{{Y}}" width="220" height="260" as="geometry"/>
</mxCell>
<!-- Top color bar -->
<mxCell id="bar1" vertex="1" parent="1"
  style="fillColor={{PILLAR_COLOR_HEX}};strokeColor=none;rounded=1;arcSize=5;">
  <mxGeometry x="{{X}}" y="{{Y}}" width="220" height="8" as="geometry"/>
</mxCell>
<!-- Pillar icon -->
<mxCell id="icon1" value="" vertex="1" parent="1"
  style="sketch=0;outlineConnect=0;gradientColor=none;fillColor={{PILLAR_COLOR_HEX}};
         strokeColor=none;aspect=fixed;shape=mxgraph.aws4.resourceIcon;
         resIcon=mxgraph.aws4.{{STENCIL}};verticalLabelPosition=bottom;verticalAlign=top;">
  <mxGeometry x="{{X+71}}" y="{{Y+16}}" width="78" height="78" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{N}}` | Number of selected pillars (1–6) |
| `{{PILLAR_LIST}}` | Comma-separated names of selected pillars |
| `{{SUBTITLE}}` | Context for the diagram (e.g., "For serverless architecture review") |
| `{{PILLAR_COLOR}}` | Color from the Pillar Reference table above |
| `{{STENCIL}}` | Relevant mxgraph.aws4 stencil (cloudwatch for OpEx, shield for Security, etc.) |
