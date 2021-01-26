import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

type Props = {
  children?: ReactNode
  title?: string
}

const socialIcons = [
  'Spotify',
  'Twitter',
  'Dribbble',
  'Instagram',
  'GitHub',
  'LinkedIn'
];

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    
    <header>
      <nav>
        <Link href="/">
          <a>Hayden Bleasel</a>
        </Link>
        <span>Menu</span>
      </nav>
    </header>

    {children}
    
    <footer>
      <div className="newsletter">
        <Image
          layout="fixed"
          width={20}
          height={20}
          src="/public/newsletter.svg"
        />
        <p className="newsletter-heading">Join my private mailing list and get notified when I publish a new product or article.</p>
        <input type="email" placeholder="janesmith@example.com" />
      </div>
      <div className="social">
        {socialIcons.map((platform) => (
          <div key={platform}>
            <Image
              alt={platform}
              layout="fixed"
              width={16}
              height={16}
              src={`/public/social/${platform.toLowerCase()}.svg`}
            />
          </div>
        ))}
      </div>
      <span>&copy; Hayden Bleasel 2077</span>
    </footer>
  </div>
);

export default Layout;