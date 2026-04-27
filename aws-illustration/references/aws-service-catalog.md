# AWS Service Catalog

Quick reference for the most-common AWS services.
Columns: lookup key → marketing name → category → color name → hex → draw.io resIcon value

**Machine-readable version:** `aws-service-catalog.jsonl` (one JSON object per line, in the same directory).
Use `bin/aws-service-lookup.sh <key-or-alias>` to query by key or alias from the shell.
Add new services by appending one JSON line to `aws-service-catalog.jsonl` AND adding a row here.

Used by:
- `--verify` mode (via parallel specialists in `references/specialists/`) to cross-check stencil names AND label values in generated draw.io XML
- `--from=<file>` mode to parse architecture descriptions and map service names to marketing names
- `bin/aws-catalog-hash.sh` to generate the 12-char catalog hash embedded in every `.drawio` self-check marker

---

## Naming Convention — AWS Marketing Names

**All generated output (AI prompts, draw.io labels) MUST use the official AWS marketing name.**
Never use the short lookup key ("lambda", "s3") as a label.

### Amazon prefix — managed services providing a domain capability
> **Amazon** S3, **Amazon** EC2, **Amazon** DynamoDB, **Amazon** RDS, **Amazon** Aurora,
> **Amazon** OpenSearch Service, **Amazon** CloudWatch, **Amazon** CloudFront, **Amazon** Route 53,
> **Amazon** Bedrock, **Amazon** SageMaker, **Amazon** API Gateway, **Amazon** ElastiCache,
> **Amazon** Redshift, **Amazon** Kinesis Data Streams, **Amazon** SQS, **Amazon** SNS,
> **Amazon** EventBridge, **Amazon** Cognito, **Amazon** GuardDuty, **Amazon** Neptune,
> **Amazon** DocumentDB, **Amazon** MemoryDB, **Amazon** Athena, **Amazon** EMR,
> **Amazon** QuickSight, **Amazon** Comprehend, **Amazon** Textract, **Amazon** Polly,
> **Amazon** Lex, **Amazon** Kendra, **Amazon** Personalize, **Amazon** Inspector,
> **Amazon** Rekognition, **Amazon** Certificate Manager, **Amazon** EBS, **Amazon** EFS,
> **Amazon** ECS, **Amazon** EKS, **Amazon** VPC

### AWS prefix — platform/tooling/governance/framework
> **AWS** Lambda, **AWS** Fargate, **AWS** IAM, **AWS** CloudFormation, **AWS** Control Tower,
> **AWS** Organizations, **AWS** WAF, **AWS** Shield, **AWS** KMS, **AWS** Step Functions,
> **AWS** Glue, **AWS** Config, **AWS** Batch, **AWS** CloudTrail, **AWS** Systems Manager,
> **AWS** Service Catalog, **AWS** App Runner, **AWS** Secrets Manager,
> **AWS** Global Accelerator, **AWS** Direct Connect, **AWS** Transit Gateway,
> **AWS** Database Migration Service, **AWS** DataSync, **AWS** Migration Hub,
> **AWS** Application Migration Service, **AWS** X-Ray, **AWS** AppSync,
> **AWS** Data Prepper, **AWS** Elastic Beanstalk, **AWS** Backup, **AWS** Snow Family,
> **AWS** Storage Gateway, **AWS** Auto Scaling, **AWS** Lake Formation

### Elastic family — no prefix
> **Elastic Load Balancing** (ELB / ALB / NLB)

### Common gotchas (wrong prefix is a brand error)
| ❌ Wrong | ✅ Correct |
|---|---|
| Amazon Lambda | **AWS Lambda** |
| Amazon Fargate | **AWS Fargate** |
| Amazon X-Ray | **AWS X-Ray** |
| AWS API Gateway | **Amazon API Gateway** |
| AWS EventBridge | **Amazon EventBridge** |
| AWS CloudWatch | **Amazon CloudWatch** |
| AWS DynamoDB | **Amazon DynamoDB** |
| AWS S3 | **Amazon S3** |
| OpenSearch | **Amazon OpenSearch Service** (three words) |
| Data Prepper | **AWS Data Prepper** |

---

## How to use in draw.io XML

**Current library: `mxgraph.aws4` (aws3 is deprecated — do NOT use `shape=mxgraph.aws3.*`).**

Use the `resourceIcon` wrapper with the `resIcon` attribute — NOT the old direct-shape format:

```
style="shape=mxgraph.aws4.resourceIcon;resIcon=<RESICON_VALUE>;sketch=0;
       fillColor=<CATEGORY_HEX>;gradientColor=none;
       verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;"
```

