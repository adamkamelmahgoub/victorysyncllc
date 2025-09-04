
export default function Platform() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-bold">Open by Default</h1>
        <p className="text-slate-600 max-w-3xl">
          VictorySync connects your CRM, dialer, helpdesk and reporting. Smart routing directs simple issues to self-service and urgent ones to trained agents. QA and analytics drive continuous improvement.
        </p>
        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold mb-2">High-Level Flow</h3>
          <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-1">
            <li>Inbound channel (voice/chat/email/webhook) identifies intent.</li>
            <li>Router → self-service or best-fit agent.</li>
            <li>Agent assist & knowledge → faster, accurate answers.</li>
            <li>Auto-summary + QA scorecards → coaching & reports.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
