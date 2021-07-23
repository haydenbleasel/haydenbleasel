import type { GetStaticProps, NextPage } from 'next';
import Layout from "../../components/layout";
import Section from "../../components/section";
import Card from "../../components/card";
import Title from "../../components/title";
import { queryAt } from "../../utils/prismic";

type IProjects = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
  };
  settings: PrismicSettings;
  projects: {
    uid: string;
    data: PrismicProject;
  }[];
}

function sortProjects(a, b) {
  const order = ['neutral', 'bokeh', 'presumi'];

  return order.indexOf(a.uid) > order.indexOf(b.uid) ? 1 : -1;
}

const Projects: NextPage<IProjects> = ({ data, settings, projects }) => (
  <Layout
    title={data.title}
    description={data.description}
    image={projects.sort(sortProjects)[0].data.image}
    settings={settings}
  >
    <Title title={data.hero_title} />

    {projects.sort(sortProjects).map((project, index) => (
      <Section key={project.uid}>
        <Card
          status={project.data.status}
          title={project.data.title}
          id={project.uid}
          subtitle={project.data.description}
          action={project.data.action_cta}
          link={project.data.action_link}
          image={project.data.image}
          priority={!index}
        >
          {project.data.content}
        </Card>
      </Section>
    ))}
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await queryAt('document.type', 'projects');
  const projects = await queryAt('document.type', 'project');
  const { data: settings } = await queryAt('document.type', 'settings');

  return {
    props: {
      data,
      projects,
      settings,
    },
  };
}

export default Projects;
