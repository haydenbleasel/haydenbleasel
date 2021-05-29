import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Headroom from "react-headroom";
import { Squeeze as Hamburger } from "hamburger-react";

import styles from "./header.module.css";
import Link from "../link";
import Section from "../section";

const routes = ["Home", "About", "Work", "Journal", "Projects", "Contact"];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { pathname } = useRouter();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    document.body.style.position = menuOpen ? "fixed" : "unset";
    document.body.style.width = menuOpen ? "100vw" : "unset";
  }, [menuOpen]);

  function NavItem(route: string) {
    let url = `/${route.toLowerCase()}`;

    if (url === "/home") {
      url = "/";
    }

    return (
      <li
        key={route}
        className={`small ${pathname == url ? styles.active : ""}`}
      >
        <Link href={url}>{route}</Link>
      </li>
    );
  }

  return (
    <Headroom style={{ zIndex: 999, height: 102 }}>
      <nav className={styles.container}>
        <Section>
          <header className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
            <div className={styles.logo}>
              <Link href="/">
                <Image
                  src="/images/logo.svg"
                  alt="Hayden Bleasel"
                  layout="fixed"
                  width={54}
                  height={16}
                  priority
                />
              </Link>
            </div>
            <div className={styles.menu}>
              <ul className={styles.sitemap}>{routes.map(NavItem)}</ul>
              <div className={styles.hamburger}>
                <Hamburger
                  size={20}
                  toggled={menuOpen}
                  toggle={(open) => setMenuOpen(open)}
                  color="var(--black)"
                  label="Show menu"
                />
              </div>
            </div>
          </header>
        </Section>
      </nav>
    </Headroom>
  );
};

export default Header;
