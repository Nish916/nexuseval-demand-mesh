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
<meta name="robots" content="index,follow"><link rel="canonical" href="https://nexuseval-demand-mesh.vercel.app/pilot"><meta property="og:title" content="NexusEval - 7 Day AI Marketing Preflight Pilot"><meta property="og:description" content="One real workflow, up to 100 outputs, $99 fixed. Agree scope before invoicing.">
<style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:0 auto;padding:42px 22px;line-height:1.6;color:#111;background:#fff}
.hero{padding:28px 0 18px}.eyebrow{font-size:.82rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.price{font-size:2.2rem;font-weight:800;margin:.2em 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.card{border:1px solid #ddd;border-radius:14px;padding:18px}.cta{display:inline-block;padding:14px 20px;border-radius:10px;background:#111;color:#fff;text-decoration:none;font-weight:700}.small{font-size:.92rem;opacity:.72}code{background:#f5f5f5;padding:2px 5px;border-radius:5px}

.pilot-form{margin:22px 0 16px;background:#f7faf8;border:1px solid #c6d5cd;border-radius:17px;padding:23px}.pilot-form h2{margin:0 0 6px}.pilot-form label{display:block;font-size:13px;font-weight:750;margin:14px 0 5px}.pilot-form input,.pilot-form select,.pilot-form textarea{width:100%;padding:11px;border:1px solid #abbcaf;border-radius:8px;font:inherit;background:white;color:#122319}.pilot-form textarea{min-height:85px}.form-actions{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}.form-actions .cta{margin:0;cursor:pointer}.cta.secondary{background:#fff;color:#111;border:1px solid #888}.pilot-form input:focus,.pilot-form select:focus,.pilot-form textarea:focus{outline:2px solid #2c604b}
</style>
</head>
<body data-release="pilot-intent-v2-20261020">
<section class="hero">
<div class="eyebrow">NexusEval production pilot</div>
<h1>Stop weak or risky AI marketing before it reaches customers.</h1>
<p>NexusEval sits immediately before an AI workflow sends or publishes customer-facing marketing. Each output gets an independent <strong>PASS / WARN / BLOCK</strong> decision plus a machine-readable reason and audit trail.</p>
<div class="price">$99 fixed</div>
<p><strong>7 days · up to 100 real outputs · one production workflow</strong></p>
<div class="pilot-form">
<h2>Start a $99 pilot</h2><p>Tell us the workflow. We will confirm the scope and send verified invoice/payment instructions before work starts.</p>
<form id="pilot-request">
<label for="buyer-email">Work email</label><input id="buyer-email" type="email" autocomplete="email" maxlength="180" placeholder="you@company.com" required>
<label for="buyer-company">Company</label><input id="buyer-company" maxlength="100" placeholder="Company or team" required>
<label for="buyer-workflow">AI marketing workflow</label><select id="buyer-workflow" required><option value="">Select one</option><option>Ads / paid campaigns</option><option>AI marketing emails</option><option>Landing page and CTA</option><option>Social publishing</option><option>Other marketing workflow</option></select>
<label for="buyer-notes">What should we check? (optional)</label><textarea id="buyer-notes" maxlength="450" placeholder="A short description. Do not include confidential data."></textarea>
<div class="form-actions"><button class="cta" type="submit">Continue with Gmail</button><button type="button" class="cta secondary" id="emailapp">Use email app</button><button type="button" class="cta secondary" id="copyrequest">Copy request</button></div>
<p id="pilot-status" role="status" aria-live="polite" class="small"></p>
<p class="small">Your details are not sent or stored by this webpage. These buttons prepare a draft in your email client. You must press <strong>Send</strong> there.</p>
</form></div><div class="form-actions"><a class="cta secondary" id="invoice-cta" href="https://nishant-payment-hub.vercel.app" target="_blank" rel="noopener noreferrer">Invoice and payment options</a><a class="cta secondary" id="api-cta" href="https://nexuseval.vercel.app/.well-known/x402" target="_blank" rel="noopener noreferrer">Live USDC pay-per-call API</a></div>
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
<p>The core service is already live as an API with structured JSON, x402 v2 support on Base USDC, machine-readable pricing, signed offers/receipts, and public OpenAPI. Those are implementation details; the pilot is about whether the gate helps your real workflow. API usage is paid in USDC; the $99 human-led pilot is invoiced after the scope is agreed. No active card or INR checkout is claimed.</p>
<p class="small">Core API: <code>https://nexuseval.vercel.app</code> · Public proof: <code>/proof.json</code> on the Demand Mesh.</p>

<script>
(function(){
  var form=document.getElementById('pilot-request');
  var status=document.getElementById('pilot-status');
  var subject='NexusEval $99 production pilot';
  function track(label){try{navigator.sendBeacon('/api/pilot-event?event='+encodeURIComponent(label))}catch(_){}}
  function build(){
    if(!form.reportValidity())return null;
    var email=document.getElementById('buyer-email').value.trim();
    var company=document.getElementById('buyer-company').value.trim();
    var workflow=document.getElementById('buyer-workflow').value;
    var notes=document.getElementById('buyer-notes').value.trim();
    if(!email||!company||!workflow)return null;
    return 'Hello NexusEval,\n\nI would like to discuss a $99 seven-day pilot for one real workflow.\n\nCompany: '+company+'\nWork email: '+email+'\nWorkflow: '+workflow+'\nNotes: '+(notes||'Please advise.')+'\n\nPlease confirm scope and payment options before work begins.';
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var body=build();if(!body)return;track('gmail_enquiry_intent');
    status.textContent='Gmail will open with your request. Press Send to complete the enquiry.';
    window.location.assign('https://mail.google.com/mail/?view=cm&fs=1&to=nishants916%40gmail.com&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body));
  });
  document.getElementById('emailapp').addEventListener('click',function(){
    var body=build();if(!body)return;track('email_app_enquiry_intent');
    status.textContent='Your email app is opening. Press Send to complete the enquiry.';
    window.location.href='mailto:nishants916@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
  document.getElementById('copyrequest').addEventListener('click',function(){
    var body=build();if(!body)return;track('copy_enquiry_intent');
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText('To: nishants916@gmail.com\nSubject: '+subject+'\n\n'+body).then(function(){status.textContent='Copied. Paste into any email service and press Send.'}).catch(function(){status.textContent='Clipboard unavailable: please use Gmail or your email app.'})}
    else status.textContent='Clipboard unavailable: please use Gmail or your email app.';
  });
  document.getElementById('invoice-cta').addEventListener('click',function(){track('invoice_options_intent')});
  document.getElementById('api-cta').addEventListener('click',function(){track('api_payment_intent')});
})();
</script>
</body>
</html>`;

  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(html);
};
