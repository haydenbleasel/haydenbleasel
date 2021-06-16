import type { HTMLAttributes } from "react";
import Link from "../link";
import styles from "./outlink.module.css";

type IOutlink = {
  text: string;
  link: PrismicLink;
} & HTMLAttributes<HTMLAnchorElement>;

const Outlink = ({ link, text, ...props }: IOutlink) => (
  <Link href={link} className={styles.outlink} {...props}>
    <span className="underline">{text}</span>{" "}
    <span className={styles.arrow}>&rarr;</span>
  </Link>
);

export default Outlink;
