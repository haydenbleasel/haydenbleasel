import Image from "next/image";
import Link from "../link";
import styles from "./post.module.css";

type PostProps = {
  image?: string;
  title: string;
  description?: string;
  caption?: string;
  link: string;
  featured?: boolean;
  focus?: string;
  compact?: boolean;
};

const Post = ({
  image,
  title,
  description,
  caption,
  link,
  featured = false,
  compact = false,
  focus,
}: PostProps) => (
  <div className={styles.post}>
    <Link href={link}>
      {!!image && !compact && (
        <div className={styles.image}>
          <Image
            layout="responsive"
            width={1128}
            height={600}
            alt={title}
            src={image}
            quality={100}
            objectFit="cover"
            loading={featured ? "eager" : "lazy"}
            objectPosition={focus}
          />
        </div>
      )}
      <div className={styles.meta}>
        {!!caption && <small className="small grey">{caption}</small>}
        <h2 className={compact ? "paragraphSans" : "h4Sans"}>{title}</h2>
        {!!description && !compact && <p className="paragraphSans grey">{description}</p>}
      </div>
    </Link>
  </div>
);

export default Post;
