import { useEffect } from 'react';
import { ArticleJsonLd } from 'next-seo';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import useResponsive from '../../utils/responsive';
import { useRouter } from 'next/router';
import { Fade } from 'react-awesome-reveal';
import Image from 'next/image';
import slugify from 'slugify';
import dayjs from 'dayjs';
import mediumZoom from 'medium-zoom'
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
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
    const { isMobile } = useResponsive();

    useEffect(() => {
        const zoom = mediumZoom('figure img');
        
        document.querySelectorAll('pre').forEach((block) => {
            hljs.highlightBlock(block);
        });

        return () => {
            zoom.detach();
        };
    }, []);

    return (
        <Layout
            title={post.title}
            description={post.summary}
            image={{ url: post.image }}
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
            
            <div className={`${styles.cover} grow`}>
                {isMobile ? (
                    <Image
                        layout="fill"
                        src={post.image}
                        objectFit="cover"
                    />
                ) : (
                    <Fade triggerOnce delay={800}>
                        <Image
                            layout="responsive"
                            src={post.image}
                            width={1314}
                            height={876}
                            objectFit="cover"
                        />
                    </Fade>
                )}
            </div>

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

    const summary = dom.window.document.querySelector('h4').textContent;

    [...dom.window.document.querySelectorAll('img')].map((img) => (
        img.src = img.src.replace('max/1024', 'max/3840')
    ));

    const image = dom.window.document.querySelector('img').src;

    dom.window.document.querySelector('h4').remove();
    dom.window.document.querySelector('figure').remove();

    [...dom.window.document.querySelectorAll('a')].map((node) => {
        if (!node.href.startsWith('https://haydenbleasel.com')) {
            node.rel = 'noopener noreferrer';
            node.target = '_blank';
        }
    });

    [...dom.window.document.querySelectorAll('body > *')].map((node) => {
        const prev = node.previousSibling;
        if (prev && prev.nodeName === 'PRE' && node.nodeName === 'PRE') {
            prev.innerHTML += `<br /><br />${node.innerHTML}`;
            node.remove();
        }
    });

    [...dom.window.document.querySelectorAll('iframe')].map((node) => {
        const wrapper = dom.window.document.createElement('div');
        const parent = node.parentNode;
        
        wrapper.className = 'iframe-wrapper';
        wrapper.innerHTML = node.outerHTML;
        parent.replaceChild(wrapper, node);

        node.remove();
    });

    return {
        props: {
            post: {
                title: post.title,
                id: slugify(post.title as string, {
                    lower: true,
                    strict: true,
                }),
                date: post.isoDate,
                content: dom.window.document.querySelector('body').innerHTML,
                summary,
                image,
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

    return {
        paths,
        fallback: false,
    };
}

export default Article;