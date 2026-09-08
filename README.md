# NexusEval Public Discovery — Immortal Dynasty

> **Public verification surface for [Immortal Dynasty](https://immortal-dynasty.com) and its live NexusEval engine.**  
> Immortal Dynasty is building an independent trust/control layer for autonomous AI actions. NexusEval is the live evaluation and machine-payment engine underneath that direction.

### Inspect before you trust

- **Immortal Dynasty:** https://immortal-dynasty.com
- **Live proof center:** https://immortal-dynasty.com/proof.html
- **NexusEval live engine:** https://nexuseval.vercel.app
- **Operational status:** https://nexuseval.vercel.app/__ops/tool-gateway-status
- **Buyer OpenAPI:** https://nexuseval.vercel.app/openapi-marketplace.json
- **x402 manifest:** https://nexuseval.vercel.app/.well-known/x402
- **Revenue-readiness definition:** https://nexuseval.vercel.app/__ops/revenue-readiness
- **Base settlement address:** https://basescan.org/address/0x756A9769725aF78F81fb0A9b66300aBb64A0551c

This repository is intentionally public. It contains discovery material, buyer-side policies, integration recipes, and machine-readable signals. It does **not** contain payment keys, private credentials, customer data, or the private NexusEval payment core.

A transfer to a public wallet is on-chain activity, not automatically revenue. Immortal Dynasty/NexusEval count revenue only when there is an independent payer, successful settlement, and delivered paid output.

---

## NexusEval Demand Mesh

[![Powered by RustChain](https://img.shields.io/badge/Powered%20by-RustChain-orange)](https://rustchain.org)

> Disclosure: this RustChain badge was added while participating in an openly posted RustChain bounty.

Public machine-discovery and buyer-intent layer for
[NexusEval](https://nexuseval.vercel.app).

## Future Beacon v1 — one portable signal for third-party agents

Instead of broadcasting every offer blindly, NexusEval publishes one machine-readable beacon that a third-party agent, registry, router, workflow engine, or marketplace can poll, crawl, cache, index, or relay.

- Human-readable design: [`FUTURE-BEACON.md`](./FUTURE-BEACON.md)
- Machine-readable beacon: [`future-beacon.json`](./future-beacon.json)
- Well-known repository manifest: [`.well-known/nexuseval-future-beacon.json`](./.well-known/nexuseval-future-beacon.json)
- Raw public signal: `https://raw.githubusercontent.com/Nish916/nexuseval-demand-mesh/main/future-beacon.json`

Receiver loop:

`discover beacon → match current task → verify owner spend policy → choose smallest matching x402 route → use result → repeat only for new useful work`

The beacon carries intent tags, exact prices/endpoints, Base/x402 metadata, refresh hints, PASS/WARN/BLOCK follow-up behavior, duplicate-spend protection, and an explicit instruction to ignore the signal when no real matching task exists.

## Drop-in agent skill + autonomous preflight policy

- Agent-readable install/usage skill: [`skill.md`](./skill.md)
- Buyer-controlled purchase policy: [`agent-policy.json`](./agent-policy.json)
- Framework-agnostic pre-action hooks: [`preflight-hooks.json`](./preflight-hooks.json)

The intended integration is:

`customer-facing action → is QA economically justified? → smallest matching paid check → PASS/WARN/BLOCK or structured result → continue/review/stop`

Buyer-side protections include smallest-route selection, no subscription, no auto-renew, a same-unchanged-artifact duplicate-spend guard, and a rule to check settlement/receipt evidence before retrying an ambiguous paid request.

## Try → Verify Value → Repeat Only When Useful

For agents that want the smallest genuine paid proof before adopting a new tool:

- Start with the smallest live route that matches the real task.
- Inspect the paid result for your own workflow.
- Repeat only if the result was useful and another matching task exists.
- No synthetic purchases or fake demand.

Human-readable metered offer: [`TRY-VERIFY-REPEAT.md`](./TRY-VERIFY-REPEAT.md)  
Machine-readable policy: [`try-verify-repeat.json`](./try-verify-repeat.json)

## The One Last Check — responsible-agent mission

Autonomous agents can generate in seconds. Before an ad, email, landing page, CTA, campaign brief, or GTM message reaches a human, give it one last independent quality check when that check is worth more than its price.

- Human-readable mission offer: [`RESPONSIBLE-AGENT-OFFER.md`](./RESPONSIBLE-AGENT-OFFER.md)
- Machine-readable mission offer: [`responsible-agent-offer.json`](./responsible-agent-offer.json)

This is not a sympathy purchase. Buy only for a real matching task, when expected utility exceeds price, and when the owner/operator spending policy allows it.

## Why it exists

Autonomous buyers do not browse products like humans do. They resolve tasks into tools.

This project publishes:

- portable machine-readable discovery signals
- exact buyer-intent pages and catalog data
- buyer-intent resolver
- x402 purchase recipes
- public infrastructure proof
- AI-readable `llms.txt`
- agent-native skill instructions
- buyer-controlled spend/purchase policy
- reusable pre-publish / pre-send / pre-launch hooks

## Commercial service

https://nexuseval.vercel.app

## Machine catalog

https://nexuseval-demand-mesh.vercel.app/catalog.json

## Intent resolver

https://nexuseval-demand-mesh.vercel.app/resolve?q=review+my+campaign

## Integrity

No self-purchases, fake customer claims, purchased reviews, credential abuse, search spam, or synthetic revenue claims.

A marketplace listing is discovery infrastructure, not evidence of demand or settlement.

## Deployment

Production is connected to this repository on Vercel. Commits to `main` trigger automatic deployments.
