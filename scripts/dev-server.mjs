import http from 'node:http';

const port = process.env.PORT || 3000;

const demoMessages = [
  'Hi, need an EICR for a 3 bed house in Stafford next week. How much?',
  'Hi mate, how much for a Worcester boiler service? I’m in Cannock and can do Friday.',
  'I’ve got a leak coming through the bedroom ceiling when it rains. Can you come out? I’m in Walsall.',
  'How much for a deep clean on a Range Rover? It’s pretty dirty inside. Based in Wolverhampton.',
  'Need an end of tenancy clean for a 2 bed flat in Birmingham next Thursday.',
  'How much for rear tints on a Golf? I’m in Cannock and can do Friday.'
];

const services = [
  { name: 'Boiler service', keywords: ['boiler', 'worcester'], price: 85, risk: 'high', missing: ['boiler make/model', 'full postcode'] },
  { name: 'EICR certificate', keywords: ['eicr', 'certificate'], price: 120, risk: 'high', missing: ['full postcode', 'property type'] },
  { name: 'Leak inspection', keywords: ['leak', 'roof', 'ceiling'], fromPrice: 120, risk: 'high', missing: ['photos', 'access notes'] },
  { name: 'Deep clean', keywords: ['deep clean', 'range rover', 'dirty'], price: 170, risk: 'low', missing: ['water/power access'] },
  { name: 'End-of-tenancy clean', keywords: ['end of tenancy', '2 bed', 'flat'], price: 160, risk: 'low', missing: ['full postcode'] },
  { name: 'Rear window tints', keywords: ['rear tints', 'golf', 'tint'], price: 150, risk: 'low', missing: ['shade preference'] }
];

function analyseLead(bodyText = '') {
  const text = bodyText.toLowerCase();
  const service = services.find((item) => item.keywords.some((keyword) => text.includes(keyword))) ?? services[0];
  const city = ['stafford', 'cannock', 'walsall', 'wolverhampton', 'birmingham'].find((place) => text.includes(place));
  const classification = /refund|complaint|unhappy|angry/.test(text) ? 'complaint' : /seo|crypto|loan/.test(text) ? 'spam' : 'new_lead';
  const suggestedReply = service.fromPrice
    ? `Hi, yes we can help. ${service.name} starts from £${service.fromPrice}. Could you send ${service.missing.join(', ')} so we can quote it properly?`
    : `Hi, yes we can help. ${service.name} is £${service.price}. Could you send ${service.missing.join(', ')} please?`;

  return {
    universalMessage: {
      channel: 'manual',
      senderHandle: 'demo-customer',
      bodyText,
      receivedAt: new Date().toISOString()
    },
    analysis: {
      classification,
      confidence: classification === 'new_lead' ? 0.88 : 0.7,
      serviceMatch: service.name,
      location: city ?? 'not detected',
      urgency: /urgent|leak|emergency/.test(text) ? 'high' : 'medium',
      missingFields: service.missing,
      riskLevel: service.risk,
      ownerApprovalRequired: service.risk === 'high' || classification !== 'new_lead'
    },
    pricing: {
      canQuote: Boolean(service.price || service.fromPrice),
      price: service.price,
      fromPrice: service.fromPrice,
      currency: 'GBP',
      explanation: 'Calculated from demo pricing rules. No AI invented prices.'
    },
    suggestedReply,
    nextAction: service.risk === 'high' ? 'Create owner approval card' : 'Ask missing details or send quote'
  };
}

