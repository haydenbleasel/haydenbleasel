import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import ArrowLink from '../../components/ArrowLink';
import eventsList from './events.json';
import styles from './Events.module.css';

type EventItem = {
    name: string,
    organisation: string,
    year: number,
    url?: string,
}

const Event = ({ name, organisation, year }: EventItem) => (
    <span className={styles.event}>
        <span className={styles.eventName}>{name}</span>
        <span className={styles.eventMeta}>
            <span>{organisation}</span>
            <span className={styles.eventYear}>{year}</span>
        </span>
    </span>
);

const Events = () => (
    <Layout
        title="Events and press"
        description="I’ve been fortunate enough to speak at a few events and be interviewed by a few writers and blogs."
    >

        <Hero
            title="Events"
            description="I’ve been fortunate enough to speak at a few events and be interviewed by a few writers and blogs."
        >
            <ArrowLink href="/contact">Let's chat</ArrowLink>
        </Hero>

        <ul className={styles.events}>
            {(eventsList as EventItem[]).map(({ url, ...event }) => (
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