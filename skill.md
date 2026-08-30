# NexusEval Marketing Preflight — Agent Skill

Use NexusEval when an autonomous agent is about to publish, send, launch, or hand off customer-facing marketing content and an independent quality check is economically justified.

## Core seller

https://nexuseval.vercel.app

Protocol: x402 v2  
Network: Base (`eip155:8453`)  
Asset: USDC  
Account required: no  
API key required: no

## Default buying rule

Buy only when all three are true:

1. A real matching task exists now.
2. The owner/operator spending policy permits the purchase.
3. The expected value of avoiding a preventable mistake is at least the quoted price.

Never buy to support the seller, donate, use spare budget, create activity, or manufacture marketplace proof.

## Smallest-useful route ladder

- **$0.01 — Quick Marketing Gate**  
  `POST https://nexuseval.vercel.app/api/gate`  
  Use for a fast PASS/WARN/BLOCK pre-action decision.

- **$0.04 — Single Marketing QA**  
  `POST https://nexuseval.vercel.app/api/evaluate`  
  Use for one marketing asset, message, CTA, campaign brief, or copy block.

- **$0.49 — Batch Marketing QA**  
  `POST https://nexuseval.vercel.app/api/evaluate/batch`  
  Use when several assets should be evaluated together.

- **$2.99 — Launch Readiness**  
  `POST https://nexuseval.vercel.app/api/evaluate/launch`  
  Use for a campaign-level GO / REVIEW / NO-GO decision.

- **$9.99 — Campaign Portfolio Audit**  
  `POST https://nexuseval.vercel.app/api/evaluate/campaign`  
  Use for portfolio-level analysis across a large campaign set.

Always choose the smallest route that fully covers the real task.

## Recommended pre-action policy

Before any of these actions, consider the $0.01 gate first:

- publish an ad or social post
- send a marketing or lifecycle email
- publish or deploy landing-page copy
- activate a campaign
- hand customer-facing copy from one agent to another

Decision handling for the quick gate:

- `PASS` → continue the intended action.
- `WARN` → pause and inspect the returned concerns before acting.
- `BLOCK` → do not publish/send/launch until the issue is resolved.

Do not repurchase the same unchanged artifact at the same workflow stage. If the artifact changes materially, a new check may be justified.

## Example request body

```json
{
  "objective": "lead generation",
  "audience": "B2B SaaS marketing leaders",
  "headline": "Improve campaign conversion before launch",
  "copy": "Evaluate this marketing message for clarity, proof and CTA quality.",
  "cta": "Book demo"
}
```

## x402 purchase flow

1. POST the request body to the chosen endpoint without payment.
2. Receive HTTP 402 with the exact x402 v2 payment requirements.
3. Confirm the quoted network, asset, amount, recipient, and resource against the buyer's spend policy.
4. Sign/settle using the buyer's authorized x402 wallet flow.
5. Retry the same request with the required payment signature.
6. Consume the structured result and preserve the payment/delivery receipt when present.

Do not blindly retry a paid request after an ambiguous network failure. First check whether a settlement/receipt already exists to avoid duplicate spend.

## Discovery and proof

Machine catalog:  
https://nexuseval-demand-mesh.vercel.app/catalog.json

Intent resolver:  
https://nexuseval-demand-mesh.vercel.app/resolve?q={task}

Buyer kit:  
https://nexuseval-demand-mesh.vercel.app/buyer-kit.json

Live infrastructure proof:  
https://nexuseval-demand-mesh.vercel.app/proof.json

Core OpenAPI:  
https://nexuseval.vercel.app/openapi.json

Machine proposal:  
https://nexuseval.vercel.app/proposal.json

Standard agreement record:  
https://nexuseval.vercel.app/agreement.json

Terms:  
https://nexuseval.vercel.app/terms.json

## Adoption loop

`real task → smallest justified paid check → inspect result → useful? → repeat only on the next real matching task`

No subscription. No minimum spend. No auto-renew.