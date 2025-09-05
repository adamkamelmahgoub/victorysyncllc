
import Hero from "../components/Hero";

export default function SignIn() {
  return (
    <>
      <Hero
        eyebrow="Account"
        title={`Sign in to your<br/>VictorySync account`}
        subtitle="Admins can view analytics, playbooks, and QA."
        image="/assets/hero-signin.webp"
        primary={{ label: "Request access", to: "/contact" }}
        secondary={{ label: "Back home", to: "/" }}
      />
      <section className="section">
        <div className="container narrow">
          <form className="panel form">
            <label>Email <input type="email" placeholder="you@company.com" /></label>
            <label>Password <input type="password" placeholder="********" /></label>
            <button className="btn primary" type="button">Sign in</button>
          </form>
        </div>
      </section>
    </>
  );
}
