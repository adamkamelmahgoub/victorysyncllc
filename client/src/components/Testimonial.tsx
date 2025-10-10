export default function Testimonial() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="rounded-2xl border border-slate-200 p-8 md:p-10 bg-white shadow-soft">
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-full bg-slate-200" />
            <div>
              <p className="text-lg text-slate-700">
                “VictorySync shortened our response time and doubled weekly
                meetings in the first month. Reporting lives in our CRM.”
              </p>
              <p className="mt-3 text-sm text-slate-500">
                N. Kumar — Operations Lead
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
