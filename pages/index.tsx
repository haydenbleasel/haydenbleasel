import Image from "next/image";
import Layout from "../components/Layout";
import Link from "../components/Link";
import Client from "../components/Client";
import Section from "../components/Section";
import styles from "./Home.module.css";
import Post from "../components/Post";
import { getDevPosts, getMediumPosts } from "../utils/journal";

const Home = ({ mediumPosts, devPosts }) => {
  return (
    <Layout
      title="Hi, I’m Hayden Bleasel. I’m a digital product designer living in Sydney, Australia."
      description="I’ve had the privilege of working with many fantastic companies including Google, Palantir, Nike, Toyota, National Geographic, Westfield, Square, Canva and Spaceship."
    >
      <Section>
        <div className={styles.heroLeft}>
          <div className={styles.asterisk}>
            <Image
              src="/images/asterisk.svg"
              layout="fixed"
              width={48}
              height={48}
            />
          </div>
        </div>
        <div className={styles.heroRight}>
          <p className="h1Sans">
            Hi, I’m Hayden Bleasel. I’m a digital product designer living in
            Sydney, Australia. I currently run and lead Product Design at{" "}
            <Client large name="Jellypepper" /> &mdash; an award-winning digital
            agency for bright ideas.
          </p>
          <p className="h1Sans">
            I’ve had the privilege of working with many fantastic companies
            including <Client large name="Google" />,{" "}
            <Client large name="Palantir" />, <Client large name="Nike" />,{" "}
            <Client large name="Toyota" />
            , <Client large name="National Geographic" />,{" "}
            <Client large name="Westfield" />, <Client large name="Square" />,{" "}
            <Client large name="Canva" /> and <Client large name="Spaceship" />.
          </p>
          <p className="h1Sans">
            <Link href="/about">Keep reading →</Link>
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
            description="I worked as a Product Design intern at Palantir’s Palo Alto HQ. I was part of a small team tasked with designing an anti-fraud focused pilot project which helped kickstart my career in Product Design."
          />
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionHeader}>
          <span className="h2Sans">Thoughts</span>
          <span className="h2Serif"> &amp; Ideas</span>
        </h2>

        {mediumPosts.slice(0, 2).map((post) => (
          <div className={styles.journal}>
            <Post {...post} />
          </div>
        ))}

        <div className={styles.journal}>
          {devPosts.slice(0, 3).map((post) => (
            <Post {...post} compact />
          ))}
        </div>
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
