const CORE = "https://nexuseval.vercel.app";
const MESH = "https://nexuseval-demand-mesh.vercel.app";
const AGENT402 = "https://agent402.tools/api/index?seller=nexuseval.vercel.app";

const ROUTES = {
  gate: { id: "quick-gate", name: "Quick Marketing Gate", method: "POST", path: "/api/gate", endpoint: `${CORE}/api/gate`, priceUsd: 0.01, intent: "Fast PASS/WARN/BLOCK pre-publish or pre-send decision" },
  single: { id: "single-qa", name: "Full Marketing Evaluation", method: "POST", path: "/api/evaluate", endpoint: `${CORE}/api/evaluate`, priceUsd: 0.04, intent: "Evaluate one general marketing asset or message" },
  ad: { id: "ad-qa", name: "Advertising Copy QA", method: "POST", path: "/api/evaluate/ad", endpoint: `${CORE}/api/evaluate/ad`, priceUsd: 0.04, intent: "Evaluate one advertising asset" },
  landing: { id: "landing-qa", name: "Landing Page Conversion QA", method: "POST", path: "/api/evaluate/landing", endpoint: `${CORE}/api/evaluate/landing`, priceUsd: 0.04, intent: "Evaluate landing-page messaging and CTA quality" },
  email: { id: "email-qa", name: "Marketing Email QA", method: "POST", path: "/api/evaluate/email", endpoint: `${CORE}/api/evaluate/email`, priceUsd: 0.04, intent: "Evaluate one marketing or lifecycle email before send" },
  gtm: { id: "gtm-qa", name: "GTM Brief and Positioning QA", method: "POST", path: "/api/evaluate/gtm", endpoint: `${CORE}/api/evaluate/gtm`, priceUsd: 0.04, intent: "Evaluate one GTM positioning or messaging asset" },
  batch: { id: "batch-qa", name: "Batch Marketing QA", method: "POST", path: "/api/evaluate/batch", endpoint: `${CORE}/api/evaluate/batch`, priceUsd: 0.49, intent: "Evaluate up to 20 marketing assets together" },
  launch: { id: "launch-readiness", name: "Launch Readiness QA Pack", method: "POST", path: "/api/evaluate/launch", endpoint: `${CORE}/api/evaluate/launch`, priceUsd: 2.99, intent: "GO/REVIEW/NO-GO launch-readiness check" },
  campaign: { id: "campaign-audit", name: "Campaign Portfolio Audit", method: "POST", path: "/api/evaluate/campaign", endpoint: `${CORE}/api/evaluate/campaign`, priceUsd: 9.99, intent: "Portfolio-level audit for up to 50 campaign assets" }
};

function choose(q = "") {
  const x = String(q).toLowerCase();
  if (/portfolio|full campaign|campaign audit|cross.?asset|50 asset/.test(x)) return ROUTES.campaign;
  if (/launch readiness|go.?no.?go|campaign launch/.test(x)) return ROUTES.launch;
  if (/batch|multiple|multi.?asset|several|many/.test(x)) return ROUTES.batch;

  // A pre-action decision is deliberately the cheapest gate even if the artifact is an ad/email/page.
  if (/before\s+(publishing|publish|sending|send|handoff)|pre.?publish|pre.?send|preflight|pass|warn|block|\bgate\b/.test(x)) return ROUTES.gate;

  if (/\bemail\b|lifecycle|newsletter|subject line/.test(x)) return ROUTES.email;
  if (/landing|homepage|conversion page/.test(x)) return ROUTES.landing;
  if (/\bad\b|advert|creative|paid social|paid media/.test(x)) return ROUTES.ad;
  if (/gtm|positioning|value proposition|go.to.market/.test(x)) return ROUTES.gtm;
  return ROUTES.single;
}

function example(route) {
  if (["batch-qa", "launch-readiness", "campaign-audit"].includes(route.id)) {
    return { items: [{ objective: "lead generation", audience: "B2B SaaS marketing leaders", headline: "Improve campaign conversion before launch", copy: "Evaluate this campaign message for clarity, proof and CTA quality.", cta: "Book demo" }] };
  }
  return { objective: "lead generation", audience: "B2B SaaS marketing leaders", headline: "Improve campaign conversion before launch", copy: "Evaluate this marketing message for clarity, proof and CTA quality.", cta: "Book demo" };
}

async function marketState() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const r = await fetch(AGENT402, { signal: controller.signal, headers: { "user-agent": "NexusEval-Demand-Mesh/2.0 resolver" } });
    const x = await r.json();
    const tools = Array.isArray(x.tools) ? x.tools : [];
    const priced = tools.filter(t => Number.isFinite(t.price));
    return { reachable: r.ok, indexed: x.origin === CORE, sellerRoutable: Boolean(x.routable), health: x.health ?? null, toolCount: tools.length, pricedToolCount: priced.length, allRoutesPriced: tools.length === 9 && priced.length === 9 };
  } catch (e) {
    return { reachable: false, authoritativeFallback: `${MESH}/proof.json` };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const query = String((req.query && req.query.q) || "");
  const recommendation = choose(query);
  const liveMarketplaceState = await marketState();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).json({
    query,
    recommendation,
    rule: "Choose the smallest route that fully covers the real task. Pre-action PASS/WARN/BLOCK checks default to the $0.01 gate; use $0.04 specialized QA only when deeper artifact-specific evaluation is actually requested.",
    purchaseModel: "x402-v2",
    accountRequired: false,
    apiKeyRequired: false,
    samplePayload: example(recommendation),
    liveMarketplaceState,
    proof: `${MESH}/proof.json`,
    openapi: `${CORE}/openapi.json`
  });
};
