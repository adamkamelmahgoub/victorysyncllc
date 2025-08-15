
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import NotFound from "@/pages/NotFound";

/**
 * Auto-map files in /pages to routes:
 * - Home.tsx or /pages/Home.tsx          -> "/"
 * - /pages/Index.tsx                     -> "/"
 * - /pages/About.tsx                     -> "/about"
 * - /pages/blog/Index.tsx                -> "/blog"
 * - /pages/blog/Post.tsx                 -> "/blog/post"
 * - /pages/blog/[slug].tsx               -> "/blog/:slug"
 * NOTE: exclude NotFound from auto list; we wire it explicitly.
 */

type Loader = () => Promise<{ default: React.ComponentType<any> }>;
const pageModules = import.meta.glob("./pages/**/*.tsx") as Record<string, Loader>;

function fileToPath(file: string): string {
  // strip "./pages" prefix and ".tsx" suffix
  let p = file.replace("./pages", "").replace(/\.tsx$/, "");
  // remove trailing /Index or /index, map Home to root
  p = p.replace(/\/?Index$/i, "");
  if (/^\/Home$/i.test(p)) p = "";
  // transform [param] -> :param
  p = p.replace(/\[([^\]]+)\]/g, ":$1");
  // ensure leading slash; lower-case for consistency
  p = (p ? p : "/").toLowerCase();
  return p;
}

const autoRoutes = Object.entries(pageModules)
  .map(([file, loader]) => ({ path: fileToPath(file), Component: lazy(loader) }))
  .filter(r => r.path !== "/404" && r.path !== "/notfound"); // we add NotFound explicitly

export default function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<RootLayout />}>
          {/* index route ("/") */}
          {autoRoutes
            .filter(r => r.path === "/")
            .map(({ path, Component }) => (
              <Route key={path} index element={<Component />} />
            ))}

          {/* all other routes */}
          {autoRoutes
            .filter(r => r.path !== "/")
            .map(({ path, Component }) => (
              <Route key={path} path={path.slice(1)} element={<Component />} />
            ))}

          {/* 404 */}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
