# NexusEval × SharedOS — Permissioned A2A Marketing QA

Status: hackathon build branch; not yet registered/submitted on Devpost.

## Problem

AI agents increasingly publish ads, landing pages, email, GTM copy and campaign assets without a second independent check. A buyer agent should be able to request QA from another agent **without handing over its whole workspace, tool catalog, credentials, or authority**.

## Product

NexusEval becomes a permission-scoped A2A QA worker running behind SharedOS authority boundaries.

A buyer asks: “Check this launch email before I send it.” The owner grants the QA worker only:

- permission to execute the QA agent,
- read access to the one approved asset/context,
- access to one minimal NexusEval QA action,
- a purpose such as `marketing-preflight`.

SharedOS keeps unrelated tools out of the worker-visible catalog. The worker returns a structured `PASS`, `WARN`, or `BLOCK` result and the buyer decides what to do next.

## Demo flow

1. `buyer-agent` sends a request to `nexuseval-qa`.
2. Trusted grants authorize the recipient agent and one asset path.
3. SharedOS lists only the tools allowed for that purpose.
4. The QA driver calls `marketing.evaluate` once.
5. The deterministic demo returns findings and a release decision.
6. An unauthorized attempt to access another asset is absent from the visible tool/resource scope rather than merely discouraged by prompt text.

## Why SharedOS matters

The core value is not “another prompt wrapper.” SharedOS separates sender provenance from recipient authority. Authority is loaded from trusted grants, filtered before the model sees tools, and re-checked at execution time. This is a direct fit for buyer-to-seller agent commerce where a seller should receive the smallest possible capability surface.

## NexusEval reuse

Existing NexusEval concepts reused:

- PASS/WARN/BLOCK marketing preflight
- machine-readable purchase policy
- smallest-route selection
- duplicate-spend protection
- x402-compatible commercial endpoints

Hackathon-period work on this branch:

- SharedOS-native permission model
- A2A QA demo contract
- deterministic test fixture
- demo script and submission packaging

## Next build steps

- replace the in-memory `marketing.evaluate` stub with a controlled NexusEval adapter
- add an explicit spend/purchase grant separate from asset-read authority
- add a BLOCK escalation path that requires owner approval
- record an end-to-end demo
- complete Devpost registration/submission if account-level rules are accepted by the entrant

## References

SharedOS quickstart pattern: `Aicoo-Team/SharedOS/examples/quickstart`.

NexusEval seller: `https://nexuseval.vercel.app`
