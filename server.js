const express = require("express");

const app = express();
app.set("trust proxy", 1);

const CORE = "https://nexuseval.vercel.app";

const PRODUCT = {
  name: "NexusEval Marketing Preflight",
  legacyName: "NexusEval",
  category: "Autonomous AI-agent marketing quality infrastructure",
  core: CORE,
  protocol: "x402 v2",
  network: "eip155:8453",
  currency: "USDC",
  proposal: `${CORE}/proposal.json`,
  agreement: `${CORE}/agreement.json`,
  pricing: `${CORE}/pricing.json`,
  openapi: `${CORE}/openapi.json`,
  terms: `${CORE}/terms.json`
};

const SKUS = [
  {
    id: "quick-gate",
    name: "Quick Marketing Gate",
    price: 0.01,
    endpoint: `${CORE}/api/gate`,
    routerEligible: true,
    intent:
      "PASS WARN BLOCK pre-publish quality gate for autonomous marketing agents"
  },
  {
    id: "single-qa",
    name: "Single Marketing QA",
    price: 0.04,
    endpoint: `${CORE}/api/evaluate`,
    routerEligible: true,
    intent:
      "evaluate one marketing asset, message, CTA, campaign brief or copy before publishing"
  },
  {
    id: "batch-qa",
    name: "Batch Marketing QA",
    price: 0.49,
    endpoint: `${CORE}/api/evaluate/batch`,
    routerEligible: true,
    intent:
      "evaluate multiple marketing assets in one agent purchase"
  },
  {
    id: "launch-readiness",
    name: "Launch Readiness",
    price: 2.99,
    endpoint: `${CORE}/api/evaluate/launch`,
    routerEligible: false,
    intent:
      "GO REVIEW NO-GO campaign launch readiness and prioritized remediation"
  },
  {
    id: "campaign-audit",
    name: "Campaign Portfolio Audit",
    price: 9.99,
    endpoint: `${CORE}/api/evaluate/campaign`,
    routerEligible: false,
    intent:
      "portfolio-level audit for up to 50 campaign assets, recurring risks and weak assets"
  }
];

const INTENTS = [
  {
    slug: "ai-agent-marketing-preflight",
    title: "AI Agent Marketing Preflight",
    q:
      "Check autonomous AI-generated marketing output before it is published.",
    sku: "quick-gate"
  },
  {
    slug: "ad-copy-qa",
    title: "Advertising Copy QA",
    q:
      "Score advertising copy for clarity, audience fit, CTA, proof and claim risk.",
    sku: "single-qa"
  },
  {
    slug: "landing-page-copy-review",
    title: "Landing Page Copy Review",
    q:
      "Review landing-page messaging and CTA quality before launch.",
    sku: "single-qa"
  },
  {
    slug: "email-campaign-qa",
    title: "Email Campaign QA",
    q:
      "Evaluate marketing and lifecycle email messaging before send.",
    sku: "single-qa"
  },
  {
    slug: "gtm-positioning-review",
    title: "GTM Positioning Review",
    q:
      "Review GTM brief, positioning and customer value proposition.",
    sku: "single-qa"
  },
  {
    slug: "marketing-claim-risk-check",
    title: "Marketing Claim Risk Check",
    q:
      "Flag unsupported or overly strong marketing claims before publication.",
    sku: "single-qa"
  },
  {
    slug: "cta-quality-check",
    title: "CTA Quality Check",
    q:
      "Check whether a marketing call-to-action is clear and actionable.",
    sku: "single-qa"
  },
  {
    slug: "autonomous-marketing-quality-gate",
    title: "Autonomous Marketing Quality Gate",
    q:
      "Put a PASS WARN BLOCK gate in an autonomous marketing workflow.",
    sku: "quick-gate"
  },
  {
    slug: "multi-asset-marketing-qa",
    title: "Multi-Asset Marketing QA",
    q:
      "Evaluate multiple ads, emails, landing sections or campaign assets together.",
    sku: "batch-qa"
  },
  {
    slug: "campaign-launch-readiness",
    title: "Campaign Launch Readiness",
    q:
      "Decide whether a marketing campaign is GO REVIEW or NO-GO before launch.",
    sku: "launch-readiness"
  },
  {
    slug: "campaign-portfolio-audit",
    title: "Campaign Portfolio Audit",
    q:
      "Find the weakest assets and recurring risks across a full campaign portfolio.",
    sku: "campaign-audit"
  },
  {
    slug: "marketing-agent-output-review",
    title: "Marketing Agent Output Review",
    q:
      "Quality-check output produced by another autonomous marketing agent.",
    sku: "quick-gate"
  }
];

