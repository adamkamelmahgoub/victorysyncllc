
import { PropsWithChildren } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const items = [
  { to: "/admin/overview", label: "Overview" },
  { to: "/admin/users", label: "Users & Roles" },
  { to: "/admin/access-codes", label: "Access Codes" },
  { to: "/admin/billing", label: "Billing" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/integrations", label: "Integrations" },
  { to: "/admin/api-keys", label: "API Keys" },
  { to: "/admin/webhooks", label: "Webhooks" },
  { to: "/admin/audit", label: "Audit & Health" },
];

export default function AdminShell({ children }: PropsWithChildren) {
  const nav = useNavigate();
  function logout(){
    localStorage.removeItem("vs_token");
    nav("/admin/login");
  }
  return (
    <div className="vs-admin min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r">
        <div className="vs-gradient text-white px-4 py-4 font-semibold">VictorySync Admin</div>
        <nav className="p-2 space-y-1">
          {items.map(i=>(
            <NavLink
              key={i.to}
              to={i.to}
              className={({isActive}) => `block rounded-md px-3 py-2 ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
            >{i.label}</NavLink>
          ))}
          <button onClick={logout} className="mt-4 text-left w-full rounded-md px-3 py-2 hover:bg-gray-50">Logout</button>
        </nav>
      </aside>
      <main>
        <div className="vs-gradient text-white px-6 py-6">
          <h1 className="text-2xl font-semibold">Admin Portal</h1>
          <p className="opacity-90">Internal tools for operations</p>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
