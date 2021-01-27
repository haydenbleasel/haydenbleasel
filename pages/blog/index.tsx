import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';

type BlogProps = {
    posts: string[],
}

const Blog = ({ posts }: BlogProps) => (
    <Layout title="Home | Next.js + TypeScript Example">

        <Hero
            title="Blog"
            description="I sometimes write about things I find interesting, tools I’m using and personal news. Here are some variants rants."
        />
    
    </Layout>
);

export async function getStaticProps() {
    return {
        props: {
            posts: [],
        },
    }
}

export default Blog;