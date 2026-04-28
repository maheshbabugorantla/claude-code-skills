# Examples

Three full worked invocations showing complete outputs from `/gcp-illustration`.
Each example includes: invocation, consultation answers, AI prompt, and draw.io XML skeleton.

---

## Example 1 — Serverless Web App (`architecture`, light)

**Invocation:**
```
/gcp-illustration architecture "Serverless web app with Cloud Run and Firestore" --theme=light
```

**Consultation answers (resolved from invocation):**
- Theme: light (from `--theme=light`)
- Services: Cloud Load Balancing → Cloud Run → Firestore + Cloud Storage
- Layout: single row
- Flow: ingress-heavy (left to right)
- Audience: engineering team (architecture review)

**Steps skipped:** S1 (theme from flag), S2 (services named in topic)
**Steps taken:** layout confirmation → S3 (flow direction) → S4 (audience)

---

### AI Prompt (save to `img/serverless-web-app-prompt.md`)

```
Style: Clean Google Cloud architecture diagram on a white (#FFFFFF) background.
Material Design aesthetic. Service icons using official Google Cloud colors:
Google Blue (#4285F4) for Compute/Networking, Google Green (#34A853) for Storage/Serverless,
Google Red (#EA4335) for Databases.
Label every service with its official Google Cloud marketing name:
"Cloud Load Balancing", "Cloud Run", "Firestore", "Cloud Storage".
Text in Google Sans or Roboto font. Slate (#5F6368) arrows, 2px weight.
White card backgrounds, 1px #DADCE0 borders, subtle corner radius.
Google Cloud architecture diagram style. Aspect ratio 16:9, 1920x1080.

Strict Left-to-Right layout ONLY. No arrows point downward. No arrows point left.
No diagonal arrows. No curved arrows. No arcs.

Architecture (5 components left to right):

Component 1 — User (outside left): Stick figure labeled "User / Browser".
  Style: no GCP icon, just a person icon in Slate (#5F6368).

Component 2 — Cloud Load Balancing: Official Cloud Load Balancing icon in Google Blue (#4285F4).
  Label: "Cloud Load Balancing". Subtitle: "Global HTTP(S) LB".
  Position: leftmost GCP service, just to the right of the User icon.
  Arrow from User to Cloud Load Balancing pointing RIGHT. Label: "HTTPS".

Component 3 — Cloud Run: Official Cloud Run icon in Google Green (#34A853).
  Label: "Cloud Run". Subtitle: "Containerized API".
  Position: center, to the right of Cloud Load Balancing.
  Arrow from Cloud Load Balancing to Cloud Run pointing RIGHT. Label: "HTTP".

Component 4 — Firestore: Official Firestore icon in Google Red (#EA4335).
  Label: "Firestore". Subtitle: "NoSQL database".
  Position: to the right of Cloud Run.
  Arrow from Cloud Run to Firestore pointing RIGHT. Label: "gRPC / REST".

Component 5 — Cloud Storage: Official Cloud Storage icon in Google Green (#34A853).
  Label: "Cloud Storage". Subtitle: "Static assets".
  Position: to the right of Firestore (or stacked below Firestore, if needed).
  Arrow from Cloud Run to Cloud Storage pointing RIGHT (or DOWN if stacked). Label: "GCS PUT/GET".

All 5 components sit on the same horizontal level if possible.
CONFIRM: Arrows flow LEFT → RIGHT: User → Cloud Load Balancing → Cloud Run → Firestore.
Cloud Run also connects to Cloud Storage. No arrows reverse direction.

FLAT 2D icons. NOT isometric. NOT 3D perspective. NOT glass morphism. NOT neon glows.
NO generic cloud shapes — use official Google Cloud service icons only.
```

---

