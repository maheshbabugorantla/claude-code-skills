# Examples

Three worked examples — full invocations, generated prompts, and draw.io XML snippets.

---

## Example 1 — Serverless Web App (architecture, light)

**Invocation:**
```
/aws-illustration architecture "Serverless web app: CloudFront → API Gateway → Lambda → DynamoDB + S3" --theme=light
```

**Expected consultation output:**
```
[Step 1/2 — Data flow]
Ingress-heavy — user traffic enters from the left → confirmed

[Step 2/2 — Audience]
Engineering team (architecture review) → selected
```

**Generated AI prompt (img/serverless-web-app-prompt.md):**
```
Create a clean AWS architecture diagram on a white (#FFFFFF) background showing a
serverless web application.

CRITICAL LAYOUT RULE: All components are arranged on a SINGLE horizontal row from left
to right. There is only ONE row. No component drops to a second row. All arrows point
strictly RIGHT. No arrows point downward. No arrows point left. No diagonal arrows.
No curved arrows. Space components evenly across the full width. If components don't fit,
shrink them — never wrap to a second row.

Layout: 5 components arranged left-to-right in a horizontal flow, connected by
1.5px slate (#545B64) arrows with 4px classic arrowheads. Labels on arrows.

Component 1 (white card, 8px radius, 1px #EAEDED border, subtle 0 2px 8px shadow):
- Amazon CloudFront icon in Galaxy purple (#8C4FFF) — a rounded-square icon with a
  stylized distribution network symbol
- Label below icon: "Amazon CloudFront" in 20px semibold Amazon Ember-style humanist sans-serif
- Sublabel: "CDN / edge cache"

Component 2 (white card, same styling):
- Amazon API Gateway icon in Cosmos pink (#E7157B) — a rounded-square with an API plug icon
- Label: "Amazon API Gateway"
- Sublabel: "REST API"

Component 3 (white card):
- AWS Lambda icon in Smile orange (#ED7100) — a rounded-square with a lightning-bolt
  Lambda symbol
- Label: "AWS Lambda"
- Sublabel: "Business logic"

Component 4 (white card):
- Amazon DynamoDB icon in Cosmos pink (#E7157B) — a rounded-square with a table/database symbol
- Label: "Amazon DynamoDB"
- Sublabel: "NoSQL store"

Component 5 (white card):
- Amazon S3 icon in Endor green (#7AA116) — a rounded-square with a bucket/storage symbol
- Label: "Amazon S3"
- Sublabel: "Static assets"

CONFIRM: All 5 components sit on the same horizontal level. No component is above or
below another. All arrows point right.

Arrows between components (slate #545B64, 1.5px, 4px arrowhead):
- 1→2: "HTTPS"
- 2→3: "REST invoke"
- 3→4: "DynamoDB API"
- 3→5: "GetObject / PutObject" (arrow to 5 branches from 3)

Style: Clean AWS architecture diagram on a white (#FFFFFF) background.
2023 AWS flat-icon style — NOT isometric, NOT glass morphism, NOT dark mode.
Service icons in their official 2023 AWS category colors: Amazon CloudFront in Galaxy
purple (#8C4FFF), Amazon API Gateway in Cosmos pink (#E7157B), AWS Lambda in Smile
orange (#ED7100), Amazon S3 in Endor green (#7AA116), Amazon DynamoDB in Cosmos pink
(#E7157B). Label every service with its full AWS marketing name — "Amazon CloudFront",
"Amazon API Gateway", "AWS Lambda", "Amazon DynamoDB", "Amazon S3". Text in Amazon
Ember-style clean humanist sans-serif (fallback: Inter). Slate (#545B64) arrows.
AWS Blog reference architecture style. Aspect ratio 16:9, 1920x1080.
```

