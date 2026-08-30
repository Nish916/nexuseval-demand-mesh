const crypto = require("crypto");

const CORE = "https://nexuseval.vercel.app";
const MESH = "https://nexuseval-demand-mesh.vercel.app";

const ROUTES = [
  {
    id: "quick-gate",
    priceUsd: 0.01,
    endpoint: `${CORE}/api/gate`,
    match: /gate|pass|warn|block|publish|send|handoff|preflight/i
  },
  {
    id: "single-qa",
    priceUsd: 0.04,
    endpoint: `${CORE}/api/evaluate`,
    match: /single|one asset|copy|message|cta|ad|email|landing|gtm/i
  },
  {
    id: "batch-qa",
    priceUsd: 0.49,
    endpoint: `${CORE}/api/evaluate/batch`,
    match: /batch|multiple|multi.?asset|several|many/i
  },
  {
    id: "launch-readiness",
    priceUsd: 2.99,
    endpoint: `${CORE}/api/evaluate/launch`,
    match: /launch|readiness|go.?no.?go/i
  },
  {
    id: "campaign-audit",
    priceUsd: 9.99,
    endpoint: `${CORE}/api/evaluate/campaign`,
    match: /portfolio|full campaign|campaign audit|cross.?asset/i
  }
];

function chooseRoute(query) {
  const q = String(query || "");
  return (
    ROUTES.slice().reverse().find(route => route.match.test(q)) ||
    ROUTES[0]
  );
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

module.exports = function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "method-not-allowed" });
  }

  const now = new Date();
  const expires = new Date(now.getTime() + 5 * 60 * 1000);
  const hitId = crypto.randomUUID();
  const query = String((req.query && req.query.q) || "");
  const route = chooseRoute(query);
  const ua = String(req.headers["user-agent"] || "unknown");
  const uaHash = sha256(ua).slice(0, 16);
  const timeBucket = Math.floor(now.getTime() / 60000);

  const challengeSeed = [
    "nexuseval-raindrop-v1",
    hitId,
    now.toISOString(),
    String(timeBucket),
    uaHash,
    route.id
  ].join("|");

  const challenge = sha256(challengeSeed);
  const payload = {
    spec: "nexuseval-raindrop/1.0",
    kind: "ephemeral-agent-discovery-challenge",
    status: "active",
    generatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    hitId,
    challenge,
    freshness: {
      cacheable: false,
      timeBucketMinutes: 1,
      uniquePerHit: true
    },
    signal: {
      message:
        "A fresh NexusEval pre-action QA signal was observed. Inspect only if your current real task matches; ignore otherwise.",
      query: query || null,
      recommendedRoute: route,
      zeroCostInspection: [
        `${MESH}/proof.json`,
        `${MESH}/catalog.json`,
        `${MESH}/resolve?q=${encodeURIComponent(query || "pre-publish marketing QA")}`,
        `${MESH}/future-beacon.json`,
        `${MESH}/skill.md`
      ]
    },
    buyerPolicy: {
      spendRequiredToInspectBeacon: false,
      buyOnlyForRealMatchingTask: true,
      requireOwnerSpendAuthorization: true,
      requireExpectedUtilityAtLeastPrice: true,
      chooseSmallestMatchingRoute: true,
      neverBuyFor: [
        "seller-support",
        "donation",
        "unused-budget-consumption",
        "synthetic-demand",
        "marketplace-proof-manufacturing"
      ],
      duplicateSpendGuard:
        "Do not repurchase the same unchanged artifact at the same workflow stage.",
      ambiguousPaymentGuard:
        "Check settlement or receipt evidence before retrying an ambiguous paid call."
    },
    action: {
      ifNoMatchingTask: "ignore",
      ifMatchingTaskButNoSpendAuthorization: "inspect-free-surfaces-only",
      ifMatchingAndAuthorized:
        "verify live x402 quote, then invoke the smallest justified paid route",
      paidRoute: route.endpoint,
      maximumSuggestedSpendUsdForThisMatch: route.priceUsd
    },
    integrity: {
      algorithm: "sha256",
      challengeInputClass:
        "hit-id + timestamp + minute-bucket + user-agent-hash + selected-route",
      note:
        "This is a freshness/integrity challenge, not a seller cryptographic signature. Verify commercial signatures on the core x402 response."
    },
    discovery: {
      futureBeacon: `${MESH}/future-beacon.json`,
      skill: `${MESH}/skill.md`,
      policy: `${MESH}/agent-policy.json`,
      hooks: `${MESH}/preflight-hooks.json`,
      catalog: `${MESH}/catalog.json`,
      proof: `${MESH}/proof.json`,
      coreOpenAPI: `${CORE}/openapi.json`,
      coreX402: `${CORE}/.well-known/x402`
    }
  };

  const body = JSON.stringify(payload);
  const responseHash = sha256(body);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Nexus-Signal", "raindrop-v1");
  res.setHeader("X-Nexus-Hit-Id", hitId);
  res.setHeader("X-Nexus-Challenge", challenge);
  res.setHeader("X-Nexus-Response-SHA256", responseHash);
  res.setHeader(
    "Link",
    `<${MESH}/future-beacon.json>; rel="service-desc", <${MESH}/skill.md>; rel="describedby", <${CORE}/openapi.json>; rel="service-doc"`
  );

  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(body);
};
