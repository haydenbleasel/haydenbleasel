import React from 'react';
import Image from 'next/image';
import Fade from 'react-reveal/Fade';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import ArrowLink from '../../components/ArrowLink';
import eventsList from './events.json';
import styles from './Events.module.css';
import { siteUrl } from '../../next-sitemap';

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
        image={{
            url: `${siteUrl}/images/events/sydney-designers.jpg`,
            width: 4032,
            height: 3024,
        }}
    >

        <Hero
            title="Events"
            description="I’ve been fortunate enough to speak at a few events and be interviewed by a few writers and blogs."
        >
            <ArrowLink href="/contact">Let's chat</ArrowLink>
        </Hero>

        <div className={`${styles.cover} grow`}>
            <Fade delay={800}>
                <Image
                    layout="responsive"
                    width={4032}
                    height={3024}
                    src="/images/events/sydney-designers.jpg"
                    alt="Sydney Designers event at Atlassian 2017"
                    quality={100}
                    loading="eager"
                />
            </Fade>
        </div>

        <ul className={styles.events}>
            {(eventsList as EventItem[]).map(({ url, ...event }, index) => (
                <Fade delay={Math.min(index * 50, 500)}>
                    <li id={event.name}>
                        {url ? (
                            <a className={styles.eventLink} href={url} target="noopener noreferrer">
                                <Event {...event} />
                            </a>
                        ) : (
                            <Event {...event} />
                        )}
                    </li>
                </Fade>
            ))}
        </ul>

    </Layout>
);

export default Events;