const css = String.raw`
:root{--bg:#050607;--surface:#101316;--surface2:#171B20;--border:#2A3036;--text:#F7F7F2;--muted:#A8B0B8;--accent:#EFFF1A;--green:#C8FF1A;--success:#28E070;--warning:#F7C948;--danger:#FF5B5B}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 82% 0%,rgba(239,255,26,.20),transparent 28%),radial-gradient(circle at 15% 20%,rgba(200,255,26,.09),transparent 22%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit;text-decoration:none}.shell{max-width:1180px;margin:0 auto;padding:24px}.topbar{position:sticky;top:0;z-index:10;background:rgba(5,6,7,.78);backdrop-filter:blur(18px);border-bottom:1px solid rgba(42,48,54,.65)}.nav{display:flex;align-items:center;justify-content:space-between;gap:18px}.logo{font-size:25px;font-weight:950;letter-spacing:-.06em}.logo span{color:var(--accent)}.navlinks{display:flex;gap:8px;flex-wrap:wrap}.navlinks a{color:var(--muted);font-weight:700;padding:10px 12px;border-radius:999px}.navlinks a:hover{background:rgba(239,255,26,.08);color:var(--text)}.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:34px;align-items:center;padding:72px 0 52px}.eyebrow,.pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);background:rgba(23,27,32,.82);border-radius:999px;padding:7px 11px;color:var(--muted);font-size:13px;font-weight:800}.dot{width:8px;height:8px;background:var(--success);border-radius:99px;box-shadow:0 0 20px var(--success)}h1{font-size:clamp(48px,8vw,92px);line-height:.91;letter-spacing:-.075em;margin:18px 0 18px;max-width:920px}.lead{font-size:clamp(18px,2.2vw,23px);line-height:1.45;color:var(--muted);max-width:760px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--accent),var(--green));color:#050607;font-weight:950;padding:14px 20px;box-shadow:0 14px 42px rgba(239,255,26,.18);cursor:pointer}.btn.secondary{background:rgba(16,19,22,.8);color:var(--text);border:1px solid var(--border);box-shadow:none}.btn:hover{transform:translateY(-1px)}.panel{background:linear-gradient(180deg,rgba(23,27,32,.96),rgba(10,12,14,.96));border:1px solid var(--border);border-radius:30px;box-shadow:0 28px 80px rgba(0,0,0,.45),inset 0 1px rgba(255,255,255,.04);overflow:hidden}.phone{max-width:470px;margin-left:auto}.phone-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding:16px 18px}.status{color:var(--success);font-weight:900;font-size:12px}.message{margin:18px;background:#080a0c;border:1px solid var(--border);border-radius:22px;padding:17px}.bubble{background:rgba(239,255,26,.10);border:1px solid rgba(239,255,26,.22);padding:14px;border-radius:18px;color:#fff}.analysis{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.metric{background:rgba(255,255,255,.035);border:1px solid var(--border);border-radius:16px;padding:12px}.metric b{display:block;color:var(--accent);font-size:20px}.reply{margin-top:14px;border-left:3px solid var(--accent);padding:12px 14px;background:rgba(239,255,26,.07);border-radius:12px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.card{background:linear-gradient(180deg,var(--surface),#0b0d0f);border:1px solid var(--border);border-radius:24px;padding:22px}.card h3{margin:8px 0 8px;font-size:21px;letter-spacing:-.02em}.muted{color:var(--muted);line-height:1.55}.strip{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0 0}.workflow{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;counter-reset:step}.step{position:relative;padding-top:48px}.step:before{counter-increment:step;content:counter(step);position:absolute;top:18px;left:18px;width:28px;height:28px;border-radius:99px;background:var(--accent);color:#050607;display:grid;place-items:center;font-weight:950}.section{padding:34px 0}.section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px}.section-title h2{font-size:clamp(30px,4vw,48px);letter-spacing:-.055em;margin:0}.lab{display:grid;grid-template-columns:.9fr 1.1fr;gap:18px;padding:34px 0}.textarea{width:100%;min-height:180px;background:#080a0c;color:var(--text);border:1px solid var(--border);border-radius:20px;padding:16px;font:inherit;resize:vertical}.examples{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.example{background:var(--surface2);border:1px solid var(--border);color:var(--muted);border-radius:999px;padding:8px 10px;cursor:pointer}.result{white-space:pre-wrap;overflow:auto;max-height:560px;background:#07090a;border:1px solid var(--border);border-radius:18px;padding:14px;color:#d9e1e8;font-size:13px}.footer-cta{text-align:center;padding:56px 24px;margin:40px 0}.footer-cta h2{font-size:clamp(34px,5vw,60px);letter-spacing:-.06em;margin:0 0 12px}@media(max-width:860px){.hero,.lab{grid-template-columns:1fr}.phone{margin:0;max-width:none}.grid,.workflow{grid-template-columns:1fr}.nav{align-items:flex-start}.navlinks{display:none}h1{font-size:52px}.shell{padding:18px}.analysis{grid-template-columns:1fr}}
`;

