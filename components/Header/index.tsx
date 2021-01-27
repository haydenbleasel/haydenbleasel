import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './Header.module.css';

const routes = ['Work', 'Events', 'Blog', 'Playlists'];

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
                    {routes.map((route) => (
                        <Link href={`/${route.toLowerCase()}`} key={route.toLowerCase()}>
                            <a className={router.pathname == `/${route.toLowerCase()}` ? styles.active : ""}>{route}</a>
                        </Link>
                    ))}
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