import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

import eventsList from './events.json';
import styles from './Events.module.css';

const Event = ({ name, organisation, year }) => (
    <span className={styles.event}>
        <span className={styles.eventName}>{name}</span>
        <span className={styles.eventMeta}>
            <span>{organisation}</span>
            <span className={styles.eventYear}>{year}</span>
        </span>
    </span>
);

const Events = () => (
    <Layout title="Home | Next.js + TypeScript Example">

        <Hero
            title="Events"
            description="I’ve been fortunate enough to speak at a few events and be interviewed by a few writers and blogs."
            actions={[
                { href: '/contact', children: 'Let\'s chat' }
            ]}
        />

        <ul className={styles.events}>
            {eventsList.map(({ url, ...event }) => (
                <li id={event.name}>
                    {url ? (
                        <a className={styles.eventLink} href={url} target="noopener noreferrer">
                            <Event {...event} />
                        </a>
                    ) : (
                        <Event {...event} />
                    )}
                </li>
            ))}
        </ul>

    </Layout>
);

export default Events;