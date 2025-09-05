
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { Link } from "react-router-dom";

type Resource = { id: string; title: string; type: string; href: string };

export default function Resources() {
  const [items, setItems] = useState<Resource[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await apiRequest<{ items: Resource[] }>("GET", "/resources");
        setItems(r.items);
      } catch (e: any) { setErr(e.message); }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Resources</h1>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(it => (
          <Link key={it.id} to={`/resources/${it.id}`} className="rounded-2xl border p-5 hover:shadow-md transition bg-white">
            <div className="text-sm text-slate-500 uppercase">{it.type}</div>
            <div className="font-semibold">{it.title}</div>
            <div className="text-indigo-600 mt-2 text-sm">Open →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
