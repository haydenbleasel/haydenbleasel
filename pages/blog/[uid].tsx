import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

const Article = ({ post }) => (
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

export default Article;