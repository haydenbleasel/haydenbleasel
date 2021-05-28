import type { ReactNode } from "react";
import NextLink from "next/link";

type LinkProps = {
  href: string;
  label?: string;
  children?: ReactNode;
};

const Link = ({ children, href, ...props }: LinkProps) =>
  href.startsWith("/") ? (
    <NextLink href={href} {...props}>
      <a>{children}</a>
    </NextLink>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );

export default Link;
