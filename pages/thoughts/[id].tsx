import React from 'react';
import { ArticleJsonLd } from 'next-seo';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import { useRouter } from 'next/router';
import Image from 'next/image';
import slugify from 'slugify';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

import styles from './Article.module.css';

type Post = {
    title: string,
    id: string,
    date: string,
    content: string,
    summary: string,
    image: string,
    tags: string[],
}

type ArticleProps = {
    post: Post,
}

const Article = ({ post }: ArticleProps) => {

    const { asPath, basePath } = useRouter();

    return (
        <Layout
            title={post.title}
            description={post.summary}
            images={[{ url: post.image }]}
            openGraph={{
                type: 'article',
                article: {
                    publishedTime: post.date,
                    tags: post.tags,
                },
            }}
        >

            <ArticleJsonLd
                url={asPath}
                title={post.title}
                images={[post.image]}
                datePublished={post.date}
                authorName={["Hayden Bleasel"]}
                publisherName="Hayden Bleasel"
                publisherLogo={`${basePath}/images/cover.jpg`}
                description={post.summary}
            />

            <Hero
                title={post.title}
                description={post.summary}
            >
                <small className={styles.date}>
                    <span>Published </span>
                    <time dateTime={post.date}>{dayjs(post.date).format('MMMM D, YYYY')}</time>
                </small>
            </Hero>
            
            <Image
                layout="responsive"
                src={post.image}
                width={1314}
                height={876}
                objectFit="cover"
                className={styles.image}
            />

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

        </Layout>
    );
}

export async function getStaticProps({ params }) {
    const parser = new Parser();

    const { items } = await parser.parseURL('https://medium.com/feed/@haydenbleasel');

    const id: string = params?.id;

    const posts = items.filter(({ title }) => id === slugify(title as string, {
        lower: true,
        strict: true,
    }));

    if (!posts.length) {
        throw Error('Story not found');
    }

    const post = posts[0];
    
    const content = post['content:encoded'];
    const dom = new JSDOM(content);

    const contentDom = new JSDOM(content);
    contentDom.window.document.querySelector('h4').remove();
    contentDom.window.document.querySelector('figure').remove();

    return {
        props: {
            post: {
                title: post.title,
                id: slugify(post.title as string, {
                    lower: true,
                    strict: true,
                }),
                date: post.isoDate,
                content: contentDom.window.document.querySelector('body').innerHTML,
                summary: dom.window.document.querySelector('h4').textContent,
                image: dom.window.document.querySelector('img').src.replace('max/1024', 'max/3840'),
                tags: post.categories,
            },
        },
    }
}

export async function getStaticPaths() {
    const parser = new Parser();

    const { items } = await parser.parseURL('https://medium.com/feed/@haydenbleasel');

    const paths = items.map((item) => ({
        params: {
            id: slugify(item.title as string, {
                lower: true,
                strict: true,
            })
        },
    }));

    console.log(paths, 'paths');

    return {
        paths,
        fallback: false,
    };
}

export default Article;