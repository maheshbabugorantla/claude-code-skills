# Template: `resource-hierarchy`

**Layout:** Top-down GCP Resource Hierarchy tree. Organization at the top, Folders below, Projects below Folders, Resources below Projects. Right-angle connectors only. Best for: explaining GCP IAM hierarchy, onboarding material, landing zone diagrams, multi-project architecture overviews.

**Requires:** Read `references/layout-rules.md` (GCP Resource Hierarchy rules, AP-14).
**Anti-patterns:**
- AP-14: Folder drawn as child of Project (inverted nesting)
- AP-06: Diagonal or curved connectors
- AP-15: Canvas too large for content

---

## GCP Resource Hierarchy — 4 Levels

```
Organization              ← root; IAM policies here apply to all
  └── Folder(s)            ← optional grouping (e.g., "Production", "Development")
        └── Project(s)     ← billing unit; IAM boundary; resources live here
              └── Resources (VMs, buckets, datasets, service accounts, etc.)
```

**Key rules:**
- The hierarchy is always 4 levels max (with optional folder nesting)
- Folders can be nested (Folders inside Folders)
- Projects are always leaf nodes in the folder tree (they can't contain Folders)
- All IAM policies inherit downward (an Org-level policy applies to all Folders, Projects, Resources)

---

## Prompt Template — Light Theme (single org, 2 folders, 2 projects each)

```
Create a clean Google Cloud Resource Hierarchy illustration on white (#FFFFFF) showing
{{DESCRIPTION}}.

Layout: Top-to-bottom tree. Organization at the top center. Folders arranged horizontally
below Organization. Projects arranged below their parent Folder. Representative resources
below Projects. ALL connectors are RIGHT-ANGLE lines (orthogonal). No diagonal lines. No
curved lines.

HIERARCHY (strict top-to-bottom order — NEVER invert):
Level 1 — ORGANIZATION (top center):
- Icon: Cloud Resource Manager icon in Slate (#5F6368)
- Label: "{{ORG_NAME}}" (e.g., "acme.com")
- Below label: "Organization"

Level 2 — FOLDERS (horizontal row below Organization):
Folder A (left): Google Blue (#4285F4) folder icon. Label: "{{FOLDER_A_NAME}}"
Folder B (right): Google Blue (#4285F4) folder icon. Label: "{{FOLDER_B_NAME}}"
Right-angle connectors from Organization down to each Folder.

Level 3 — PROJECTS (below their parent Folder):
Under Folder A:
  Project 1: Google Blue (#4285F4) project icon. Label: "{{PROJECT_1_NAME}}"
  Project 2: Google Blue (#4285F4) project icon. Label: "{{PROJECT_2_NAME}}"
Under Folder B:
  Project 3: Google Blue (#4285F4) project icon. Label: "{{PROJECT_3_NAME}}"
  Project 4: Google Blue (#4285F4) project icon. Label: "{{PROJECT_4_NAME}}"
Right-angle connectors from each Folder down to its Projects.

Level 4 — RESOURCES (below each Project, small icon row):
Under Project 1: Compute Engine + Cloud Storage + BigQuery icons (small, ~40px)
Under Project 2: Cloud Run + Firestore icons
{{...others as specified...}}
Right-angle connectors from Projects down to their resource rows.

OPTIONAL IAM CALLOUT:
- Google Blue (#4285F4) "Cloud IAM" icon adjacent to Organization with a dashed label:
  "Org-level policy: all projects inherit"
- Cloud IAM icon adjacent to a Folder with label: "Folder policy"

CONFIRM: Organization is the ROOT (highest level). Folders are BELOW Organization.
Projects are BELOW Folders. Resources are BELOW Projects.
NO Folder is drawn as a child of a Project. ALL connectors are right-angle lines.

Style: Clean GCP Resource Hierarchy on white (#FFFFFF). Material Design aesthetic.
Official GCP service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Right-angle connectors (no curved, no diagonal). Google Sans font.
Aspect ratio 16:9 preferred; adjust pageHeight to fit content.
```

---

## Prompt Template — Dark Theme (single org, 2 folders, 2 projects each)

```
Create a Google Cloud Resource Hierarchy illustration on Deep Gray (#202124) background
showing {{DESCRIPTION}}.

Layout: Top-to-bottom tree. Organization at the top center. Folders arranged horizontally
below Organization. Projects arranged below their parent Folder. Representative resources
below Projects. ALL connectors are RIGHT-ANGLE lines (orthogonal). No diagonal lines. No
curved lines.

HIERARCHY (strict top-to-bottom order — NEVER invert):
Level 1 — ORGANIZATION (top center):
- Icon: Cloud Resource Manager icon in Pale Gray (#9AA0A6)
- Label: "{{ORG_NAME}}" (e.g., "acme.com"), white (#FFFFFF)
- Below label: "Organization" in #9AA0A6

Level 2 — FOLDERS (horizontal row below Organization):
Folder A (left): Google Blue (#4285F4) folder icon. Dark card (#303134), Blue border. Label: "{{FOLDER_A_NAME}}" in white.
Folder B (right): Google Blue (#4285F4) folder icon. Dark card (#303134), Blue border. Label: "{{FOLDER_B_NAME}}" in white.
Right-angle connectors (#5F6368) from Organization down to each Folder.

Level 3 — PROJECTS (below their parent Folder):
Under Folder A:
  Project 1: Dark card (#303134), 1px #4285F4 border. Label: "{{PROJECT_1_NAME}}" in white.
  Project 2: Dark card (#303134), 1px #4285F4 border. Label: "{{PROJECT_2_NAME}}" in white.
Under Folder B:
  Project 3: Dark card (#303134), 1px #4285F4 border. Label: "{{PROJECT_3_NAME}}" in white.
  Project 4: Dark card (#303134), 1px #4285F4 border. Label: "{{PROJECT_4_NAME}}" in white.
Right-angle connectors (#5F6368) from each Folder down to its Projects.

Level 4 — RESOURCES (below each Project, small icon row):
Same as light theme — official GCP service icons in their category colors.
Right-angle connectors (#5F6368) from Projects down to their resource rows.

CONFIRM: Organization is the ROOT (highest level). Folders are BELOW Organization.
Projects are BELOW Folders. Resources are BELOW Projects.
NO Folder is drawn as a child of a Project. ALL connectors are right-angle lines.
Background: Deep Gray (#202124) — NOT pure black (#000000).

Style: Google Cloud Resource Hierarchy on Deep Gray (#202124) dark background.
Material Design dark aesthetic. Official GCP service icons. FLAT 2D icons. NOT isometric.
NOT glass morphism. NOT neon glows. Right-angle connectors. Google Sans font.
Aspect ratio 16:9 preferred; adjust pageHeight to fit content.
```

---

## draw.io XML pattern (org → 2 folders → 2 projects each)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=resource-hierarchy, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="900">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- Level 1: Organization (centered) -->
        <mxCell id="org" value="{{ORG_NAME}}&#xa;Organization" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.cloud_resource_manager;resIcon=mxgraph.gcp2.cloud_resource_manager;
                 fillColor=#5F6368;strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=14;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="928" y="60" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Level 2: Folder A (left) -->
        <mxCell id="folder_a" value="{{FOLDER_A_NAME}}&#xa;Folder" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E8F0FE;strokeColor=#4285F4;strokeWidth=1;
                 fontFamily=Google Sans,Roboto;fontSize=14;fontStyle=1;fontColor=#202124;">
          <mxGeometry x="480" y="260" width="240" height="80" as="geometry"/>
        </mxCell>

        <!-- Level 2: Folder B (right) -->
        <mxCell id="folder_b" value="{{FOLDER_B_NAME}}&#xa;Folder" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E8F0FE;strokeColor=#4285F4;strokeWidth=1;
                 fontFamily=Google Sans,Roboto;fontSize=14;fontStyle=1;fontColor=#202124;">
          <mxGeometry x="1200" y="260" width="240" height="80" as="geometry"/>
        </mxCell>

        <!-- Org → Folder A connector -->
        <mxCell id="conn_org_fa" value="" edge="1" source="org" target="folder_a" parent="1"
          style="endArrow=none;html=1;strokeColor=#5F6368;strokeWidth=1.5;
                 edgeStyle=orthogonalEdgeStyle;rounded=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <!-- Org → Folder B connector -->
        <mxCell id="conn_org_fb" value="" edge="1" source="org" target="folder_b" parent="1"
          style="endArrow=none;html=1;strokeColor=#5F6368;strokeWidth=1.5;
                 edgeStyle=orthogonalEdgeStyle;rounded=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Level 3: Projects under Folder A -->
        <mxCell id="proj1" value="{{PROJECT_1_NAME}}&#xa;Project" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#4285F4;strokeWidth=1;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontColor=#202124;">
          <mxGeometry x="360" y="460" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="proj2" value="{{PROJECT_2_NAME}}&#xa;Project" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#4285F4;strokeWidth=1;
                 fontFamily=Google Sans,Roboto;fontSize=13;fontColor=#202124;">
          <mxGeometry x="600" y="460" width="200" height="60" as="geometry"/>
        </mxCell>

        <!-- Folder A → Project 1,2 connectors -->
        <mxCell id="conn_fa_p1" value="" edge="1" source="folder_a" target="proj1" parent="1"
          style="endArrow=none;html=1;strokeColor=#5F6368;strokeWidth=1.5;
                 edgeStyle=orthogonalEdgeStyle;rounded=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="conn_fa_p2" value="" edge="1" source="folder_a" target="proj2" parent="1"
          style="endArrow=none;html=1;strokeColor=#5F6368;strokeWidth=1.5;
                 edgeStyle=orthogonalEdgeStyle;rounded=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Level 4: Resources under Project 1 (small icons) -->
        <mxCell id="res1_gce" value="Compute Engine" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.compute_engine;resIcon=mxgraph.gcp2.compute_engine;
                 fillColor=#4285F4;strokeColor=none;fontColor=#5F6368;
                 fontFamily=Google Sans,Roboto;fontSize=10;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="320" y="620" width="40" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="res1_gcs" value="Cloud Storage" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.cloud_storage;resIcon=mxgraph.gcp2.cloud_storage;
                 fillColor=#34A853;strokeColor=none;fontColor=#5F6368;
                 fontFamily=Google Sans,Roboto;fontSize=10;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="380" y="620" width="40" height="40" as="geometry"/>
        </mxCell>

        <!-- Repeat for remaining projects and folders on right side -->

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## IAM Binding Callout Pattern

```xml
<!-- Cloud IAM binding callout at Organization level -->
<mxCell id="iam_callout" value="Cloud IAM&#xa;Org-level policy" vertex="1" parent="1"
  style="shape=mxgraph.gcp2.cloud_iam;resIcon=mxgraph.gcp2.cloud_iam;
         fillColor=#4285F4;strokeColor=none;fontColor=#202124;
         fontFamily=Google Sans,Roboto;fontSize=11;fontStyle=1;
         verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
  <mxGeometry x="1120" y="60" width="48" height="48" as="geometry"/>
</mxCell>
<mxCell id="iam_conn" value="applies to all" edge="1" source="iam_callout" target="org" parent="1"
  style="endArrow=open;html=1;strokeColor=#4285F4;strokeWidth=1.5;dashed=1;
         fontFamily=Google Sans,Roboto;fontSize=11;fontColor=#4285F4;
         labelBackgroundColor=#FFFFFF;labelBorderColor=none;">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

---

## Variables

| Variable | Description |
|---|---|
| `{{ORG_NAME}}` | Organization domain (e.g., `acme.com`) |
| `{{FOLDER_A_NAME}}` / `{{FOLDER_B_NAME}}` | Folder names (e.g., "Production", "Development") |
| `{{PROJECT_N_NAME}}` | Project names (e.g., `prod-api`, `dev-data`) |
