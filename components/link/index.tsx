import type { AnchorHTMLAttributes } from "react";
import NextLink from "next/link";
import { resolveLink } from "../../utils/prismic";

type LinkProps = {
  href: PrismicLink | string;
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const Link = ({ children, href, ...props }: LinkProps) => {
  const url = typeof href === 'string' ? href : resolveLink(href);

  return url.startsWith("/") ? (
    <NextLink href={url}>
      <a {...props}>{children}</a>
    </NextLink>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

export default Link;
