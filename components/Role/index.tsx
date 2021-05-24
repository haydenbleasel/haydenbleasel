import Image from 'next/image';
import { ReactNode } from 'react';
import styles from './role.module.css';

type IRole = {
  date: string;
  title: string;
  company: string;
  children: ReactNode;
}

const Role = ({ date, title, company, children }: IRole) => (
  <div className={styles.role}>
    <Image
      src={`/images/work/${company.toLowerCase()}.png`}
      layout="responsive"
      width={1312}
      height={600}
    />
    <div className={styles.meta}>
      <div className={styles.summary}>
        <p className="verySmall">{date}</p>
        <h2 className="h2Sans">{title}</h2>
        <p className="h2Serif">{company}</p>
      </div>
      {children}
    </div>
  </div>
);

export default Role;