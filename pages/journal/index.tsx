import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import slugify from 'slugify';
import { Fade } from 'react-awesome-reveal';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Post from '../../components/Post';

import styles from './Journal.module.css';

type Post = {
    title: string,
    id: string,
    date: string,
    summary: string,
    image: string,
}

type MediumPost = {
    title: string,
    link: string,
    guid: string,
    isoDate: string,
    categories: string[],
    'content:encoded': string,
}

type BlogProps = {
    posts: Post[],
}

const Journal = ({ posts }: BlogProps) => (
    <Layout
        title="Thoughts, stories and ideas"
        description="I’ve had the privilege of working with a wide range of companies and early-stage startups.">

        <Hero
            title="Journal"
            description="I sometimes write about things I find interesting, tools I’m using and personal news. Here are some variants rants that didn't fit on Twitter."
        />

        <Fade triggerOnce delay={800}>
            <ul className={styles.posts}>
                {posts.map(({ title, id, date, summary, image }, index) => (
                    <li className={index === 0 ? styles.featured : ''} key={id}>
                        <Post
                            id={id}
                            image={image}
                            title={title}
                            description={summary}
                            caption={dayjs(date).format('MMMM D, YYYY')}
                            featured={index === 0}
                        />
                    </li>
                ))}
            </ul>
        </Fade>
    
    </Layout>
);

export async function getStaticProps() {
    const parser = new Parser();

    const { items } = await parser.parseURL('https://medium.com/feed/@haydenbleasel');

    const posts = (items as MediumPost[]).map((item) => {
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
            image: dom.window.document.querySelector('img').src.replace('max/1024', 'max/3840'),
            tags: item.categories,
        };
    });

    return {
        props: {
            posts,
        },
    }
}

export default Journal;