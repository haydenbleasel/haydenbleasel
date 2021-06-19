import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Headroom from "react-headroom";
import { Squeeze as Hamburger } from "hamburger-react";
import classNames from 'classnames/bind';

import styles from "./header.module.css";
import Link from "../link";
import Section from "../section";
import { resolveLink } from "../../utils/prismic";

type IHeader = {
  settings: PrismicSettings;
}

const cx = classNames.bind(styles);

const Header = ({ settings }: IHeader) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { pathname } = useRouter();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    document.body.style.position = menuOpen ? "fixed" : "unset";
    document.body.style.width = menuOpen ? "100vw" : "unset";
  }, [menuOpen]);

  function NavItem({ sitemap_label, sitemap_link }) {
    return (
      <li
        key={sitemap_label}
        className={`smallSans ${pathname == resolveLink(sitemap_link) ? styles.active : ""}`}
      >
        <Link href={sitemap_link}>{sitemap_label}</Link>
      </li>
    );
  }

  return (
    <Headroom style={{ zIndex: 999, height: 102 }}>
      <nav className={styles.container}>
        <Section>
          <header className={cx('nav', { menuOpen })}>
            <div className={styles.logo}>
              <Link href={settings.logo_link}>
                <Image
                  src={settings.logo.url}
                  alt="Hayden Bleasel"
                  layout="fixed"
                  width={54}
                  height={16}
                  priority
                />
              </Link>
            </div>
            <div className={styles.menu}>
              <ul className={styles.sitemap}>
                {settings.header_sitemap.map(NavItem)}
              </ul>
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
