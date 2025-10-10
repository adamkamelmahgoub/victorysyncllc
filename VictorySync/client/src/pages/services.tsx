import Layout from './_Layout'
import { Link } from 'react-router-dom'

export default function Services() {
  return (
    <Layout>
      <section className="py-24">
        <div className="container space-y-6">
          <h1 className="text-4xl font-bold">Services</h1>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li><Link className="link" to="/services/collaboration">Real-Time Collaboration & CRM Sync</Link></li>
            <li><Link className="link" to="/services/omnichannel">Omnichannel Support & Outreach</Link></li>
            <li><Link className="link" to="/automation">AI Workflows & Journey Automation</Link></li>
          </ul>
        </div>
      </section>
    </Layout>
  )
}