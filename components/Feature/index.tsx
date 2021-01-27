import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import styles from './Feature.module.css';

type FeatureProps = {
    image: string,
    title: string,
    description: string,
    actions: any,
    reverse?: boolean,
}

const Feature = ({
    image,
    title,
    description,
    actions,
    reverse = false,
}: FeatureProps) => (
    <div className={`${styles.feature} ${reverse && styles.reverse}`}>
        <div className={styles.featureImage}>
            <Image
                layout="fixed"
                height={630}
                width={630}
                alt={title}
                src={image}
            />
        </div>
        <div className={styles.featureInfoContainer}>
            <div className={styles.featureInfo}>
                <h2 className="heading-5">{title}</h2>
                <p>{description}</p>
                <div className={styles.actions}>
                    {actions.map(Link)}
                </div>
            </div>
        </div>
    </div>
);

export default Feature;