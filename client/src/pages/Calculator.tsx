
import Hero from "../components/Hero";
import { useMemo, useState } from "react";

export default function Calculator() {
  const [missed, setMissed] = useState(400);
  const [aov, setAov] = useState(65);
  const [conv, setConv] = useState(0.23); // 23%
  const [capture, setCapture] = useState(0.6); // we capture 60% of missed

  const lostMonthly = useMemo(() => missed * conv * aov, [missed, conv, aov]);
  const recaptured = useMemo(() => lostMonthly * capture, [lostMonthly, capture]);
  const lostAnnual = lostMonthly * 12;
  const recapturedAnnual = recaptured * 12;

  return (
    <>
      <Hero
        eyebrow="Calculator"
        title={`Missed Calls Cost Calculator`}
        subtitle="Quantify the impact of slow response times and after-hours misses."
        image="/assets/hero-calculator.webp"
        primary={{ label: "Get a Demo", to: "/demo" }}
        secondary={{ label: "Resources", to: "/resources" }}
      />

      <section className="section">
        <div className="container grid cols-2 gap-24">
          <div className="panel form">
            <label>
              Missed calls / month
              <input type="number" value={missed} min={0} onChange={e => setMissed(+e.target.value)} />
            </label>
            <label>
              Average order value ($)
              <input type="number" value={aov} min={0} onChange={e => setAov(+e.target.value)} />
            </label>
            <label>
              Conversion rate (0–1)
              <input type="number" step="0.01" value={conv} min={0} max={1} onChange={e => setConv(+e.target.value)} />
            </label>
            <label>
              % we can capture (0–1)
              <input type="number" step="0.05" value={capture} min={0} max={1} onChange={e => setCapture(+e.target.value)} />
            </label>
          </div>
          <div className="panel stack gap-12">
            <h3>Estimated impact</h3>
            <div className="stat"><span>Monthly lost revenue</span><strong>${lostMonthly.toLocaleString()}</strong></div>
            <div className="stat"><span>We can recapture / month</span><strong>${recaptured.toLocaleString()}</strong></div>
            <div className="stat"><span>Annual lost revenue</span><strong>${lostAnnual.toLocaleString()}</strong></div>
            <div className="stat"><span>We can recapture / year</span><strong>${recapturedAnnual.toLocaleString()}</strong></div>
          </div>
        </div>
      </section>
    </>
  );
}
