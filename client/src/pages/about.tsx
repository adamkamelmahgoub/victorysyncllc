
export default function About() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold">About VictorySync</h1>
          <p className="mt-2 text-slate-600">
            Cairo-based operations. U.S. clients. We extend your service hours, reduce response times, and lower cost with a trained team and smart automation.
          </p>
        </div>
        <div className="rounded-2xl border p-6 bg-slate-50">
          <p className="text-sm text-slate-700">Headquarters: NJ, USA • Ops: Cairo, Egypt</p>
          <p className="text-sm text-slate-700 mt-2">Contact: +1 (718) 813-2106 • victorysynccx@gmail.com</p>
        </div>
      </div>
    </section>
  );
}
