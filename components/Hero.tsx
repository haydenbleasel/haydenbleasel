import React from 'react';
import Link from 'next/link';

const Hero = ({ title, description, actions }) => (
    <div className="hero">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="actions">
            {actions.map(Link)}
        </div>
    </div>
);

export default Hero;