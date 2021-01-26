import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Feature = ({ image, title, description, actions }) => (
    <div className="feature">
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