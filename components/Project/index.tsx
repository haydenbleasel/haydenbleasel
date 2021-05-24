import Image from 'next/image';
import { ReactNode } from 'react';
import { Fade } from 'react-awesome-reveal';
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
    <Fade triggerOnce>
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
    </Fade>
  </div>
);

export default Project;