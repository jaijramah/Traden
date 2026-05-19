import http from 'node:http';

const port = process.env.PORT || 3000;

const trades = ['electrician', 'gas engineer', 'roofer', 'mobile detailer', 'cleaner', 'plumber', 'window tinter'];
const demoMessages = [
  'Hi, need an EICR for a 3 bed house in Stafford next week. How much?',
  'Hi mate, how much for a Worcester boiler service? I’m in Cannock and can do Friday.',
  'I’ve got a leak coming through the bedroom ceiling when it rains. Can you come out? I’m in Walsall.',
  'How much for a deep clean on a Range Rover? It’s pretty dirty inside. Based in Wolverhampton.',
  'Need an end of tenancy clean for a 2 bed flat in Birmingham next Thursday.',
  'How much for rear tints on a Golf? I’m in Cannock and can do Friday.'
];

const services = [
  { trade: 'electrician', name: 'EICR certificate', keywords: ['eicr', 'electric'], price: 120, risk: 'high', missing: ['full postcode', 'property type'] },
  { trade: 'gas engineer', name: 'Boiler service', keywords: ['boiler', 'worcester', 'gas'], price: 85, risk: 'high', missing: ['boiler make/model', 'full postcode'] },
  { trade: 'roofer', name: 'Leak inspection', keywords: ['leak', 'roof', 'ceiling'], fromPrice: 120, risk: 'high', missing: ['photos', 'access notes'] },
  { trade: 'mobile detailer', name: 'Deep clean', keywords: ['deep clean', 'range rover', 'detail'], price: 170, risk: 'low', missing: ['vehicle size', 'water/power access'] },
  { trade: 'cleaner', name: 'End-of-tenancy clean', keywords: ['tenancy', 'clean', 'flat'], price: 160, risk: 'low', missing: ['full postcode', 'rooms'] },
  { trade: 'plumber', name: 'Leak visit', keywords: ['plumb', 'tap', 'radiator'], price: 90, risk: 'high', missing: ['full postcode', 'issue description'] },
  { trade: 'window tinter', name: 'Rear window tints', keywords: ['tint', 'rear', 'golf'], price: 150, risk: 'low', missing: ['vehicle make/model', 'shade preference'] }
];

function analyseLead(bodyText = '') {
  const text = bodyText.toLowerCase();
  const service = services.find((s) => s.keywords.some((k) => text.includes(k))) ?? services[0];
  const classification = /refund|complaint|angry/.test(text) ? 'complaint' : /seo|crypto|loan/.test(text) ? 'spam' : 'new_lead';
  const suggestedReply = service.fromPrice
    ? `Hi, yes we can help. ${service.name} starts from £${service.fromPrice}. Could you send ${service.missing.join(', ')} so we can quote it properly?`
    : `Hi, yes we can help. ${service.name} is £${service.price}. Could you send ${service.missing.join(', ')} please?`;
  return {
    analysis: {
      classification,
      confidence: classification === 'new_lead' ? 0.88 : 0.7,
      trade: service.trade,
      serviceMatch: service.name,
      missingFields: service.missing,
      riskLevel: service.risk,
      ownerApprovalRequired: service.risk === 'high' || classification !== 'new_lead'
    },
    pricing: {
      canQuote: true,
      price: service.price,
      fromPrice: service.fromPrice,
      currency: 'GBP',
      explanation: 'Calculated from saved demo pricing rules. No AI invented prices.'
    },
    suggestedReply,
    nextAction: service.risk === 'high' ? 'Create owner approval card' : 'Send quote or ask missing details'
  };
}

