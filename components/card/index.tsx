import Image from "next/image";
import Link from '../link';
import Skeleton from "../skeleton";
import { richtext } from "../../utils/prismic";
import styles from "./card.module.css";

type IRole = {
  id: string;
  caption: string;
  image: PrismicImage;
  title: string;
  subtitle: string;
  action?: string;
  link?: PrismicLink;
  priority?: boolean;
  children: PrismicRichText;
};

const Role = ({
  id,
  caption,
  image,
  title,
  subtitle,
  link,
  action,
  priority = false,
  children,
}: IRole) => (
  <div className={styles.role} id={id}>
    <Skeleton>
      <Image
        src={image.url}
        layout="responsive"
        width={1312}
        height={600}
        priority={priority}
      />
    </Skeleton>
    <div className={styles.meta}>
      <div className={styles.summary}>
        <p className="grey small">{caption}</p>
        <h2 className="h2Sans">{title}</h2>
        <p className="h2Serif">{subtitle}</p>
        {(link && action) && <Link href={link}>{action}</Link>}
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: richtext(children) }} />
    </div>
  </div>
);

export default Role;