### draw.io XML Skeleton (save to `diagrams/serverless-web-app.drawio`)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=architecture, generated=ISO8601, slug=serverless-web-app -->
<mxfile>
  <diagram name="Serverless Web App">
    <mxGraphModel background="#FFFFFF" grid="0" gridSize="10" page="0" pageWidth="1920" pageHeight="560">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- User -->
        <mxCell id="user1" value="User / Browser" style="shape=mxgraph.gcp2.user;fillColor=#5F6368;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="80" y="220" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Cloud Load Balancing -->
        <mxCell id="clb1" value="Cloud Load Balancing" style="shape=mxgraph.gcp2.cloud_load_balancing;resIcon=mxgraph.gcp2.cloud_load_balancing;fillColor=#4285F4;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="280" y="220" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Cloud Run -->
        <mxCell id="cloudrun1" value="Cloud Run" style="shape=mxgraph.gcp2.cloud_run;resIcon=mxgraph.gcp2.cloud_run;fillColor=#34A853;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="520" y="220" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Firestore -->
        <mxCell id="firestore1" value="Firestore" style="shape=mxgraph.gcp2.firestore;resIcon=mxgraph.gcp2.firestore;fillColor=#EA4335;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="760" y="180" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Cloud Storage -->
        <mxCell id="gcs1" value="Cloud Storage" style="shape=mxgraph.gcp2.cloud_storage;resIcon=mxgraph.gcp2.cloud_storage;fillColor=#34A853;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="760" y="320" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Arrows -->
        <mxCell id="e1" value="HTTPS" style="endArrow=classic;strokeColor=#5F6368;strokeWidth=2;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#FFFFFF;labelBorderColor=none;" edge="1" source="user1" target="clb1" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e2" value="HTTP" style="endArrow=classic;strokeColor=#5F6368;strokeWidth=2;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#FFFFFF;labelBorderColor=none;" edge="1" source="clb1" target="cloudrun1" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e3" value="gRPC / REST" style="endArrow=classic;strokeColor=#5F6368;strokeWidth=2;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#FFFFFF;labelBorderColor=none;" edge="1" source="cloudrun1" target="firestore1" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e4" value="GET / PUT" style="endArrow=classic;strokeColor=#5F6368;strokeWidth=2;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#FFFFFF;labelBorderColor=none;" edge="1" source="cloudrun1" target="gcs1" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

**Replace `HASH`** with the output of `bash bin/gcp-catalog-hash.sh`.

---

## Example 2 — Data Pipeline (`workflow`, dark)

**Invocation:**
```
/gcp-illustration workflow "Streaming data pipeline: Pub/Sub to BigQuery" --theme=dark
```

**Consultation answers:**
- Theme: dark (from `--theme=dark`)
- Services: Pub/Sub → Dataflow → BigQuery → Looker
- Workflow phases: Ingest → Transform → Store → Visualize
- Audience: engineering team

---

### AI Prompt (save to `img/pubsub-bigquery-pipeline-prompt.md`)

```
Style: Google Cloud architecture diagram on a Deep Gray (#202124) background.
Material Design aesthetic, dark mode. Service icons using official Google Cloud colors:
Google Yellow (#FBBC04) for Analytics/Data services.
Label every service with its official Google Cloud marketing name:
"Pub/Sub", "Dataflow", "BigQuery", "Looker".
White (#FFFFFF) text. Pale gray (#9AA0A6) arrows, 1.5px weight.
Dark card surface (#303134), 1px #5F6368 border.
Google Cloud architecture diagram style, dark mode. Aspect ratio 16:9, 1920x1080.

Strict Left-to-Right layout ONLY. No arrows point downward. No arrows point left.
No diagonal arrows. No curved arrows.

Workflow — 4 horizontal phases with phase labels above each component:

Phase 1 — INGEST: Pub/Sub icon in Google Yellow (#FBBC04).
  Label below icon: "Pub/Sub". Phase label above: "1. Ingest".
  Subtitle: "Streaming messages".

Phase 2 — TRANSFORM: Dataflow icon in Google Yellow (#FBBC04).
  Label: "Dataflow". Phase label: "2. Transform".
  Subtitle: "Apache Beam jobs".
  Arrow from Pub/Sub to Dataflow pointing RIGHT. Label: "Pub/Sub message".

Phase 3 — STORE: BigQuery icon in Google Yellow (#FBBC04).
  Label: "BigQuery". Phase label: "3. Store".
  Subtitle: "Analytical warehouse".
  Arrow from Dataflow to BigQuery pointing RIGHT. Label: "Streaming insert".

Phase 4 — VISUALIZE: Looker icon in Google Yellow (#FBBC04).
  Label: "Looker". Phase label: "4. Visualize".
  Subtitle: "BI dashboards".
  Arrow from BigQuery to Looker pointing RIGHT. Label: "SQL query".

All 4 components on the same horizontal row.
CONFIRM: Flow is LEFT → RIGHT: Pub/Sub → Dataflow → BigQuery → Looker.
No arrows reverse direction.

FLAT 2D icons. NOT isometric. NOT glass morphism. NOT neon glows. NO generic data flow icons.
Use official Google Cloud service icons only.
```

