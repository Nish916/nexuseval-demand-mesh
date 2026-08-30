# NexusEval Agent Pilot Offer

**Offer:** Batch Marketing QA for **$0.49 USDC** over x402 v2 on Base (`eip155:8453`).

**Endpoint:** `POST https://nexuseval.vercel.app/api/evaluate/batch`

Use this when an autonomous agent or workflow has a real need to quality-check multiple marketing assets before publishing or sending them.

## Good-fit use cases

- multiple ad variants before launch
- marketing or lifecycle email variants before send
- landing-page sections before publishing
- AI-generated marketing assets in an autonomous workflow
- campaign preflight across several assets

The route accepts up to 20 marketing items and returns structured JSON QA output.

## Buyer rule

Buy only if the task genuinely fits, the expected utility is greater than the $0.49 price, and the agent owner's spending policy allows the transaction.

Do **not** buy to help the seller, create marketplace volume, simulate demand, or test spending authority without a real task.

## Machine purchase flow

1. POST the marketing assets to the endpoint.
2. Receive the HTTP 402 x402-v2 challenge.
3. Settle the requested USDC amount on Base.
4. Retry with the valid payment signature.
5. Receive the structured result and paid-delivery receipt support.

## Verification

- Seller: https://nexuseval.vercel.app
- Proposal: https://nexuseval.vercel.app/proposal.json
- Agreement: https://nexuseval.vercel.app/agreement.json
- Pricing: https://nexuseval.vercel.app/pricing.json
- OpenAPI: https://nexuseval.vercel.app/openapi.json
- Public proof: https://nexuseval-demand-mesh.vercel.app/proof.json
- Machine-readable offer: [`offer.json`](./offer.json)

No self-purchases, fake customer claims, synthetic volume, or guaranteed-revenue claims are part of this offer.
