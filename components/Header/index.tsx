import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Headroom from "react-headroom";
import { Fade } from "react-awesome-reveal";
import { Squeeze as Hamburger } from "hamburger-react";
import useResponsive from "../../utils/responsive";

import styles from "./Header.module.css";
import Link from "../Link";
import Section from "../Section";

const routes = ["Home", "About", "Work", "Journal", "Projects", "Contact"];

type HeaderProps = {
  onNavToggle: any;
};

const Header = ({ onNavToggle }: HeaderProps) => {
  const [menuActive, setMenuActive] = useState(false);
  const router = useRouter();
  const { isLaptop } = useResponsive();

  function toggleMenuActive(active) {
    setMenuActive(active);
    isLaptop && onNavToggle();
  }

  function NavItem(route: string) {
    let url = `/${route.toLowerCase()}`;

    if (url === '/home') {
      url = '/';
    }

    return (
      <li
        key={route}
        className={`small ${
          router.pathname == url ? styles.active : ""
        }`}
      >
        <Link href={url}>{route}</Link>
      </li>
    );
  }

  return (
    <Headroom>
      <Fade triggerOnce>
        <nav className={styles.navContainer}>
          <Section>
            <header
              className={`container ${styles.nav} ${
                menuActive ? styles.active : ""
              }`}
            >
              <div className={styles.name}>
                <Link href="/">
                  <Image
                    src="/images/logo.svg"
                    alt="Hayden Bleasel"
                    layout="fixed"
                    width={54}
                    height={16}
                  />
                </Link>
              </div>
              <div className={styles.menu}>
                <ul className={styles.sitemap}>
                  {routes.map(NavItem)}
                </ul>
                {isLaptop && (
                  <div className={styles.hamburgerContainer}>
                    <Hamburger
                      size={20}
                      toggled={menuActive}
                      toggle={toggleMenuActive}
                      color="var(--black)"
                      label="Show menu"
                    />
                  </div>
                )}
              </div>
            </header>
          </Section>
        </nav>
      </Fade>
    </Headroom>
  );
};

export default Header;