---

### draw.io XML Skeleton (save to `diagrams/pubsub-bigquery-pipeline.drawio`)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=dark, type=workflow, generated=ISO8601, slug=pubsub-bigquery-pipeline -->
<mxfile>
  <diagram name="Pub/Sub to BigQuery Pipeline">
    <mxGraphModel background="#202124" grid="0" page="0" pageWidth="1920" pageHeight="400">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- Pub/Sub -->
        <mxCell id="pubsub1" value="Pub/Sub" style="shape=mxgraph.gcp2.pub_sub;resIcon=mxgraph.gcp2.pub_sub;fillColor=#FBBC04;strokeColor=none;fontColor=#FFFFFF;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="160" y="160" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Dataflow -->
        <mxCell id="dataflow1" value="Dataflow" style="shape=mxgraph.gcp2.dataflow;resIcon=mxgraph.gcp2.dataflow;fillColor=#FBBC04;strokeColor=none;fontColor=#FFFFFF;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="480" y="160" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- BigQuery -->
        <mxCell id="bq1" value="BigQuery" style="shape=mxgraph.gcp2.bigquery;resIcon=mxgraph.gcp2.bigquery;fillColor=#FBBC04;strokeColor=none;fontColor=#FFFFFF;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="800" y="160" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Looker -->
        <mxCell id="looker1" value="Looker" style="shape=mxgraph.gcp2.looker;resIcon=mxgraph.gcp2.looker;fillColor=#FBBC04;strokeColor=none;fontColor=#FFFFFF;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="1120" y="160" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Arrows (dark mode: pale gray) -->
        <mxCell id="e1" value="Pub/Sub message" style="endArrow=classic;strokeColor=#9AA0A6;strokeWidth=2;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#202124;labelBorderColor=none;" edge="1" source="pubsub1" target="dataflow1" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e2" value="Streaming insert" style="endArrow=classic;strokeColor=#9AA0A6;strokeWidth=2;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#202124;labelBorderColor=none;" edge="1" source="dataflow1" target="bq1" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e3" value="SQL query" style="endArrow=classic;strokeColor=#9AA0A6;strokeWidth=2;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#202124;labelBorderColor=none;" edge="1" source="bq1" target="looker1" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Example 3 — Multi-region GKE with Cloud SQL (`region-diagram`, light)

**Invocation:**
```
/gcp-illustration region-diagram "Multi-region GKE with Cloud SQL replica" --theme=light
```

**Consultation answers:**
- Theme: light
- Scope: multi-region (us-central1 + us-east1), 2 zones each
- Services: VPC Network (global) → Cloud Load Balancing → GKE nodes (each region) → Cloud SQL (primary us-central1, replica us-east1)
- Audience: engineering team

---

### AI Prompt (save to `img/multi-region-gke-prompt.md`)

