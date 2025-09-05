
import Hero from "../components/Hero";

export default function Contact() {
  return (
    <>
      <Hero
        eyebrow="Contact"
        title={`Say hello to VictorySync`}
        subtitle="We typically reply within 1 business day."
        image="/assets/hero-contact.webp"
        primary={{ label: "Pricing", to: "/pricing" }}
        secondary={{ label: "Resources", to: "/resources" }}
      />
      <section className="section">
        <div className="container narrow">
          <form className="panel form">
            <label>Full name <input placeholder="Your name" /></label>
            <label>Email <input type="email" placeholder="you@company.com" /></label>
            <label>Message <textarea rows={5} placeholder="Tell us a bit about your needs..." /></label>
            <button className="btn primary" type="button">Send</button>
          </form>
        </div>
      </section>
    </>
  );
}
