import React from 'react';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Post from '../../components/Post';

type Post = {
    title: string,
    url: string,
    id: string,
    date: string,
    content: string,
    summary: string,
    image: string,
}

type BlogProps = {
    posts: Post[],
}

const Thoughts = ({ posts }: BlogProps) => (
    <Layout
        title="Thoughts, stories and ideas"
        description="I’ve had the privilege of working with a wide range of companies and early-stage startups.">

        <Hero
            title="Thoughts"
            description="I sometimes write about things I find interesting, tools I’m using and personal news. Here are some variants rants."
        />

        <ul>
            {posts.map(({ title, url, id, date, summary, image }) => (
                <li key={id}>
                    <Post
                        image={image}
                        title={title}
                        description={summary}
                        href={url}
                        caption={dayjs(date).format('MMMM, YYYY')}
                    />
                </li>
            ))}
        </ul>
    
    </Layout>
);

export async function getStaticProps() {
    const parser = new Parser();

    const { items } = await parser.parseURL('https://medium.com/feed/@haydenbleasel');

    const posts = items.map((item) => {
        const content = item['content:encoded'];
        const dom = new JSDOM(content);

        return {
            title: item.title,
            url: item.link,
            id: item.guid,
            date: item.isoDate,
            summary: dom.window.document.querySelector('p').textContent,
            content,
            image: dom.window.document.querySelector('img').src,
        };
    });

    return {
        props: {
            posts,
        },
    }
}

export default Thoughts;