# Template: `region-diagram`

**Layout:** GCP VPC Network (global, Google Blue solid boundary) containing Region boundaries (dashed, Slate) containing Zone boundaries (dotted, Pale Gray). Zones are stacked VERTICALLY within each region — never side by side. GCP-specific: the VPC is a global resource spanning multiple regions.

**Requires:** Read `references/layout-rules.md` (GCP network hierarchy rules, AP-04, AP-05, AP-08).
**Anti-patterns:**
- AP-04: VPC drawn as regional (must be global)
- AP-05: Zones placed side by side horizontally
- AP-08: Boundary styles all identical (no visual hierarchy)
- AP-15: Canvas padded to 1920×1080 when content is much smaller

---

## Prompt Template — Single Region, 2 Zones, Light Theme

```
Create a clean Google Cloud region diagram on white (#FFFFFF) showing {{DESCRIPTION}}.

BOUNDARY RULES — 3 DISTINCT border styles, explicitly different:
1. VPC Network boundary: SOLID 2px Google Blue (#4285F4) outer box — label "VPC Network: {{VPC_NAME}}".
   The VPC is a GLOBAL resource in GCP. It contains BOTH region boxes.
2. Region boundary: DASHED 1px Slate (#5F6368) box inside the VPC — label "{{REGION_NAME}}".
3. Zone boundaries: DOTTED (short dashes) 1px Pale Gray (#9AA0A6) boxes inside the Region.
   Zones are stacked VERTICALLY: Zone {{REGION}}-a is in the TOP ROW. Zone {{REGION}}-b is in the BOTTOM ROW.
   They are NOT side by side horizontally.

INTERNET / ENTRY POINT (outside VPC, to the left):
- User/Internet icon labeled "Internet" with an arrow pointing RIGHT into the VPC.
- Cloud Load Balancing icon at the VPC left edge labeled "Cloud Load Balancing" — it is a global resource.

INSIDE VPC → INSIDE {{REGION_NAME}} REGION:
Zone {{REGION}}-a (TOP zone):
{{...services in top zone...}}

Zone {{REGION}}-b (BOTTOM zone — directly below Zone A):
{{...services in bottom zone...}}

CONFIRM:
- VPC is the OUTER boundary (solid Blue). ONE VPC wraps the region.
- Region is INSIDE the VPC (dashed Slate).
- Zone A is the TOP box. Zone B is the BOTTOM box. They are STACKED VERTICALLY.
- Cloud Load Balancing, Pub/Sub, Cloud Storage, BigQuery sit OUTSIDE the VPC or at the VPC edge.

GOOGLE-MANAGED SERVICES OUTSIDE VPC (dotted connection):
{{...list managed services and their connection label...}}

Style: Clean Google Cloud region diagram on white (#FFFFFF). Material Design aesthetic.
Official Google Cloud service icons. FLAT 2D icons. NOT isometric. NOT glass morphism.
Three distinct boundary line styles (solid blue VPC / dashed slate region / dotted pale gray zone).
Google Sans font. Slate (#5F6368) arrows inside VPC. Aspect ratio 16:9, 1920x1080.
```

---

## Prompt Template — Multi-Region, Light Theme

```
Create a Google Cloud multi-region diagram on white (#FFFFFF) showing {{DESCRIPTION}}.

BOUNDARY RULES — same 3 distinct styles as single-region.

VPC Network boundary (SOLID Google Blue #4285F4): GLOBAL — label "VPC Network: {{VPC_NAME}}".
Contains BOTH region boxes.

Left Region — {{REGION_1}} (dashed Slate):
Zone {{REGION_1}}-a (TOP): {{...services...}}
Zone {{REGION_1}}-b (BOTTOM): {{...services...}}

Right Region — {{REGION_2}} (dashed Slate):
Zone {{REGION_2}}-a (TOP): {{...services...}}
Zone {{REGION_2}}-b (BOTTOM): {{...services...}}

Cross-region traffic: Arrow between {{REGION_1}} and {{REGION_2}} labeled "{{replication/routing label}}".

CRITICAL:
- The VPC boundary wraps BOTH region boxes — there is ONE VPC, not two.
- Zones A/B in each region are VERTICAL (A on top, B on bottom).

GOOGLE-MANAGED SERVICES OUTSIDE VPC: BigQuery (multi-regional), Cloud Spanner (multi-regional),
Cloud Storage. Connect with dotted arrows labeled "Private Google Access".

Style: Clean Google Cloud multi-region architecture. Material Design aesthetic.
Same boundary rules. Aspect ratio 16:9, 1920x1080.
```

