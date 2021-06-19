import type { GetStaticProps, NextPage } from 'next';
import Layout from "../../components/layout";
import Section from "../../components/section";
import Card from "../../components/card";
import Title from "../../components/title";
import Outlink from "../../components/outlink";
import { queryAt, richtext } from "../../utils/prismic";
import styles from './work.module.css';

type IWork = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    action_cta: string;
    action_link: PrismicLink;
    other_intro: string;
    jellypepper_intro: string;
    jellypepper_roles: {
      role_date: string;
      role_title: string;
      role_company: string;
      role_description: PrismicRichText;
    }[];
  };
  settings: PrismicSettings;
  roles: {
    uid: string;
    data: PrismicRole;
  }[];
}

function sortRoles(a, b) {
  const dateA = a.data.date.split(' — ')[0];
  const dateB = b.data.date.split(' — ')[0];
  
  return new Date(dateA) < new Date(dateB) ? 1 : -1;
}

function sortJellypepperRoles(a, b) {
  const dateA = a.role_date;
  const dateB = b.role_date;
  
  return new Date(dateA) < new Date(dateB) ? 1 : -1;
}

function Client({
  date,
  title,
  subtitle,
  description,
}) {
  return (
    <div className={styles.client}>
      <p className="smallSans">{date}</p>
      <p>
        <span className="paragraphSans">{title},&nbsp;</span>
        <span className="paragraphSerif">{subtitle}</span>
      </p>
      <p className="smallSans" dangerouslySetInnerHTML={{ __html: richtext(description, true) }} />
    </div>
  );
}

const Work: NextPage<IWork> = ({ data, roles, settings }) => (
  <Layout
    title={data.title}
    description={data.description}
    settings={settings}
  >
    <Title title={data.hero_title} />

    {roles.filter(({ data }) => data.featured).sort(sortRoles).map((role, index) => (
      <Section key={role.uid}>
        <Card
          caption={role.data.date}
          title={role.data.title}
          subtitle={role.data.description}
          id={role.uid}
          image={role.data.image}
          priority={!index}
        >
          {role.data.content}
        </Card>
      </Section>
    ))}

    <Section>
      <p className={styles.subtitle}>{data.other_intro}</p>
      <div className={styles.clients}>
        <div className={styles.listHeader}>
          <p className="smallSans">Date</p>
          <p className="smallSans">Role</p>
          <p className="smallSans">Description</p>
        </div>
        {roles.filter(({ data }) => !data.featured).sort(sortRoles).map((role) => (
          <Client
            key={role.uid}
            date={role.data.date}
            title={role.data.title}
            subtitle={role.data.description}
            description={role.data.content}
          />
        ))}
      </div>
    </Section>

    <Section>
      <p className={styles.subtitle}>{data.jellypepper_intro}</p>
      <div className={styles.clients}>
        <div className={styles.listHeader}>
          <p className="smallSans">Date</p>
          <p className="smallSans">Client</p>
          <p className="smallSans">Description</p>
        </div>
        {data.jellypepper_roles.sort(sortJellypepperRoles).map((role) => (
          <Client
            key={role.role_company}
            date={role.role_date}
            title={role.role_title}
            subtitle={role.role_company}
            description={role.role_description}
          />
        ))}
      </div>
    </Section>

    <Section>
      <Outlink
        link={data.action_link}
        text={data.action_cta}
      />
    </Section>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await queryAt('document.type', 'work');
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

export default Work;
