import Link from 'next/link';

const features = [
  'AI lead replies',
  'Quote from your own prices',
  'WhatsApp/SMS/email inbox',
  'Google Calendar booking',
  'Follow-ups',
  'Invoice/payment/review flow'
];

const trades = ['Electricians', 'Gas engineers', 'Roofers', 'Mobile detailers', 'Cleaners', 'Plumbers', 'Landscapers', 'Window tinters'];
const steps = ['Lead arrives from WhatsApp, SMS, email or manual paste.', 'Traden qualifies it and asks for missing details.', 'Prices come from your saved rules — never invented.', 'Owner approves, then booking, invoice and review follow-up happen.'];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="pill">Demo mode live • real integrations ready</p>
          <h1>Turn trade enquiries into booked jobs.</h1>
          <p className="lead">
            Traden replies to leads, creates quotes from your saved prices, books jobs, tracks your pipeline, sends invoices and gets reviews — so you can stay on the tools.
          </p>
          <div className="actions">
            <Link className="btn" href="/test-lab">Start free demo →</Link>
            <Link className="btn btn-secondary" href="#workflow">See how it works</Link>
          </div>
        </div>
        <aside className="card hero-preview">
          <div className="preview-top"><b>New WhatsApp lead</b><span>READY TO APPROVE</span></div>
          <p className="preview-bubble">Hi mate, how much for a Worcester boiler service? I’m in Cannock and can do Friday.</p>
          <div className="preview-grid">
            <div><small>Matched service</small><b>Boiler service</b></div>
            <div><small>Saved price</small><b>£85</b></div>
            <div><small>Risk gate</small><b>Owner</b></div>
            <div><small>Next step</small><b>Ask details</b></div>
          </div>
          <p className="preview-reply"><b>Suggested reply</b><br />Hi, a standard boiler service is £85. Friday may work. What make/model is the boiler and what’s the full postcode please?</p>
        </aside>
      </section>

      <section className="grid-auto">
        {features.map((feature) => (
          <article className="card" key={feature}>
            <span className="pill">Built for trades</span>
            <h3>{feature}</h3>
            <p className="muted">Practical workflows, safety checks and owner approval before risky automation.</p>
          </article>
        ))}
      </section>

      <section className="card section-card">
        <h2>Trade-agnostic from day one.</h2>
        <p className="muted">Not just tinting software. Built for mobile service businesses.</p>
        <div className="nav">{trades.map((trade) => <span className="pill" key={trade}>{trade}</span>)}</div>
      </section>

      <section id="workflow" className="section-card">
        <h2>Customer message in. Admin handled.</h2>
        <div className="workflow-grid">
          {steps.map((step, index) => (
            <article className="card" key={step}>
              <span className="step-number">{index + 1}</span>
              <p className="muted">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card final-cta">
        <h2>Ready to see it work?</h2>
        <p className="muted">Open the Lead Test Lab and run the full demo pipeline with trade-specific examples.</p>
        <Link className="btn" href="/test-lab">Start free demo →</Link>
      </section>
    </main>
  );
}
