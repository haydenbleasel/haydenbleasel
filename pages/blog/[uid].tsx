import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

type Article = {
    title: string,
    description: string,
}

type ArticleProps = {
    post: Article,
}

const Article = ({ post }: ArticleProps) => (
    <Layout title="Home | Next.js + TypeScript Example">

        <Hero
            title={post.title}
            description={post.description}
        />

    </Layout>
);

export async function getStaticProps() {
    return {
        props: {
            post: {
                title: 'test',
                description: 'test',
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