import React from "react";
import { Link } from "react-router-dom";

interface SmartLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function SmartLink({ href, children, className, target, rel }: SmartLinkProps) {
  // Guard against undefined href
  if (!href) {
    return <span className={className}>{children}</span>;
  }

  // External link
  if (href.startsWith("http")) {
    return (
      <a href={href} className={className} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  // Internal link
  return (
    <Link to={href} className={className} target={target} rel={rel}>
      {children}
    </Link>
  );
}