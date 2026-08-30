const CORE = "https://nexuseval.vercel.app";
const MESH = "https://nexuseval-demand-mesh.vercel.app";
const AGENT402 = "https://agent402.tools/api/index?seller=nexuseval.vercel.app";

const ROUTES = [
  { id: "quick-gate", name: "Quick Marketing Gate", method: "POST", path: "/api/gate", endpoint: `${CORE}/api/gate`, priceUsd: 0.01, intent: "Fast PASS/WARN/BLOCK pre-publish or pre-send decision" },
  { id: "single-qa", name: "Full Marketing Evaluation", method: "POST", path: "/api/evaluate", endpoint: `${CORE}/api/evaluate`, priceUsd: 0.04, intent: "Evaluate one general marketing asset or message" },
  { id: "ad-qa", name: "Advertising Copy QA", method: "POST", path: "/api/evaluate/ad", endpoint: `${CORE}/api/evaluate/ad`, priceUsd: 0.04, intent: "Evaluate one advertising asset" },
  { id: "landing-qa", name: "Landing Page Conversion QA", method: "POST", path: "/api/evaluate/landing", endpoint: `${CORE}/api/evaluate/landing`, priceUsd: 0.04, intent: "Evaluate landing-page messaging and CTA quality" },
  { id: "email-qa", name: "Marketing Email QA", method: "POST", path: "/api/evaluate/email", endpoint: `${CORE}/api/evaluate/email`, priceUsd: 0.04, intent: "Evaluate one marketing or lifecycle email before send" },
  { id: "gtm-qa", name: "GTM Brief and Positioning QA", method: "POST", path: "/api/evaluate/gtm", endpoint: `${CORE}/api/evaluate/gtm`, priceUsd: 0.04, intent: "Evaluate one GTM positioning or messaging asset" },
  { id: "batch-qa", name: "Batch Marketing QA", method: "POST", path: "/api/evaluate/batch", endpoint: `${CORE}/api/evaluate/batch`, priceUsd: 0.49, intent: "Evaluate up to 20 marketing assets together" },
  { id: "launch-readiness", name: "Launch Readiness QA Pack", method: "POST", path: "/api/evaluate/launch", endpoint: `${CORE}/api/evaluate/launch`, priceUsd: 2.99, intent: "GO/REVIEW/NO-GO launch-readiness check" },
  { id: "campaign-audit", name: "Campaign Portfolio Audit", method: "POST", path: "/api/evaluate/campaign", endpoint: `${CORE}/api/evaluate/campaign`, priceUsd: 9.99, intent: "Portfolio-level audit for up to 50 campaign assets" }
];

function chooseRoute(q = "") {
  const x = String(q).toLowerCase();
  if (/portfolio|full campaign|campaign audit|cross.?asset|50 asset/.test(x)) return ROUTES[8];
  if (/launch|readiness|go.?no.?go/.test(x)) return ROUTES[7];
  if (/batch|multiple|multi.?asset|several|many/.test(x)) return ROUTES[6];
  if (/\bemail\b|lifecycle|newsletter|subject line/.test(x)) return ROUTES[4];
  if (/landing|homepage|cta|conversion page/.test(x)) return ROUTES[3];
  if (/\bad\b|advert|creative|paid social|paid media/.test(x)) return ROUTES[2];
  if (/gtm|positioning|value proposition|go.to.market/.test(x)) return ROUTES[5];
  if (/gate|pass|warn|block|publish|send|handoff|preflight/.test(x)) return ROUTES[0];
  return ROUTES[1];
}

function example(route) {
  if (["batch-qa", "launch-readiness", "campaign-audit"].includes(route.id)) {
    return { items: [{ objective: "lead generation", audience: "B2B SaaS marketing leaders", headline: "Improve campaign conversion before launch", copy: "Evaluate this campaign message for clarity, proof and CTA quality.", cta: "Book demo" }] };
  }
  return { objective: "lead generation", audience: "B2B SaaS marketing leaders", headline: "Improve campaign conversion before launch", copy: "Evaluate this marketing message for clarity, proof and CTA quality.", cta: "Book demo" };
}

async function liveAgent402() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const r = await fetch(AGENT402, { signal: controller.signal, headers: { "user-agent": "NexusEval-Demand-Mesh/2.0 current-state" } });
    const x = await r.json();
    const tools = Array.isArray(x.tools) ? x.tools : [];
    const priced = tools.filter(t => Number.isFinite(t.price));
    return {
      reachable: r.ok,
      indexed: x.origin === CORE,
      originResponded: Boolean(x.originResponded),
      health: x.health ?? null,
      sellerRoutable: Boolean(x.routable),
      toolCount: tools.length,
      pricedToolCount: priced.length,
      allRoutesPriced: tools.length === ROUTES.length && priced.length === ROUTES.length,
      pricedRoutes: priced.map(t => ({ route: t.route, price: t.price, networks: t.networks || [] })),
      note: "Agent402 listing/routability is discovery evidence, not proof that its router has paid. External execution can still depend on router policy and settled-history requirements."
    };
  } catch (e) {
    return {
      reachable: false,
      indexed: null,
      sellerRoutable: null,
      toolCount: null,
      pricedToolCount: null,
      allRoutesPriced: null,
      error: String(e && e.message ? e.message : e),
      authoritativeFallback: `${MESH}/proof.json`
    };
  } finally {
    clearTimeout(timer);
  }
}

