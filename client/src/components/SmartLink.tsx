
import React from "react";
import { Link, LinkProps } from "react-router-dom";

type Props = {
  to: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const isInternal = (to: string) => {
  if (!to) return false;
  return /^\/(?!\/)/.test(to) || to.startsWith("#");
};

export default function SmartLink({ to, children, className, newTab, ...rest }: Props) {
  if (!to) return <span className={className}>{children}</span>;
  
  return isInternal(to)
    ? <Link to={to} className={className} {...(rest as Omit<LinkProps,"to">)}>{children}</Link>
    : <a href={to} className={className} target={newTab ? "_blank" : rest.target}
         rel={newTab ? "noopener noreferrer" : rest.rel} {...rest}>{children}</a>;
}
