import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import NotFound from "@/pages/not-found";

type Loader = () => Promise<{ default: React.ComponentType<any> }>;
const pageModules = import.meta.glob("./pages/**/*.tsx") as Record<string, Loader>;
function fileToPath(file:string){ let p=file.replace("./pages","").replace(/\.tsx$/,""); p=p.replace(/\/?Index$/i,""); if(/^\/Home$/i.test(p)) p=""; p=p.replace(/\[([^\]]+)\]/g,":$1"); return (p? p: "/").toLowerCase(); }
const auto = Object.entries(pageModules).map(([f,l])=>({ path:fileToPath(f), C:lazy(l)})).filter(r=>!["/404","/notfound"].includes(r.path));

export default function AppRouter(){
  return (<Suspense fallback={null}>
    <Routes>
      <Route element={<RootLayout/>}>
        {auto.filter(r=>r.path==="/").map(({C},i)=><Route key={i} index element={<C/>}/>)}
        {auto.filter(r=>r.path!=="/").map(({path,C})=><Route key={path} path={path.slice(1)} element={<C/>}/>)}
        <Route path="404" element={<NotFound/>}/><Route path="*" element={<Navigate to="/404" replace/>}/>
      </Route>
    </Routes>
  </Suspense>);
}