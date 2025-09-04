
import { useParams, Link } from "react-router-dom";

const MAP: Record<string, { h: string; p: string; href?: string }> = {
  "after-hours-playbook": {
    h: "After-Hours Playbook",
    p: "How to capture missed revenue with blended on-call coverage.",
    href: "/resources/after-hours.pdf"
  },
  "qa-scorecard": {
    h: "QA Scorecard Template",
    p: "What to measure and how to coach for consistent outcomes.",
    href: "/resources/qa-scorecard.pdf"
  },
  "missed-calls-calculator": {
    h: "Missed Calls Cost Calculator",
    p: "Quantify the impact of slow response times.",
    href: "/roi"
  }
};

export default function ResourceDetail() {
  const { slug } = useParams();
  const res = slug ? MAP[slug] : undefined;

  if (!res) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold">Resource not found</h1>
        <Link to="/resources" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-white">Back to Resources</Link>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold">{res.h}</h1>
        <p className="mt-2 text-slate-600">{res.p}</p>
        {res.href && (
          <a href={res.href} className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 transition">
            Open
          </a>
        )}
      </div>
    </section>
  );
}
