
import RoiCalculator from "../components/RoiCalculator";

export default function RoiCenter() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold">ROI Center</h1>
          <p className="mt-2 text-slate-600">
            Customers value fast answers and low effort—optimize voice for high-stakes issues, leverage AI for the simple ones, and measure what matters. Then track the savings. 
          </p>
        </div>
        <RoiCalculator />
      </div>
    </section>
  );
}