function layout(content, title = 'Traden') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${css}</style></head><body><div class="topbar"><div class="shell nav"><a class="logo" href="/">TRA<span>DEN</span></a><div class="navlinks"><a href="/test-lab">Test Lab</a><a href="/dashboard">Dashboard</a><a href="/leads">Leads</a><a href="/actions">Actions</a><a href="/settings/integrations">Integrations</a></div><a class="btn" href="/?demo=1#live-demo">Try demo</a></div></div>${content}</body></html>`;
}

function landingPage({ preRun = false } = {}) {
  const initialLandingResult = preRun
    ? escapeHtml(JSON.stringify(analyseLead(demoMessages[1]), null, 2))
    : 'Click “Run demo pipeline” to see Traden analyse a real trade enquiry.';
  return layout(`<main class="shell">
    <section class="hero">
      <div>
        <span class="eyebrow"><span class="dot"></span> Demo mode live • real integrations ready</span>
        <h1>Turn trade enquiries into booked jobs.</h1>
        <p class="lead">Traden replies to leads, creates quotes from your saved prices, books jobs, tracks your pipeline, sends invoices and gets reviews — so you can stay on the tools.</p>
        <div class="actions"><a class="btn" href="#live-demo" data-demo-start>Try demo now →</a><a class="btn secondary" href="/test-lab">Open full Test Lab</a></div>
      </div>
      <aside class="panel phone" aria-label="Demo lead workflow preview">
        <div class="phone-head"><b>New WhatsApp lead</b><span class="status">READY TO APPROVE</span></div>
        <div class="message"><div class="bubble">Hi mate, how much for a Worcester boiler service? I’m in Cannock and can do Friday.</div><div class="analysis"><div class="metric"><small>Matched service</small><b>Boiler service</b></div><div class="metric"><small>Saved price</small><b>£85</b></div><div class="metric"><small>Risk gate</small><b>Owner</b></div><div class="metric"><small>Next step</small><b>Ask details</b></div></div><div class="reply"><b>Suggested reply</b><br>Hi, a standard boiler service is £85. Friday may work. What make/model is the boiler and what’s the full postcode please?</div></div>
      </aside>
    </section>
    <section class="section"><div class="grid">${['AI lead replies','Quote from your own prices','WhatsApp/SMS/email inbox','Google Calendar booking','Follow-ups','Invoice/payment/review flow'].map((item) => `<article class="card"><span class="pill">Built for trades</span><h3>${item}</h3><p class="muted">Practical workflows, safety checks and owner approval before risky automation.</p></article>`).join('')}</div></section>
    <section class="section panel" style="padding:24px"><div class="section-title"><h2>Trade-agnostic from day one.</h2><p class="muted">Not just tinting software. Built for mobile service businesses.</p></div><div class="strip">${['Electricians','Gas engineers','Roofers','Mobile detailers','Cleaners','Plumbers','Landscapers','Window tinters'].map((item) => `<span class="pill">${item}</span>`).join('')}</div></section>
    <section id="live-demo" class="section panel live-demo" style="padding:24px">
      <div class="section-title"><div><span class="eyebrow"><span class="dot"></span> Live demo</span><h2>Press once. Watch Traden work.</h2></div><p class="muted">No signup. No API keys. This runs the same deterministic demo pipeline used by the Test Lab.</p></div>
      <div class="lab" style="padding:0">
        <div class="card"><label class="pill" for="landing-message">Customer message</label><textarea id="landing-message" class="textarea">${demoMessages[1]}</textarea><div class="actions"><button id="landing-analyse" class="btn">Run demo pipeline →</button><a class="btn secondary" href="/test-lab">Open full Test Lab</a></div><div class="examples">${demoMessages.map((message, index) => `<button class="example" data-landing-message="${escapeHtml(message)}">Example ${index + 1}</button>`).join('')}</div></div>
        <div class="card"><h3 style="margin-top:0">Result</h3><p class="muted">Classification, pricing, safety gate and suggested reply appear here.</p><pre id="landing-result" class="result">${initialLandingResult}</pre></div>
      </div>
    </section>
    <section id="workflow" class="section"><div class="section-title"><h2>Customer message in. Admin handled.</h2><a class="btn secondary" href="#live-demo" data-demo-start>Try the live flow</a></div><div class="workflow">${['Lead arrives from WhatsApp, SMS, email or manual paste.','Traden qualifies it and extracts missing fields.','Price is calculated from your own rules — never invented.','Owner approves, then booking, invoice and review follow-up happen.'].map((item) => `<article class="card step"><p class="muted">${item}</p></article>`).join('')}</div></section>
    <section class="panel footer-cta"><h2>Ready to see it work?</h2><p class="muted">Open the Lead Test Lab and run the full demo pipeline with trade-specific examples.</p><div class="actions" style="justify-content:center"><a class="btn" href="#live-demo" data-demo-start>Start free demo →</a><a class="btn secondary" href="/dashboard">View dashboard</a></div></section>
  </main><script>