```
Style: Clean Google Cloud architecture diagram on a white (#FFFFFF) background.
Material Design aesthetic. Service icons using official Google Cloud colors.
Label every service with its official Google Cloud marketing name:
"VPC Network", "Cloud Load Balancing", "Google Kubernetes Engine", "Cloud SQL".
Text in Google Sans or Roboto font. Slate (#5F6368) arrows.
Google Cloud architecture diagram style. Aspect ratio 16:9, 1920x1080.

Strict Left-to-Right layout for traffic flow. Boundaries use distinct styles.

BOUNDARY RULES:
- VPC Network: GLOBAL. One solid Google Blue (#4285F4) outer boundary box containing both regions.
  Label: "VPC Network: prod-vpc". The VPC is NOT regional — it wraps BOTH regions.
- Region boundaries: dashed 1px gray boxes INSIDE the VPC box. Label: "us-central1" (left) and "us-east1" (right).
- Zone boundaries: dotted 1px pale gray boxes INSIDE each Region. Zones stacked VERTICALLY.
  Zone us-central1-a is in the TOP ROW. Zone us-central1-b is in the BOTTOM ROW. NOT side by side.
  Zone us-east1-b is in the TOP ROW. Zone us-east1-c is in the BOTTOM ROW. NOT side by side.

COMPONENTS:

Outside VPC (top left): User / Internet icon. Arrow pointing right into Cloud Load Balancing.
At VPC edge: Cloud Load Balancing icon in Google Blue (#4285F4). Label: "Cloud Load Balancing". Subtitle: "Global HTTPS LB".
  Arrow from CLB to each region's GKE node pool. Label: "HTTPS".

Inside us-central1 region:
  Zone us-central1-a (top): Google Kubernetes Engine icon in Google Blue (#4285F4). Label: "Google Kubernetes Engine". Subtitle: "Node pool - us-central1-a".
  Zone us-central1-b (bottom): Google Kubernetes Engine icon. Label: "Google Kubernetes Engine". Subtitle: "Node pool - us-central1-b".
  Below both zones (at region level): Cloud SQL icon in Google Red (#EA4335). Label: "Cloud SQL". Subtitle: "Primary - PostgreSQL".
  Arrows from GKE nodes to Cloud SQL pointing DOWN/RIGHT. Label: "SQL".

Inside us-east1 region (to the right of us-central1):
  Zone us-east1-b (top): Google Kubernetes Engine icon. Label: "Google Kubernetes Engine". Subtitle: "Node pool - us-east1-b".
  Zone us-east1-c (bottom): Google Kubernetes Engine icon. Label: "Google Kubernetes Engine". Subtitle: "Node pool - us-east1-c".
  Below both zones: Cloud SQL icon in Google Red (#EA4335). Label: "Cloud SQL". Subtitle: "Read Replica".

Replication arrow from Cloud SQL (primary) to Cloud SQL (replica) pointing RIGHT. Label: "async replication". Dashed arrow.

CONFIRM: VPC is ONE GLOBAL boundary. Both regions sit INSIDE the VPC. Zone A is ABOVE Zone B in each region.
FLAT 2D icons. NOT isometric. NOT glass morphism. NOT neon glows.
```

---

### draw.io XML Skeleton (save to `diagrams/multi-region-gke.drawio`)

