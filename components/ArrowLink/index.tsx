import React, { ReactNode } from 'react';

import styles from './ArrowLink.module.css';

type ArrowLinkProps = {
    children?: ReactNode,
    color?: string,
}

const ArrowLink = ({
    children,
    color = 'var(--black)'
}: ArrowLinkProps) => (
    <span className={styles.arrow} style={{ color }}>
        {!!children && (
            <span>{children}</span>
        )}
        <svg className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <g fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeMiterlimit="10">
                <circle className={styles.arrowIconCircle} cx="16" cy="16" r="15.12" />
                <path className={styles.arrowIconArrow} d="M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98" />
            </g>
        </svg>
    </span>
);

export default ArrowLink;