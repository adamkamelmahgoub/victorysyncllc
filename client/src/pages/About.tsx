
import Hero from "../components/Hero";

export default function About() {
  return (
    <>
      <Hero
        eyebrow="About"
        title={`Built for outcomes,<br/>run by operators`}
        subtitle="VictorySync blends Cairo operations with the right layer of AI to reduce cost, lift response times, and increase ROI—without sacrificing the customer experience."
        image="/assets/hero-about.webp"
        primary={{ label: "Get a Demo", to: "/demo" }}
        secondary={{ label: "Contact us", to: "/contact" }}
      />
      <section className="section">
        <div className="container narrow">
          <h2>Our principles</h2>
          <ol className="numbered">
            <li>Ship measurable outcomes in weeks, not months.</li>
            <li>Automate the boring; escalate the human.</li>
            <li>Bring your tools; we integrate and optimize.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
