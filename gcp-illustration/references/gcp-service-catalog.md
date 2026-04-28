# GCP Service Catalog (Human Readable)

Human-readable companion to `gcp-service-catalog.jsonl`. Use this for quick visual reference when writing diagram labels or checking marketing names. The machine-readable file is the authoritative source for `--verify` and `bin/gcp-service-lookup.sh`.

**Stencil namespace:** `mxgraph.gcp2.*` — always underscore-separated, never spaces.  
**Lookup script:** `bash bin/gcp-service-lookup.sh <key-or-alias>` → returns full JSON object.  
**Unlisted service?** Fetch `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/diagramly/sidebar/Sidebar-GCP2.js` and search for the service name. Never invent a stencil name.

---

## Compute (Blue `#4285F4` / Green `#34A853` for Serverless)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `compute_engine` | Compute Engine | `#4285F4` | `compute_engine` | _(none)_ | |
| `gke` | Google Kubernetes Engine | `#4285F4` | `gke` | Google | |
| `cloud_run` | Cloud Run | `#34A853` | `cloud_run` | Cloud | Serverless → Green |
| `cloud_functions` | Cloud Functions | `#34A853` | `cloud_functions` | Cloud | Serverless → Green |
| `app_engine` | App Engine | `#34A853` | `app_engine` | _(none)_ | Serverless PaaS → Green |
| `bare_metal_solution` | Bare Metal Solution | `#4285F4` | `bare_metal_solution` | _(none)_ | |
| `vmware_engine` | Google Cloud VMware Engine | `#4285F4` | `vmware_engine` | Google Cloud | |
| `batch` | Batch | `#4285F4` | `batch` | _(none)_ | |
| `anthos` | Anthos | `#4285F4` | `anthos` | _(none)_ | Now branded GKE Enterprise; verify resicon |

---

## Storage (Green `#34A853`)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `cloud_storage` | Cloud Storage | `#34A853` | `cloud_storage` | Cloud | ⚠ NOT 'Google Cloud Storage' or 'GCS' |
| `persistent_disk` | Persistent Disk | `#34A853` | `persistent_disk` | _(none)_ | |
| `filestore` | Filestore | `#34A853` | `filestore` | _(none)_ | |
| `local_ssd` | Local SSD | `#34A853` | `local_ssd` | _(none)_ | |
| `storage_transfer_service` | Storage Transfer Service | `#34A853` | `storage_transfer_service` | _(none)_ | |
| `backup_dr` | Backup and DR Service | `#34A853` | `backup_and_dr` | _(none)_ | |

---

## Database (Red `#EA4335`)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `cloud_sql` | Cloud SQL | `#EA4335` | `cloud_sql` | Cloud | |
| `cloud_spanner` | Cloud Spanner | `#EA4335` | `cloud_spanner` | Cloud | |
| `cloud_bigtable` | Cloud Bigtable | `#EA4335` | `cloud_bigtable` | Cloud | |
| `firestore` | Firestore | `#EA4335` | `firestore` | _(none)_ | ⚠ NOT 'Cloud Firestore' — prefix was dropped |
| `memorystore` | Memorystore | `#EA4335` | `memorystore` | _(none)_ | Managed Redis / Memcached |
| `alloydb` | AlloyDB for PostgreSQL | `#EA4335` | `alloydb` | _(none)_ | ⚠ Full name: 'AlloyDB for PostgreSQL' |
| `cloud_datastore` | Cloud Datastore | `#EA4335` | `cloud_datastore` | Cloud | Legacy; prefer Firestore in Datastore mode |

---

## Data Analytics (Yellow `#FBBC04`)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `bigquery` | BigQuery | `#FBBC04` | `bigquery` | _(none)_ | ⚠ ONE word: NOT 'Big Query' or 'Google BigQuery' |
| `pub_sub` | Pub/Sub | `#FBBC04` | `pub_sub` | _(none)_ | ⚠ Use slash: NOT 'PubSub' or 'Cloud Pub/Sub' |
| `dataflow` | Dataflow | `#FBBC04` | `dataflow` | _(none)_ | Apache Beam managed |
| `dataproc` | Dataproc | `#FBBC04` | `dataproc` | _(none)_ | Managed Spark/Hadoop |
| `dataplex` | Dataplex | `#FBBC04` | `dataplex` | _(none)_ | Data mesh / governance |
| `dataprep` | Dataprep | `#FBBC04` | `dataprep` | _(none)_ | |
| `looker` | Looker | `#FBBC04` | `looker` | _(none)_ | BI / data viz |
| `data_catalog` | Data Catalog | `#FBBC04` | `data_catalog` | _(none)_ | Metadata management |
| `cloud_composer` | Cloud Composer | `#FBBC04` | `cloud_composer` | Cloud | Managed Apache Airflow |
| `dataform` | Dataform | `#FBBC04` | `dataform` | _(none)_ | SQL-based data transformation; verify resicon |

