import Image from 'next/image';
import { ReactNode } from 'react';
import Link from '../Link';
import styles from './role.module.css';

type IProject = {
  date: string;
  name: string;
  role: string;
  link: string;
  children: ReactNode;
}

const Project = ({ date, name, role, link, children }: IProject) => (
  <div className={styles.role}>
    <Image
      src={`/images/projects/${name.toLowerCase()}.png`}
      layout="responsive"
      width={1312}
      height={600}
    />
    <div className={styles.meta}>
      <div className={styles.summary}>
        <p className="verySmall">{date}</p>
        <h2 className="h2Sans">{name}</h2>
        <p className="h2Serif">{role}</p>
        <Link href={link}>Visit the website</Link>
      </div>
      {children}
    </div>
  </div>
);

export default Project;