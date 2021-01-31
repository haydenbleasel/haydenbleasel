import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Fade from 'react-reveal/Fade';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Feature from '../components/Feature';
import styles from './Home.module.css';
import ArrowLink from '../components/ArrowLink';
import Link from '../components/Link';

function calculateAge(currentTime: number) {
  const birthDateTime = new Date(1993, 10, 26).getTime();
  const difference = (currentTime - birthDateTime);
  
  return difference / (1000 * 60 * 60 * 24 * 365);
}

const Home = () => {
  const timeOnStart = new Date().getTime();
  const ageOnStart = calculateAge(timeOnStart);
  
  const [age, setAge] = useState(ageOnStart);
  const [fix, setFix] = useState(0);

  useEffect(() => {
    const ageInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const newAge = calculateAge(currentTime);
      setAge(newAge);
    }, 50);

    return () => clearInterval(ageInterval);
  }, []);

  return (
    <Layout
      title="Digital product designer, JavaScript developer and entrepreneur"
      description="I help companies elevate their experiences through their brand, websites and products by taking their awesome ideas from concept to launch."
    >

      <div className={styles.avatar}>
        <Fade bottom>
          <Image
            layout="fixed"
            width={72}
            height={72}
            src="/images/home/haydenbleasel.jpg"
            alt="Hayden Bleasel"
            quality={100}
            objectFit="cover"
            objectPosition="43% center"
            loading="eager"
          />
        </Fade>
      </div>
    
      <Hero
        title="Hayden Bleasel"
        description={(
          <p>
            <span className={styles.age} onClick={() => setFix(fix === 9 ? 0 : 9)}>
              {age.toFixed(fix)}
            </span>
            -year-old digital product designer, JavaScript developer and entrepreneur of sorts based in Sydney, Australia.
          </p>
        )}
      >
        <ArrowLink href="/contact">Get in touch</ArrowLink>
      </Hero>

      <div className={styles.cover}>
        <Fade delay={800}>
          <Image
            layout="responsive"
            width={6000}
            height={4000}
            src="/images/home/haydenbleasel.jpg"
            alt="Hayden Bleasel"
            quality={100}
            loading="eager"
          />
        </Fade>
      </div>

      <Fade>
        <div className={styles.intro}>
          <p className="heading-5">I help companies elevate their experiences through their brand, websites and products by taking their awesome ideas from concept to launch.</p>
          <p className="heading-5">Here’s what I’m currently doing...</p>
        </div>
      </Fade>

      <div className={styles.features}>
      
        <Fade>
          <Feature
            image="/images/home/jellypepper.png"
            title="Jellypepper"
            description="I’m the creative director of an award-winning digital agency for bright ideas. We’ve helped a wide range of companies and startups that share our values create brands, websites and products that are thoughtful and beautiful."
          >
            <ArrowLink href="https://jellypepper.com/" color="#E60067">Visit the website</ArrowLink>
          </Feature>
        </Fade>

        <Fade>
          <Feature
            reverse
            image="/images/home/neutral.png"
            title="Neutral"
            description="After hours, I work on an app for combating climate change through reforestation programs. We ask you a few key questions about your lifestyle, spending and utility bills, then combine this information with country averages and formulas from the U.S. EPA to calculate a score that measures how sustainable you live."
          >
            <ArrowLink href="https://tryneutral.com/" color="#068466">Download Neutral</ArrowLink>
          </Feature>
        </Fade>

        <Fade>
          <Feature
            image="/images/home/tomorrow.png"
            title="Tomorrow"
            description="I’m also half of a tiny product incubator for delightful products. Our first product is Bokeh — an intelligent portfolio platform for professional photographers. We just launched, but if you join the mailing list, we’ll keep you in the loop."
          >
            <ArrowLink href="https://tomorrowstudio.co/" color="#5F49E3">Join the mailing list</ArrowLink>
          </Feature>
        </Fade>

      </div>

      <div className={styles.focus}>
        <Fade>
          <p>Before all this, I was Head of Product at Spaceship, product design intern at Palantir in Palo Alto and a bunch of other roles <Link href="/work">you can read about</Link>.</p>
        </Fade>
        <Fade delay={200}>
          <p>In 2016, I graduated from the University of Technology, Sydney with two Bachelors degrees. During this time, I created a product for job seekers called <Link href="/thoughts/presumi">Presumi</Link> that I ended up licensing to SEEK in Hong Kong.</p>
        </Fade>
        <Fade delay={400}>
          <p>In my spare time, I enjoy mentoring entrepreneurs, advising startups, going to the gym, speaking at events, curating <Link href="/playlists">Spotify playlists</Link>, playing video games, making apps and learning new things.</p>
        </Fade>
      </div>
    </Layout>
  );
}

export default Home;