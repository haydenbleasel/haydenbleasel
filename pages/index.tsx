import React from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Feature from '../components/Feature';

import styles from './Home.module.css';
import ArrowLink from '../components/ArrowLink';

const Home = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    
    <Hero
      title="Hayden Bleasel"
      description="27-year-old digital product designer, JavaScript developer and entrepreneur of sorts based in Sydney, Australia."
      actions={[
        { href: '/contact', children: 'Get in touch' }
      ]}
    />

    <div className={styles.cover}>
      <Image
        layout="responsive"
        width={1314}
        height={740}
        src="/images/home/haydenbleasel.jpg"
        alt="Hayden Bleasel"
        objectFit="cover"
      />
    </div>

    <div className={styles.intro}>
      <p className="heading-5">I help companies elevate their experiences through their brand, websites and products by taking their awesome ideas from concept to launch.</p>
      <p className="heading-5">Here’s what I’m currently doing...</p>
    </div>

    <div className={styles.features}>
    
      <Feature
        image="/images/home/jellypepper.png"
        title="Jellypepper"
        description="I’m the creative director of an award-winning digital agency for bright ideas. We’ve helped a wide range of companies and startups that share our values create brands, websites and products that are thoughtful and beautiful."
      >
        <a href="https://jellypepper.com/" rel="noopener noreferrer">
          <ArrowLink color="#f12369">Visit the website</ArrowLink>
        </a>
      </Feature>

      <Feature
        reverse
        image="/images/home/neutral.png"
        title="Neutral"
        description="After hours, I work on an app for combating climate change through reforestation programs. We ask you a few key questions about your lifestyle, spending and utility bills, then combine this information with country averages and formulas from the U.S. EPA to calculate a score that measures how sustainable you live."
      >
        <a href="https://tryneutral.com/" rel="noopener noreferrer">
          <ArrowLink color="#068466">Download Neutral</ArrowLink>
        </a>
      </Feature>

      <Feature
        image="/images/home/tomorrow.png"
        title="Tomorrow"
        description="I’m also half of a tiny product incubator for delightful products. Our first product is Bokeh — an intelligent portfolio platform for professional photographers. We just launched, but if you join the mailing list, we’ll keep you in the loop."
      >
        <a href="https://tomorrowstudio.co/" rel="noopener noreferrer">
          <ArrowLink color="#5F49E3">Join the mailing list</ArrowLink>
        </a>
      </Feature>
    
    </div>

    <div className={styles.focus}>
      <p>Before all this, I was Head of Product at Spaceship, product design intern at Palantir in Palo Alto and a bunch of other roles you can read about here.</p>
      <p>In 2016, I graduated from the University of Technology, Sydney with two Bachelors degrees. During this time, I created a product for job seekers called Presumi that I ended up licensing to SEEK in Hong Kong.</p>
      <p>In my spare time, I enjoy mentoring entrepreneurs, advising startups, going to the gym, learning guitar, speaking at events, curating Spotify playlists, playing video games, making apps and learning new things.</p>
    </div>
  </Layout>
);

export default Home;