const skuById = id =>
  SKUS.find(x => x.id === id);

function chooseSku(q = "") {
  const x = String(q).toLowerCase();

  if (
    /portfolio|50 asset|full campaign|campaign audit|cross.?asset/.test(x)
  )
    return skuById("campaign-audit");

  if (
    /launch|go.?no.?go|readiness|before launch/.test(x)
  )
    return skuById("launch-readiness");

  if (
    /batch|multiple|multi.?asset|several|many assets/.test(x)
  )
    return skuById("batch-qa");

  if (
    /gate|pass|warn|block|high.?frequency|autonomous workflow/.test(x)
  )
    return skuById("quick-gate");

  return skuById("single-qa");
}

function samplePayload(sku) {
  if (
    sku.id === "batch-qa" ||
    sku.id === "launch-readiness" ||
    sku.id === "campaign-audit"
  ) {
    return {
      items: [
        {
          objective: "lead generation",
          audience: "B2B SaaS marketing leaders",
          headline: "Improve campaign conversion before launch",
          copy:
            "Evaluate this campaign message for clarity, proof and CTA quality.",
          cta: "Book demo"
        }
      ]
    };
  }

  return {
    objective: "lead generation",
    audience: "B2B SaaS marketing leaders",
    headline: "Improve campaign conversion before launch",
    copy:
      "Evaluate this marketing message for clarity, proof and CTA quality.",
    cta: "Book demo"
  };
}

