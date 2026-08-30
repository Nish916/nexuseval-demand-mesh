module.exports = function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NexusEval — 7-Day AI Marketing Preflight Pilot</title>
<meta name="description" content="Independent pre-publish PASS/WARN/BLOCK gate for AI-generated customer-facing marketing. 7-day pilot, up to 100 real outputs, $99 fixed.">
<meta name="robots" content="index,follow">
<style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:0 auto;padding:42px 22px;line-height:1.6;color:#111;background:#fff}
.hero{padding:28px 0 18px}.eyebrow{font-size:.82rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.price{font-size:2.2rem;font-weight:800;margin:.2em 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.card{border:1px solid #ddd;border-radius:14px;padding:18px}.cta{display:inline-block;padding:14px 20px;border-radius:10px;background:#111;color:#fff;text-decoration:none;font-weight:700}.small{font-size:.92rem;opacity:.72}code{background:#f5f5f5;padding:2px 5px;border-radius:5px}
</style>
</head>
<body>
<section class="hero">
<div class="eyebrow">NexusEval production pilot</div>
<h1>Stop weak or risky AI marketing before it reaches customers.</h1>
<p>NexusEval sits immediately before an AI workflow sends or publishes customer-facing marketing. Each output gets an independent <strong>PASS / WARN / BLOCK</strong> decision plus a machine-readable reason and audit trail.</p>
<div class="price">$99 fixed</div>
<p><strong>7 days · up to 100 real outputs · one production workflow</strong></p>
<a class="cta" id="pilot-cta" href="mailto:nishants916@gmail.com?subject=NexusEval%20%2499%20production%20pilot&body=I%27d%20like%20to%20test%20NexusEval%20on%20one%20real%20AI%20publishing%2Fsending%20workflow.">Pilot one real workflow</a>
</section>

<h2>What the pilot includes</h2>
<div class="grid">
  <div class="card"><strong>Independent preflight</strong><br>Run customer-facing AI output through a separate quality gate before send/publish.</div>
  <div class="card"><strong>PASS / WARN / BLOCK</strong><br>A simple decision your automation can act on immediately.</div>
  <div class="card"><strong>Failure log</strong><br>See what was flagged, why it was flagged, and which output triggered it.</div>
  <div class="card"><strong>Production-ready path</strong><br>After the pilot, continue through direct API/x402 calls or a volume arrangement if it proves useful.</div>
</div>

<h2>Good fit</h2>
<p>AI social publishing, lifecycle/email automation, AI ad generation, landing-page generation, autonomous campaign workflows, agencies publishing AI-assisted marketing at volume, or any system where a bad customer-facing output has a real cost.</p>

<h2>What this does not promise</h2>
<p>NexusEval does not guarantee revenue, conversion lift, legal compliance, or that every bad output will be caught. The pilot is designed to answer one narrower question with real evidence: <strong>does an independent pre-publish gate add enough value to your actual workflow to keep using it?</strong></p>

<h2>Technical integration</h2>
<p>The core service is already live as an API with structured JSON, x402 v2 support on Base USDC, machine-readable pricing, signed offers/receipts, and public OpenAPI. Those are implementation details; the pilot is about whether the gate helps your real workflow.</p>
<p class="small">Core API: <code>https://nexuseval.vercel.app</code> · Public proof: <code>/proof.json</code> on the Demand Mesh.</p>

<script>
document.getElementById('pilot-cta').addEventListener('click', () => {
  try { navigator.sendBeacon('/api/pilot-event?event=cta'); } catch (_) {}
});
</script>
</body>
</html>`;

  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(html);
};