---

## draw.io XML pattern (single region, 2 zones, light)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=region-diagram, generated=ISO8601, slug=SLUG -->
<mxfile>
  <diagram name="{{SLUG}}">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="900">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>

        <!-- VPC Network (global, solid Google Blue) -->
        <mxCell id="vpc" value="VPC Network: {{VPC_NAME}}" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#4285F4;strokeWidth=2;
                 dashed=0;fontColor=#4285F4;fontFamily=Google Sans,Roboto;fontSize=14;fontStyle=1;
                 verticalAlign=top;spacingTop=8;">
          <mxGeometry x="280" y="80" width="1480" height="760" as="geometry"/>
        </mxCell>

        <!-- Region (dashed Slate) -->
        <mxCell id="region" value="{{REGION_NAME}}" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#5F6368;strokeWidth=1;
                 dashed=1;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=13;
                 verticalAlign=top;spacingTop=8;">
          <mxGeometry x="360" y="140" width="1320" height="660" as="geometry"/>
        </mxCell>

        <!-- Zone A (TOP zone — dotted Pale Gray) -->
        <mxCell id="zone_a" value="Zone: {{REGION}}-a" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#9AA0A6;strokeWidth=1;
                 dashed=1;dashPattern=4 4;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=12;
                 verticalAlign=top;spacingTop=8;">
          <mxGeometry x="400" y="200" width="1240" height="260" as="geometry"/>
        </mxCell>

        <!-- Services in Zone A -->
        <mxCell id="svc_zone_a" value="{{Service in Zone A}}" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.{{STENCIL}};resIcon=mxgraph.gcp2.{{STENCIL}};
                 fillColor={{HEX}};strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=12;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="600" y="280" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Zone B (BOTTOM zone — directly below Zone A, same left/right bounds) -->
        <mxCell id="zone_b" value="Zone: {{REGION}}-b" vertex="1" parent="1"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#9AA0A6;strokeWidth=1;
                 dashed=1;dashPattern=4 4;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=12;
                 verticalAlign=top;spacingTop=8;">
          <mxGeometry x="400" y="480" width="1240" height="260" as="geometry"/>
        </mxCell>

        <!-- Services in Zone B -->

        <!-- Cloud Load Balancing (at VPC edge, outside or at VPC left) -->
        <mxCell id="clb" value="Cloud Load Balancing" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.cloud_load_balancing;resIcon=mxgraph.gcp2.cloud_load_balancing;
                 fillColor=#4285F4;strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=11;fontStyle=1;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="290" y="390" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Internet (outside VPC, left) -->
        <mxCell id="internet" value="Internet" vertex="1" parent="1"
          style="shape=mxgraph.gcp2.user;fillColor=#5F6368;strokeColor=none;fontColor=#202124;
                 fontFamily=Google Sans,Roboto;fontSize=12;
                 verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;">
          <mxGeometry x="120" y="390" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Arrows -->
        <mxCell id="e_internet_clb" value="HTTPS" edge="1" source="internet" target="clb" parent="1"
          style="endArrow=classic;html=1;strokeColor=#5F6368;strokeWidth=2;
                 fontFamily=Google Sans,Roboto;fontSize=11;fontColor=#5F6368;
                 labelBackgroundColor=#FFFFFF;labelBorderColor=none;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Service Placement Quick Reference

| Service | Placement | Notes |
|---|---|---|
| Compute Engine | Inside Zone | In a specific zone |
| GKE node pool | Inside Zone | Multiple nodes per zone |
| Cloud SQL | Inside Zone (primary) + sibling Zone (replica) | Zone-specific placement |
| Cloud Spanner | Outside VPC or spanning regions | Multi-regional by nature |
| Cloud Load Balancing | At VPC edge | Global resource |
| Cloud NAT | Regional layer (between VPC and internet) | Per-region resource |
| Cloud Run | Outside VPC (default) | Inside VPC with Direct VPC egress |
| Cloud Storage | Outside VPC | Connect via Private Google Access |
| BigQuery | Outside VPC | Connect via Private Google Access |
| Pub/Sub | Outside VPC | Global managed service |

---

## Variables

| Variable | Description |
|---|---|
| `{{VPC_NAME}}` | VPC name (e.g., `prod-vpc`) |
| `{{REGION_NAME}}` | Region (e.g., `us-central1`) |
| `{{REGION}}` | Region prefix for zone names (e.g., `us-central1`) |
| `{{REGION_1}}` / `{{REGION_2}}` | Two regions for multi-region diagram |
