import React, { ReactNode } from 'react';
import styles from './Hero.module.css';

type HeroProps = {
    title: string,
    description: string | ReactNode,
    children?: ReactNode,
}

const Hero = ({
    title,
    description,
    children,
}: HeroProps) => (
    <div className={styles.hero}>
        <h1 className="heading-2">{title}</h1>
        <p>{description}</p>
        {!!children && (
            <div className={styles.actions}>
                {children}
            </div>
        )}
    </div>
);

export default Hero;