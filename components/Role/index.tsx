import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Fade } from 'react-awesome-reveal';
import slug from '../../utils/slug';
import styles from './role.module.css';

type IRole = {
  caption: string;
  image: string;
  title: string;
  subtitle: string;
  link?: string;
  children: ReactNode;
}

const Role = ({ caption, image, title, subtitle, link, children }: IRole) => (
  <div className={styles.role} id={slug(subtitle)}>
    <Fade triggerOnce>
      <Image
        src={image}
        layout="responsive"
        width={1312}
        height={600}
      />
      <div className={styles.meta}>
        <div className={styles.summary}>
          <p className="grey small">{caption}</p>
          <h2 className="h2Sans">{title}</h2>
          <p className="h2Serif">{subtitle}</p>
          {!!link && <Link href={link}>Visit the website</Link>}
        </div>
        {children}
      </div>
    </Fade>
  </div>
);

export default Role;