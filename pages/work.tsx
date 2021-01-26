import React from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Feature from '../components/Feature';

export default () => (
  <Layout title="Home | Next.js + TypeScript Example">

    <Hero
      title="Work"
      description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
    />

    <h2>Jellypepper</h2>
    <p>Running an agency has given me the opportunity to see how companies from all different industries, all over the world, work and grow. My team and I have been fortunate enough to work with these folks...</p>

    <h2>Other roles</h2>
    <p>Outside Jellypepper, I have been fortunate enough to work with the following companies.</p>
  </Layout>
);
