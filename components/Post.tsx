import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Post = ({ image, title, description, caption, href }) => (
    <div className="post">
        <Link href={href}>
            <Image
                layout="responsive"
                height={402}
                width={306}
                alt={title}
                src={image}
            />
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{caption}</p>
        </Link>
    </div>
);

export default Post;