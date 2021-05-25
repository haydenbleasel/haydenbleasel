import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Skeleton from '../../components/skeleton';
import styles from './role.module.css';

type IRole = {
  id: string;
  caption: string;
  image: string;
  title: string;
  subtitle: string;
  link?: string;
  children: ReactNode;
}

const Role = ({
  id,
  caption,
  image,
  title,
  subtitle,
  link,
  children,
}: IRole) => (
  <div className={styles.role} id={id}>
    <Skeleton>
      <Image src={image} layout="responsive" width={1312} height={600} />
    </Skeleton>
    <div className={styles.meta}>
      <div className={styles.summary}>
        <p className="grey small">{caption}</p>
        <h2 className="h2Sans">{title}</h2>
        <p className="h2Serif">{subtitle}</p>
        {!!link && <Link href={link}>Visit the website</Link>}
      </div>
      {children}
    </div>
  </div>
);

export default Role;