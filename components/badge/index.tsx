import type { HTMLAttributes } from 'react';
import styles from './badge.module.css';

export default function Badge(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styles.badge} {...props} />
  );
}
