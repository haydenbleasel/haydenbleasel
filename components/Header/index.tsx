import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Headroom from 'react-headroom';

import styles from './Header.module.css';

const routes = ['Work', 'Events', 'Thoughts', 'Playlists', 'Contact'];

const Header = () => {

    const [menuActive, setMenuActive] = useState(false);
    const router = useRouter();

    return (
        <Headroom>
            <nav className={`grid ${styles.navContainer}`}>
                <header className={`container ${styles.nav} ${menuActive ? styles.active : ''}`}>
                    <Link href="/">
                        <a className={styles.name}>Hayden Bleasel</a>
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
            </nav>
        </Headroom>
    );
}

export default Header;