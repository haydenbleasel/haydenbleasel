import type { GetStaticProps, NextPage } from 'next';
import { useState } from "react";
import { parse } from 'date-fns';
import styles from "./about.module.css";
import Layout from "../../components/layout";
import Section from "../../components/section";
import Link from "../../components/link";
import Title from "../../components/title";
import Divider from "../../components/divider";
import { queryAt, richtext } from "../../utils/prismic";

type IAbout = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    sections: { section_title: string, section_content: PrismicRichText }[];
    work_history: {
      work_date: string;
      work_role: string;
      work_company: string;
    }[];
    speaking_events: {
      event_host: string;
      event_date: string;
      event_name: string;
      event_link: PrismicLink;
    }[];
    interviews: {
      interview_host: string;
      interview_date: string;
      interview_name: string;
      interview_link: PrismicLink;
    }[];
  };
  roles: {
    uid: string;
    data: PrismicRole;
  }[];
  settings: PrismicSettings;
}

type IItem = {
  date: string;
  title: string;
  subtitle: string;
  link?: PrismicLink;
}

const ItemInner = ({ title, subtitle }: Omit<IItem, 'date'>) => (
  <div className={styles.itemDetails}>
    <span className="paragraphSans">{title},</span>
    <span className="paragraphSerif">&nbsp;{subtitle}</span>
  </div>
)

const Item = ({ date, title, subtitle, link }: IItem) => (
  <li id={title} className={styles.eventLink}>
    <small className="smallSans grey">
      {date}
    </small>
    {link ? (
      <Link className={styles.itemLink} href={link}>
        <ItemInner title={title} subtitle={subtitle} />
      </Link>
    ) : (
      <ItemInner title={title} subtitle={subtitle} />
    )}
  </li>
);

function sortRoles(a, b) {
  const dateA = a.data.date.split(' — ')[0];
  const dateB = b.data.date.split(' — ')[0];
  
  return dateA < dateB ? 1 : -1;
}

function sortEvents(a, b) {
  return a.event_date < b.event_date ? 1 : -1;
}

function sortInterviews(a, b) {
  return a.interview_date < b.interview_date ? 1 : -1;
}

const About: NextPage<IAbout> = ({ data, roles, settings }) => {
  const [rolesExpanded, setRolesExpanded] = useState(false);
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const [interviewsExpanded, setInterviewsExpanded] = useState(false);

  function filterRoles({ data }) {
    if (rolesExpanded) {
      return true;
    } else {
      return data.title.toLowerCase().includes('design');
    }
  }

  function sliceList(expanded: boolean) {
    return expanded ? [] : [0, 5];
  }

  return (
    <Layout
      title={data.title}
      description={data.description}
      settings={settings}
    >
      <Title title={data.hero_title} />

      <Section>
        <div className={styles.bio}>
          {data.sections.map((section) => (
            <div key={section.section_title}>
              <Divider text={section.section_title} />

              <div className="h3Sans" dangerouslySetInnerHTML={{ __html: richtext(section.section_content) }} />
            </div>
          ))}
        </div>
        
        <div className={styles.sidebar}>
          <div>
            <Divider text="Work History" />

            <ul className={styles.list}>
              {roles.sort(sortRoles).filter(filterRoles).slice(...sliceList(rolesExpanded)).map(({ data }, index) => (
                <Item
                  key={`${data.description}-${index}`}
                  date={data.date}
                  title={data.title}
                  subtitle={data.description}
                />
              ))}
            </ul>
            {!rolesExpanded && (
              <p
                className={`smallSans underline grey ${styles.expand}`}
                onClick={() => setRolesExpanded(true)}
              >
                Show more
              </p>
            )}
          </div>
          <div>
            <Divider text="Speaking Events" />

            <ul
              className={styles.list}
            >
              {data.speaking_events.sort(sortEvents).slice(...sliceList(eventsExpanded)).map((item, index) => (
                <Item
                  key={`${item.event_name}-${index}`}
                  date={item.event_date}
                  title={item.event_name}
                  subtitle={item.event_host}
                  link={item.event_link}
                />
              ))}
            </ul>
            {!eventsExpanded && (
              <p
                className={`smallSans underline grey ${styles.expand}`}
                onClick={() => setEventsExpanded(true)}
              >
                Show more
              </p>
            )}
          </div>
          <div>
            <Divider text="Interviews &amp; Features" />

            <ul className={styles.list}>
              {data.interviews.sort(sortInterviews).slice(...sliceList(interviewsExpanded)).map((item, index) => (
                <Item
                  key={`${item.interview_name}-${index}`}
                  date={item.interview_date}
                  title={item.interview_name}
                  subtitle={item.interview_host}
                  link={item.interview_link}
                />
              ))}
            </ul>
            {!interviewsExpanded && (
              <p
                className={`smallSans underline grey ${styles.expand}`}
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await queryAt('document.type', 'about');
  const roles = await queryAt('document.type', 'role');
  const { data: settings } = await queryAt('document.type', 'settings');

  return {
    props: {
      data,
      roles,
      settings,
    },
  };
}

export default About;
