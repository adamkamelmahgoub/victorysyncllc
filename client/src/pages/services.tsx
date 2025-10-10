import { Link } from 'react-router-dom'

const Card = ({ title, body, to, icon }: { title: string; body: string; to: string; icon: React.ReactNode }) => (
  <div className="card-dark">
    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-slate-300">{body}</p>
    <Link to={to} className="mt-4 inline-flex items-center gap-2 text-brand-purple hover:text-white">
      Explore <span aria-hidden>→</span>
    </Link>
  </div>
)

export default function ServicesBand() {
  return (
    <section className="py-24 bg-brand-navy text-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Impactful customer service for business</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <Card
            title="24/7 Customer Support"
            body="Reduce response times and boost CSAT with always-on phone, chat, and email. SLA-backed agents with ticketing & escalations."
            to="/services"
            icon={<svg width="20" height="20" fill="currentColor" className="text-white/80"><path d="M10 2a6 6 0 0 0-6 6v2a2 2 0 0 0 2 2h1v-4H6a4 4 0 1 1 8 0h-1v4h1a2 2 0 0 0 2-2V8a6 6 0 0 0-6-6z"/></svg>}
          />
          <Card
            title="Outbound Sales & Marketing"
            body="Qualify leads, book meetings, and run compliant outreach with clear playbooks and pipeline reporting."
            to="/services/omnichannel"
            icon={<svg width="20" height="20" fill="currentColor" className="text-white/80"><path d="M3 3h14v4H3zM3 9h9v8H3zM14 9h3v8h-3z"/></svg>}
          />
          <Card
            title="Journey Optimization"
            body="Map journeys, automate follow-ups, and personalize touchpoints; dashboards reveal bottlenecks and next best actions."
            to="/automation"
            icon={<svg width="20" height="20" fill="currentColor" className="text-white/80"><path d="M4 4h12v3H4zM4 9h7v3H4zM4 14h10v3H4z"/></svg>}
          />
        </div>
      </div>
    </section>
  )
}
