
export default function RoiCta() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl font-bold">Prove the impact before you scale</h2>
          <p className="mt-2 text-slate-600">Run the numbers on seats, volume, and AHT—then book a live review.</p>
        </div>
        <div><a href="/roi" className="rounded-xl bg-primary px-5 py-3 text-white hover:bg-primary-600 transition">Open ROI Calculator</a></div>
      </div>
    </section>
  );
}