Where `<RESICON_VALUE>` is the full `mxgraph.aws4.<name>` token from the `resicon` column below (e.g., `mxgraph.aws4.lambda`, `mxgraph.aws4.api gateway`, `mxgraph.aws4.elastic block store`). Names use **lowercase with spaces** — never underscores.

Set `value="<Marketing Name>"` — the full official AWS marketing name.

**If a resIcon value is uncertain** (marked "Verify" in the Notes column): fetch the authoritative name from `https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/stencils/aws4.xml` and search for `<shape name="` entries. The `name` attribute value is the correct resIcon suffix.

Dark mode: same `shape=` and `resIcon=`, same fillColor. Swap card/background colors:
- Background: `#232F3E`
- Card fill: `#314050`
- Text/stroke: `#FFFFFF` / `#D5DBDB`

---

## Compute — Smile `#ED7100`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| lambda | **AWS Lambda** | `mxgraph.aws4.lambda` | Serverless function |
| ec2 | **Amazon EC2** | `mxgraph.aws4.ec2` | Virtual machine |
| ec2_auto_scaling | **AWS Auto Scaling** | `mxgraph.aws4.auto scaling` | ASG |
| ecs | **Amazon Elastic Container Service** | `mxgraph.aws4.ecs` | Short: "Amazon ECS" |
| fargate | **AWS Fargate** | `mxgraph.aws4.fargate` | Serverless containers — NOT "Amazon Fargate" |
| eks | **Amazon Elastic Kubernetes Service** | `mxgraph.aws4.eks` | Short: "Amazon EKS" |
| app_runner | **AWS App Runner** | `mxgraph.aws4.app runner` | PaaS container service |
| elastic_beanstalk | **AWS Elastic Beanstalk** | `mxgraph.aws4.elastic beanstalk` | PaaS |
| lightsail | **Amazon Lightsail** | `mxgraph.aws4.lightsail` | VPS |
| batch | **AWS Batch** | `mxgraph.aws4.batch` | Batch compute |

## Storage — Endor `#7AA116`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| s3 | **Amazon S3** | `mxgraph.aws4.s3` | Object storage (most-used) |
| s3_glacier | **Amazon S3 Glacier** | `mxgraph.aws4.glacier` | Archive storage |
| ebs | **Amazon EBS** | `mxgraph.aws4.elastic block store` | Block volume |
| efs | **Amazon EFS** | `mxgraph.aws4.efs standard` | NFS-style file system |
| fsx | **Amazon FSx** | `mxgraph.aws4.fsx` | Windows/Lustre file system |
| backup | **AWS Backup** | `mxgraph.aws4.backup` | Centralized backup |
| snow_family | **AWS Snow Family** | `mxgraph.aws4.snowball` | Edge / offline transfer |
| storage_gateway | **AWS Storage Gateway** | `mxgraph.aws4.storage gateway` | Hybrid cloud storage |

## Database — Cosmos `#E7157B`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| dynamodb | **Amazon DynamoDB** | `mxgraph.aws4.dynamodb` | NoSQL key-value |
| rds | **Amazon RDS** | `mxgraph.aws4.rds` | Relational DB (MySQL/Postgres/etc) |
| aurora | **Amazon Aurora** | `mxgraph.aws4.aurora` | High-perf relational |
| aurora_serverless | **Amazon Aurora Serverless** | `mxgraph.aws4.aurora` | Use same resIcon as Aurora |
| elasticache | **Amazon ElastiCache** | `mxgraph.aws4.elasticache` | In-memory cache (Redis/Memcached) |
| redshift | **Amazon Redshift** | `mxgraph.aws4.redshift` | Data warehouse |
| neptune | **Amazon Neptune** | `mxgraph.aws4.neptune` | Graph database |
| documentdb | **Amazon DocumentDB** | `mxgraph.aws4.documentdb with mongodb compatibility` | MongoDB-compatible |
| memorydb | **Amazon MemoryDB** | `mxgraph.aws4.memorydb for redis` | Durable Redis |
| keyspaces | **Amazon Keyspaces** | `mxgraph.aws4.keyspaces` | Cassandra-compatible |

## App Integration — Cosmos `#E7157B`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| api_gateway | **Amazon API Gateway** | `mxgraph.aws4.api gateway` | REST/HTTP/WebSocket APIs — NOT "AWS API Gateway" |
| eventbridge | **Amazon EventBridge** | `mxgraph.aws4.eventbridge` | Event bus — NOT "AWS EventBridge" |
| sqs | **Amazon SQS** | `mxgraph.aws4.sqs` | Message queue |
| sns | **Amazon SNS** | `mxgraph.aws4.sns` | Pub/Sub notifications |
| step_functions | **AWS Step Functions** | `mxgraph.aws4.step functions` | State machine / workflow |
| appsync | **AWS AppSync** | `mxgraph.aws4.appsync` | GraphQL API |
| mq | **Amazon MQ** | `mxgraph.aws4.mq` | Managed message broker |