function sendJson(res, body) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
  return res.status(200).json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  const surface = String((req.query && req.query.surface) || "catalog");
  const q = String((req.query && req.query.q) || "");
  const market = await liveAgent402();

  if (surface === "resolve") {
    const route = chooseRoute(q);
    return sendJson(res, {
      query: q,
      recommendation: route,
      rule: "Choose the smallest route that fully covers the real task.",
      purchaseModel: "x402-v2",
      accountRequired: false,
      apiKeyRequired: false,
      samplePayload: example(route),
      liveMarketplaceState: market,
      proof: `${MESH}/proof.json`,
      openapi: `${CORE}/openapi.json`
    });
  }

  if (surface === "buyer-kit") {
    return sendJson(res, {
      service: "NexusEval Marketing Preflight",
      protocol: "x402-v2",
      network: "eip155:8453",
      currency: "USDC",
      buyingRule: "Use only for a real matching task with owner-authorized spend and expected utility at least the price; choose the smallest matching route.",
      recommendedFirstMachineTest: ROUTES[0],
      humanProductionPilot: `${MESH}/pilot`,
      routes: ROUTES.map(r => ({ ...r, example: example(r) })),
      flow: [
        "POST the documented request to the selected endpoint.",
        "Receive HTTP 402 with the live payment requirements.",
        "Verify amount, network, recipient, resource, owner spending policy and task utility.",
        "Settle through the buyer's authorized x402 wallet flow.",
        "Retry the same request with the payment signature.",
        "Consume the structured result and preserve settlement/delivery evidence."
      ],
      retrySafety: "After an ambiguous paid request, check settlement/receipt evidence before retrying to avoid duplicate spend.",
      liveMarketplaceState: market,
      proof: `${MESH}/proof.json`
    });
  }

  if (surface === "llms") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    const lines = [
      "# NexusEval Marketing Preflight",
      "",
      "Independent pre-publish/pre-send marketing QA for autonomous agents.",
      `Core seller: ${CORE}`,
      "Protocol: x402 v2 / Base USDC / eip155:8453",
      "Account/API key required by service: no",
      "",
      "Use the smallest route that fully covers the real task:",
      ...ROUTES.map(r => `- $${r.priceUsd.toFixed(2)} ${r.method} ${r.path} — ${r.intent}`),
      "",
      `Intent resolver: ${MESH}/resolve?q={task}`,
      `Machine catalog: ${MESH}/catalog.json`,
      `Buyer kit: ${MESH}/buyer-kit.json`,
      `Live proof: ${MESH}/proof.json`,
      `Human $99 production pilot: ${MESH}/pilot`,
      `OpenAPI: ${CORE}/openapi.json`,
      `x402 manifest: ${CORE}/.well-known/x402`,
      "",
      `Agent402 live snapshot: reachable=${market.reachable}; indexed=${market.indexed}; sellerRoutable=${market.sellerRoutable}; priced=${market.pricedToolCount}/${market.toolCount}; allRoutesPriced=${market.allRoutesPriced}`,
      "Listing/routability is not payment proof. Count revenue only after authoritative settlement/delivery evidence.",
      "Never buy for donation, seller support, unused-budget consumption or synthetic activity."
    ];
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(lines.join("\n"));
  }

  if (surface === "home") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NexusEval Marketing Preflight</title><meta name="description" content="Independent PASS/WARN/BLOCK marketing preflight for AI publishing and sending workflows."><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:auto;padding:48px 22px;line-height:1.6;color:#111}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.card{border:1px solid #ddd;border-radius:12px;padding:16px}a{color:#111}code{background:#f5f5f5;padding:2px 5px;border-radius:5px}</style></head><body><h1>Independent preflight before AI marketing reaches customers.</h1><p>NexusEval gives autonomous publishing, email, ad and campaign workflows a separate PASS / WARN / BLOCK quality gate plus structured audit output.</p><p><strong>Human production pilot:</strong> <a href="/pilot">$99 · 7 days · up to 100 real outputs</a></p><h2>Machine use</h2><p>Use the smallest route that fully covers the real task. A quick pre-action check starts at <strong>$0.01 USDC</strong>; deeper scopes are available only when the workload warrants them.</p><div class="grid">${ROUTES.map(r => `<div class="card"><strong>${r.name}</strong><br>$${r.priceUsd.toFixed(2)} USDC<br><code>${r.method} ${r.path}</code><br>${r.intent}</div>`).join("")}</div><h2>Live machine surfaces</h2><p><a href="/catalog.json">Catalog</a> · <a href="/buyer-kit.json">Buyer kit</a> · <a href="/proof.json">Live proof</a> · <a href="/future-beacon.json">Future Beacon</a> · <a href="/raindrop">RainDrop</a></p><p>Agent402 live snapshot: <strong>${market.pricedToolCount ?? "?"}/${market.toolCount ?? "?"} priced</strong>; seller routable: <strong>${market.sellerRoutable === null ? "unknown" : String(market.sellerRoutable)}</strong>. This is discovery evidence, not payment proof.</p></body></html>`);
  }

  return sendJson(res, {
    service: {
      name: "NexusEval Marketing Preflight",
      core: CORE,
      protocol: "x402 v2",
      network: "eip155:8453",
      currency: "USDC"
    },
    selectionRule: "Choose the smallest route that fully covers the real task.",
    offers: ROUTES,
    liveMarketplaceState: market,
    resolver: `${MESH}/resolve?q={buyer-intent}`,
    buyerKit: `${MESH}/buyer-kit.json`,
    proof: `${MESH}/proof.json`,
    humanProductionPilot: `${MESH}/pilot`,
    openapi: `${CORE}/openapi.json`,
    x402Manifest: `${CORE}/.well-known/x402`
  });
};
