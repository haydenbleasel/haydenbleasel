import React, { ReactNode } from 'react';
import NextLink from 'next/link';

type LinkProps = {
    href: string,
    label?: string,
    children?: ReactNode,
}

const Link = ({ children, href, label, ...props }: LinkProps) => (
    href.startsWith('/') ? (
        <NextLink href={href} {...props}>
            <a aria-label={label}>{children}</a>
        </NextLink>
    ) : (
        <a href={href} rel="noopener noreferrer" aria-label={label} {...props}>{children}</a>
    )  
);

export default Link;