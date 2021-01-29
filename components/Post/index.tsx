import React from 'react';
import Image from 'next/image';
import Link from '../Link';

import styles from './Post.module.css';

type PostProps = {
    image: string,
    title: string,
    description: string,
    caption: string,
    id: string,
    featured: boolean,
}

const Post = ({
    image,
    title,
    description,
    caption,
    id,
    featured = false,
}: PostProps) => (
    <div className={styles.post}>
        <Link href={`/thoughts/${id}`}>
            <Image
                layout="responsive"
                height={featured ? 540 : 306}
                width={featured ? 858 : 403}
                alt={title}
                src={image}
                quality={100}
                objectFit="cover"
                className={styles.image}
            />
            <div className={styles.meta}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
                <small className={styles.caption}>{caption}</small>
            </div>
        </Link>
    </div>
);

export default Post;