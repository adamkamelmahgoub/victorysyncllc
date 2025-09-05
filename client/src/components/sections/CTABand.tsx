
import { Link } from "react-router-dom";

export default function CTABand() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-indigo-600 text-white p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 vs-anim-in">
          <div>
            <h2 className="text-2xl font-bold">Ready to modernize your contact center?</h2>
            <p className="mt-1 text-indigo-100">Get a tailored plan, pricing, and a quick ROI model.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/contact" className="rounded-xl bg-white text-indigo-700 px-5 py-3 font-semibold hover:bg-indigo-50 transition">
              Get a Demo
            </Link>
            <Link to="/pricing" className="rounded-xl bg-indigo-500 px-5 py-3 hover:bg-indigo-500/90 transition">
              See Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
