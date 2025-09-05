
type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; };
export function Input({ label, hint, className = "", id, ...props }: Props) {
  const htmlId = id || `in_${label.replace(/\s+/g, "_")}`;
  return (
    <label htmlFor={htmlId} className="grid gap-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input id={htmlId} {...props}
        className={`rounded-xl border border-slate-300 px-3 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 ${className}`} />
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
