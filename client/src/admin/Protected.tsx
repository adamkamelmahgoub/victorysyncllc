
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiRequest";

export default function AdminProtected(){
  const [ok,setOk]=useState<boolean|null>(null);
  useEffect(()=>{
    const token = localStorage.getItem("vs_token")||"";
    if(!token) return setOk(false);
    apiRequest<{user:any}>("/api/auth/me",{ token }).then(()=>setOk(true)).catch(()=>setOk(false));
  },[]);
  if(ok===null) return null;
  return ok ? <Outlet/> : <Navigate to="/admin/login" replace />;
}
