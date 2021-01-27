import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

import eventsList from './events.json';

const Events = () => (
    <Layout title="Home | Next.js + TypeScript Example">

        <Hero
            title="Events"
            description="I’ve been fortunate enough to speak at a few events and be interviewed by a few writers and blogs."
            actions={[
                { href: '/contact', children: 'Let\'s chat' }
            ]}
        />

        <ul>
            {eventsList.map(({ name, organisation, year, url }) => (
                <li>
                    {url ? (
                        <a href={url} target="noopener noreferrer">{name} - {organisation} {year}</a>
                    ) : (
                        <span>{name} - {organisation} {year}</span>
                    )}
                </li>
            ))}
        </ul>

    </Layout>
);

export default Events;