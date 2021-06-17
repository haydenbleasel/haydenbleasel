import Image, { ImageProps } from "next/image";
import Link from '../link';
import Skeleton from "../skeleton";
import { richtext } from "../../utils/prismic";
import styles from "./card.module.css";

type ICard = {
  id: string;
  caption: string;
  image: PrismicImage;
  title: string;
  subtitle?: string;
  action?: string;
  link?: PrismicLink | string;
  children: PrismicRichText | string;
} & Omit<ImageProps, 'src'>;

const Card = ({
  id,
  caption,
  image,
  title,
  subtitle,
  link,
  action,
  children,
  ...props
}: ICard) => (
  <div className={styles.card} id={id}>
    <Skeleton>
      <Image
        src={image.url}
        layout="responsive"
        width={1312}
        height={600}
        alt={title}
        {...props}
      />
    </Skeleton>
    <div className={styles.meta}>
      <div className={styles.summary}>
        <p className="grey smallSans">{caption}</p>
        <h2 className="h2Sans">{title}</h2>
        {!!subtitle && (
          <p className="h2Serif">{subtitle}</p>
        )}
        {(link && action) && <Link href={link}>{action}</Link>}
      </div>
      {typeof children === 'string' ? (
        <p className={styles.content}>{children}</p>
      ) : (
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: richtext(children) }} />
      )}
    </div>
  </div>
);

export default Card;
