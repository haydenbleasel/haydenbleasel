import React from 'react';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import slugify from 'slugify';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Post from '../../components/Post';

import styles from './Blog.module.css';

type Post = {
    title: string,
    id: string,
    date: string,
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

        <ul className={styles.posts}>
            {posts.map(({ title, id, date, summary, image }, i) => (
                <li className={i === 0 ? styles.featured : ''} key={id}>
                    <Post
                        id={id}
                        image={image}
                        title={title}
                        description={summary}
                        caption={dayjs(date).format('MMMM, YYYY')}
                        featured={i === 0}
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
            id: slugify(item.title as string, {
                lower: true,
                strict: true,
            }),
            date: item.isoDate,
            summary: dom.window.document.querySelector('h4').textContent,
            image: dom.window.document.querySelector('img').src,
            tags: item.categories,
        };
    });

    return {
        props: {
            posts,
        },
    }
}

export default Thoughts;