function esc(x = "") {
  return String(x)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function page({
  title,
  description,
  body,
  canonical = "/"
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: PRODUCT.name,
    alternateName: PRODUCT.legacyName,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web API",
    description:
      "Machine-native marketing quality infrastructure for autonomous AI agents using x402 v2 payments.",
    offers: SKUS.map(x => ({
      "@type": "Offer",
      price: x.price,
      priceCurrency: "USD",
      name: x.name
    }))
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:980px;margin:0 auto;padding:36px 22px;line-height:1.6;color:#111}
code,pre{background:#f5f5f5;border-radius:8px}
pre{padding:18px;overflow:auto}
a{color:#111}
nav{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:34px}
.hero{padding:36px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.card{border:1px solid #ddd;border-radius:12px;padding:18px}
.small{opacity:.72}
strong{font-weight:700}
</style>
</head>
<body>
<nav>
<a href="/">Home</a>
<a href="/catalog.json">Machine catalog</a>
<a href="/buyer-kit.json">Buyer kit</a>
<a href="/proof.json">Live proof</a>
<a href="${PRODUCT.proposal}">Proposal</a>
<a href="${PRODUCT.agreement}">Agreement</a>
</nav>
${body}
</body>
</html>`;
}

app.get("/", (_req, res) => {
  res.type("html").send(
    page({
      title:
        "NexusEval Marketing Preflight — Machine-native QA for AI agents",
      description:
        "Autonomous AI agents can discover, pay for and run marketing QA over x402 v2 without accounts or API keys.",
      canonical: "/",
      body: `
<section class="hero">
<h1>Marketing Preflight for Autonomous AI Agents</h1>
<p>
NexusEval lets another agent check marketing output before publication,
pay programmatically over x402 v2, and receive structured JSON.
</p>
<p>
No account. No API key. No manual checkout required by the service.
</p>
</section>

<h2>Machine purchase ladder</h2>
<div class="grid">
${SKUS.map(
  x => `<div class="card">
<strong>${esc(x.name)}</strong><br>
$${x.price.toFixed(2)} USDC<br>
<span class="small">${esc(x.intent)}</span><br>
Agent402 external-router eligible:
<strong>${x.routerEligible ? "yes" : "direct purchase"}</strong>
</div>`
).join("")}
</div>

<h2>Buyer intents</h2>
<div class="grid">
${INTENTS.map(
  x => `<div class="card">
<a href="/use-case/${x.slug}"><strong>${esc(x.title)}</strong></a>
<p>${esc(x.q)}</p>
</div>`
).join("")}
</div>

<h2>For autonomous buyers</h2>
<pre>GET /resolve?q=review+my+campaign+before+launch
GET /catalog.json
GET /buyer-kit.json
GET /proof.json</pre>
`
    })
  );
});

app.get("/resolve", (req, res) => {
  const query = String(req.query.q || "");
  const sku = chooseSku(query);

  res.json({
    query,
    recommendation: sku,
    purchaseModel: "x402-v2",
    accountRequired: false,
    apiKeyRequired: false,
    proposal: PRODUCT.proposal,
    agreement: PRODUCT.agreement,
    terms: PRODUCT.terms,
    samplePayload: samplePayload(sku)
  });
});

app.get("/catalog.json", (_req, res) => {
  res.json({
    service: PRODUCT,
    offers: SKUS,
    useCases: INTENTS,
    resolver:
      "https://nexuseval-demand-mesh.vercel.app/resolve?q={buyer-intent}",
    note:
      "Agent402 external router currently fits NexusEval routes priced at or below $0.50; higher-priced offers are direct x402/Bazaar purchase paths."
  });
});

app.get("/buyer-kit.json", (_req, res) => {
  res.json({
    service: PRODUCT,
    howToBuy: [
      "Select a task using /resolve or /catalog.json.",
      "POST the documented JSON body to the chosen NexusEval endpoint.",
      "Receive HTTP 402 Payment Required.",
      "Use the returned x402 v2 payment requirements to settle USDC on Base.",
      "Retry with the payment signature.",
      "Receive structured JSON plus signed delivery-receipt support."
    ],
    zeroFriction: {
      account: false,
      apiKey: false,
      manualCheckoutRequiredByService: false
    },
    offers: SKUS.map(x => ({
      ...x,
      example: samplePayload(x)
    }))
  });
});

app.get("/benchmark.json", (_req, res) => {
  res.json({
    disclaimer:
      "Synthetic examples for integration testing. These are not customer results, revenue claims or endorsements.",
    tests: INTENTS.map((x, i) => {
      const sku = skuById(x.sku);
      return {
        id: i + 1,
        buyerIntent: x.q,
        recommendedSku: sku.id,
        endpoint: sku.endpoint,
        priceUSD: sku.price,
        sampleInput: samplePayload(sku)
      };
    })
  });
});

app.get("/proof.json", async (_req, res) => {
  const result = {
    checkedAt: new Date().toISOString(),
    core: CORE,
    checks: {}
  };

  async function grab(name, url) {
    try {
      const r = await fetch(url, {
        headers: {
          "user-agent":
            "NexusEval-Demand-Mesh/1.0 public-proof-check"
        }
      });

      const text = await r.text();

      result.checks[name] = {
        ok: r.ok,
        status: r.status,
        body:
          text.length < 5000
            ? JSON.parse(text)
            : "response-too-large"
      };
    } catch (e) {
      result.checks[name] = {
        ok: false,
        error: String(e.message || e)
      };
    }
  }

  await grab("health", `${CORE}/health`);
  await grab("proposal", `${CORE}/proposal.json`);
  await grab(
    "x402Manifest",
    `${CORE}/.well-known/x402`
  );

  try {
    const r = await fetch(
      "https://agent402.tools/api/index"
    );
    const x = await r.json();

    const raw = JSON.stringify(x);

    result.checks.agent402 = {
      reachable: r.ok,
      containsNexusEvalOrigin:
        raw.includes("nexuseval.vercel.app")
    };
  } catch (e) {
    result.checks.agent402 = {
      reachable: false,
      error: String(e.message || e)
    };
  }

  res.json(result);
});

app.get("/use-case/:slug", (req, res) => {
  const item = INTENTS.find(
    x => x.slug === req.params.slug
  );

  if (!item)
    return res.status(404).send("Not found");

  const sku = skuById(item.sku);
  const payload = samplePayload(sku);

  res.type("html").send(
    page({
      title:
        `${item.title} — ${PRODUCT.name}`,
      description: item.q,
      canonical: `/use-case/${item.slug}`,
      body: `
<h1>${esc(item.title)}</h1>
<p>${esc(item.q)}</p>

<h2>Best machine purchase</h2>
<p>
<strong>${esc(sku.name)}</strong> —
$${sku.price.toFixed(2)} USDC on Base via x402 v2.
</p>

<p>
Endpoint:
<code>${esc(sku.endpoint)}</code>
</p>

<p>
Agent402 external-router eligible:
<strong>${sku.routerEligible ? "yes" : "no — direct x402 purchase"}</strong>
</p>

<h2>Example request body</h2>
<pre>${esc(JSON.stringify(payload, null, 2))}</pre>

<h2>Commercial evidence</h2>
<ul>
<li><a href="${PRODUCT.proposal}">Machine proposal</a></li>
<li><a href="${PRODUCT.agreement}">Standard purchase agreement record</a></li>
<li><a href="${PRODUCT.terms}">Terms + hash</a></li>
<li><a href="${CORE}/.well-known/x402-signer.json">Public offer/receipt signer</a></li>
</ul>

<p class="small">
No customer result, guaranteed revenue, conversion guarantee or endorsement
is implied by this page.
</p>
`
    })
  );
});

app.get("/llms.txt", (_req, res) => {
  res.type("text/plain").send(
`# NexusEval Marketing Preflight

Purpose:
Machine-native pre-publish marketing QA for autonomous AI agents.

Core seller:
${CORE}

Protocol:
x402 v2 / Base USDC / eip155:8453

Machine catalog:
https://nexuseval-demand-mesh.vercel.app/catalog.json

Intent resolver:
https://nexuseval-demand-mesh.vercel.app/resolve?q={task}

Buyer kit:
https://nexuseval-demand-mesh.vercel.app/buyer-kit.json

Public proof:
https://nexuseval-demand-mesh.vercel.app/proof.json

Core OpenAPI:
${PRODUCT.openapi}

Machine proposal:
${PRODUCT.proposal}

Standard agreement:
${PRODUCT.agreement}

Best low-friction routes:
$0.01 PASS/WARN/BLOCK gate
$0.04 single QA
$0.49 batch QA

Premium direct routes:
$2.99 launch readiness
$9.99 campaign portfolio audit

Use when an AI agent needs:
- pre-publish marketing QA
- ad copy review
- landing-page copy review
- email campaign QA
- GTM positioning review
- marketing claim risk flags
- batch campaign QA
- launch readiness
- campaign portfolio audit
`
  );
});

app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(
`User-agent: *
Allow: /

Sitemap: https://nexuseval-demand-mesh.vercel.app/sitemap.xml
`
  );
});

app.get("/sitemap.xml", (_req, res) => {
  const urls = [
    "/",
    "/catalog.json",
    "/buyer-kit.json",
    "/benchmark.json",
    "/proof.json",
    "/llms.txt",
    ...INTENTS.map(
      x => `/use-case/${x.slug}`
    )
  ];

  res
    .type("application/xml")
    .send(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    x =>
`<url>
<loc>https://nexuseval-demand-mesh.vercel.app${x}</loc>
<changefreq>${x === "/proof.json" ? "hourly" : "weekly"}</changefreq>
</url>`
  )
  .join("\n")}
</urlset>`
    );
});

app.get("/openapi.json", (_req, res) => {
  res.json({
    openapi: "3.1.0",
    info: {
      title: "NexusEval Demand Mesh",
      version: "1.0.0",
      description:
        "Free machine discovery, buyer-intent resolution and proof layer for NexusEval Marketing Preflight."
    },
    servers: [
      {
        url:
          "https://nexuseval-demand-mesh.vercel.app"
      }
    ],
    paths: {
      "/resolve": {
        get: {
          summary:
            "Resolve a buyer task into the appropriate NexusEval paid SKU",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            "200": {
              description:
                "Recommended paid endpoint"
            }
          }
        }
      },
      "/catalog.json": {
        get: {
          summary:
            "Machine-readable NexusEval commercial catalog",
          responses: {
            "200": {
              description: "Catalog"
            }
          }
        }
      },
      "/proof.json": {
        get: {
          summary:
            "Publicly verifiable live NexusEval infrastructure state",
          responses: {
            "200": {
              description: "Live proof"
            }
          }
        }
      }
    }
  });
});

app.get(
  "/.well-known/nexuseval-demand.json",
  (_req, res) => {
    res.json({
      service:
        "NexusEval Demand Mesh",
      seller:
        PRODUCT,
      discovery:
        "https://nexuseval-demand-mesh.vercel.app/catalog.json",
      resolver:
        "https://nexuseval-demand-mesh.vercel.app/resolve?q={task}",
      proof:
        "https://nexuseval-demand-mesh.vercel.app/proof.json",
      llms:
        "https://nexuseval-demand-mesh.vercel.app/llms.txt"
    });
  }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `NexusEval Demand Mesh listening on ${port}`
  );
});
