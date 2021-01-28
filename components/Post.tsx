import React from 'react';
import Image from 'next/image';
import Link from './Link';

type PostProps = {
    image: string,
    title: string,
    description: string,
    caption: string,
    href: string,
}

const Post = ({
    image,
    title,
    description,
    caption,
    href,
}: PostProps) => (
    <div className="post">
        <Link href={href}>
            <Image
                layout="responsive"
                height={402}
                width={306}
                alt={title}
                src={image}
                quality={100}
            />
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{caption}</p>
        </Link>
    </div>
);

export default Post;