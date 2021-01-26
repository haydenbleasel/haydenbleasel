import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className={`feature ${reverse && 'reverse'}`}>
        <Image
            layout="fixed"
            height={630}
            width={630}
            alt={title}
            src={image}
        />
        <div className="feature-info">
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="actions">
                {actions.map(Link)}
            </div>
        </div>
    </div>
);

export default Feature;