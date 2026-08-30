# NexusEval Demand Mesh

Public machine-discovery and buyer-intent layer for
[NexusEval Marketing Preflight](https://nexuseval.vercel.app).

This repository does **not** contain payment keys, private credentials,
customer data, or the NexusEval payment core.

## Why it exists

Autonomous buyers do not browse products like humans do.
They resolve tasks into tools.

This project publishes:

- exact buyer-intent pages
- machine-readable catalog
- buyer-intent resolver
- x402 purchase recipes
- public infrastructure proof
- AI-readable `llms.txt`
- sitemap + search metadata
- synthetic integration benchmark

## Commercial seller

https://nexuseval.vercel.app

## Machine catalog

https://nexuseval-demand-mesh.vercel.app/catalog.json

## Recommended first paid pilot

Use **Batch Marketing QA** at `$0.49` USDC:

- endpoint: `POST https://nexuseval.vercel.app/api/evaluate/batch`
- network: Base (`eip155:8453`)
- payment: x402 v2
- discovery: Agent402 or direct x402

This is the lowest-priced NexusEval route that Agent402 currently exposes
with a machine-readable price.

## Current marketplace state

The public Agent402 seller record currently reports NexusEval as indexed,
healthy, origin-responsive, and routable with nine tools. Three routes have
machine-readable prices:

- `/api/evaluate/batch` — `$0.49`
- `/api/evaluate/launch` — `$2.99`
- `/api/evaluate/campaign` — `$9.99`

Six indexed routes currently have no Agent402 price: `/api/gate`,
`/api/evaluate`, `/api/evaluate/ad`, `/api/evaluate/landing`,
`/api/evaluate/email`, and `/api/evaluate/gtm`. They remain direct x402 paths
until their Agent402 discovery metadata is repaired. The live state is exposed
at https://nexuseval-demand-mesh.vercel.app/proof.json.

## Intent resolver

https://nexuseval-demand-mesh.vercel.app/resolve?q=review+my+campaign

## Integrity

No self-purchases, fake customer claims, purchased reviews,
credential abuse, search spam, or synthetic revenue claims.

This repository makes no customer, conversion, or revenue claim. A marketplace
listing is discovery infrastructure, not evidence of demand or settlement.

## Deployment

Production is connected to this repository on Vercel. Commits to `main` trigger automatic deployments.
