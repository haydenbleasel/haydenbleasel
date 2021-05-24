import { Fade } from "react-awesome-reveal";
import styles from "./About.module.css";
import Layout from "../../components/Layout";
import eventsList from "./events.json";
import workList from "./work.json";
import { siteUrl } from "../../next-sitemap";
import Section from "../../components/Section";
import Link from "../../components/Link";
import Client from "../../components/Client";

type EventItem = {
  name: string;
  organisation: string;
  year: number;
  url?: string;
};

const Event = ({ name, organisation, year }: EventItem) => (
  <span className={styles.event}>
    <span className={styles.eventName}>{name}</span>
    <span className={styles.eventMeta}>
      <span>{organisation}</span>
      <span className={styles.eventYear}>{year}</span>
    </span>
  </span>
);

const About = () => (
  <Layout
    title="About"
    description="I’ve been fortunate enough to speak at a few events and be interviewed by a few writers and blogs."
    image={{
      url: `${siteUrl}/images/events/sydney-designers.jpg`,
      width: 4032,
      height: 3024,
    }}
  >
    <Section>
      <h1>
        <span className="titleSans">About</span>
        <span className="titleSerif"> Me</span>
      </h1>
    </Section>

    <Section>
      <div className={styles.bio}>
        <div>
          <h2 className="small">Introduction</h2>
          <p className="h3Sans">
            Hi, I’m Hayden Bleasel. I’m a digital product designer living in
            Sydney, Australia. I enjoy reducing complex problems into thoughtful
            solutions that balance simplicity, functionality and accessibility.
          </p>
          <p className="h3Sans">
            I help companies make experiences their customers love by
            collaborating closely with cross-functional teams and partnering
            with other teams in Engineering, Research and more to take ideas
            from concept to launch to growth.
          </p>
          <p className="h3Sans">
            My primary focus is Product Design for iOS, Android and Web. I’m
            best at screen designs in the form of UI and UX; and creating,
            maintaining and growing design systems. I’m relatively good at
            branding, copywriting and a few others.
          </p>
          <p className="h3Sans">
            I follow a lean, iterative approach to design centred around
            empathy, constant learning and ideation; consisting of end-to-end
            visual design, prototyping, testing and measuring success of
            products and design systems.
          </p>
          <p className="h3Sans">
            While I’m typically happy owning the end-to-end design process, I
            also enjoy working with and fostering tight-knit, collaborative and
            diverse design teams.
          </p>
          <p className="h3Sans">
            I’m also a full-stack JavaScript developer, focusing on React + Next
            for apps and websites, and React Native + Expo for native mobile
            applications.
          </p>
        </div>

        <div>
          <h2 className="small">Work</h2>
          <p className="h3Sans">
            I currently run <Client name="Jellypepper" /> — an award-winning
            digital agency for bright ideas. I also work with R/GA every so
            often, collaborating with their strategy and design teams across
            different international offices on amazing products and campaigns.
          </p>
          <p className="h3Sans">
            After hours, I work on <Client name="Neutral" /> — a climate-focused
            app that combines a lifestyle questionnaire with U.S. EPA and other
            data sources to calculate your CO₂e emissions, then helps you offset
            it with a reforestation program.
          </p>
          <p className="h3Sans">
            I’m also the design half of <Client name="Tomorrow Studio" /> — a
            tiny incubator for delightful products. We’re currently working on{" "}
            <Client name="Bokeh" /> — a smart portfolio platform for
            photographers.
          </p>
        </div>

        <div>
          <h2 className="small">Tools</h2>
          <p className="h3Sans">
            My design tool of choice for anything is typically Figma - it’s
            brilliant at handling the wireframing, ideating, designing and
            collaboration aspects of my process. Plus, since FigJam came out,
            it’s been handy for brainstorming and workshops too! I previously
            used Sketch, Abstract and InVision.
          </p>
          <p className="h3Sans">
            For prototyping and animating, I typically opt for Principle due to
            it’s simplicity. Keynote works pretty well too in a pinch.
          </p>
        </div>

        <div>
          <h2 className="small">Life</h2>
          <p className="h3Sans">
            In 2016, I graduated from UTS with two Bachelors degrees — Business
            (Management) and Information Technology (Enterprise Systems
            Development).
          </p>
          <p className="h3Sans">
            In my spare time, I like to mentor young designers and
            entrepreneurs, advise startups, go to the gym, speak at events,{" "}
            <Link href="https://open.spotify.com/user/haydenbleasel">
              make Spotify playlists
            </Link>
            , play video games, make apps and learn new things.
          </p>
        </div>
      </div>
      <div className={styles.sidebar}>
        <div>
          <h2 className="small">Work</h2>
          <ul className={styles.events}>
            {(workList as any[]).map(
              ({ role, company, start, end, url }, index) => (
                <Fade triggerOnce delay={Math.min(index * 50, 500)}>
                  <li id={company}>
                    <a
                      className={styles.eventLink}
                      href={url}
                      target="noopener noreferrer"
                    >
                      <small>
                        {start} &mdash; {end}
                      </small>
                      <p>
                        <span className="paragraph">{role},</span>
                        <span className="paragraphSerif"> {company}</span>
                      </p>
                    </a>
                  </li>
                </Fade>
              )
            )}
          </ul>
        </div>
        <div>
          <h2 className="small">Speaking Events</h2>
          <ul className={styles.events}>
            {(eventsList as EventItem[]).map(({ url, ...event }, index) => (
              <Fade triggerOnce delay={Math.min(index * 50, 500)}>
                <li id={event.name}>
                  {url ? (
                    <a
                      className={styles.eventLink}
                      href={url}
                      target="noopener noreferrer"
                    >
                      <Event {...event} />
                    </a>
                  ) : (
                    <Event {...event} />
                  )}
                </li>
              </Fade>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  </Layout>
);

export default About;
