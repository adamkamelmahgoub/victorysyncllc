
import Hero from "../components/Hero";

export default function Platform() {
  return (
    <>
      <Hero
        eyebrow="Platform"
        title={`The contact stack,<br/>without the mess`}
        subtitle="One pane of glass: bring your CRM + helpdesk into our platform; we handle triage, routing, and automations."
        image="/assets/hero-platform.webp"
        primary={{ label: "See Integrations", to: "/resources#integrations" }}
        secondary={{ label: "Case Studies", to: "/resources#case-studies" }}
      />

      <section className="section">
        <div className="container narrow">
          <h2>Architecture that just works</h2>
          <ul className="pill-list">
            <li><strong>Routing</strong> — skills-based, priority, & after-hours rules</li>
            <li><strong>Agent</strong> — superlight console with macros, screen pop, and knowledge search</li>
            <li><strong>Knowledge</strong> — unified search, policy sync, templates</li>
            <li><strong>Automation</strong> — triage, ticket creation, refunds, returns</li>
            <li><strong>Analytics</strong> — SLAs, AHT, CSAT, QA, revenue captured</li>
            <li><strong>Integrations</strong> — CRM + Helpdesk + BI</li>
          </ul>
        </div>
      </section>
    </>
  );
}
