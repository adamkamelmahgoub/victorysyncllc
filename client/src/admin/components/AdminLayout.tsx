
import { Link, useLocation } from "wouter"

const NAV = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/orgs", label: "Orgs" },
  { to: "/admin/flags", label: "Flags" },
  { to: "/admin/access", label: "Access" },
  { to: "/admin/billing", label: "Billing" },
  { to: "/admin/apikeys", label: "API Keys" },
  { to: "/admin/webhooks", label: "Webhooks" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/integrations", label: "Integrations" },
  { to: "/admin/mfa", label: "MFA (2FA)" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/health", label: "Health" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pathname] = useLocation()
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="font-semibold">VictorySync Admin</div>
          <nav className="flex items-center gap-4">
            {NAV.map(n=>{
              const active = n.exact ? pathname===n.to : pathname.startsWith(n.to)
              return <Link key={n.to} href={n.to} className={`text-sm ${active?"text-black font-semibold":"text-gray-600 hover:text-gray-900"}`}>{n.label}</Link>
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
