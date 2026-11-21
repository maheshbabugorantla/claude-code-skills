---
format: technical-explainer/v1
title: How a prompt travels through an LLM gateway
slug: llm-gateway
audience: Engineers who call model APIs directly and have not run a gateway
takeaway: A gateway is one door for every model call, and one door is what makes keys, budgets, routing and records possible.
arc: follow-one-request
numbers: illustrative
---

## Cast

| id | name | what it is | kind |
|---|---|---|---|
| app | Your app | The program that needs an answer from a model | client |
| gw | Gateway | A service every model call passes through | node |
| book | Keys + budgets | Where the gateway keeps callers, limits and usage | store |
| cache | Response cache | Earlier prompts and the answers they got | store |
| models | Models | The boundary around everything that can answer a prompt | zone |
| pa | Provider A | A hosted model service | node |
| pb | Provider B | A second hosted model service | node |
| own | Self-hosted | A model you run yourself | node |
| rule | Routing rule | The rule that picks a model for this request | note |
| costs | The trade | What the gateway gives and what it costs | note |

## Gauges

| id | label | why the reader watches it |
|---|---|---|
| keys | Provider keys in the app | It falls to zero when the gateway arrives |
| sdks | Integrations to maintain | It falls from three to one |
| budget | Team budget left | It shows the gateway knows who is spending |
| errors | Errors the app saw | It stays at zero through a provider failure |

## Steps

### 1. Three models, three integrations

- tag: problem
- motion: a request travels from Your app to each of the three models
- gauges: keys = 3 (warn); sdks = 3 (warn)

Your app calls three model providers directly. Each one brings its own SDK, its own secret key, its own rate limits and its own bill.

Nothing in the middle can answer two plain questions: who spent what, and what happens when one of them slows down?

### 2. Put one door in front

- tag: idea
- enters: Gateway, with a link from Your app to it and from it to each model
- leaves: the three direct links
- motion: requests travel from Your app to Gateway
- gauges: keys = 0 (good); sdks = 1 (good)

A gateway is a small service that every model call passes through. The app keeps one endpoint and one key. The provider keys move behind the door.

Every later step is something the gateway can do only because all traffic crosses one point.

Changed:
+ Gateway between the app and the models
~ Provider keys move out of the app
- Three direct integrations

### 3. Who is asking?

- tag: mechanism
- enters: Keys + budgets
- state: Gateway shows the badge "team: search"
- motion: a request labelled "gateway key" travels from Your app to Gateway; data travels from Gateway to Keys + budgets
- focus: Your app, Gateway, Keys + budgets

The app sends a key that the gateway issued, not one from a provider. Call it a gateway key. The gateway looks it up and learns which team is calling and what that team may use.

> A gateway key names a caller. A provider key names an account. Keeping them apart lets you cut off one team without rotating a provider secret.

### 4. Can they afford it?

- tag: mechanism
- state: Gateway's badge becomes "within budget"
- motion: data returns from Keys + budgets to Gateway
- focus: Gateway, Keys + budgets
- gauges: budget = 62% (good)

The same lookup returns the team's budget and rate limit. If the month's budget is spent, or the caller is sending faster than allowed, the gateway refuses here, before any model is paid.

### 5. Seen this before?

- tag: mechanism
- enters: Response cache
- state: Gateway's badge clears; Response cache shows the badge "miss"
- motion: data travels from Gateway to Response cache
- focus: Gateway, Response cache

Next the gateway checks a cache: a store of earlier prompts and their answers. An exact repeat is answered from it with no model call.

A hit costs one lookup. A miss costs the lookup plus the model call, so a cache pays only when prompts repeat. This one is a miss.

### 6. Pick a model

- tag: mechanism
- enters: Routing rule
- state: Response cache's badge clears; Gateway shows the badge "route: Provider B"
- motion: requests travel from Gateway to Provider B
- focus: Gateway, Provider B

A routing rule maps the request to a model. A rule can read the task, the caller, the price, and how healthy each provider is right now.

Here the rule sends summaries to Provider B first.

### 7. Provider B says slow down

- tag: failure
- state: Provider B warns, badge "429"; the link from Gateway to Provider B is cut
- motion: an error returns from Provider B to Gateway
- focus: Gateway, Provider B

Provider B answers 429: too many requests. Without a gateway, the app has to notice, wait and retry by itself, in every code path that calls a model.

### 8. Fall back, don't fail

- tag: fix
- state: Gateway's badge becomes "fallback: self-hosted"
- motion: a request travels from Gateway to Self-hosted; a response returns; a response returns from Gateway to Your app
- focus: Your app, Gateway, Self-hosted
- gauges: errors = 0 (good)

The rule lists a fallback. The gateway retries the same request on the self-hosted model and returns that answer. The app sees one slower success, not an error.

> A fallback trades latency or quality for availability. Whether that trade is right depends on the task, so it belongs in a rule you can read, not in scattered retry code.

### 9. Write it down

- tag: mechanism
- state: Gateway's badge clears; Keys + budgets shows the badge "+1 usage row"
- motion: an event travels from Gateway to Keys + budgets
- focus: Gateway, Keys + budgets
- gauges: budget = 61%

Before it replies, the gateway records the call: caller, model, tokens in and out, cost, latency. That single ledger is what makes per-team budgets, alerts and a monthly bill possible.

### 10. What the door costs

- tag: tradeoff
- enters: The trade
- leaves: Routing rule
- state: Provider B recovers; its link is whole again; Keys + budgets' badge clears
- motion: requests travel from Your app to Gateway and on to Provider A

Every call now makes one more hop, and the gateway sits on the critical path: if it is down, every model is down for you. Run more than one copy, and keep it boring.

In return there is one place for keys, budgets, routing and records.

Changed:
+ One place for keys, budgets, routing and records
- One extra network hop on every call
! The gateway must be more available than any provider behind it
