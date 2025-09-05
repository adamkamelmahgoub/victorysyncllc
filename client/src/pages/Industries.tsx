
import Hero from "../components/Hero";

export default function Industries() {
  return (
    <>
      <Hero
        eyebrow="Industries"
        title={`Tailored flows for your<br/>business`}
        subtitle="From retail to fintech, we ship playbooks that match your risk and compliance needs."
        image="/assets/hero-industries.webp"
        primary={{ label: "Talk to Solutions", to: "/demo" }}
        secondary={{ label: "Case Studies", to: "/resources#case-studies" }}
      />

      <section className="section">
        <div className="container grid cols-3 gap-16">
          {[
            ["Retail", "High volume: support, returns, billing, status."],
            ["E-commerce", "Order questions, payments, and cart recovery."],
            ["Fintech", "KYC, disputes, and fraud notifications."],
            ["Healthcare", "Scheduling, reminders, and benefit questions."],
            ["Telecom", "Provisioning, outages, upsell campaigns."],
            ["Logistics", "Delivery updates, exceptions, and claims."],
          ].map(([title, copy]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