---

## Networking (Blue `#4285F4`)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `vpc` | VPC Network | `#4285F4` | `vpc` | _(none)_ | ⚠ VPCs are GLOBAL in GCP — draw as single global boundary |
| `cloud_load_balancing` | Cloud Load Balancing | `#4285F4` | `cloud_load_balancing` | Cloud | |
| `cloud_cdn` | Cloud CDN | `#4285F4` | `cloud_cdn` | Cloud | |
| `cloud_dns` | Cloud DNS | `#4285F4` | `cloud_dns` | Cloud | |
| `cloud_nat` | Cloud NAT | `#4285F4` | `cloud_nat` | Cloud | |
| `cloud_interconnect` | Cloud Interconnect | `#4285F4` | `cloud_interconnect` | Cloud | Dedicated or Partner |
| `cloud_vpn` | Cloud VPN | `#4285F4` | `cloud_vpn` | Cloud | |
| `cloud_router` | Cloud Router | `#4285F4` | `cloud_router` | Cloud | |
| `network_intelligence_center` | Network Intelligence Center | `#4285F4` | `network_intelligence_center` | _(none)_ | |
| `service_directory` | Service Directory | `#4285F4` | `service_directory` | _(none)_ | |
| `cloud_endpoints` | Cloud Endpoints | `#4285F4` | `cloud_endpoints` | Cloud | Lightweight OpenAPI proxy; verify resicon |
| `apigee` | Apigee | `#4285F4` | `apigee` | _(none)_ | Full API management platform; verify resicon |

---

## Security & Identity (Blue `#4285F4`)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `cloud_iam` | Cloud IAM | `#4285F4` | `cloud_iam` | Cloud | |
| `cloud_identity` | Cloud Identity | `#4285F4` | `cloud_identity` | Cloud | |
| `cloud_kms` | Cloud Key Management Service | `#4285F4` | `cloud_kms` | Cloud | |
| `secret_manager` | Secret Manager | `#4285F4` | `secret_manager` | _(none)_ | |
| `identity_aware_proxy` | Identity-Aware Proxy | `#4285F4` | `identity_aware_proxy` | _(none)_ | ⚠ Hyphenated: 'Identity-Aware Proxy' |
| `cloud_armor` | Cloud Armor | `#4285F4` | `cloud_armor` | Cloud | WAF / DDoS protection |
| `security_command_center` | Security Command Center | `#4285F4` | `security_command_center` | _(none)_ | |
| `vpc_service_controls` | VPC Service Controls | `#4285F4` | `vpc_service_controls` | VPC | |
| `beyondcorp` | BeyondCorp Enterprise | `#4285F4` | `beyondcorp` | _(none)_ | Zero Trust access |

---

## Operations & Management (Slate `#5F6368`)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `cloud_logging` | Cloud Logging | `#5F6368` | `cloud_logging` | Cloud | Formerly Stackdriver Logging |
| `cloud_monitoring` | Cloud Monitoring | `#5F6368` | `cloud_monitoring` | Cloud | Formerly Stackdriver Monitoring |
| `cloud_trace` | Cloud Trace | `#5F6368` | `cloud_trace` | Cloud | Formerly Stackdriver Trace |
| `cloud_profiler` | Cloud Profiler | `#5F6368` | `cloud_profiler` | Cloud | Verify resicon |
| `error_reporting` | Error Reporting | `#5F6368` | `error_reporting` | _(none)_ | Verify resicon |
| `cloud_resource_manager` | Cloud Resource Manager | `#5F6368` | `cloud_resource_manager` | Cloud | Manages Org → Folder → Project hierarchy |
| `cloud_billing` | Cloud Billing | `#5F6368` | `cloud_billing` | Cloud | |

---