async function runDemoFrom(messageId, resultId) {
  const input = document.querySelector(messageId);
  const result = document.querySelector(resultId);
  if (!input || !result) return;
  result.textContent = 'Running Traden pipeline…';
  try {
    const response = await fetch('/api/test-lab/analyse', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ bodyText: input.value }) });
    const data = await response.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = 'Demo failed: ' + (error instanceof Error ? error.message : String(error));
  }
}
document.addEventListener('click', (event) => {
  const start = event.target.closest('[data-demo-start]');
  if (start && document.querySelector('#landing-message')) {
    event.preventDefault();
    document.querySelector('#live-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    runDemoFrom('#landing-message', '#landing-result');
  }
  const example = event.target.closest('[data-landing-message]');
  if (example) {
    document.querySelector('#landing-message').value = example.dataset.landingMessage;
    runDemoFrom('#landing-message', '#landing-result');
  }
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#landing-analyse')?.addEventListener('click', () => runDemoFrom('#landing-message', '#landing-result'));
});
</script>`);
}

function testLabPage() {
  const initialTestLabResult = escapeHtml(JSON.stringify(analyseLead(demoMessages[1]), null, 2));
  return layout(`<main class="shell"><section class="section-title" style="padding-top:34px"><div><span class="eyebrow"><span class="dot"></span> Lead Test Lab</span><h1 style="font-size:clamp(42px,6vw,70px)">Run the full lead pipeline.</h1><p class="lead">Paste a customer message, then see normalisation, classification, pricing, owner approval and the suggested reply.</p></div></section><section class="lab"><div class="card"><label class="pill" for="message">Customer message</label><textarea id="message" class="textarea">${demoMessages[1]}</textarea><div class="actions"><button id="analyse" class="btn">Analyse lead →</button><a class="btn secondary" href="/">Back to landing</a></div><div class="examples">${demoMessages.map((message, index) => `<button class="example" data-message="${escapeHtml(message)}">Example ${index + 1}</button>`).join('')}</div></div><div class="card"><h2 style="margin-top:0">Pipeline result</h2><p class="muted">The result below is deterministic demo mode, using saved trade rules and safety gates.</p><pre id="result" class="result">${initialTestLabResult}</pre></div></section></main><script>
const examples = document.querySelectorAll('.example');
const input = document.querySelector('#message');
const result = document.querySelector('#result');
examples.forEach((button) => button.addEventListener('click', () => { input.value = button.dataset.message; runTestLabDemo(); }));
async function runTestLabDemo() {
  result.textContent = 'Analysing…';
  try {
    const response = await fetch('/api/test-lab/analyse', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ bodyText: input.value }) });
    result.textContent = JSON.stringify(await response.json(), null, 2);
  } catch (error) {
    result.textContent = 'Demo failed: ' + (error instanceof Error ? error.message : String(error));
  }
}
document.querySelector('#analyse').addEventListener('click', runTestLabDemo);
runTestLabDemo();
</script>`, 'Traden Test Lab');
}

function appPage(pathname) {
  const title = pathname.split('/').filter(Boolean).join(' / ') || 'Dashboard';
  const cards = ['New leads today', 'Quotes waiting', 'Action cards', 'Jobs booked', 'Payments outstanding', 'Reviews requested'];
  return layout(`<main class="shell"><section class="section-title" style="padding-top:34px"><div><span class="eyebrow"><span class="dot"></span> Demo mode</span><h1 style="font-size:clamp(42px,6vw,72px);text-transform:capitalize">${title}</h1><p class="lead">A polished demo surface for Traden. Connect real integrations when credentials are ready.</p></div></section><section class="grid">${cards.map((card) => `<article class="card"><span class="pill">Demo</span><h3>${card}</h3><p class="muted">Mobile-friendly cards keep the tradesman in control with clear actions.</p><div class="actions"><button class="btn">Approve</button><button class="btn secondary">Edit first</button></div></article>`).join('')}</section></main>`, `Traden ${title}`);
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);

  if (req.method === 'POST' && url.pathname === '/api/test-lab/analyse') {
    const raw = await readBody(req);
    const payload = raw ? JSON.parse(raw) : {};
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(analyseLead(payload.bodyText), null, 2));
    return;
  }

  res.setHeader('content-type', 'text/html; charset=utf-8');
  if (url.pathname === '/') res.end(landingPage({ preRun: url.searchParams.get('demo') === '1' }));
  else if (url.pathname === '/test-lab') res.end(testLabPage());
  else res.end(appPage(url.pathname));
}).listen(port, () => console.log(`Traden demo running on http://localhost:${port}`));
