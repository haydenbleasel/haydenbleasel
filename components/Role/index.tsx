import Image from 'next/image';
import { ReactNode } from 'react';
import { Fade } from 'react-awesome-reveal';
import styles from './role.module.css';

type IRole = {
  date: string;
  title: string;
  company: string;
  children: ReactNode;
}

const Role = ({ date, title, company, children }: IRole) => (
  <div className={styles.role}>
    <Fade triggerOnce>
      <Image
        src={`/images/work/${company.toLowerCase()}.png`}
        layout="responsive"
        width={1312}
        height={600}
      />
      <div className={styles.meta}>
        <div className={styles.summary}>
          <p className="small">{date}</p>
          <h2 className="h2Sans">{title}</h2>
          <p className="h2Serif">{company}</p>
        </div>
        {children}
      </div>
    </Fade>
  </div>
);

export default Role;