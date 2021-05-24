import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Headroom from "react-headroom";
import { Fade } from "react-awesome-reveal";
import { Squeeze as Hamburger } from "hamburger-react";
import useResponsive from "../../utils/responsive";

import styles from "./Header.module.css";
import Link from "../Link";

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

  return (
    <Headroom>
      <Fade triggerOnce>
        <nav className={`grid ${styles.navContainer}`}>
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
                {routes.map((route) => (
                  <li
                    className={
                      router.pathname == `/${route.toLowerCase()}`
                        ? styles.active
                        : ""
                    }
                  >
                    <Link
                      href={`/${route.toLowerCase()}`}
                      key={route.toLowerCase()}
                    >
                      {route}
                    </Link>
                  </li>
                ))}
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
        </nav>
      </Fade>
    </Headroom>
  );
};

export default Header;
