
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";

type Resource = { id: string; title: string; type: string; href: string };

export default function ResourceDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<Resource | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!slug) return;
        const r = await apiRequest<{ item: Resource }>("GET", `/resources/${slug}`);
        setItem(r.item);
      } catch (e: any) { setErr(e.message); }
    })();
  }, [slug]);

  if (err) return <div className="mx-auto max-w-xl p-8 text-red-600">{err}</div>;
  if (!item) return <div className="mx-auto max-w-xl p-8">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 grid gap-4">
      <h1 className="text-3xl font-bold">{item.title}</h1>
      <a className="text-indigo-600 hover:text-indigo-700 underline" href={item.href} target="_blank" rel="noreferrer">Open file</a>
    </div>
  );
}
