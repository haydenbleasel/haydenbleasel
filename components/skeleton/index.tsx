import type { HTMLAttributes } from "react";
import styles from "./skeleton.module.css";

const Skeleton = (props: HTMLAttributes<HTMLDivElement>) => <div className={styles.skeleton} {...props} />;

export default Skeleton;