const css = `:root{--bg:#050607;--surface:#101316;--surface2:#171B20;--border:#2A3036;--text:#F7F7F2;--muted:#A8B0B8;--accent:#EFFF1A;--green:#C8FF1A}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,Arial,sans-serif}.shell{max-width:1180px;margin:0 auto;padding:20px}.top{position:sticky;top:0;background:#050607d9;border-bottom:1px solid var(--border)}.nav{display:flex;justify-content:space-between;align-items:center;gap:10px}.links{display:flex;gap:8px;flex-wrap:wrap}.links a{color:var(--muted);padding:8px 10px;border-radius:999px}.links a:hover{background:var(--surface2);color:var(--text)}.btn{border:0;border-radius:999px;padding:10px 14px;font-weight:800;background:linear-gradient(135deg,var(--accent),var(--green));color:#050607;cursor:pointer}.btn.secondary{background:#171B20;color:var(--text);border:1px solid var(--border)}.card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:16px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}.hero{display:grid;grid-template-columns:1.2fr .8fr;gap:12px}.muted{color:var(--muted)}.pill{display:inline-block;border:1px solid var(--border);border-radius:999px;padding:5px 9px;color:var(--muted);font-size:12px}.input,.textarea,select{width:100%;background:#080a0c;color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px}.textarea{min-height:120px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.list{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}.state{font-size:12px;color:var(--muted)}pre{white-space:pre-wrap;background:#07090a;border:1px solid var(--border);border-radius:10px;padding:10px;max-height:420px;overflow:auto}@media(max-width:900px){.hero{grid-template-columns:1fr}.links{display:none}}`;

const appJs = `
const seedServices=${JSON.stringify(services.map(s=>({trade:s.trade,name:s.name,price:s.price??s.fromPrice??0})))};
function getState(){return JSON.parse(localStorage.getItem('traden_state')||'{}')}
function saveState(s){localStorage.setItem('traden_state',JSON.stringify(s))}
function ensure(){const s=getState();if(!s.business)s.business={name:'Traden Demo Business',trade:'gas engineer',onboarded:false,automation:'assisted'};if(!s.services)s.services=seedServices;if(!s.leads)s.leads=[];if(!s.actions)s.actions=[];if(!s.jobs)s.jobs=[];if(!s.invoices)s.invoices=[];if(!s.reviews)s.reviews=[];saveState(s);return s}
window.traden={getState,saveState,ensure};
`;

function shell(title, body, pageScript = '') {
  return `<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>${title}</title><style>${css}</style></head><body><div class='top'><div class='shell nav'><a href='/'><b>TRA<span style='color:#EFFF1A'>DEN</span></b></a><div class='links'><a href='/onboarding'>Onboarding</a><a href='/dashboard'>Dashboard</a><a href='/test-lab'>Test Lab</a><a href='/leads'>CRM</a><a href='/actions'>Actions</a><a href='/calendar'>Calendar</a><a href='/jobs'>Jobs</a><a href='/invoices'>Invoices</a><a href='/settings'>Settings</a></div><a class='btn' href='/test-lab'>Try demo</a></div></div><main class='shell'>${body}</main><script>${appJs}</script><script>${pageScript}</script></body></html>`;
}

function landingPage(){return shell('Traden',`<section class='hero'><div class='card'><span class='pill'>Working demo MVP</span><h1>Turn trade enquiries into booked jobs.</h1><p class='muted'>Onboarding, dashboard, test lab, CRM, action cards, calendar booking, job completion, invoices and review flow are interactive in demo mode.</p><div class='actions'><a class='btn' href='/onboarding'>Start onboarding</a><a class='btn secondary' href='/test-lab'>Open test lab</a></div><p class='muted'>Trades supported: ${trades.join(', ')}.</p></div><div class='card'><h3>Demo flow</h3><ol><li>Onboard business</li><li>Analyse lead in test lab</li><li>Approve action card</li><li>Book slot</li><li>Complete job</li><li>Invoice + review</li></ol></div></section>`)}

