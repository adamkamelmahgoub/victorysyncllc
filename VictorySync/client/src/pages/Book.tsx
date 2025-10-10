
import Layout from './_Layout'
export default function Book() {
  return (
    <Layout>
      <section className="py-24">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold">Book a 15-min Intro</h1>
          <p className="mt-3 text-slate-600">Pick a time that works. (Replace with your Calendly embed.)</p>
          <div className="mt-8 aspect-video rounded-xl border border-slate-200 grid place-items-center text-slate-400">
            Calendly / booking iframe goes here
          </div>
        </div>
      </section>
    </Layout>
  )
}
