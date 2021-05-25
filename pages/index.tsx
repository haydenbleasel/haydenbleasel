import Layout from "../components/layout";
import Link from "../components/link";
import Client from "../components/client";
import Section from "../components/section";
import Post from "../components/post";
import Outlink from "../components/outlink";
import { getDevPosts, getMediumPosts } from "../utils/journal";
import styles from "./home.module.css";

import Jellypepper from '../public/images/companies/jellypepper.svg';
import Google from '../public/images/companies/google.svg';
import Palantir from '../public/images/companies/palantir.svg';
import Nike from '../public/images/companies/nike.svg';
import Toyota from '../public/images/companies/toyota.svg';
import NationalGeographic from '../public/images/companies/natgeo.svg';
import Westfield from '../public/images/companies/westfield.svg';
import Square from '../public/images/companies/square.svg';
import Canva from '../public/images/companies/canva.svg';
import Spaceship from '../public/images/companies/spaceship.svg';
import Asterisk from '../public/images/home/asterisk.svg';

const Home = ({ mediumPosts, devPosts }) => {
  return (
    <Layout
      title="Hi, I’m Hayden Bleasel. I’m a digital product designer living in Sydney, Australia."
      description="I’ve had the privilege of working with many fantastic companies including Google, Palantir, Nike, Toyota, National Geographic, Westfield, Square, Canva and Spaceship."
    >
      <Section>
        <div className={styles.heroLeft}>
          <div className={styles.asterisk}>
            <Asterisk />
          </div>
        </div>
        <div className={styles.heroRight}>
          <p className="h1Sans">
            Hi, I’m Hayden Bleasel. I’m a digital product designer living in
            Sydney, Australia. I currently run and lead product design at{" "}
            <Client
              large
              name="Jellypepper"
              image={Jellypepper}
              link="https://jellypepper.com/"
            />{" "}
            &mdash; an award-winning digital agency for bright ideas.
          </p>
          <p className="h1Sans">
            I’ve had the privilege of working with many fantastic companies
            including <Client large name="Google" image={Google} />,{" "}
            <Client large name="Palantir" image={Palantir} />,{" "}
            <Client large name="Nike" image={Nike} />,{" "}
            <Client large name="Toyota" image={Toyota} />
            ,{" "}
            <Client
              large
              name="National Geographic"
              image={NationalGeographic}
            />
            , <Client large name="Westfield" image={Westfield} />,{" "}
            <Client large name="Square" image={Square} />,{" "}
            <Client large name="Canva" image={Canva} /> and{" "}
            <Client large name="Spaceship" image={Spaceship} />.
          </p>
          <p className="h1Sans">
            <Link href="/about">
              <span className="underline">Keep reading</span> →
            </Link>
          </p>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionHeader}>
          <span className="h2Sans">Selected</span>
          <span className="h2Serif"> Work</span>
        </h2>
        <div className={styles.work}>
          <Post
            image="/images/work/spaceship.png"
            focus="center left"
            caption="2016 &mdash; 2017"
            title="Head of Product and Design at Spaceship"
            link="/work#spaceship"
            description="I joined Spaceship in September 2016 where I helped grow a waitlist of 28,000 people, design and build the marketing website and superannuation portal, as well as the design system that ran our apps."
          />
        </div>
        <div className={styles.work}>
          <Post
            image="/images/work/palantir.png"
            caption="2015"
            title="Product Design Intern at Palantir Technologies"
            link="/work#palantir"
            description="I worked as a Product Design intern at Palantir’s Palo Alto HQ. I was part of a small team tasked with designing an anti-fraud focused pilot project which helped kickstart my career in product design."
          />
        </div>

        <Outlink link="/work" text="View more work" />
      </Section>

      <Section>
        <h2 className={styles.sectionHeader}>
          <span className="h2Sans">Thoughts</span>
          <span className="h2Serif"> &amp; Ideas</span>
        </h2>

        <div className={styles.designPosts}>
          {mediumPosts.slice(0, 2).map((post) => (
            <Post key={post.title} {...post} />
          ))}
        </div>

        <div className={styles.technicalPosts}>
          {devPosts.slice(0, 3).map((post) => (
            <Post key={post.title} {...post} compact />
          ))}
        </div>

        <Outlink link="/journal" text="View more posts" />
      </Section>

      <Section>
        <h2 className={styles.sectionHeader}>
          <span className="h2Sans">Projects</span>
          <span className="h2Serif"> &amp; Apps</span>
        </h2>
        <div className={styles.project}>
          <Post
            image="/images/projects/neutral.png"
            title="Neutral"
            description="Climate-focused app that combines a lifestyle questionnaire with U.S. EPA and other data sources to calculate your CO₂e emissions, then helps you offset it with a reforestation program."
            link="/projects#neutral"
          />
        </div>
        <div className={styles.project}>
          <Post
            image="/images/projects/bokeh.png"
            title="Bokeh"
            description="Take control of your photography career with an intelligent portfolio platform for professional photographers that grows with your work. Bokeh is currently in private beta, but you can join the waitlist."
            link="/projects#bokeh"
          />
        </div>

        <Outlink link="/projects" text="View more projects" />
      </Section>
    </Layout>
  );
};

export async function getStaticProps() {
  const mediumPosts = await getMediumPosts();
  const devPosts = await getDevPosts();

  return {
    props: {
      mediumPosts,
      devPosts,
    },
  };
}

export default Home;
