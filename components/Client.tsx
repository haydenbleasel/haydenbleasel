import React from 'react';
import Image from 'next/image';

const Client = ({ image, title, summary, description, caption }) => (
    <div className="Client">
        <Image
            layout="fixed"
            height={32}
            width={32}
            alt={title}
            src={image}
        />
        <p>{summary}</p>
        <p>{description}</p>
        <p>{caption}</p>
    </div>
);

export default Client;