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

.pilot-form{margin:22px 0 16px;background:#f7faf8;border:1px solid #c6d5cd;border-radius:17px;padding:23px}.pilot-form h2{margin:0 0 6px}.pilot-form label{display:block;font-size:13px;font-weight:750;margin:14px 0 5px}.pilot-form input,.pilot-form select,.pilot-form textarea{width:100%;padding:11px;border:1px solid #abbcaf;border-radius:8px;font:inherit;background:white;color:#122319}.pilot-form textarea{min-height:85px}.form-actions{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}.form-actions .cta{margin:0;cursor:pointer}.cta.secondary{background:#fff;color:#111;border:1px solid #888}.pilot-form input:focus,.pilot-form select:focus,.pilot-form textarea:focus{outline:2px solid #2c604b}.pilot-form label.consent{display:flex;align-items:flex-start;gap:10px;line-height:1.45;margin-top:18px;font-weight:500}.pilot-form .consent input{width:18px;height:18px;flex:none;margin:4px 0}.pilot-form button[disabled]{opacity:.65;cursor:wait}
</style>
</head>
<body data-release="pilot-lead-v3-20261020">
<section class="hero">
<div class="eyebrow">NexusEval production pilot</div>
<h1>Stop weak or risky AI marketing before it reaches customers.</h1>
<p>NexusEval sits immediately before an AI workflow sends or publishes customer-facing marketing. Each output gets an independent <strong>PASS / WARN / BLOCK</strong> decision plus a machine-readable reason and audit trail.</p>
<div class="price">$99 fixed</div>
<p><strong>7 days · up to 100 real outputs · one production workflow</strong></p>
<div class="pilot-form">
<h2>Start a $99 pilot</h2>
<p>One live workflow, up to 100 outputs in seven days. Describe your use case; we will reply with an agreed scope and verified payment instructions. No payment is taken by this form.</p>
<form id="pilot-request" autocomplete="on">
<label for="buyer-email">Work email *</label><input id="buyer-email" name="email" type="email" autocomplete="email" maxlength="180" placeholder="you@company.com" required>
<label for="buyer-company">Company *</label><input id="buyer-company" name="company" maxlength="100" placeholder="Company or team" required>
<label for="buyer-workflow">AI marketing workflow *</label><select id="buyer-workflow" name="workflow" required><option value="">Select one</option><option>Ads / paid campaigns</option><option>AI marketing emails</option><option>Landing page and CTA</option><option>Social publishing</option><option>Other marketing workflow</option></select>
<label for="buyer-notes">What should we check? (optional)</label><textarea id="buyer-notes" name="message" maxlength="450" placeholder="One or two sentences. Do not submit credentials or confidential material."></textarea>
<input type="text" id="pilot-honey" name="_honey" tabindex="-1" autocomplete="off" style="position:absolute;left:-10000px;opacity:0" aria-hidden="true">
<label class="consent" for="buyer-consent"><input id="buyer-consent" type="checkbox" required> I agree that my contact details and request may be sent securely to our form-delivery provider and emailed to NexusEval for a reply. Do not include confidential material. *</label>
<div class="form-actions"><button class="cta" type="submit" id="pilot-submit">Send pilot enquiry</button><button type="button" class="cta secondary" id="emailapp">Use email app instead</button><button type="button" class="cta secondary" id="copyrequest">Copy request</button></div>
<p id="pilot-status" role="status" aria-live="polite" class="small"></p>
<p class="small">We use FormSubmit for email delivery. Your contact details and message are transferred to that service for processing and sent to our enquiry inbox. We do not collect payment information here. If the direct submission is unavailable, use your own email app; you must press Send there.</p>
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
  var submit=document.getElementById('pilot-submit');
  var subject='NexusEval $99 production pilot';
  var inbox='nishants916@gmail.com';
  var endpoint='https://formsubmit.co/ajax/'+inbox;
  function track(label){try{navigator.sendBeacon('/api/pilot-event?event='+encodeURIComponent(label))}catch(_){}}
  function fields(){
    if(!form.reportValidity())return null;
    var data={email:document.getElementById('buyer-email').value.trim(),company:document.getElementById('buyer-company').value.trim(),workflow:document.getElementById('buyer-workflow').value,notes:document.getElementById('buyer-notes').value.trim(),honey:document.getElementById('pilot-honey').value};
    if(!data.email||!data.company||!data.workflow)return null;
    return data;
  }
  function emailBody(v){
    return 'Hello NexusEval,\n\nI would like to discuss the $99 seven-day pilot for one production workflow.\n\nCompany: '+v.company+'\nEmail: '+v.email+'\nWorkflow: '+v.workflow+'\nNotes: '+(v.notes||'Please advise.')+'\n\nPlease confirm scope and payment options before work begins.';
  }
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    if(submit.disabled)return;
    var v=fields();if(!v)return;
    if(v.honey){status.textContent='Your request was received.';return}
    submit.disabled=true;submit.textContent='Sending...';status.textContent='Submitting your request securely...';
    try{
      var controller=new AbortController(),timer=setTimeout(function(){controller.abort()},14000);
      var response;
      try{response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email:v.email,company:v.company,workflow:v.workflow,message:v.notes||'Scope to be discussed',_subject:'[NEXUSEVAL PILOT LEAD] New $99 enquiry',_honey:'',_captcha:'false',source:'NexusEval public pilot landing page'}),signal:controller.signal})}
      finally{clearTimeout(timer)}
      var result=await response.json();
      if(!response.ok||String(result.success)!=='true')throw Error('Submission unavailable');
      status.textContent='Request sent successfully. We will reply to your work email to confirm scope and payment options. No payment has been charged.';
      track('lead_submitted_confirmed');
      form.reset();
    }catch(error){
      status.textContent='Direct submission could not be confirmed. Your details are still here; please use the email-app or copy-request option below to send them. We have not confirmed receipt.';
      track('lead_delivery_error');
    }finally{submit.disabled=false;submit.textContent='Send pilot enquiry'}
  });
  document.getElementById('emailapp').addEventListener('click',function(){
    var v=fields();if(!v)return;track('email_app_enquiry_intent');
    status.textContent='Your email app is opening. Press Send to complete the enquiry.';
    window.location.href='mailto:'+inbox+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(emailBody(v));
  });
  document.getElementById('copyrequest').addEventListener('click',function(){
    var v=fields();if(!v)return;track('copy_enquiry_intent');
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText('To: '+inbox+'\nSubject: '+subject+'\n\n'+emailBody(v)).then(function(){status.textContent='Copied. Paste into any email service and press Send.'}).catch(function(){status.textContent='Clipboard unavailable. Please use your email app.'});
    }else{status.textContent='Clipboard unavailable. Please use your email app.'}
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
