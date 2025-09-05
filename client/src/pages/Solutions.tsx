
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Solutions() {
  return (
    <>
      <Hero
        eyebrow="Solutions"
        title={`Outcomes first,<br/>features second`}
        subtitle="Pick a lane or bundle them together—each solution plugs into your tooling and data."
        image="/assets/hero-solutions.webp"
        primary={{ label: "Get a Demo", to: "/demo" }}
        secondary={{ label: "See Pricing", to: "/pricing" }}
      />

      <section className="section">
        <div className="container grid cols-4 gap-16">
          {[
            { id: "inbound", title: "Inbound Support", copy: "Phone, chat, email coverage, under 60s first reply." },
            { id: "outbound", title: "Outbound Growth", copy: "Lead follow-up, win-backs, and paid-conversion nudges." },
            { id: "helpdesk", title: "Helpdesk & Live Chat", copy: "Tiered support with SLA targets & live escalations." },
            { id: "qa", title: "QA & Analytics", copy: "Scorecards, coaching, and revenue insights." },
          ].map((item) => (
            <article id={item.id} className="card hover" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <Link to="/demo" className="card-link">Talk to sales →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <h2>Battle-tested flows</h2>
          <div className="grid cards-3">
            {["After-hours Capture", "RMA & Returns", "Billing & Refunds"].map((t) => (
              <article className="card" key={t}>
                <h3>{t}</h3>
                <p>Prebuilt triage + agent macros tailored to the use case.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