function onboardingPage(){return shell('Onboarding',`<div class='grid'><div class='card'><h2>Onboarding</h2><label>Business name</label><input id='biz-name' class='input'/><label>Trade</label><select id='biz-trade'>${trades.map(t=>`<option>${t}</option>`).join('')}</select><label>Automation</label><select id='biz-auto'><option>draft_only</option><option selected>assisted</option><option>autopilot</option></select><div class='actions'><button class='btn' id='save-onboard'>Complete onboarding</button><a class='btn secondary' href='/dashboard'>Continue</a></div><pre id='out'>Complete onboarding to save business profile.</pre></div><div class='card'><h3>Seeded services</h3>${services.map(s=>`<p class='muted'>${s.name} (${s.trade})</p>`).join('')}</div></div>`,`const s=traden.ensure();bizName=document.getElementById('biz-name');bizTrade=document.getElementById('biz-trade');bizAuto=document.getElementById('biz-auto');bizName.value=s.business.name;bizTrade.value=s.business.trade;bizAuto.value=s.business.automation;document.getElementById('save-onboard').onclick=()=>{const st=traden.ensure();st.business={name:bizName.value,trade:bizTrade.value,automation:bizAuto.value,onboarded:true};traden.saveState(st);document.getElementById('out').textContent=JSON.stringify(st.business,null,2);};`)}

function dashboardPage(){return shell('Dashboard',`<div class='grid'><div class='card'><p class='muted'>New leads</p><h2 id='k1'>0</h2></div><div class='card'><p class='muted'>Quotes waiting</p><h2 id='k2'>0</h2></div><div class='card'><p class='muted'>Jobs booked</p><h2 id='k3'>0</h2></div><div class='card'><p class='muted'>Payments pending</p><h2 id='k4'>0</h2></div></div><div class='card'><div class='actions'><a class='btn' href='/test-lab'>Analyse lead</a><a class='btn secondary' href='/actions'>Action cards</a><a class='btn secondary' href='/calendar'>Book slots</a></div></div>`,`const s=traden.ensure();k1.textContent=s.leads.filter(l=>['new','qualifying','quoted'].includes(l.status)).length;k2.textContent=s.leads.filter(l=>l.status==='quoted').length;k3.textContent=s.jobs.filter(j=>j.status==='scheduled').length;k4.textContent=s.invoices.filter(i=>i.status!=='paid').length;`)}

