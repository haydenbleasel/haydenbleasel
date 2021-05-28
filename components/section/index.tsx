import type { HTMLAttributes } from "react";
import styles from "./section.module.css";

const Section = (props: HTMLAttributes<HTMLDivElement>) => (
  <section className={styles.grid} {...props} />
);

export default Section;
