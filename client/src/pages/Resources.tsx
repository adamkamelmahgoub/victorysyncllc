
import Hero from "../components/Hero";

export default function Resources() {
  const items = [
    { title: "After-Hours Playbook", href: "/resources/playbook" },
    { title: "QA Scorecard Template", href: "/resources/qa-scorecard" },
    { title: "Missed Calls Cost Calculator", href: "/calculator" },
    { title: "Integrations", href: "#integrations" },
    { title: "Case Studies", href: "#case-studies" },
  ];

  return (
    <>
      <Hero
        eyebrow="Resources"
        title={`Playbooks, templates,<br/>and calculators`}
        subtitle="Practical tools to ship outcomes faster."
        image="/assets/hero-resources.webp"
        primary={{ label: "Open calculator", to: "/calculator" }}
        secondary={{ label: "Get a demo", to: "/demo" }}
      />

      <section className="section">
        <div className="container grid cols-3 gap-16">
          {items.map((r) => (
            <a key={r.title} className="card hover" href={r.href}>
              <h3>{r.title}</h3>
              <p>Open →</p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
