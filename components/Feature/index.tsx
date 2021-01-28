import React, { ReactNode } from 'react';
import Image from 'next/image';
import styles from './Feature.module.css';

type FeatureProps = {
    image: string,
    title: string,
    description: string,
    caption?: string,
    children: ReactNode,
    reverse?: boolean,
    onImageLoad?: any,
}

const Feature = ({
    image,
    title,
    description,
    caption,
    children,
    onImageLoad,
    reverse = false,
}: FeatureProps) => (
    <div className={`${styles.feature} ${reverse ? styles.reverse : ''}`}>
        <div className={styles.featureImage}>
            <Image
                layout="fixed"
                height={630}
                width={630}
                alt={title}
                src={image}
                objectFit="cover"
                onLoad={onImageLoad}
                quality={100}
            />
        </div>
        <div className={styles.featureInfoContainer}>
            <div className={styles.featureInfo}>
                <h2 className="heading-5">{title}</h2>
                {!!caption && (
                    <small className={styles.caption}>{caption}</small>
                )}
                <p>{description}</p>
                <div className={styles.actions}>
                    {children}
                </div>
            </div>
        </div>
    </div>
);

export default Feature;