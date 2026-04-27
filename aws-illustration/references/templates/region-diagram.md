# Template: `region-diagram`

**Layout:** AWS regional architecture with Region boundary → VPC → AZ boundaries → subnets → services. The gold-standard AWS reference architecture diagram format. Default: single region, 2 AZs, public+private subnets per AZ.

**Requires:** Read `references/layout-rules.md` (especially AWS Region/AZ Hierarchy Rules) before generating.

---

## Prompt Template — Single Region, 2 AZs, Light Theme

```
Create a clean AWS regional architecture diagram on white (#FFFFFF) background showing
{{DESCRIPTION}}.

CRITICAL LAYOUT RULES:
1. AZs are stacked VERTICALLY. AZ us-east-1a is in the TOP row. AZ us-east-1b is in
   the BOTTOM row. They are NOT side by side horizontally. NEVER horizontal AZ placement.
2. Within each AZ, services flow LEFT to RIGHT inside their subnets.
3. Public subnet is ALWAYS on top within an AZ. Private subnet is ALWAYS below it.
4. The Region boundary box is DASHED. AZ boundaries are DOTTED. VPC is SOLID purple.

[Outer boundary — AWS Cloud: no fill, optional thin border]

  [Internet / User icon — outside the Region, on the left]
  Arrow labeled "HTTPS" pointing right into the Region

  [Region boundary box — dashed 1px #545B64, top-left label: "▣ us-east-1"]
  Full-width dashed box containing the VPC.

    [VPC boundary — solid 1px #8C4FFF (Galaxy), fill rgba(140,79,255,0.04), label: "VPC (10.0.0.0/16)"]

      [AZ boundary — us-east-1a — DOTTED 1px #879096, TOP row]
        [Public Subnet — solid 1px #7AA116 border, pale green fill, label "Public Subnet / 10.0.1.0/24"]
          Services in public subnet:
          {{PUBLIC_SERVICES_AZ_A}}
          (Application Load Balancer, NAT Gateway, bastion host typical)

        [Private Subnet — solid 1px #879096 border, pale gray fill, label "Private Subnet / 10.0.2.0/24"]
          Services in private subnet:
          {{PRIVATE_SERVICES_AZ_A}}
          (AWS Lambda, Amazon ECS tasks, Amazon RDS primary typical)

      [AZ boundary — us-east-1b — DOTTED, BOTTOM row, directly below us-east-1a]
        [Public Subnet — same styling, label "Public Subnet / 10.0.3.0/24"]
          {{PUBLIC_SERVICES_AZ_B}}

        [Private Subnet — label "Private Subnet / 10.0.4.0/24"]
          {{PRIVATE_SERVICES_AZ_B}}
          (Amazon RDS standby/replica, Amazon ECS tasks)

  [Outside VPC on right: supporting services]
  {{EXTERNAL_SERVICES}} — Amazon S3, Amazon DynamoDB, Amazon CloudWatch, AWS CloudTrail (managed, outside VPC)

External service icons ({{CATEGORY_COLOR}}):
- Each managed service outside VPC connected to private subnet with dotted arrows labeled "AWS SDK / API"

AZ connectivity: Arrows between AZ-A services and AZ-B services labeled "Multi-AZ failover" (dashed).

CONFIRM:
- AZ us-east-1a is in the TOP row
- AZ us-east-1b is in the BOTTOM row directly below us-east-1a
- They are stacked vertically, NOT placed side by side
- Public subnets are on TOP within each AZ
- Private subnets are on BOTTOM within each AZ

Style: Clean AWS architecture on white (#FFFFFF). 2023 AWS flat icons. Region dashed,
AZ dotted, VPC solid purple. Category-color icons. Amazon Ember-style sans-serif.
Slate (#545B64) arrows. AWS Blog reference architecture style.
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Single Region, 2 AZs, Dark Theme

```
Create an AWS re:Invent regional architecture diagram on Squid Ink navy (#232F3E)
showing {{DESCRIPTION}}.

CRITICAL LAYOUT RULES (same as light):
1. AZs stacked VERTICALLY. us-east-1a TOP row. us-east-1b BOTTOM row. NOT side by side.
2. Public subnet TOP within AZ. Private subnet BOTTOM.
3. Region = dashed #D5DBDB border. AZ = dotted #879096. VPC = solid Galaxy purple.

[Internet icon — outside, left. White/pale icon.]

[Region boundary — dashed #D5DBDB, top-left label white "▣ us-east-1"]

  [VPC — solid 1px #8C4FFF, fill rgba(140,79,255,0.08), label white "VPC"]

    [AZ us-east-1a — DOTTED #879096, TOP row]
      [Public Subnet — 1px #7AA116 border, rgba(122,161,22,0.15) fill, white label]
        {{PUBLIC_SERVICES_AZ_A}} — dark-BG icon variants
      [Private Subnet — 1px #545B64 border, rgba(84,91,100,0.2) fill, white label]
        {{PRIVATE_SERVICES_AZ_A}} — dark-BG icons

    [AZ us-east-1b — DOTTED, BOTTOM row below us-east-1a]
      [Public Subnet]  {{PUBLIC_SERVICES_AZ_B}}
      [Private Subnet] {{PRIVATE_SERVICES_AZ_B}}

  [External: {{EXTERNAL_SERVICES}} with pale gray arrows]

CONFIRM: AZ vertical stacking, public on top, private on bottom.

Style: AWS re:Invent on #232F3E. Dark-BG icon variants. No glass morphism.
White text. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML skeleton

```xml
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="1" gridSize="10">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Region boundary -->
        <mxCell id="region" value="us-east-1" vertex="1" parent="1"
          style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];
                 shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_region;grStroke=1;
                 verticalLabelPosition=top;verticalAlign=bottom;labelBackgroundColor=none;
                 align=center;spacingTop=0;dashed=1;strokeColor=#545B64;fillColor=none;
                 html=1;fontSize=14;fontColor=#545B64;fontStyle=1;">
          <mxGeometry x="120" y="80" width="1600" height="880" as="geometry"/>
        </mxCell>

        <!-- VPC boundary -->
        <mxCell id="vpc" value="VPC (10.0.0.0/16)" vertex="1" parent="1"
          style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];
                 shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_vpc;grStroke=1;
                 dashed=0;strokeColor=#8C4FFF;strokeWidth=1;fillColor=rgba(140,79,255,0.04);
                 verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;
                 fontSize=13;fontColor=#8C4FFF;fontStyle=1;">
          <mxGeometry x="160" y="120" width="1520" height="820" as="geometry"/>
        </mxCell>

        <!-- AZ us-east-1a (TOP) -->
        <mxCell id="az_a" value="us-east-1a" vertex="1" parent="1"
          style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];
                 shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_availability_zone;
                 grStroke=1;dashed=1;strokeDashPattern=4 4;strokeColor=#879096;fillColor=none;
                 verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;
                 fontSize=12;fontColor=#879096;fontStyle=1;">
          <mxGeometry x="200" y="160" width="1440" height="380" as="geometry"/>
        </mxCell>

        <!-- AZ us-east-1b (BOTTOM — below us-east-1a) -->
        <mxCell id="az_b" value="us-east-1b" vertex="1" parent="1"
          style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];
                 shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_availability_zone;
                 grStroke=1;dashed=1;strokeDashPattern=4 4;strokeColor=#879096;fillColor=none;
                 verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;
                 fontSize=12;fontColor=#879096;fontStyle=1;">
          <mxGeometry x="200" y="560" width="1440" height="380" as="geometry"/>
        </mxCell>

        <!-- Public Subnet AZ-A -->
        <mxCell id="pub_a" value="Public Subnet 10.0.1.0/24" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E9F3E6;strokeColor=#7AA116;
                 strokeWidth=1;fontSize=11;fontColor=#545B64;verticalAlign=top;align=left;
                 spacingLeft=8;spacingTop=4;">
          <mxGeometry x="240" y="200" width="660" height="160" as="geometry"/>
        </mxCell>

        <!-- Private Subnet AZ-A -->
        <mxCell id="priv_a" value="Private Subnet 10.0.2.0/24" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F5F5F5;strokeColor=#879096;
                 strokeWidth=1;fontSize=11;fontColor=#545B64;verticalAlign=top;align=left;
                 spacingLeft=8;spacingTop=4;">
          <mxGeometry x="940" y="200" width="660" height="160" as="geometry"/>
        </mxCell>

        <!-- Service icons go inside the subnet boxes -->
        <!-- Example: ALB in Public Subnet AZ-A -->
        <mxCell id="alb_a" value="ALB" vertex="1" parent="1"
          style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;
                 fillColor=#8C4FFF;strokeColor=none;dashed=0;verticalLabelPosition=bottom;
                 verticalAlign=top;align=center;html=1;fontSize=11;aspect=fixed;
                 shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.application_load_balancer;">
          <mxGeometry x="290" y="230" width="60" height="60" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{DESCRIPTION}}` | What the architecture shows |
| `{{PUBLIC_SERVICES_AZ_A/B}}` | Services in public subnets: Application Load Balancer, NAT Gateway, bastion host |
| `{{PRIVATE_SERVICES_AZ_A/B}}` | Services in private subnets: AWS Lambda, Amazon ECS, Amazon RDS |
| `{{EXTERNAL_SERVICES}}` | Managed services outside VPC: Amazon S3, Amazon DynamoDB, Amazon CloudWatch |

## Default service placements

| Service | Placement |
|---|---|
| Application Load Balancer / Network Load Balancer | Public subnet |
| NAT Gateway | Public subnet |
| Bastion host (Amazon EC2) | Public subnet |
| AWS Lambda | Private subnet |
| Amazon ECS / AWS Fargate tasks | Private subnet |
| Amazon RDS primary | Private subnet AZ-A |
| Amazon RDS standby | Private subnet AZ-B |
| Amazon API Gateway | Outside VPC (right side) |
| Amazon CloudFront | Outside region (far left) |
| Amazon S3 / Amazon DynamoDB | Outside VPC (right side) |
| Amazon CloudWatch / AWS X-Ray | Outside VPC (bottom right) |
| AWS IAM | Outside VPC |
