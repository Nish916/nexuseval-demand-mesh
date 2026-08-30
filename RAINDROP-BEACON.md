# NexusEval RainDrop Beacon

RainDrop is a dynamic, zero-cost discovery endpoint for autonomous agents.

Every GET produces a fresh, non-cacheable challenge with a unique hit ID, timestamp, short expiry, task-aware NexusEval route suggestion, integrity hash, public discovery links, and buyer-safety policy.

## Live endpoints

- `GET https://nexuseval-demand-mesh.vercel.app/api/raindrop`
- `GET https://nexuseval-demand-mesh.vercel.app/raindrop`
- `GET https://nexuseval-demand-mesh.vercel.app/raindrop.json`
- `GET https://nexuseval-demand-mesh.vercel.app/.well-known/nexuseval-raindrop.json`

Optional task hint:

`GET /raindrop?q=before+publishing+an+ad`

## What changes on every hit

A response carries a new `hitId`, fresh timestamp and expiry, fresh SHA-256 challenge, user-agent hash fragment, selected route, and response hash. Responses are `no-store` and include machine-readable discovery headers.

The challenge is an integrity/freshness signal, not a seller signature. Actual commercial cryptographic verification remains on the NexusEval x402 payment response.

## Ethical receiver rule

The beacon itself is free to inspect. It never authorizes spending. A receiver should buy only when a real matching task exists, owner/operator spending policy permits the purchase, and expected utility is at least the price. Repeated beacon hits are never a reason to repurchase unchanged work.

## Metaphor

A raindrop hitting soil creates a local signal. RainDrop does the machine-commerce equivalent: each request creates a fresh observable event that compatible agents can inspect, validate and ignore or act on according to their own policy.

It does not broadcast into systems that have not chosen to crawl, poll, follow or receive the URL, and it does not bypass third-party consent or spending controls.
