import Link from '../link';
import styles from './outlink.module.css';

type IOutlink = {
  text: string;
  link: string;
}

const Outlink = ({ link, text }: IOutlink) => (
  <div className={styles.outlink}>
    <Link href={link}>
      <span className="underline">{text}</span> &rarr;
    </Link>
  </div>
);

export default Outlink;