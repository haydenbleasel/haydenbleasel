import Image, { ImageProps } from "next/image";
import ReactPlayer from 'react-player/vimeo';
import Link from '../link';
import Skeleton from "../skeleton";
import { richtext } from "../../utils/prismic";
import styles from "./card.module.css";

type ICard = {
  id: string;
  caption?: string;
  status?: string;
  image?: PrismicImage;
  video?: PrismicVideo;
  title: string;
  subtitle?: string;
  action?: string;
  link?: PrismicLink | string;
  children: PrismicRichText | string;
} & Omit<ImageProps, 'src'|'placeholder'|'blurDataURL'|'layout'>;

const Card = ({
  id,
  caption,
  status,
  image,
  video,
  title,
  subtitle,
  link,
  action,
  children,
  ...props
}: ICard) => (
  <div className={styles.card} id={id}>
    <Skeleton>
      {!!video?.embed_url && (
        <div className={styles.video}>
          <ReactPlayer url={video.embed_url} playing muted loop playsinline width="100%" height="100%" config={{ playerOptions: { background: true } }} />
        </div>
      )}
      {(!!image?.url && !video?.embed_url) && (
        <Image
          src={image.url}
          layout="responsive"
          width={1312}
          height={600}
          alt={title}
          {...props}
        />
      )}
    </Skeleton>
    <div className={styles.meta}>
      <div className={styles.summary}>
        {!!caption && (
          <p className="grey smallSans">{caption}</p>
        )}
        <h2 className="h2Sans">{title}</h2>
        {!!subtitle && (
          <p className="h2Serif">{subtitle}</p>
        )}
        {!!status && (
            <div className={styles.status}>{status}</div>
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
