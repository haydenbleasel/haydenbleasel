import React from 'react';
import Image from 'next/image';

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
    <div className="client">
        <Image
            layout="fixed"
            height={32}
            width={32}
            alt={title}
            src={image}
        />
        <p>{summary}</p>
        {description}
        <p>{caption}</p>
    </div>
);

export default Client;