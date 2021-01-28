import React from 'react';
import Parser from 'rss-parser';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

type BlogProps = {
    posts: string[],
}

const Thoughts = ({ posts }: BlogProps) => (
    <Layout title="Home | Next.js + TypeScript Example">

        <Hero
            title="Thoughts"
            description="I sometimes write about things I find interesting, tools I’m using and personal news. Here are some variants rants."
        />

        <ul>
            {posts.map((name) => (
                <li>{name}</li>
            ))}
        </ul>
    
    </Layout>
);

export async function getStaticProps() {

    const parser = new Parser();

    const feed = await parser.parseURL('https://medium.com/feed/@haydenbleasel');

    console.log(feed, 'feed');

    return {
        props: {
            posts: [],
        },
    }
}

export default Thoughts;