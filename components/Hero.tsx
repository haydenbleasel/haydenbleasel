import React from 'react';
import Link from 'next/link';

type HeroProps = {
    title: string,
    description: string,
    actions?: any,
}

const Hero = ({
    title,
    description,
    actions = [],
}: HeroProps) => (
    <div className="hero">
        <h1>{title}</h1>
        <p>{description}</p>
        {!!actions.length && (
            <div className="actions">
                {actions.map(Link)}
            </div>
        )}
    </div>
);

export default Hero;