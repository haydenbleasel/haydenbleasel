import NextLink from "next/link";
import { resolveLink } from "../../utils/prismic";
import type { AnchorHTMLAttributes } from "react";

type LinkProps = {
  href: PrismicLink;
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const Link = ({ children, href, ...props }: LinkProps) => {
  const url = resolveLink(href);

  return url.startsWith("/") ? (
    <NextLink href={url} {...props}>
      <a>{children}</a>
    </NextLink>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

export default Link;
