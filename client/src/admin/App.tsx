import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./LoginPage";
import OverviewPage from "./OverviewPage";
import { getToken } from "./auth";

// Simple guard: if no token, send to /admin/login
function ProtectedRoute() {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

// Minimal Admin layout — NOT the public navbar/footer
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">VictorySync Admin</div>
          <nav className="text-sm">
            <a href="/admin/overview" className="hover:underline">Overview</a>
            <span className="mx-2">•</span>
            <a href="/admin/logout" className="hover:underline">Logout</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      {/* /admin → /admin/login */}
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<LoginPage />} />

      {/* Protected section */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="overview"
          element={
            <AdminLayout>
              <OverviewPage />
            </AdminLayout>
          }
        />
        {/* Add more protected routes below, e.g. users, orgs, billing, etc. */}
      </Route>

      {/* Logout route: clears token then back to login */}
      <Route path="logout" element={<LogoutNow />} />

      {/* Fallback to /admin/login */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

function LogoutNow() {
  localStorage.removeItem("vs_token");
  return <Navigate to="/admin/login" replace />;
}