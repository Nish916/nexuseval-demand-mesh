# NexusEval x SharedOS — Permissioned Agent QA

Hackathon target: Shared OS Hackathon (A2A product).

## Problem
Autonomous agents can discover paid QA tools, but a buyer should not be able to spend or inspect arbitrary resources just because another agent asked it to. The authority for a purchase and the authority for the underlying artifact must remain outside the message.

## Product
**Permissioned Agent QA** lets a requester agent ask a reviewer agent to run a NexusEval preflight. SharedOS controls which artifact can be read and which QA action can be invoked. The reviewer only sees the tools allowed by grants. NexusEval then chooses the smallest matching QA route and returns PASS/WARN/BLOCK plus evidence.

Flow:

`requester agent -> SharedOS execution grant -> scoped artifact read -> NexusEval route selection -> QA result -> requester`

## Why SharedOS matters
The SharedOS quickstart demonstrates that sender identity is provenance, not authority, and that a turn executes with independently loaded grants. Tool visibility is filtered before the model sees the catalog. This makes it a strong policy boundary for agent-to-agent commerce and QA.

## Demo scenarios
1. **Allowed**: reviewer has grant to read `campaign/a.md` and invoke `nexuseval.evaluate`; the QA call proceeds.
2. **Denied artifact**: requester points to `finance/secrets.md`; file tool is absent or authorization fails.
3. **Denied purchase**: reviewer can read the artifact but lacks QA/spend grant; no paid call is made.
4. **Least-cost route**: a single asset chooses the smallest applicable NexusEval route rather than a larger campaign audit.
5. **Auditability**: request id, artifact scope, selected route, decision, and result are recorded without exposing payment secrets.

## Existing NexusEval assets reused
- Machine-readable offers and exact x402 prices
- PASS/WARN/BLOCK gate
- Duplicate-spend guard
- Settlement/receipt verification rule
- Buyer-controlled spend policy
- Agent discovery beacon

## Deliverable plan
- `sharedos-demo.ts` — deterministic SharedOS execution showing scoped QA authorization
- `agent-card.json` — A2A-facing capability description
- `DEMO.md` — judge walkthrough and denial cases
- Optional live adapter to `https://nexuseval.vercel.app` for a real QA request; demo must remain safe when payment credentials are absent

No synthetic purchases or fake revenue are part of this entry.