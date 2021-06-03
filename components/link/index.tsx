import type { ReactNode } from "react";
import NextLink from "next/link";
import { resolveLink } from "../../utils/prismic";

type LinkProps = {
  href: PrismicLink;
  label?: string;
  children?: ReactNode;
};

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
