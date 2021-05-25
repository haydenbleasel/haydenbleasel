import { useState } from "react";
import styles from "./about.module.css";
import Layout from "../../components/layout";
import { siteUrl } from "../../next-sitemap";
import Section from "../../components/section";
import Link from "../../components/link";
import Client from "../../components/client";
import Title from "../../components/title";
import Divider from "../../components/divider";
import events from "./events.json";
import work from "./work.json";
import interviews from "./interviews.json";

type IEvent = {
  name: string;
  organisation: string;
  year: number;
  url?: string;
};

type IRole = {
  role: string;
  company: string;
  start: string;
  end: string;
};

const Event = ({ url, name, organisation, year }: IEvent) => (
  <li key={name}>
    <p className={`${styles.eventDetails} small grey`}>
      {organisation}, {year}
    </p>
    {url ? (
      <Link href={url}>
        <span className="paragraphSans">{name}</span>
      </Link>
    ) : (
      <p className="paragraphSans">{name}</p>
    )}
  </li>
);

const Role = ({ role, company, start, end }: IRole) => (
  <li key={role} id={company} className={styles.eventLink}>
    <small className="small grey">
      {start} &mdash; {end}
    </small>
    <p className={styles.roleDetails}>
      <span className="paragraphSans">{role},</span>
      <span className="paragraphSerif"> {company}</span>
    </p>
  </li>
);

const About = () => {
  const [rolesExpanded, setRolesExpanded] = useState(false);
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const [interviewsExpanded, setInterviewsExpanded] = useState(false);

  return (
    <Layout
      title="About"
      description="I’ve been fortunate enough to speak at a few events and be interviewed by a few writers and blogs."
      image={{
        url: `${siteUrl}/images/events/sydney-designers.jpg`,
        width: 4032,
        height: 3024,
      }}
    >
      <Title sans="About" serif="Me" />

      <Section>
        <div className={styles.bio}>
          <div>
            <Divider text="Introduction" />

            <p className="h3Sans">
              Hi, I’m Hayden Bleasel. I’m a digital product designer living in
              Sydney, Australia. I enjoy reducing complex problems into
              thoughtful solutions that balance simplicity, functionality and
              accessibility.
            </p>
            <p className="h3Sans">
              I help companies make experiences their customers love by
              collaborating closely with cross-functional teams and partnering
              with other teams in Engineering, Research and more to take ideas
              from concept to launch to growth.
            </p>
            <p className="h3Sans">
              My primary focus is product design for iOS, Android and Web. I’m
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
              also enjoy working with and fostering tight-knit, collaborative
              and diverse design teams.
            </p>
            <p className="h3Sans">
              I’m also a full-stack JavaScript developer, focusing on React +
              Next for apps and websites, and React Native + Expo for native
              mobile applications.
            </p>
          </div>

          <div>
            <Divider text="Work" />

            <p className="h3Sans">
              I currently run{" "}
              <Client name="Jellypepper" link="https://jellypepper.com/" /> — an
              award-winning digital agency for bright ideas, where I manage a
              team of 5 and typically lead the product design projects.
            </p>
            <p className="h3Sans">
              I also work with <Client name="R/GA" /> every so often,
              collaborating with their strategy and design teams across
              different international offices on amazing products and campaigns.
            </p>
            <p className="h3Sans">
              After hours, I work on{" "}
              <Client name="Neutral" link="https://neutral.sh/" /> — a
              climate-focused app that combines a lifestyle questionnaire with
              U.S. EPA and other data sources to calculate your CO₂e emissions,
              then helps you offset it with a reforestation program.
            </p>
            <p className="h3Sans">
              I’m also the design half of{" "}
              <Client
                name="Tomorrow Studio"
                link="https://tomorrowstudio.co/"
              />{" "}
              — a tiny incubator for delightful products. We’re currently
              working on <Client name="Bokeh" link="https://heybokeh.com/" /> —
              a smart portfolio platform for photographers.
            </p>
          </div>

          <div>
            <Divider text="Tools" />

            <p className="h3Sans">
              My design tool of choice for anything is typically Figma - it’s
              brilliant at handling the wireframing, ideating, designing and
              collaboration aspects of my process. Plus, since FigJam came out,
              it’s been handy for brainstorming and workshops too! I previously
              used Sketch, Abstract and InVision.
            </p>
            <p className="h3Sans">
              For prototyping and animating, I typically opt for Principle due
              to it’s simplicity. Keynote works pretty well too in a pinch.
            </p>
          </div>

          <div>
            <Divider text="Life" />

            <p className="h3Sans">
              In 2016, I graduated from UTS with two Bachelors degrees —
              Business (Management) and Information Technology (Enterprise
              Systems Development).
            </p>
            <p className="h3Sans">
              In my spare time, I like to mentor young designers and
              entrepreneurs, advise startups, go to the gym, speak at events,{" "}
              <Link href="https://open.spotify.com/user/haydenbleasel">
                make Spotify playlists
              </Link>
              , play video games, make apps and learn new things.
            </p>
            <p className="h3Sans">
              I also{" "}
              <Link href="https://www.meetup.com/en-AU/sydney-designers/">
                started a design meetup
              </Link>{" "}
              and used to work on{" "}
              <Link href="https://www.npmjs.com/package/favicons">
                open-source software
              </Link>
              .
            </p>
          </div>
        </div>
        <div className={styles.sidebar}>
          <div>
            <Divider text="Work" />

            <ul
              className={`${styles.list} ${
                rolesExpanded ? styles.expanded : ""
              }`}
            >
              {work.map(Role)}
            </ul>
            {!rolesExpanded && (
              <p
                className={`small underline grey ${styles.expand}`}
                onClick={() => setRolesExpanded(true)}
              >
                Show more
              </p>
            )}
          </div>
          <div>
            <Divider text="Speaking Events" />

            <ul
              className={`${styles.list} ${
                eventsExpanded ? styles.expanded : ""
              }`}
            >
              {events.map(Event)}
            </ul>
            {!eventsExpanded && (
              <p
                className={`small underline grey ${styles.expand}`}
                onClick={() => setEventsExpanded(true)}
              >
                Show more
              </p>
            )}
          </div>
          <div>
            <Divider text="Interviews &amp; Features" />

            <ul
              className={`${styles.list} ${
                interviewsExpanded ? styles.expanded : ""
              }`}
            >
              {interviews.map(Event)}
            </ul>
            {!interviewsExpanded && (
              <p
                className={`small underline grey ${styles.expand}`}
                onClick={() => setInterviewsExpanded(true)}
              >
                Show more
              </p>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default About;
