import React, { ReactNode } from 'react';
import { Fade } from 'react-awesome-reveal';
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
        <Fade triggerOnce delay={200}>
            <h1 className="heading-2">{title}</h1>
        </Fade>
        <Fade triggerOnce delay={400}>
            <p>{description}</p>
        </Fade>
        {!!children && (
            <Fade triggerOnce delay={600}>
                <div className={styles.actions}>
                    {children}
                </div>
            </Fade>
        )}
    </div>
);

export default Hero;