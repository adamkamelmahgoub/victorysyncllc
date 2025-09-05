
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Pricing() {
  const tiers = [
    { name: "Starter", price: 899, features: ["Shared inbox", "Basic reporting", "Email + chat"] },
    { name: "Growth", price: 1990, features: ["Phone + chat + email", "Advanced routing", "Automations"] },
    { name: "Enterprise", price: "Talk to us", features: ["Custom SLAs", "Dedicated team", "Bespoke workflows"] },
  ];

  return (
    <>
      <Hero
        eyebrow="Pricing"
        title={`Scale up and never down`}
        subtitle="Plans scale by monthly resolved volume. No surprise fees."
        image="/assets/hero-pricing.webp"
        primary={{ label: "Get a Demo", to: "/demo" }}
        secondary={{ label: "Common questions", to: "#faq" }}
      />

      <section className="section">
        <div className="container grid cols-3 gap-16">
          {tiers.map((t) => (
            <article className="card price" key={t.name}>
              <h3>{t.name}</h3>
              <div className="price-tag">
                {typeof t.price === "number" ? <>${t.price}<span>/mo</span></> : t.price}
              </div>
              <ul className="bullets">
                {t.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link className="btn primary block" to="/demo">Add a Plan</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="section tint">
        <div className="container narrow">
          <h2>Common questions</h2>
          <details><summary>How do you price contracts?</summary><p>Monthly per resolved contact; voice, chat, and email count when we resolve.</p></details>
          <details><summary>Do you support seasonal bursts?</summary><p>Yes—volume flex with a cap; we align staffing and automations.</p></details>
          <details><summary>What's onboarding like?</summary><p>2–4 weeks: playbook setup, knowledge sync, automations, and QA.</p></details>
        </div>
      </section>
    </>
  );
}
