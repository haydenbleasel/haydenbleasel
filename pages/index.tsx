import Image from "next/image";
import Layout from "../components/Layout";
import Link from "../components/Link";
import Client from "../components/Client";
import Section from "../components/Section";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <Layout
      title="Hi, I’m Hayden Bleasel. I’m a digital product designer living in Sydney, Australia."
      description="I’ve had the privilege of working with many fantastic companies including Google, Palantir, Nike, Toyota, National Geographic, Westfield, Square, Canva and Spaceship."
    >
      
      <Section>
        <div className={styles.heroLeft}>
          <Image
            src="/images/asterisk.svg"
            layout="fixed"
            width={48}
            height={48}
          />
        </div>
        <div className={styles.heroRight}>
          <p className="h1Sans">
            Hi, I’m Hayden Bleasel. I’m a digital product designer living in
            Sydney, Australia. I currently spend my days running and designing
            at <Client size={32} name="Jellypepper" /> &mdash; an award-winning digital
            agency for bright ideas.
          </p>
          <p className="h1Sans">
            I’ve had the privilege of working with many fantastic companies
            including <Client size={32} name="Google" />, <Client size={32} name="Palantir" />,{" "}
            <Client size={32} name="Nike" />, <Client size={32} name="Toyota" />,{" "}
            <Client size={32} name="National Geographic" />, <Client size={32} name="Westfield" />,{" "}
            <Client size={32} name="Square" />, <Client size={32} name="Canva" /> and{" "}
            <Client size={32} name="Spaceship" />.
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
          <div style={{ height: 390, background: "var(--ghost)" }} />
          <p className="verySmall">2016 &mdash; 2017</p>
          <h3 className="h4Sans">Head of Product and Design at Spaceship</h3>
        </div>
        <div className={styles.work}>
          <div style={{ height: 390, background: "var(--ghost)" }} />
          <p className="verySmall">2015</p>
          <h3 className="h4Sans">
            Product Design Intern at Palantir Technologies
          </h3>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionHeader}>
          <span className="h2Sans">Thoughts</span>
          <span className="h2Serif"> &amp; Ideas</span>
        </h2>
        <div className={styles.journal}>
          <div style={{ height: 390, background: "var(--ghost)" }} />
          <h3 className="h4Sans">
            How I started a data analytics startup and partnered with SEEK.
          </h3>
        </div>
        <div className={styles.journal}>
          <div style={{ height: 390, background: "var(--ghost)" }} />
          <h3 className="h4Sans">
            Finding some inner peace through simplicity and focus
          </h3>
        </div>
        <div className={styles.journal}>
          <div>
            <p className="verySmall">May, 2020</p>
            <h3 className="paragraph">
              Finding some inner peace through simplicity and focus
            </h3>
          </div>
          <div>
            <p className="verySmall">May, 2020</p>
            <h3 className="paragraph">
              Finding some inner peace through simplicity and focus
            </h3>
          </div>
          <div>
            <p className="verySmall">May, 2020</p>
            <h3 className="paragraph">
              Finding some inner peace through simplicity and focus
            </h3>
          </div>
          <div>
            <p className="verySmall">May, 2020</p>
            <h3 className="paragraph">
              Finding some inner peace through simplicity and focus
            </h3>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className={styles.sectionHeader}>
          <span className="h2Sans">Projects</span>
          <span className="h2Serif"> &amp; Apps</span>
        </h2>
        <div className={styles.project}>
          <div style={{ height: 390, background: "var(--ghost)" }} />
          <h3 className="h4Sans">Neutral</h3>
          <p className="paragraph">
            Climate-focused app that combines a lifestyle questionnaire with
            U.S. EPA and other data sources to calculate your CO₂e emissions,
            then helps you offset it with a reforestation program.
          </p>
        </div>
        <div className={styles.project}>
          <div style={{ height: 390, background: "var(--ghost)" }} />
          <h3 className="h4Sans">Bokeh</h3>
          <p className="paragraph">
            Take control of your photography career with an intelligent
            portfolio platform for professional photographers that grows with
            your work. Bokeh is currently in private beta, but you can join the
            waitlist.
          </p>
        </div>
      </Section>
    </Layout>
  );
};

export default Home;
