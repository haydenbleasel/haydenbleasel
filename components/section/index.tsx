import type { HTMLAttributes } from "react";
import { richtext } from "../../utils/prismic";
import styles from "./section.module.css";

type ISection = {
  title?: PrismicRichText;
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>;

const Section = ({ title, children, ...props }: ISection) => (
  <section className={styles.grid} {...props}>
    {!!title && (
      <h2 className={styles.sectionHeader} dangerouslySetInnerHTML={{ __html: richtext(title, true) }} />
    )}
    {children}
  </section>
);

export default Section;