```xml
<!-- gcp-illustration: v=1, catalog-hash=HASH, theme=light, type=region-diagram, generated=ISO8601, slug=multi-region-gke -->
<mxfile>
  <diagram name="Multi-region GKE with Cloud SQL">
    <mxGraphModel background="#FFFFFF" grid="0" page="0" pageWidth="1920" pageHeight="820">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- VPC Network (global boundary) -->
        <mxCell id="vpc1" value="VPC Network: prod-vpc" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#4285F4;strokeWidth=2;dashed=0;fontColor=#4285F4;fontFamily=Google Sans,Roboto;fontSize=13;fontStyle=1;verticalAlign=top;" vertex="1" parent="1">
          <mxGeometry x="200" y="100" width="1600" height="680" as="geometry"/>
        </mxCell>

        <!-- Region us-central1 -->
        <mxCell id="region1" value="us-central1" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#5F6368;strokeWidth=1;dashed=1;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=12;verticalAlign=top;" vertex="1" parent="1">
          <mxGeometry x="240" y="150" width="700" height="580" as="geometry"/>
        </mxCell>

        <!-- Zone us-central1-a (top) -->
        <mxCell id="zone1a" value="Zone: us-central1-a" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#9AA0A6;strokeWidth=1;dashed=1;dashPattern=4 4;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=11;verticalAlign=top;" vertex="1" parent="1">
          <mxGeometry x="280" y="200" width="300" height="220" as="geometry"/>
        </mxCell>

        <!-- GKE zone-a -->
        <mxCell id="gke1a" value="Google Kubernetes Engine" style="shape=mxgraph.gcp2.gke;resIcon=mxgraph.gcp2.gke;fillColor=#4285F4;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=11;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="390" y="270" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Zone us-central1-b (bottom) -->
        <mxCell id="zone1b" value="Zone: us-central1-b" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#9AA0A6;strokeWidth=1;dashed=1;dashPattern=4 4;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=11;verticalAlign=top;" vertex="1" parent="1">
          <mxGeometry x="280" y="440" width="300" height="220" as="geometry"/>
        </mxCell>

        <!-- GKE zone-b -->
        <mxCell id="gke1b" value="Google Kubernetes Engine" style="shape=mxgraph.gcp2.gke;resIcon=mxgraph.gcp2.gke;fillColor=#4285F4;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=11;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="390" y="510" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Cloud SQL primary -->
        <mxCell id="sql1" value="Cloud SQL&#xa;(Primary)" style="shape=mxgraph.gcp2.cloud_sql;resIcon=mxgraph.gcp2.cloud_sql;fillColor=#EA4335;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=11;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="600" y="360" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Region us-east1 -->
        <mxCell id="region2" value="us-east1" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#5F6368;strokeWidth=1;dashed=1;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=12;verticalAlign=top;" vertex="1" parent="1">
          <mxGeometry x="1060" y="150" width="700" height="580" as="geometry"/>
        </mxCell>

        <!-- Zone us-east1-b (top) -->
        <mxCell id="zone2a" value="Zone: us-east1-b" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#9AA0A6;strokeWidth=1;dashed=1;dashPattern=4 4;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=11;verticalAlign=top;" vertex="1" parent="1">
          <mxGeometry x="1100" y="200" width="300" height="220" as="geometry"/>
        </mxCell>

        <!-- GKE zone-east-a -->
        <mxCell id="gke2a" value="Google Kubernetes Engine" style="shape=mxgraph.gcp2.gke;resIcon=mxgraph.gcp2.gke;fillColor=#4285F4;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=11;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="1210" y="270" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Zone us-east1-c (bottom) -->
        <mxCell id="zone2b" value="Zone: us-east1-c" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#9AA0A6;strokeWidth=1;dashed=1;dashPattern=4 4;fontColor=#9AA0A6;fontFamily=Google Sans,Roboto;fontSize=11;verticalAlign=top;" vertex="1" parent="1">
          <mxGeometry x="1100" y="440" width="300" height="220" as="geometry"/>
        </mxCell>

        <!-- GKE zone-east-b -->
        <mxCell id="gke2b" value="Google Kubernetes Engine" style="shape=mxgraph.gcp2.gke;resIcon=mxgraph.gcp2.gke;fillColor=#4285F4;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=11;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="1210" y="510" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Cloud SQL replica -->
        <mxCell id="sql2" value="Cloud SQL&#xa;(Read Replica)" style="shape=mxgraph.gcp2.cloud_sql;resIcon=mxgraph.gcp2.cloud_sql;fillColor=#EA4335;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=11;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="1420" y="360" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- User + CLB outside VPC -->
        <mxCell id="user1" value="Internet" style="shape=mxgraph.gcp2.user;fillColor=#5F6368;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=12;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="40" y="380" width="64" height="64" as="geometry"/>
        </mxCell>
        <mxCell id="clb1" value="Cloud Load Balancing" style="shape=mxgraph.gcp2.cloud_load_balancing;resIcon=mxgraph.gcp2.cloud_load_balancing;fillColor=#4285F4;strokeColor=none;fontColor=#202124;fontFamily=Google Sans,Roboto;fontSize=11;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;sketch=0;" vertex="1" parent="1">
          <mxGeometry x="200" y="380" width="64" height="64" as="geometry"/>
        </mxCell>

        <!-- Replication arrow -->
        <mxCell id="repl" value="async replication" style="endArrow=classic;strokeColor=#5F6368;strokeWidth=1.5;dashed=1;fontColor=#5F6368;fontFamily=Google Sans,Roboto;fontSize=11;labelBackgroundColor=#FFFFFF;labelBorderColor=none;" edge="1" source="sql1" target="sql2" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

**Notes:**
- Replace `HASH` with output of `bash bin/gcp-catalog-hash.sh`
- Adjust `x/y` coordinates to match actual canvas layout after opening in draw.io
- Load the "GCP" shape library in draw.io before opening (Sidebar `+` → GCP)
- The VPC boundary (`strokeColor=#4285F4`) visually spans both region boxes — verify this in draw.io after opening
