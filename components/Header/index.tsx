import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Headroom from 'react-headroom';
import { useMediaQuery } from 'react-responsive'

import styles from './Header.module.css';
import Link from '../Link';

const routes = ['Work', 'Events', 'Thoughts', 'Playlists', 'Contact'];

type HeaderProps = {
    onNavToggle: any,
}

const Header = ({
    onNavToggle,
}: HeaderProps) => {

    const laptop = useMediaQuery({ query: '(max-width: 991.98px)' });
    const [menuActive, setMenuActive] = useState(false);
    const router = useRouter();

    return (
        <Headroom>
            <nav className={`grid ${styles.navContainer}`}>
                <header className={`container ${styles.nav} ${menuActive ? styles.active : ''}`}>
                    <div className={styles.name}>
                        <Link href="/">Hayden Bleasel</Link>
                    </div>
                    <div className={styles.menu}>
                        <ul className={styles.sitemap}>
                            {routes.map((route) => (
                                <li className={router.pathname == `/${route.toLowerCase()}` ? styles.active : ""}>
                                    <Link href={`/${route.toLowerCase()}`} key={route.toLowerCase()}>{route}</Link>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.hamburgerContainer} onClick={() => {
                            setMenuActive(!menuActive);
                            laptop && onNavToggle();
                        }}>
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