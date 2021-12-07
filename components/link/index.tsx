import type { AnchorHTMLAttributes, FC } from "react";
import NextLink from "next/link";

type LinkProps = {
  href: string;
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const Link: FC<LinkProps> = ({ children, href, ...props }) => href.startsWith("/") ? (
  <NextLink href={href}>
    <a {...props}>{children}</a>
  </NextLink>
) : (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
);
export default Link;
