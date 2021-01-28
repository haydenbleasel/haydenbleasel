import React from 'react';
import Image from 'next/image';

import styles from './Client.module.css';

type ClientProps = {
    image: string,
    title: string,
    summary: string,
    description: any,
    caption: string,
}

const Client = ({
    image,
    title,
    summary,
    description,
    caption,
}: ClientProps) => (
    <div className={styles.client}>
        <Image
            layout="fixed"
            height={32}
            width={32}
            alt={title}
            src={image}
            quality={100}
        />
        <h2 className="heading-5">{title}</h2>
        <p className={styles.summary}>{summary}</p>
        <p className={styles.description}>
            {description}
        </p>
        <small className={styles.caption}>{caption}</small>
    </div>
);

export default Client;