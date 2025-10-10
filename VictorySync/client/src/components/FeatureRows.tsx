
import { Link } from 'react-router-dom'

const Row = ({ title, body, bullets, to, flip=false }:{
  title: string; body: string; bullets: string[]; to: string; flip?: boolean
}) => (
  <div className={`grid md:grid-cols-2 gap-10 items-center ${flip ? 'md:[&>div:first-child]:order-2' : ''}`}>
    <div className="rounded-2xl bg-white border border-slate-200 shadow-soft aspect-[4/3] grid place-items-center text-slate-400">
      <span className="text-sm">Image / Diagram</span>
    </div>
    <div>
      <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
      <p className="mt-3 text-slate-600">{body}</p>
      <ul className="mt-4 space-y-2 text-slate-700 list-disc list-inside">
        {bullets.map((b,i)=>(<li key={i}>{b}</li>))}
      </ul>
      <Link to={to} className="mt-5 inline-block link">Explore</Link>
    </div>
  </div>
)

export default function FeatureRows() {
  return (
    <section className="py-24">
      <div className="container space-y-20">
        <Row
          title="Real-Time Collaboration & CRM Sync"
          body="Keep teams aligned. Every call, chat, and ticket is logged with notes, tags, and recordings for instant handoffs."
          bullets={['@mentions & internal notes','Auto-log to HubSpot/Salesforce/Zoho','SLA timers & escalations']}
          to="/services/collaboration"
        />
        <Row
          title="Omnichannel Support & Outreach"
          body="Phone, chat, email, and SMS from one playbook. We resolve tickets and book meetings with clear scripts."
          bullets={['Inbound support + outbound booking','Warm transfers','Daily KPI report (AHT, CSAT, conversion)']}
          to="/services/omnichannel"
          flip
        />
        <Row
          title="AI Workflows & Journey Automation"
          body="Route every contact to the next best step. Automations score leads, trigger follow-ups, and personalize journeys."
          bullets={['Smart routing & auto follow-ups','Knowledge-base responses','Reactivation playbooks']}
          to="/automation"
        />
      </div>
    </section>
  )
}
