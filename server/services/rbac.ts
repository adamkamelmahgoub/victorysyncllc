
export type Role = 'superAdmin'|'admin'|'manager'|'agent'|'customer';
export const roleRank: Record<Role, number> = { superAdmin: 5, admin: 4, manager: 3, agent: 2, customer: 1 };
export function authorize({ roles, minRole, permissions }:{ roles?:Role[], minRole?:Role, permissions?:string[] }) {
  return (req:any,res:any,next:any)=>{
    const u=req.user;
    if(!u) return res.status(401).json({ error:'Unauthenticated' });
    if(minRole && roleRank[u.role as Role] < roleRank[minRole]) return res.status(403).json({ error:'Forbidden' });
    if(roles && !roles.includes(u.role)) return res.status(403).json({ error:'Forbidden' });
    if(permissions && permissions.length){
      const has = (u.permissions||[]).some((p:string)=>permissions.includes(p));
      if(!has) return res.status(403).json({ error:'Forbidden' });
    }
    return next();
  }
}