function testLabPage(){return shell('Test Lab',`<div class='grid'><div class='card'><label>Customer message</label><textarea id='msg' class='textarea'>${demoMessages[1]}</textarea><div class='actions'><button class='btn' id='analyse'>Run analysis</button><a class='btn secondary' href='/leads'>Open CRM</a></div><div class='actions'>${demoMessages.map((m,i)=>`<button class='btn secondary ex' data-msg="${m.replaceAll('"','&quot;')}">Example ${i+1}</button>`).join('')}</div></div><div class='card'><h3>Pipeline output</h3><pre id='result'>Ready.</pre></div></div>`,`traden.ensure();async function run(){const res=await fetch('/api/test-lab/analyse',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({bodyText:msg.value})});const data=await res.json();result.textContent=JSON.stringify(data,null,2);const s=traden.ensure();const lead={id:Date.now()+'',customer:'Demo Customer',trade:data.analysis.trade,service:data.analysis.serviceMatch,status:data.analysis.ownerApprovalRequired?'qualifying':'quoted',price:data.pricing.price||data.pricing.fromPrice||0,suggestedReply:data.suggestedReply};s.leads.unshift(lead);if(data.analysis.ownerApprovalRequired)s.actions.unshift({id:'a'+Date.now(),type:'send_reply',summary:lead.service+' needs approval',message:data.suggestedReply,leadId:lead.id});traden.saveState(s);} analyse.onclick=run;document.querySelectorAll('.ex').forEach(b=>b.onclick=()=>{msg.value=b.dataset.msg;run();});`)}

function leadsPage(){return shell('CRM Leads',`<div class='card'><div id='list' class='list'></div><div class='actions'><a class='btn' href='/test-lab'>Add lead from Test Lab</a></div></div>`,`const s=traden.ensure();const order=['new','qualifying','quoted','booking_pending','booked','completed','paid'];if(!s.leads.length){list.innerHTML='<p class="muted">No leads yet.</p>'; } else {list.innerHTML=s.leads.map((l,i)=>'<div class="card"><span class="state">'+l.status+'</span><h3>'+l.service+'</h3><p class="muted">'+l.trade+' • £'+(l.price||'TBC')+'</p><div class="actions"><button class="btn secondary nxt" data-i="'+i+'">Advance status</button><button class="btn secondary act" data-i="'+i+'">Create action card</button></div></div>').join('');document.querySelectorAll('.nxt').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);const idx=order.indexOf(s.leads[i].status);s.leads[i].status=order[Math.min(idx+1,order.length-1)];traden.saveState(s);location.reload();});document.querySelectorAll('.act').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);s.actions.unshift({id:'a'+Date.now(),type:'follow_up',summary:'Follow up '+s.leads[i].service,message:s.leads[i].suggestedReply||''});traden.saveState(s);location.href='/actions';});}`)}

function actionsPage(){return shell('Action Cards',`<div class='card'><div id='alist' class='list'></div></div>`,`const s=traden.ensure();if(!s.actions.length){alist.innerHTML='<p class="muted">No pending actions.</p>';} else {alist.innerHTML=s.actions.map((a,i)=>'<div class="card"><span class="pill">'+a.type+'</span><h3>'+a.summary+'</h3><p class="muted">'+(a.message||'')+'</p><div class="actions"><button class="btn ok" data-i="'+i+'">Send reply</button><button class="btn secondary edit" data-i="'+i+'">Edit first</button><button class="btn secondary rej" data-i="'+i+'">Reject</button></div></div>').join('');document.querySelectorAll('.ok,.rej').forEach(b=>b.onclick=()=>{s.actions.splice(Number(b.dataset.i),1);traden.saveState(s);location.reload();});document.querySelectorAll('.edit').forEach(b=>b.onclick=()=>alert('Edit first flow (demo): open lead and modify message.'));}`)}

function calendarPage(){return shell('Calendar Booking',`<div class='card'><div id='slots' class='list'></div></div>`,`const s=traden.ensure();const lead=s.leads.find(l=>['quoted','booking_pending'].includes(l.status));const cand=['Friday 10:30','Friday 14:00','Monday 09:30'];if(!lead){slots.innerHTML='<p class="muted">No lead ready for booking.</p>'; } else {slots.innerHTML=cand.map((slot,i)=>'<div class="card"><h3>'+slot+'</h3><p class="muted">'+lead.service+' • score '+(92-i*8)+'</p><div class="actions"><button class="btn book" data-i="'+i+'">Book this slot</button><button class="btn secondary">Offer both slots</button></div></div>').join('');document.querySelectorAll('.book').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);s.jobs.unshift({id:'j'+Date.now(),service:lead.service,customer:lead.customer,slot:cand[i],status:'scheduled',paymentStatus:'unpaid',price:lead.price||85});lead.status='booked';traden.saveState(s);location.href='/jobs';});}`)}

function jobsPage(){return shell('Jobs',`<div class='card'><div id='jobs' class='list'></div></div>`,`const s=traden.ensure();if(!s.jobs.length){jobs.innerHTML='<p class="muted">No jobs booked yet.</p>'; } else {jobs.innerHTML=s.jobs.map((j,i)=>'<div class="card"><h3>'+j.service+' — '+j.customer+'</h3><p class="muted">'+j.slot+' • '+j.status+'</p><div class="actions"><button class="btn paid" data-i="'+i+'">Mark paid card</button><button class="btn secondary cash" data-i="'+i+'">Mark paid cash</button><button class="btn secondary inv" data-i="'+i+'">Needs invoice</button><button class="btn secondary unh" data-i="'+i+'">Customer unhappy</button></div></div>').join('');document.querySelectorAll('.paid,.cash').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);s.jobs[i].status='completed';s.jobs[i].paymentStatus=b.classList.contains('cash')?'paid_cash':'paid_card';s.invoices.unshift({id:'inv'+Date.now(),customer:s.jobs[i].customer,total:s.jobs[i].price||85,status:'paid'});s.reviews.unshift({id:'r'+Date.now(),customer:s.jobs[i].customer,status:'queued'});traden.saveState(s);location.reload();});document.querySelectorAll('.inv').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);s.jobs[i].status='completed';s.jobs[i].paymentStatus='invoice_needed';s.invoices.unshift({id:'inv'+Date.now(),customer:s.jobs[i].customer,total:s.jobs[i].price||85,status:'sent'});traden.saveState(s);location.href='/invoices';});document.querySelectorAll('.unh').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);s.jobs[i].status='issue';s.actions.unshift({id:'a'+Date.now(),type:'resolve_complaint',summary:'Customer unhappy: '+s.jobs[i].customer,message:'Owner follow-up required'});traden.saveState(s);location.href='/actions';});}`)}

function invoicesPage(){return shell('Invoices & Reviews',`<div class='card'><div id='inv' class='list'></div></div>`,`const s=traden.ensure();if(!s.invoices.length){inv.innerHTML='<p class="muted">No invoices yet.</p>'; } else {inv.innerHTML=s.invoices.map((x,i)=>'<div class="card"><h3>Invoice '+(i+1)+' — '+x.customer+'</h3><p class="muted">£'+x.total+' • '+x.status+'</p><div class="actions"><button class="btn mp" data-i="'+i+'">Mark paid card</button><button class="btn secondary rv" data-i="'+i+'">Send review request</button></div><pre id="rv'+i+'">No review sent.</pre></div>').join('');document.querySelectorAll('.mp').forEach(b=>b.onclick=()=>{s.invoices[Number(b.dataset.i)].status='paid';traden.saveState(s);location.reload();});document.querySelectorAll('.rv').forEach(b=>b.onclick=()=>{document.getElementById('rv'+b.dataset.i).textContent='Thanks again for booking with us. Please leave a quick review: https://g.page/r/demo';s.reviews.unshift({id:'r'+Date.now(),customer:s.invoices[Number(b.dataset.i)].customer,status:'sent'});traden.saveState(s);});}`)}

function settingsPage(){return shell('Settings',`<div class='grid'><div class='card'><h3>Business</h3><p class='muted'>Trade profile and service area.</p></div><div class='card'><h3>Services</h3><p class='muted'>Trade-agnostic pricing rules.</p></div><div class='card'><h3>Integrations</h3><p class='muted'>WhatsApp/Twilio/Gmail/Calendar/Stripe are integration-ready stubs in demo mode.</p></div></div>`)}

function page(path){if(path==='/')return landingPage();if(path==='/onboarding')return onboardingPage();if(path==='/dashboard')return dashboardPage();if(path==='/test-lab')return testLabPage();if(path==='/leads')return leadsPage();if(path==='/actions')return actionsPage();if(path==='/calendar')return calendarPage();if(path==='/jobs')return jobsPage();if(path==='/invoices')return invoicesPage();if(path.startsWith('/settings'))return settingsPage();return shell('Traden',`<div class='card'><p class='muted'>Demo page. Use top navigation.</p></div>`)}

async function readBody(req){const chunks=[];for await(const chunk of req)chunks.push(chunk);return Buffer.concat(chunks).toString('utf8')}

http.createServer(async (req,res)=>{
  const url=new URL(req.url ?? '/',`http://localhost:${port}`);
  if(url.pathname==='/app.js'){res.setHeader('content-type','application/javascript');res.end(appJs);return;}
  if(req.method==='POST' && url.pathname==='/api/test-lab/analyse'){const raw=await readBody(req);const payload=raw?JSON.parse(raw):{};res.setHeader('content-type','application/json');res.end(JSON.stringify(analyseLead(payload.bodyText),null,2));return;}
  res.setHeader('content-type','text/html; charset=utf-8');
  res.end(page(url.pathname));
}).listen(port,()=>console.log(`Traden demo running on http://localhost:${port}`));
