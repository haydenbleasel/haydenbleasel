import Image from "next/image";
import type { HTMLAttributes } from "react";
import Link from "../link";
import Skeleton from "../skeleton";
import styles from "./post.module.css";

type PostProps = {
  image?: PrismicImage;
  title: string;
  description?: string;
  caption?: string;
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
          <Image
            layout="responsive"
            width={featured ? 1128 : 742}
            height={featured ? 600 : 395}
            alt={title}
            src={image.url}
            quality={100}
            objectFit="cover"
            objectPosition={focus}
            priority={featured}
          />
        </Skeleton>
      </div>
    )}
    <div className={styles.meta}>
      {!!caption && <small className="small grey">{caption}</small>}
      <h2 className={compact ? "paragraphSans" : "h4Sans"}>{title}</h2>
      {!!description && !compact && (
        <p className="paragraphSans grey">{description}</p>
      )}
    </div>
  </Link>
);

export default Post;
