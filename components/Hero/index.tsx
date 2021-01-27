import React from 'react';
import ArrowLink from '../ArrowLink';
import styles from './Hero.module.css';

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
    <div className={styles.hero}>
        <h1 className="heading-2">{title}</h1>
        <p>{description}</p>
        {!!actions.length && (
            <div className={styles.actions}>
                {actions.map((props, index) => (
                    <div key={index}>
                        <ArrowLink {...props} />
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default Hero;