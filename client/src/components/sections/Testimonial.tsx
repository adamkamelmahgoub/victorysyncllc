
export default function Testimonial() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <figure className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm vs-anim-in">
          <blockquote className="text-xl leading-relaxed text-slate-800">
            "VictorySync let us extend coverage overnight without sacrificing quality.
            Our response time dropped, CSAT rose, and costs stayed predictable."
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-4">
            <img src="/vs_avatar_128.png" alt="" className="h-12 w-12 rounded-full border border-slate-200" />
            <div>
              <div className="font-semibold">Operations Director</div>
              <div className="text-sm text-slate-500">U.S. SaaS company</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
