
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};
export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = "rounded-xl px-5 py-3 transition transform active:translate-y-0 focus-visible:outline-none";
  const map = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5",
    secondary: "border border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  } as const;
  return <button {...props} className={`${base} ${map[variant]} ${className}`} />;
}
