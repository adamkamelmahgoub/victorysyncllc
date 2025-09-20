import { useEffect, useState } from "react";
import { getEntitlements, checkout } from "./lib/api";
import CrispLoader from "./components/CrispLoader";
import Booker from "./components/Booker";

export default function App() {
  const [features, setFeatures] = useState<string[]>([]);
  useEffect(() => { getEntitlements().then(r => setFeatures(r.features)); }, []);
  const can = (f: string) => features.includes(f);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">VictorySync</h1>
        <div className="text-sm opacity-70">Org: <code>{localStorage.getItem("orgId") || "unset"}</code></div>
      </header>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Starter" price="$1,200" features={["1 Dedicated Agent","Business Hours","Basic CRM","Email","Monthly Reports"]} onClick={() => checkout("starter")} />
          <Card title="Growth" price="$2,500" popular features={["2 Agents","Extended Hours","Appointments","Advanced CRM","Live Chat","Weekly Reports"]} onClick={() => checkout("growth")} />
          <Card title="Scale" price="$4,500" cta="Get a quote" disabled onClick={() => alert("We'll contact you for a custom quote.")} />
        </div>
      </section>

      <section className="my-10">
        <h3 className="text-lg font-semibold mb-3">Book an Appointment (Growth+)</h3>
        <Booker enabled={can("appointments")} />
      </section>

      <CrispLoader enabled={can("live_chat")} />
    </main>
  );
}

function Card({ title, price, features, onClick, cta = "Add to Cart", popular=false, disabled=false }:{
  title:string; price:string; features?:string[]; onClick:()=>void; cta?:string; popular?:boolean; disabled?:boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${popular ? "ring-2 ring-purple-500" : ""}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">{title}</h4>
        {popular && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Most Popular</span>}
      </div>
      <div className="mt-2 text-3xl font-bold">{price}<span className="text-base font-medium opacity-60">/month</span></div>
      {features && <ul className="mt-4 space-y-2 text-sm">
        {features.map(f => <li key={f} className="flex items-center gap-2">✅ <span>{f}</span></li>)}
      </ul>}
      <button
        disabled={disabled}
        onClick={onClick}
        className={`mt-6 w-full rounded-md py-2 font-medium ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"}`}>
        {cta}
      </button>
    </div>
  );
}