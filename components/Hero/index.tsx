import React, { ReactNode } from 'react';
import Fade from 'react-reveal/Fade';
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
        <Fade bottom delay={200}>
            <h1 className="heading-2">{title}</h1>
        </Fade>
        <Fade bottom delay={400}>
            <p>{description}</p>
        </Fade>
        {!!children && (
            <Fade bottom delay={600}>
                <div className={styles.actions}>
                    {children}
                </div>
            </Fade>
        )}
    </div>
);

export default Hero;