# Template: `multi-account`

**Layout:** AWS Organizations hierarchy — Root at top, OUs in the middle, member accounts at the bottom. Right-angle connectors only. Good for Control Tower landing zone diagrams, MSSP architectures, and multi-tenant setups.

---

## Prompt Template — AWS Control Tower Default, Light Theme

```
Create a clean AWS multi-account organizational hierarchy diagram on white (#FFFFFF)
background showing {{DESCRIPTION}}.

CRITICAL LAYOUT RULE: This is a TOP-TO-BOTTOM hierarchy. Root at the top center.
OUs in the middle row. Member accounts in the bottom rows. ALL connector lines are
RIGHT-ANGLE (horizontal + vertical segments). NO diagonal lines. NO curved lines.
NO arrows pointing sideways or up.

[AWS Organizations icon + "Management Account" label at top center]
Connected to Root with a right-angle line.

Root box (navy #232F3E fill, white text, 8px radius):
- AWS Organizations icon (white)
- Label: "Root"
- Sublabel: "AWS Organizations"

OU row — {{N}} OU boxes, horizontally distributed:

OU 1 (white #FFFFFF, 1px #EAEDED border, 8px radius, {{CATEGORY_COLOR_1}} 4px left border):
- Title: "{{OU 1 name}}" in 16px semibold #232F3E
- Sublabel: "{{OU description}}"
- AWS Control Tower icon in {{CATEGORY_COLOR_1}} (13px, top-right corner)
Right-angle connector from Root to this OU.

OU 2 ({{CATEGORY_COLOR_2}} left border):
- Title: "{{OU 2 name}}"
- Sublabel: "{{OU description}}"
Right-angle connector from Root.

{{...more OUs...}}

Member account cards (below each OU), white, smaller, 6px radius:
- AWS Management Console icon in Mars red (#DD344C) (represents account)
- Account name: "{{account name}}"
- Account ID hint: "123456789012" (masked)
Right-angle connectors from each OU to its accounts.

Optional: AWS Control Tower service banner at top ("Governed by AWS Control Tower")
in Cosmos pink #E7157B.

CONFIRM: All connectors are right-angle only. No diagonal lines. Root is at the top.
Accounts are at the bottom. The hierarchy flows top-to-bottom.

Style: Clean AWS multi-account diagram on white (#FFFFFF). 2023 AWS flat icons.
Navy root, colored OU left borders, right-angle connectors in slate (#545B64).
Amazon Ember-style sans-serif. AWS Blog reference architecture style.
Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Dark Theme

```
Create an AWS re:Invent keynote multi-account hierarchy on Squid Ink navy (#232F3E)
showing {{DESCRIPTION}}.

CRITICAL LAYOUT RULE: Same as light — top-to-bottom, right-angle connectors only,
no diagonal lines.

Root box (white #FFFFFF fill, navy #232F3E text — inverted for visibility):
- Organizations icon
- Label: "Root"

OU boxes (dark card #314050, 1px #414D5C border, {{CATEGORY_COLOR}} 4px left border):
- Title: white text
- AWS Control Tower icon in category color

Account cards (smaller dark cards #3D4F60, white text):
- Management Console icon, pale
- Account name

Connectors: pale gray #D5DBDB, 1px, right-angle.

Style: AWS re:Invent on #232F3E. 2023 flat icons dark-BG. No glass morphism.
Colored left borders on OUs. White text. Aspect ratio 16:9, 1920x1080.
```

---

## Common OU Structures

### AWS Control Tower Default (recommended starting point)
```
Root
├── Security OU
│   ├── Log Archive Account
│   └── Audit Account
├── Sandbox OU
│   └── Developer Sandbox Account
└── Workloads OU
    ├── Production Account(s)
    └── Staging Account(s)
```
OU colors: Security → Mars `#DD344C`, Sandbox → Endor `#7AA116`, Workloads → Smile `#ED7100`

### Multi-Tier Enterprise
```
Root
├── Core OU (Mars red)
│   ├── Network Account
│   └── Security Tooling Account
├── Prod OU (Smile orange)
│   └── 3–5 Product Accounts
├── NonProd OU (Endor green)
│   └── Dev + Staging Accounts
└── Data OU (Cosmos pink)
    └── Data Lake + Analytics Accounts
```

### MSSP / Multi-Tenant SaaS
```
Root
├── Partner Management OU (Cosmos pink)
│   └── Management + Billing Accounts
└── Customer OUs (one per customer, Smile orange)
    └── Prod Account + Dev Account per customer
```

---

## draw.io XML pattern

```xml
<!-- Root -->
<mxCell id="root" value="Root" vertex="1" parent="1"
  style="rounded=1;arcSize=5;whiteSpace=wrap;html=1;fillColor=#232F3E;strokeColor=#232F3E;
         fontColor=#FFFFFF;fontStyle=1;fontSize=16;fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="{{CENTER_X-80}}" y="60" width="160" height="60" as="geometry"/>
</mxCell>
<!-- OU card -->
<mxCell id="ou1" value="&lt;b&gt;{{OU Name}}&lt;/b&gt;&lt;br/&gt;{{Description}}"
  vertex="1" parent="1"
  style="rounded=1;arcSize=5;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#EAEDED;
         fontColor=#232F3E;fontSize=14;align=left;spacingLeft=16;
         strokeWidth=1;fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="{{X}}" y="200" width="220" height="80" as="geometry"/>
</mxCell>
<!-- OU left accent bar -->
<mxCell id="oubar1" vertex="1" parent="1"
  style="fillColor={{CATEGORY_HEX}};strokeColor=none;rounded=0;">
  <mxGeometry x="{{X}}" y="200" width="4" height="80" as="geometry"/>
</mxCell>
<!-- Account card -->
<mxCell id="acct1" value="{{Account Name}}" vertex="1" parent="1"
  style="rounded=1;arcSize=5;whiteSpace=wrap;html=1;fillColor=#FAFAFA;strokeColor=#EAEDED;
         fontColor=#232F3E;fontSize=12;fontFamily=Amazon Ember,Inter,sans-serif;">
  <mxGeometry x="{{X}}" y="360" width="160" height="50" as="geometry"/>
</mxCell>
<!-- Right-angle connector Root → OU -->
<mxCell id="conn1" edge="1" source="root" target="ou1" parent="1"
  style="endArrow=none;html=1;strokeColor=#545B64;strokeWidth=1;edgeStyle=elbowEdgeStyle;">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{DESCRIPTION}}` | What org structure is shown |
| `{{N}}` | Number of OUs |
| `{{OU N name}}` | OU name (e.g., "Security OU", "Workloads OU") |
| `{{OU description}}` | Short sublabel (e.g., "Audit + logging accounts") |
| `{{CATEGORY_COLOR_N}}` | OU left-border color (can differ per OU) |
| `{{account name}}` | Member account name (e.g., "Log Archive", "Production") |
