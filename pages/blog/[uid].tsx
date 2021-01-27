import React from 'react';
import { ArticleJsonLd } from 'next-seo';l=
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import { useRouter } from 'next/router';
import { timeStamp } from 'console';

type Article = {
    title: string,
    description: string,
    createdAt: string,
    lastModifiedAt: string,
    cover: string,
}

type ArticleProps = {
    post: Article,
}

const Article = ({ post }: ArticleProps) => {

    const { asPath, basePath } = useRouter();

    return (
        <Layout title="Home | Next.js + TypeScript Example">

            <ArticleJsonLd
                url={asPath}
                title={post.title}
                images={[post.cover]}
                datePublished={post.createdAt}
                dateModified={post.lastModifiedAt}
                authorName={["Hayden Bleasel"]}
                publisherName="Hayden Bleasel"
                publisherLogo={`${basePath}/images/cover.jpg`}
                description={post.description}
            />

            <Hero
                title={post.title}
                description={post.description}
            />

        </Layout>
    );
}

export async function getStaticProps() {
    return {
        props: {
            post: {
                title: 'test',
                description: 'test',
                cover: 'test',
                createdAt: new Date().toISOString(),
                lastModifiedAt: new Date().toISOString(),
            },
        },
    }
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: false,
    };
}

export default Article;