## CI/CD & Developer Tools (Blue `#4285F4` / Red `#EA4335` for CI/CD)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `cloud_build` | Cloud Build | `#EA4335` | `cloud_build` | Cloud | CI → Red |
| `cloud_deploy` | Cloud Deploy | `#EA4335` | `cloud_deploy` | Cloud | CD → Red |
| `artifact_registry` | Artifact Registry | `#4285F4` | `artifact_registry` | _(none)_ | Recommended replacement for Container Registry |
| `container_registry` | Container Registry | `#4285F4` | `container_registry` | _(none)_ | ⚠ Deprecated — use Artifact Registry for new projects |
| `cloud_source_repositories` | Cloud Source Repositories | `#4285F4` | `cloud_source_repositories` | Cloud | |
| `cloud_tasks` | Cloud Tasks | `#4285F4` | `cloud_tasks` | Cloud | Managed task queues; verify resicon |
| `cloud_scheduler` | Cloud Scheduler | `#4285F4` | `cloud_scheduler` | Cloud | Cron job service; verify resicon |
| `cloud_workflows` | Cloud Workflows | `#4285F4` | `cloud_workflows` | Cloud | Workflow orchestration; verify resicon |
| `eventarc` | Eventarc | `#4285F4` | `eventarc` | _(none)_ | Event-driven routing; verify resicon |

---

## AI & Machine Learning (Blue `#4285F4`)

| Key | Marketing Name | Hex | Stencil (`mxgraph.gcp2.*`) | Prefix | Gotcha / Note |
|---|---|---|---|---|---|
| `vertex_ai` | Vertex AI | `#4285F4` | `vertex_ai` | _(none)_ | ⚠ NOT 'Vertex' alone or 'Google Vertex AI' |
| `cloud_automl` | Cloud AutoML | `#4285F4` | `cloud_automl` | Cloud | |
| `cloud_vision_api` | Cloud Vision API | `#4285F4` | `cloud_vision_api` | Cloud | |
| `speech_to_text` | Speech-to-Text | `#4285F4` | `speech_to_text` | _(none)_ | ⚠ Hyphenated: NOT 'Speech to Text' |
| `text_to_speech` | Text-to-Speech | `#4285F4` | `text_to_speech` | _(none)_ | ⚠ Hyphenated: NOT 'Text to Speech' |
| `dialogflow` | Dialogflow | `#4285F4` | `dialogflow` | _(none)_ | CX or ES variants; specify if important |
| `cloud_translation_api` | Cloud Translation API | `#4285F4` | `cloud_translation_api` | Cloud | |
| `cloud_natural_language_api` | Cloud Natural Language API | `#4285F4` | `cloud_natural_language_api` | Cloud | |
| `document_ai` | Document AI | `#4285F4` | `document_ai` | _(none)_ | Verify resicon |

---

## Key Marketing-Name Rules

| ❌ Wrong | ✅ Correct | Reason |
|---|---|---|
| Google Cloud Storage | Cloud Storage | Dropped "Google Cloud" prefix |
| Cloud Firestore | Firestore | Dropped "Cloud" prefix |
| Big Query | BigQuery | One word |
| PubSub / Cloud Pub/Sub | Pub/Sub | Slash, no prefix |
| Google BigQuery | BigQuery | No "Google" prefix |
| Identity Aware Proxy | Identity-Aware Proxy | Hyphenated |
| Speech to Text | Speech-to-Text | Hyphenated |
| Text to Speech | Text-to-Speech | Hyphenated |
| Vertex / Google Vertex AI | Vertex AI | Exact two-word name |
| AlloyDB | AlloyDB for PostgreSQL | Full name includes "for PostgreSQL" |
| GCS / GCE / GKE _(in labels)_ | Cloud Storage / Compute Engine / Google Kubernetes Engine | Never use acronyms as draw.io `value=""` labels |

---

## Adding a New Service

1. **Find the marketing name:** Search `docs.cloud.google.com` — the `<h1>` is authoritative.
2. **Find the resicon:** Fetch `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/js/diagramly/sidebar/Sidebar-GCP2.js` → search for the service name → extract the `resIcon=` value. Never use spaces in the stencil name.
3. **Append to JSONL:** Add a single-line JSON object to `gcp-service-catalog.jsonl` with all required fields.
4. **Add a row here:** Add to the appropriate table above.
5. **Flag if uncertain:** Set `"note": "Verify resicon"` in the JSONL entry until the stencil is confirmed working in draw.io.
