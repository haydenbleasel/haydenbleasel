import type { FC } from 'react';
import Image from 'next/image';
import Link from '../link';
import styles from './client.module.css';

const Client: FC<{
  name: string;
  url: string;
  logo: any;
}> = (({ name, url, logo }) => (
  <div className={styles.wrapper}>
    <Link href={url} className={styles.client}>
      <Image
        layout="fixed"
        height={16}
        width={16}
        alt=""
        src={logo}
        quality={100}
        objectFit="contain"
        priority
      />
      <span className={styles.name}>{name}</span>
    </Link>
  </div>
));

export default Client;
