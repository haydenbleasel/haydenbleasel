import type { ReactNode } from "react";
import { richtext } from "../../utils/prismic";
import styles from "./section.module.css";

type ISection = {
  title?: PrismicRichText;
  style?: any;
  children: ReactNode;
};

const Section = ({ title, style = {}, children }: ISection) => (
  <section className={styles.grid} style={style}>
    {!!title && (
      <h2 className={styles.sectionHeader} dangerouslySetInnerHTML={{ __html: richtext(title, true) }} />
    )}
    {children}
  </section>
);

export default Section;
