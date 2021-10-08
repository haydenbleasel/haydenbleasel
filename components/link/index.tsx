import type { AnchorHTMLAttributes } from "react";
import NextLink from "next/link";

type LinkProps = {
  href: string;
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const Link = ({ children, href, ...props }: LinkProps) => href.startsWith("/") ? (
  <NextLink href={href}>
    <a {...props}>{children}</a>
  </NextLink>
) : (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
);
export default Link;
