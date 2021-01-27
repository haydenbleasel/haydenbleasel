import React, { FormEvent, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { Notyf } from 'notyf';

import 'notyf/notyf.min.css';
import styles from './Layout.module.css';

type LayoutProps = {
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

const Layout = ({
  children,
  title = 'This is the default title'
}: LayoutProps) => {

  const [menuActive, setMenuActive] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  async function joinMailingList(event: FormEvent) {
    event.preventDefault();

    const response = await fetch('/api/revue', {
      method: 'post',
      body: JSON.stringify({ email }),
    });

    const body = await response.json();
    const notyf = new Notyf();

    if (body.success) {
      notyf.success({
        message: 'Nice one! Check your email for a confirmation.',
        duration: 5000,
        icon: false,
      });
    } else {
      notyf.error({
        message: 'Sorry, something went wrong.',
        duration: 5000,
        icon: false,
      });
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      <div className={styles.grid}>
        <div className={styles.container}>
          
          <header className={`${styles.nav} ${menuActive ? styles.active : ''}`}>
            <Link href="/">
              <a>Hayden Bleasel</a>
            </Link>
            <div className={styles.menu}>
              <div className={styles.sitemap}>
                <Link href="/work">
                  <a className={router.pathname == "/work" ? styles.active : ""}>Work</a>
                </Link>
                <Link href="/events">
                  <a className={router.pathname == "/events" ? styles.active : ""}>Events</a>
                </Link>
                <Link href="/blog">
                  <a className={router.pathname == "/blog" ? styles.active : ""}>Blog</a>
                </Link>
              </div>
              <div className={styles.hamburgerContainer} onClick={() => setMenuActive(!menuActive)}>
                <div className={styles.hamburger}>
                  <span>Menu</span>
                </div>
              </div>
            </div>
          </header>

          {children}
          
          <footer className={styles.footer}>
            <form className={styles.newsletter} onSubmit={joinMailingList}>
              <Image
                layout="fixed"
                width={20}
                height={20}
                src="/images/newsletter.svg"
              />
              <p className={styles.newsletterHeading}>Join my private mailing list and get notified when I publish a new product or article.</p>
              <input
                required
                className={styles.newsletterInput}
                type="email"
                placeholder="janesmith@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">&rarr;</button>
            </form>
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
      </div>
    </>
  );
}

export default Layout;