## Management & Governance — Cosmos `#E7157B`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| cloudwatch | **Amazon CloudWatch** | `mxgraph.aws4.cloudwatch` | Monitoring — NOT "AWS CloudWatch" |
| cloudformation | **AWS CloudFormation** | `mxgraph.aws4.cloudformation` | IaC |
| systems_manager | **AWS Systems Manager** | `mxgraph.aws4.systems manager` | SSM |
| config | **AWS Config** | `mxgraph.aws4.config` | Resource inventory |
| cloudtrail | **AWS CloudTrail** | `mxgraph.aws4.cloudtrail` | Audit log |
| organizations | **AWS Organizations** | `mxgraph.aws4.organizations` | Multi-account management |
| control_tower | **AWS Control Tower** | `mxgraph.aws4.control tower` | Landing zone |
| service_catalog | **AWS Service Catalog** | `mxgraph.aws4.service catalog` | IT service catalog |

## Networking & CDN — Galaxy `#8C4FFF`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| vpc | **Amazon VPC** | `mxgraph.aws4.vpc` | Virtual private cloud |
| cloudfront | **Amazon CloudFront** | `mxgraph.aws4.cloudfront` | CDN |
| route53 | **Amazon Route 53** | `mxgraph.aws4.route 53` | DNS |
| elb | **Elastic Load Balancing** | `mxgraph.aws4.elastic load balancing` | ALB/NLB/CLB — no prefix |
| alb | **Application Load Balancer** | `mxgraph.aws4.application load balancing` | ALB specifically — Verify resicon in aws4.xml |
| nlb | **Network Load Balancer** | `mxgraph.aws4.network load balancing` | NLB specifically — Verify resicon in aws4.xml |
| transit_gateway | **AWS Transit Gateway** | `mxgraph.aws4.transit gateway` | VPC transit hub |
| direct_connect | **AWS Direct Connect** | `mxgraph.aws4.direct connect` | Dedicated connection |
| vpn_gateway | **AWS Site-to-Site VPN** | `mxgraph.aws4.site to site vpn` | Site-to-site VPN |
| global_accelerator | **AWS Global Accelerator** | `mxgraph.aws4.global accelerator` | Anycast edge |

## Analytics — Galaxy `#8C4FFF`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| kinesis | **Amazon Kinesis Data Streams** | `mxgraph.aws4.kinesis data streams` | Real-time streaming |
| kinesis_firehose | **Amazon Data Firehose** | `mxgraph.aws4.kinesis data firehose` | Delivery stream |
| athena | **Amazon Athena** | `mxgraph.aws4.athena` | SQL over S3 |
| glue | **AWS Glue** | `mxgraph.aws4.glue` | ETL / data catalog |
| opensearch | **Amazon OpenSearch Service** | `mxgraph.aws4.opensearch service` | Full three words — NOT "OpenSearch"; sub-resource nodes use `opensearch service data node` |
| emr | **Amazon EMR** | `mxgraph.aws4.emr` | Spark/Hadoop |
| quicksight | **Amazon QuickSight** | `mxgraph.aws4.quicksight` | BI dashboards |
| lake_formation | **AWS Lake Formation** | `mxgraph.aws4.lake formation` | Data lake governance |
| data_prepper | **AWS Data Prepper** | `mxgraph.aws4.opensearch ingestion` | Open-source component; for managed service use `opensearch_ingestion` |
| opensearch_ingestion | **Amazon OpenSearch Ingestion** | `mxgraph.aws4.opensearch ingestion` | Managed ingestion pipeline (built on Data Prepper); use when deploying via AWS console |

## Security, Identity & Compliance — Mars `#DD344C`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| iam | **AWS IAM** | `mxgraph.aws4.identity and access management` | Access control |
| cognito | **Amazon Cognito** | `mxgraph.aws4.cognito` | User pools / identity |
| kms | **AWS KMS** | `mxgraph.aws4.key management service` | Encryption keys |
| secrets_manager | **AWS Secrets Manager** | `mxgraph.aws4.secrets manager` | Secret storage |
| waf | **AWS WAF** | `mxgraph.aws4.waf` | Web application firewall |
| shield | **AWS Shield** | `mxgraph.aws4.shield` | DDoS protection |
| guardduty | **Amazon GuardDuty** | `mxgraph.aws4.guardduty` | Threat detection |
| security_hub | **AWS Security Hub** | `mxgraph.aws4.security hub` | Security aggregator |
| inspector | **Amazon Inspector** | `mxgraph.aws4.inspector` | Vulnerability scanning |
| acm | **Amazon Certificate Manager** | `mxgraph.aws4.certificate manager` | TLS certs |

