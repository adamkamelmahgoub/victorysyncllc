
export default function LogoProof() {
  const logos = Array.from({ length: 6 }).map((_, i) => i);
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-sm text-slate-500">Trusted by modern CX teams</div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center opacity-80">
          {logos.map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-md vs-float" aria-hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