**draw.io XML snippet (diagrams/serverless-web-app.drawio):**
```xml
<mxfile>
  <diagram name="serverless-web-app">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" background="#FFFFFF">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
        <!-- CloudFront -->
        <mxCell id="cf1" value="Amazon CloudFront" vertex="1" parent="1"
          style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#8C4FFF;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudfront;">
          <mxGeometry x="100" y="300" width="78" height="78" as="geometry"/>
        </mxCell>
        <!-- API Gateway -->
        <mxCell id="apigw1" value="Amazon API Gateway" vertex="1" parent="1"
          style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#E7157B;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway;">
          <mxGeometry x="300" y="300" width="78" height="78" as="geometry"/>
        </mxCell>
        <!-- Lambda -->
        <mxCell id="lambda1" value="AWS Lambda" vertex="1" parent="1"
          style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#ED7100;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;">
          <mxGeometry x="500" y="300" width="78" height="78" as="geometry"/>
        </mxCell>
        <!-- DynamoDB -->
        <mxCell id="dynamo1" value="Amazon DynamoDB" vertex="1" parent="1"
          style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#E7157B;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.dynamodb;">
          <mxGeometry x="700" y="250" width="78" height="78" as="geometry"/>
        </mxCell>
        <!-- S3 -->
        <mxCell id="s3" value="Amazon S3" vertex="1" parent="1"
          style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#7AA116;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3;">
          <mxGeometry x="700" y="380" width="78" height="78" as="geometry"/>
        </mxCell>
        <!-- Arrows -->
        <mxCell id="e1" value="HTTPS" edge="1" source="cf1" target="apigw1" parent="1"
          style="endArrow=classic;html=1;strokeColor=#545B64;strokeWidth=1.5;fontSize=11;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e2" value="REST" edge="1" source="apigw1" target="lambda1" parent="1"
          style="endArrow=classic;html=1;strokeColor=#545B64;strokeWidth=1.5;fontSize=11;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e3" value="Query/Put" edge="1" source="lambda1" target="dynamo1" parent="1"
          style="endArrow=classic;html=1;strokeColor=#545B64;strokeWidth=1.5;fontSize=11;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e4" value="GetObject" edge="1" source="lambda1" target="s3" parent="1"
          style="endArrow=classic;html=1;strokeColor=#545B64;strokeWidth=1.5;fontSize=11;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Example 2 — Bedrock RAG Pipeline (process-flow, dark)

**Invocation:**
```
/aws-illustration process-flow "Bedrock RAG pipeline: User Query → API GW → Lambda → Bedrock KB → OpenSearch + S3 → Claude response" --theme=dark
```

**Generated prompt (img/bedrock-rag-pipeline-prompt.md):**
```
Create an AWS re:Invent keynote-style process-flow illustration on Squid Ink navy
background (#232F3E) showing a Bedrock RAG (Retrieval-Augmented Generation) pipeline.

Layout: 5 tall rounded-rectangle panels arranged left to right.
CRITICAL LAYOUT RULE: All panels on a single horizontal row. All arrows point strictly
RIGHT. No downward arrows. No curved arrows.

Panel 1 (white text, dark-mode card #314050, Mars red #DD344C top border 4px):
- Icon: user silhouette outline in white
- Title: "User Query"
- Sublabel: "Natural language"
Arrow to Panel 2, labeled "HTTPS"

Panel 2 (dark card, Cosmos pink #E7157B top border):
- Icon: Amazon API Gateway icon (dark variant) in Cosmos pink
- Title: "Amazon API Gateway"
- Sublabel: "Auth + routing"
Arrow to Panel 3, labeled "REST"

Panel 3 (dark card, Smile orange #ED7100 top border):
- Icon: AWS Lambda icon (dark variant) in Smile orange
- Title: "AWS Lambda"
- Sublabel: "Orchestration"
Arrow to Panel 4, labeled "Retrieve"

Panel 4 (dark card, Orbit teal #01A88D top border):
- Icon: Amazon Bedrock icon (dark variant) in Orbit teal
- Title: "Amazon Bedrock"
- Sublabel: "RAG + Claude"
Arrow to Panel 5, labeled "Augmented"

Panel 5 (dark card, Orbit teal top border):
- Icon: AWS user/check icon in white
- Title: "Response"
- Sublabel: "Grounded answer"

Supporting services below the main flow (smaller cards):
- Amazon OpenSearch Service icon in Galaxy purple (#8C4FFF), label "Amazon OpenSearch Service / Vector store"
- Amazon S3 icon in Endor green (#7AA116), label "Amazon S3 / Knowledge docs"
Dotted arrows from Panel 4 down to both.

Style: AWS re:Invent keynote-style on Squid Ink navy (#232F3E). 2023 AWS flat-icon
style dark-BG variants. White (#FFFFFF) text. Pale gray (#D5DBDB) arrows.
Category-color 4px top borders instead of shadows. NOT glass morphism. NOT isometric.
Aspect ratio 16:9, 1920x1080.
```

---

## Example 3 — Multi-Account Landing Zone (multi-account, light)

**Invocation:**
```
/aws-illustration multi-account "AWS Control Tower landing zone with Security OU, Workloads OU, and Sandbox OU" --theme=light
```

**Generated prompt (img/control-tower-landing-zone-prompt.md):**
```
Create a clean AWS architecture diagram on white (#FFFFFF) showing an AWS Control Tower
multi-account landing zone with organizational hierarchy.

Layout: Top-to-bottom hierarchy. ROOT at top center. Three OU boxes below, connected
by right-angle lines. Member accounts below each OU. NO diagonal lines. NO curved lines.
ONLY right-angle connectors.

Root (top center, large navy #232F3E box, white text):
- AWS Organizations icon in white
- Label: "Root" + "AWS Organizations"

OU Row (3 boxes side by side, each white with 4px left colored border):

OU 1 (Cosmos pink left border):
- Title: "Security OU"
- Contains 2 member accounts: "Log Archive" + "Audit"
- Managed by Control Tower

OU 2 (Smile orange left border):
- Title: "Workloads OU"
- Contains 2 member accounts: "Production" + "Staging"

OU 3 (Endor green left border):
- Title: "Sandbox OU"
- Contains 1 member account: "Developer Sandbox"

Account cards: white #FAFAFA background, 1px #EAEDED border, 8px radius, Control Tower
icon in Mars red #DD344C, account name in 16px semibold.

Connector lines: 1.5px slate #545B64, right-angle, no diagonal.

Top of diagram (above Root): AWS Control Tower service icon + "Control Tower / Landing Zone" title.

Style: Clean AWS architecture diagram on white (#FFFFFF). 2023 AWS flat icons.
Slate (#545B64) right-angle connectors. Amazon Ember-style sans-serif. AWS Blog technical
style. Aspect ratio 16:9, 1920x1080.
```
