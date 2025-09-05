
import Hero from "../components/Hero";

export default function Demo() {
  return (
    <>
      <Hero
        eyebrow="Get a tailored demo"
        title={`See VictorySync in action`}
        subtitle="Share a bit about your stack and targets; we'll tailor a walkthrough."
        image="/assets/hero-demo.webp"
        secondary={{ label: "Pricing", to: "/pricing" }}
        primary={{ label: "Calculator", to: "/calculator" }}
      />
      <section className="section">
        <div className="container narrow">
          <form className="panel form">
            <label>Full name <input placeholder="Alex Doe" /></label>
            <label>Work email <input type="email" placeholder="alex@brand.com" /></label>
            <label>Company <input placeholder="Brand Inc." /></label>
            <label>What are you hoping to achieve? <textarea rows={4} /></label>
            <button className="btn primary" type="button">Request Demo</button>
          </form>
        </div>
      </section>
    </>
  );
}
