import { Link, LinkProps } from "react-router-dom";
import React from "react";

type Props = {
  to: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const isInternal = (to: string) =>
  /^\/(?!\/)/.test(to) || to.startsWith("#"); // "/about", "/pricing", "#section"

export default function SmartLink({ to, children, className, newTab, ...rest }: Props) {
  return isInternal(to)
    ? <Link to={to} className={className} {...(rest as Omit<LinkProps, "to">)}>{children}</Link>
    : <a href={to} className={className} target={newTab ? "_blank" : rest.target} rel={newTab ? "noopener noreferrer" : rest.rel} {...rest}>{children}</a>;
}