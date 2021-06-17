import type { GetStaticProps, NextPage } from 'next';
import Link from '../../components/link';
import Layout from "../../components/layout";
import Section from "../../components/section";
import Card from "../../components/card";
import Title from "../../components/title";
import Outlink from "../../components/outlink";
import { queryAt } from "../../utils/prismic";
import jellypepper from '../../data/jellypepper.json';
import styles from './work.module.css';

type IWork = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    action_cta: string;
    action_link: PrismicLink;
    jellypepper_intro: string;
  };
  settings: PrismicSettings;
  roles: {
    uid: string;
    data: PrismicRole;
  }[];
}

type IClient = {
  id: string;
  name: string;
  projects: {
    name: string;
    link?: string;
  }[];
  roles: string[];
}

function Client({ id, name, projects, roles }: IClient) {
  projects[0].name = projects[0].name.charAt(0).toUpperCase() + projects[0].name.slice(1);

  return (
    <div id={id} key={id} className={styles.client}>
      <p>
        <span className="smallSans">
          {roles?.join(' and ')},&nbsp;
        </span>
        <span className="smallSerif">{name}</span>
      </p>
      <p className="smallSans">
        {projects.map((project, index) => {
          const projectDescription = project.link ? (
            <Link href={project.link}>{project.name}</Link>
          ) : (
            project.name
          );

          let projectDivider = <>, </>;

          if (index === projects.length - 1) {
            projectDivider = <>.</>;
          } else if (index === projects.length - 2) {
            projectDivider = <> and </>;
          }

          return (
            <span key={index}>
              {projectDescription}
              {projectDivider}
            </span>
          );
        })}
      </p>
    </div>
  )
}

function sortRoles(a, b) {
  const dateA = a.data.date.split(' — ')[0];
  const dateB = b.data.date.split(' — ')[0];
  
  return new Date(dateA) < new Date(dateB) ? 1 : -1;
}

function sortById(a: any, b: any) {
  return a.id > b.id ? 1 : -1;
}

const Work: NextPage<IWork> = ({ data, roles, settings }) => (
  <Layout
    title={data.title}
    description={data.description}
    settings={settings}
  >
    <Title title={data.hero_title} />

    {roles.sort(sortRoles).map((role, index) => (
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
      <p className={styles.jellypepperTitle}>{data.jellypepper_intro}</p>
      <div className={styles.clients}>
        <div className={styles.listHeader}>
          <p className="smallSans">Client</p>
          <p className="smallSans">Project</p>
        </div>
        {jellypepper.sort(sortById).map(Client)}
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