## Observability — Orbit `#01A88D` (shared with AI/ML)

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| xray | **AWS X-Ray** | `mxgraph.aws4.xray` | Distributed tracing — NOT "Amazon X-Ray"; resIcon uses `xray` (no hyphen) |

## AI & ML — Orbit `#01A88D`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| bedrock | **Amazon Bedrock** | `mxgraph.aws4.bedrock` | Foundation model access |
| sagemaker | **Amazon SageMaker** | `mxgraph.aws4.sagemaker` | ML platform |
| rekognition | **Amazon Rekognition** | `mxgraph.aws4.rekognition` | Image/video analysis |
| comprehend | **Amazon Comprehend** | `mxgraph.aws4.comprehend` | NLP |
| textract | **Amazon Textract** | `mxgraph.aws4.textract` | Document extraction |
| polly | **Amazon Polly** | `mxgraph.aws4.polly` | Text-to-speech |
| lex | **Amazon Lex** | `mxgraph.aws4.lex` | Chatbot |
| kendra | **Amazon Kendra** | `mxgraph.aws4.kendra` | Enterprise search |
| personalize | **Amazon Personalize** | `mxgraph.aws4.personalize` | Recommendation engine |
| forecast | **Amazon Forecast** | `mxgraph.aws4.forecast` | Time-series forecasting |

## Migration & Modernization — Orbit `#01A88D`

| Service (key) | Marketing Name | draw.io resIcon value | Notes |
|---|---|---|---|
| dms | **AWS Database Migration Service** | `mxgraph.aws4.database migration service` | DMS |
| datasync | **AWS DataSync** | `mxgraph.aws4.datasync` | File migration |
| migration_hub | **AWS Migration Hub** | `mxgraph.aws4.migration hub` | Migration tracking |
| app_migration | **AWS Application Migration Service** | `mxgraph.aws4.application migration service` | Lift-and-shift |

## Group / Container Stencils (region-diagram type)

These use the `mxgraph.aws4` namespace for group shapes:

| Shape | style format | Notes |
|---|---|---|
| Region boundary | `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_region` | Dashed border |
| Availability Zone | `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_availability_zone` | Dotted border |
| VPC | `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_vpc` | Solid purple border |
| Public subnet | `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_public_subnet` | Green border |
| Private subnet | `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_private_subnet` | Gray border |
| AWS Cloud boundary | `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_aws_cloud_alt` | Outer-most container |
| Security Group | `shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_security_group` | For firewall rules |
| Internet | `shape=mxgraph.aws4.internet_alt2` | External user/internet icon |
| User / Client | `shape=mxgraph.aws4.user` | End-user icon |
| Corporate / On-prem | `shape=mxgraph.aws4.traditional_server` | On-prem server |

---

## Short-Name Alias Index

Maps short/informal names (what users type) → lookup key → Marketing Name.
The **marketing name** is always the output — the short form is only for input matching.

| If user types | Lookup key | Use marketing name |
|---|---|---|
| Lambda | lambda | **AWS Lambda** |
| S3 / s3_bucket | s3 | **Amazon S3** |
| EC2 / ec2_instance | ec2 | **Amazon EC2** |
| ECS | ecs | **Amazon Elastic Container Service** (or "Amazon ECS") |
| Fargate | fargate | **AWS Fargate** |
| API Gateway / apigateway | api_gateway | **Amazon API Gateway** |
| EventBridge | eventbridge | **Amazon EventBridge** |
| CloudFront / cloud_front | cloudfront | **Amazon CloudFront** |
| Route53 / route53 | route53 | **Amazon Route 53** |
| IAM / iam_role | iam | **AWS IAM** |
| CloudWatch / cloudwatch_logs | cloudwatch | **Amazon CloudWatch** |
| Bedrock / amazon_bedrock | bedrock | **Amazon Bedrock** |
| Kinesis / kinesis_streams | kinesis | **Amazon Kinesis Data Streams** |
| OpenSearch / opensearch_service | opensearch | **Amazon OpenSearch Service** |
| DynamoDB / dynamo_db | dynamodb | **Amazon DynamoDB** |
| X-Ray / xray | xray | **AWS X-Ray** |
| Data Prepper / DataPrepper | data_prepper | **AWS Data Prepper** (open-source) |
| OpenSearch Ingestion / OSI | opensearch_ingestion | **Amazon OpenSearch Ingestion** (managed service) |
