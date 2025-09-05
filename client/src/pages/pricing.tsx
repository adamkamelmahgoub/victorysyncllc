
import Button from "../components/ui/Button";
import { useCartContext } from "../contexts/CartContext";

export default function Pricing() {
  const { add } = useCartContext();
  const plans = [
    { id: "starter", title: "Starter", price: 899, features: ["Email + Chat", "Basic QA", "Next-business-day"] },
    { id: "growth", title: "Growth", price: 1999, features: ["Omnichannel", "QA & Coaching", "Same-day"] },
    { id: "enterprise", title: "Enterprise", price: 4999, features: ["24/7 with Voice", "Advanced Analytics", "Premium SLA"] },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center">Transparent pricing</h1>
      <p className="text-center text-slate-600 mt-2">Scale up or down monthly. Cancel anytime.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {plans.map(p => (
          <div key={p.id} className="rounded-2xl border border-slate-200 p-6 bg-white hover:shadow-md transition">
            <div className="flex items-baseline justify-between">
              <div className="text-xl font-semibold">{p.title}</div>
              <div className="text-2xl font-bold">${p.price}/mo</div>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-slate-600">
              {p.features.map(f => <li key={f}>• {f}</li>)}
            </ul>
            <Button className="mt-6 w-full" onClick={() => add(p.id, 1, p.title)}>Add to Plan</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
