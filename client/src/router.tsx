
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import NotFound from "@/pages/not-found";

type Loader = () => Promise<{ default: React.ComponentType<any> }>;
const pageModules = import.meta.glob("./pages/**/*.tsx") as Record<string, Loader>;

function fileToPath(file: string): string {
  let p = file.replace("./pages", "").replace(/\.tsx$/, "");
  p = p.replace(/\/?index$/i, "");
  if (/^\/home$/i.test(p)) p = "";
  p = p.replace(/\[([^\]]+)\]/g, ":$1");   // [slug] -> :slug
  p = (p ? p : "/").toLowerCase();
  return p;
}

const autoRoutes = Object.entries(pageModules)
  .map(([file, loader]) => ({ path: fileToPath(file), Component: lazy(loader) }))
  .filter(r => r.path !== "/404" && r.path !== "/notfound" && r.path !== "/not-found");

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Routes>
        <Route element={<RootLayout />}>
          {autoRoutes.filter(r => r.path === "/").map(({ path, Component }) =>
            <Route key={path} index element={<Component />} />
          )}
          {autoRoutes.filter(r => r.path !== "/").map(({ path, Component }) =>
            <Route key={path} path={path.slice(1)} element={<Component />} />
          )}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
