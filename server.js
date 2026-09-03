const express = require("express");
const originalApp = require("./server-original");

const app = express();
app.set("trust proxy", 1);

const CORE = "https://nexuseval.vercel.app";
const GATE = `${CORE}/api/gate`;
const QUICK = {
  id: "quick-gate",
  name: "Quick Marketing Preflight Gate",
  endpoint: GATE,
  method: "POST",
  priceUsd: 0.01,
  currency: "USDC",
  network: "eip155:8453",
  protocol: "x402-v2",
  outcome: "Structured PASS/WARN/BLOCK-style verdict with score, risk flags and recommended fixes"
};

function sample() {
  return {
    objective: "conversion",
    audience: "prospective customers",
    headline: "Improve this offer before launch",
    copy: "Check this marketing message for clarity, proof, CTA quality and claim risk.",
    cta: "Start now"
  };
}

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NexusEval Marketing Preflight — $0.01 x402 QA</title><meta name="description" content="Get a structured marketing preflight verdict for $0.01 USDC on Base before publishing an ad, email, landing page or campaign message."><meta name="robots" content="index,follow"></head><body style="font-family:system-ui,-apple-system,sans-serif;max-width:860px;margin:0 auto;padding:42px 22px;line-height:1.55;color:#111"><h1>NexusEval Marketing Preflight</h1><p><strong>First paid check: $0.01 USDC on Base.</strong></p><p>POST marketing copy to <code>${GATE}</code> and get a structured PASS/WARN/BLOCK-style preflight with score, risk flags and recommended fixes before publishing, sending or launching.</p><pre style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:10px">POST ${GATE}\n${JSON.stringify(sample(), null, 2)}</pre><p>No account or API key required by NexusEval. The paid POST returns a machine-readable x402 payment challenge.</p><p><a href="/buyer-kit.json">Buyer kit</a> · <a href="/offer.json">Offer</a> · <a href="/proof.json">Live proof</a> · <a href="${CORE}/openapi.json">OpenAPI</a> · <a href="${CORE}/.well-known/x402">x402 discovery</a></p><p style="opacity:.7">PayAPI performed one external verification/canary settlement. It is not presented as organic customer revenue.</p></body></html>`);
});

app.get("/resolve", (req, res, next) => {
  const q = String(req.query.q || "").toLowerCase();
  if (/batch|multiple|multi.?asset|portfolio|campaign audit|launch readiness|go.?no.?go/.test(q)) return next();
  res.json({
    query: String(req.query.q || ""),
    recommendation: QUICK,
    purchaseModel: "x402-v2",
    accountRequired: false,
    apiKeyRequired: false,
    samplePayload: sample(),
    why: "Lowest-friction canonical NexusEval entry offer for a genuine single marketing preflight task."
  });
});

app.get("/buyer-kit.json", (_req, res) => {
  res.json({
    service: "NexusEval Marketing Preflight",
    recommendedFirstPaidPilot: {
      offer: QUICK,
      example: sample(),
      reason: "Canonical $0.01 entry offer already externally settlement-verified; use for one genuine pre-publish marketing QA task."
    },
    howToBuy: [
      `POST the marketing content and context as JSON to ${GATE}`,
      "Receive HTTP 402 with x402 v2 payment requirements.",
      "Settle $0.01 USDC on Base according to those requirements.",
      "Retry the same POST with the valid payment signature.",
      "Receive the structured preflight result."
    ],
    discovery: {
      x402: `${CORE}/.well-known/x402`,
      openapi: `${CORE}/openapi.json`,
      pricing: `${CORE}/pricing.json`,
      llms: `${CORE}/llms.txt`
    },
    integrity: "The PayAPI settlement is a verification/canary payment, not an organic customer claim."
  });
});

app.get("/llms.txt", (_req, res) => {
  res.type("text/plain").send(`# NexusEval Marketing Preflight\n\nCanonical first paid offer:\nPOST ${GATE}\nPrice: $0.01 USDC\nNetwork: Base (eip155:8453)\nOutcome: structured PASS/WARN/BLOCK-style marketing preflight with score, risk flags and recommended fixes.\n\nUse for:\n- ad copy pre-publish QA\n- landing-page messaging review\n- marketing/lifecycle email pre-send QA\n- CTA and claim-risk checks\n- independent QA of AI-generated marketing copy\n\nExample JSON:\n${JSON.stringify(sample(), null, 2)}\n\nDiscovery:\n${CORE}/.well-known/x402\n${CORE}/openapi.json\n${CORE}/pricing.json\n${CORE}/llms.txt\n\nVerification note:\nPayAPI performed one external verification/canary settlement. This is not an organic customer or organic revenue claim.\n`);
});

let market402Result = null;
let market402InFlight = null;

async function submitMarket402Once() {
  if (market402Result) return market402Result;
  if (market402InFlight) return market402InFlight;
  market402InFlight = (async () => {
    const attempts = [
      { headers: { "content-type": "application/json" }, body: JSON.stringify({ url: GATE }), shape: "json:url" },
      { headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint: GATE }), shape: "json:endpoint" },
      { headers: { "content-type": "text/plain" }, body: GATE, shape: "text" }
    ];
    const results = [];
    for (const attempt of attempts) {
      const r = await fetch("https://market402.com/submit", {
        method: "POST",
        headers: { ...attempt.headers, "user-agent": "NexusEval-Distribution/1.0" },
        body: attempt.body
      });
      const text = await r.text();
      results.push({ shape: attempt.shape, status: r.status, ok: r.ok, body: text.slice(0, 4000) });
      if (r.ok || ![400, 404, 405, 415, 422].includes(r.status)) break;
    }
    market402Result = { endpoint: GATE, attempts: results, completedAt: new Date().toISOString() };
    return market402Result;
  })().finally(() => { market402InFlight = null; });
  return market402InFlight;
}

app.get("/__ops/market402-submit-4c91e2", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    res.json(await submitMarket402Once());
  } catch (error) {
    res.status(502).json({ endpoint: GATE, error: String(error && error.message || error) });
  }
});

app.use(originalApp);

const PORT = process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, () => console.log(`NexusEval Demand Mesh listening on ${PORT}`));
module.exports = app;
