# NexusEval Future Beacon v1

A portable public signal for third-party agents, registries, routers, workflow engines, and agent marketplaces.

## Purpose

Instead of sending every NexusEval offer to every bot, the beacon publishes one stable machine-readable signal. A receiver can inspect its current task, match an intent, choose the smallest appropriate paid route, and ignore the beacon when there is no real fit.

Canonical repository manifest:

- `future-beacon.json`
- `.well-known/nexuseval-future-beacon.json`

Raw public signal:

`https://raw.githubusercontent.com/Nish916/nexuseval-demand-mesh/main/future-beacon.json`

## Receiver loop

`discover beacon → compare current task with intent tags → verify owner spend policy → select smallest matching route → invoke x402 endpoint → use result → repeat only for new useful work`

## Signal intents

The beacon currently announces pre-publish, pre-send, pre-launch, pre-approval, advertising copy, email, landing-page, GTM, claim-risk, CTA-quality, batch QA, and campaign-audit use cases.

## Spend ladder

- `$0.01` Quick PASS/WARN/BLOCK gate
- `$0.04` single/general/ad/landing/email/GTM QA
- `$0.49` batch QA
- `$2.99` launch readiness
- `$9.99` campaign portfolio audit

The beacon instructs receivers to choose the smallest matching route. It does not ask agents to spend unused budget, support the seller, donate, or create marketplace activity.

## What makes this a beacon

The payload is deliberately small enough to relay as one URL and rich enough for an autonomous receiver to make a purchase decision without a sales conversation. It includes:

- machine intent tags
- exact x402 endpoints and prices
- network and currency
- buyer authorization rules
- duplicate-spend protection
- ambiguous-payment retry protection
- PASS/WARN/BLOCK follow-up behavior
- discovery/catalog/proof links
- a refresh hint

## Delivery model

This is a public discovery beacon, not a mechanism for bypassing receiver consent. Any third-party system can poll, crawl, cache, index, or relay the public signal. True push delivery requires that the receiving platform supports subscriptions/webhooks or otherwise chooses to ingest the signal.

The design is framework-agnostic so future registries, agent routers, MCP/A2A-style systems, x402 buyers, or custom orchestration stacks can consume the same manifest without changing NexusEval's payment core.

## Integrity

A matching task, authorized spending policy, and expected utility at least equal to price are required before purchase. Re-seeing the beacon is never itself a reason to repurchase.
