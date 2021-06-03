import type { ReactNode } from "react";
import { richtext } from "../../utils/prismic";
import styles from "./section.module.css";

type ISection = {
  title?: PrismicRichText;
  children: ReactNode;
};

const Section = ({ title, children }: ISection) => (
  <section className={styles.grid}>
    {!!title && (
      <h2 className={styles.sectionHeader} dangerouslySetInnerHTML={{ __html: richtext(title, true) }} />
    )}
    {children}
  </section>
);

export default Section;
