
import ResourceList from "../components/ResourceList";

export default function Resources() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="mt-2 text-slate-600">Playbooks, templates, and calculators to help you scale CX.</p>
        <div className="mt-6"><ResourceList /></div>
      </div>
    </section>
  );
}
