import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

import styles from './Layout.module.css';

type Props = {
  children?: ReactNode
  title?: string
}

const socialIcons = [
  { name: 'Spotify', url: 'https://open.spotify.com/user/haydenbleasel' },
  { name: 'Twitter', url: 'https://twitter.com/haydenbleasel' },
  { name: 'Dribbble', url: 'https://dribbble.com/haydenbleasel' },
  { name: 'Instagram', url: 'https://www.instagram.com/hayden.bleasel/' },
  { name: 'GitHub', url: 'https://github.com/haydenbleasel/' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/haydenbleasel' },
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
    
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <Image
          layout="fixed"
          width={20}
          height={20}
          src="/images/newsletter.svg"
        />
        <p className={styles.newsletterHeading}>Join my private mailing list and get notified when I publish a new product or article.</p>
        <input className={styles.newsletterInput} type="email" placeholder="janesmith@example.com" />
      </div>
      <div className={styles.social}>
        {socialIcons.map((platform) => (
          <a
            className={styles.socialIcon}
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              alt={platform.name}
              layout="fixed"
              width={16}
              height={16}
              src={`/images/social/${platform.name.toLowerCase()}.svg`}
            />
          </a>
        ))}
      </div>
      <small className={styles.copyright}>&copy; Hayden Bleasel 2077</small>
    </footer>
  </div>
);

export default Layout;