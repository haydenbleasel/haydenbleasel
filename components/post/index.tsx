import type { HTMLAttributes } from "react";
import Link from "../link";
import PrismicImage from "../prismicImage";
import Skeleton from "../skeleton";
import styles from "./post.module.css";

type PostProps = {
  image?: PrismicImage;
  title: string;
  description?: string;
  caption?: string;
  status?: string;
  link: PrismicLink;
  featured?: boolean;
  focus?: string;
  compact?: boolean;
} & HTMLAttributes<HTMLAnchorElement>;

const Post = ({
  image,
  title,
  description,
  caption,
  status,
  link,
  featured = false,
  compact = false,
  focus,
  ...props
}: PostProps) => (
  <Link href={link} className={styles.post} {...props}>
    {!!image && !compact && (
      <div className={styles.image}>
        <Skeleton>
          <PrismicImage
            width={featured ? 1128 : 742}
            height={featured ? 600 : 395}
            alt={title}
            src={image}
            objectFit="cover"
            objectPosition={focus}
            priority={featured}
          />
        </Skeleton>
      </div>
    )}
    <div className={styles.meta}>
      {!!caption && <small className="smallSans grey">{caption}</small>}
      <div className={styles.title}>
        <h2 className={compact ? "paragraphSans" : "h4Sans"}>{title}</h2>
        {!!status && <div className={styles.status}>{status}</div>}
      </div>
      {!!description && !compact && (
        <p className="paragraphSans grey">{description}</p>
      )}
    </div>
  </Link>
);

export default Post;
