import Image from "next/image";
import Layout from "../components/layout";
import Link from "../components/link";
import Client from "../components/client";
import Section from "../components/section";
import Post from "../components/post";
import Outlink from "../components/outlink";
import { getDevPosts, getMediumPosts } from "../utils/journal";
import styles from "./home.module.css";

const Home = ({ mediumPosts, devPosts }) => (
  <Layout
    title="Digital Product Designer from Sydney, Australia"
    description="I’ve had the privilege of working with many fantastic companies including Google, Palantir, Nike, Toyota, National Geographic, Westfield, Square, Canva and Spaceship."
  >
    <Section>
      <div className={styles.heroLeft}>
        <div className={styles.asterisk}>
          <Image
            src="/images/home/asterisk.svg"
            layout="fixed"
            width={48}
            height={48}
            alt="Hello there"
          />
        </div>
      </div>
      <div className={styles.heroRight}>
        <p className="h1Sans">
          Hi, I’m Hayden Bleasel. I’m a digital Product Designer living in
          Sydney, Australia. I currently run and lead product design at{" "}
          <Client large name="Jellypepper" link="https://jellypepper.com/" />{" "}
          &mdash; an award-winning digital agency for bright ideas.
        </p>
        <p className="h1Sans">
          I’ve had the privilege of working with many fantastic companies
          including{" "}
          <Client large name="Google" link="https://www.google.com/" />,{" "}
          <Client large name="Palantir" link="https://www.palantir.com/" />,{" "}
          <Client large name="Nike" link="https://www.nike.com/" />,{" "}
          <Client large name="Toyota" link="https://www.toyota.com.au/" />,{" "}
          <Client
            large
            name="National Geographic"
            link="https://www.disney.com.au/national-geographic/"
          />
          ,{" "}
          <Client large name="Westfield" link="https://www.westfield.com.au/" />
          , <Client
            large
            name="Square"
            link="https://squareup.com/au/en"
          />, <Client large name="Canva" link="https://www.canva.com/en_au/" />{" "}
          and{" "}
          <Client large name="Spaceship" link="https://www.spaceship.com.au/" />
          .
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
        {devPosts.slice(0, mediumPosts.length < 2 ? 4 : 3).map((post) => (
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
