
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Hero
        eyebrow="VictorySync Platform"
        title={`AI contact center,<br/>managed for you`}
        subtitle="24/7 inbound & outbound, omnichannel triage, under 60s first reply, and measurable ROI—without the overhead."
        image="/assets/hero-home.webp"
        primary={{ label: "Get a Demo", to: "/demo" }}
        secondary={{ label: "See Pricing", to: "/pricing" }}
      />

      <section className="section">
        <div className="container">
          <h2>VictorySync Platform</h2>
          <p className="muted">
            Modular building blocks across routing, knowledge, automation, analytics, and integrations.
          </p>

          <div className="grid cards-4">
            {["Routing", "Knowledge", "Automation", "Analytics"].map((t, i) => (
              <article className="card hover" key={t} style={{ animationDelay: `${i * .05}s` }}>
                <h3>{t}</h3>
                <p>Lower cost, faster responses, always-on coverage.</p>
                <Link to="/platform" className="card-link">Explore {t} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container grid cols-2 gap-24">
          <div className="stack gap-12">
            <h2>Outcomes that ship</h2>
            <ul className="checklist">
              <li>Capture after-hours revenue you currently miss</li>
              <li>CSAT ↑, AHT ↓ with sensible automations</li>
              <li>Seamless CRM & helpdesk integrations</li>
            </ul>
          </div>
          <div className="panel">
            <h3>Missed Calls Cost Calculator</h3>
            <p className="muted">Quantify the impact of slow response times.</p>
            <Link to="/calculator" className="btn primary">Open calculator</Link>
          </div>
        </div>
      </section>
    </>
  );
}
