import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './Header.module.css';

const Header = () => {

    const [menuActive, setMenuActive] = useState(false);
    const router = useRouter();

    return (
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
    );
}

export default Header;