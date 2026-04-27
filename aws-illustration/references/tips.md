# Tips

## AWS Marketing Names — Required

**Always use official AWS marketing names in all outputs (AI prompts, draw.io labels).**
Write "AWS Lambda" not "Lambda" or "serverless compute". Write "Amazon S3" not "S3" or "object storage".
Write "Amazon OpenSearch Service" not "OpenSearch". This is non-negotiable — blog/re:Invent
artifacts must match AWS brand conventions.

### Amazon vs AWS prefix — quick rule

| Prefix | Rule | Examples |
|---|---|---|
| **Amazon** | Managed services providing a domain capability | Amazon S3, Amazon EC2, Amazon DynamoDB, Amazon RDS, Amazon Aurora, Amazon OpenSearch Service, Amazon CloudWatch, Amazon CloudFront, Amazon Route 53, Amazon Bedrock, Amazon SageMaker, Amazon API Gateway, Amazon ElastiCache, Amazon Redshift, Amazon Kinesis Data Streams, Amazon SQS, Amazon SNS, Amazon EventBridge, Amazon Cognito, Amazon GuardDuty |
| **AWS** | Platform/tooling/governance/framework | AWS Lambda, AWS Fargate, AWS IAM, AWS CloudFormation, AWS Control Tower, AWS Organizations, AWS WAF, AWS Shield, AWS KMS, AWS Step Functions, AWS Glue, AWS Config, AWS Batch, AWS CloudTrail, AWS Systems Manager, AWS App Runner, AWS Secrets Manager, AWS Global Accelerator, AWS Direct Connect, AWS X-Ray, AWS Data Prepper, AWS Elastic Beanstalk |
| **Elastic \_\_\_** | Legacy "Elastic" family — no prefix | Elastic Load Balancing (ALB/NLB) |

**Gotchas** (brand errors): `AWS Lambda` not "Amazon Lambda"; `Amazon API Gateway` not "AWS API
Gateway"; `Amazon EventBridge` not "AWS EventBridge"; `AWS Fargate` not "Amazon Fargate";
`AWS X-Ray` not "Amazon X-Ray"; `Amazon OpenSearch Service` — full three words.

See `aws-service-catalog.md` for the complete list with lookup keys and correct marketing names.

## AWS Style Tips

- **Always use official AWS marketing names** — see the rule above. Write "AWS Lambda icon in Smile orange (#ED7100)" not "Lambda icon". Write "Amazon S3 icon in Endor green (#7AA116)" not "S3 icon".
- **Always name the category color explicitly** in the prompt — "AWS Lambda icon in Smile orange (#ED7100)" not just "orange icon". Gemini knows the old AWS palette; the new 2023 colors need explicit hex values.
- **Add "2023 AWS icon style"** to the prompt. This triggers the flat-icon, non-isometric, non-glow aesthetic. Without it, Gemini often reverts to older or generic cloud styles.
- **Use "AWS Blog reference architecture style"** for light-mode diagrams and **"AWS re:Invent keynote slide style"** for dark-mode. These phrases anchor the model's visual understanding.
- **Avoid generic synonyms** — don't say "microservice" when you mean "Lambda function", don't say "load balancer" when you mean "Application Load Balancer".

## Layout Tips (architecture, workflow, split-panel, process-flow, region-diagram)

- **Arrow direction is the #1 failure mode** — use exhaustive negation: "All arrows point strictly RIGHT. No arrows point downward. No arrows point left. No diagonal arrows."
- **Redundancy beats brevity** — state layout rules 3 times: as a rule block before components, inline with component placement, and as a summary after all components. Single mentions are routinely ignored.
- **Number your components** — numbering (Component 1, Component 2, …) gives the model an unambiguous ordering and prevents reordering or duplication.
- **For region-diagram**: always say "AZs stacked VERTICALLY, one per row — NOT side by side" and repeat it. The default AI behavior is to place AZs horizontally.
- **Sublabels prevent clutter** — "AWS Lambda / function handler" (marketing title + short sublabel) instead of "AWS Lambda Function Handler" as a single long title. The marketing name is the title; the sublabel adds context.

## Draw.io XML Tips

- **Always set `sketch=0`** in every mxgraph.aws4 style string. Without it, icons render in the old "sketch" rough style which looks inconsistent with the clean 2023 flat icons.
- **Specify `aspect=fixed`** to prevent icon distortion when resizing cells.
- **Use `verticalLabelPosition=bottom;verticalAlign=top`** to place the service name below the icon.
- **For Region/AZ boundaries**, use the group shape stencils (`shape=mxgraph.aws4.groupCenter;grIcon=mxgraph.aws4.group_region`) — not plain rectangles. The group stencils include the AWS official corner badge.
- **Cell IDs must be unique** — use descriptive IDs like `lambda1`, `apigw1`, `region_us_east_1` rather than sequential integers 2, 3, 4... (0 and 1 are reserved for the root parent cells).
- **Run `--verify`** before handing draw.io XML to the user — stencil typos cause blank placeholder boxes that look broken.

## Palette / Color Tips

- **Endor green (#7AA116) is medium-light** — legible on white but can wash out on very light gray. Use `#FFFFFF` card backgrounds so it pops.
- **Nebula (#C925D1)** is reserved for rare service categories. Overusing it looks garish. If unsure, use Galaxy (#8C4FFF) for the service instead.
- **Navy (#232F3E)** — don't use pure black (#000000) as the dark background. The specific navy is AWS Squid Ink and distinguishes AWS from generic dark UI.
- **AWS Orange (#FF9900) is the brand orange** — use it for the AWS logo/wordmark placeholder in the top corner of a diagram, CTAs, or important callout arrows only. The Smile category orange (#ED7100) is for Compute service icons. They are different.

## Multi-Modal Gemini Tip

Include the `assets/palette.svg` swatch as a reference image when prompting Gemini:
> "Make the illustration's service icon colors consistent with this AWS palette swatch: [attach palette.svg]"

This dramatically improves category-color fidelity vs. text-only palette descriptions.

## Region Diagram Tips

- Always place the internet/user icon **outside and to the left** of the Region boundary.
- Bastion hosts go in the Public Subnet.
- NAT Gateway goes in the Public Subnet.
- Databases (RDS, DynamoDB) go in the Private Subnet (or outside if DynamoDB since it's a managed service).
- CloudWatch and CloudTrail go outside the VPC (they're regional services, not VPC-bound).
- If the user hasn't specified the region name, default to `us-east-1` — it's the most recognizable.
