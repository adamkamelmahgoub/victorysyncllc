
import { useNavigate } from "react-router-dom"; import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { to: string; replace?: boolean; };
export default function NavButton({ to, replace, children, ...rest }: Props) {
  const navigate = useNavigate();
  return <button {...rest} onClick={e=>{rest.onClick?.(e); if(!e.defaultPrevented) navigate(to,{replace});}}>{children}</button>;
}
