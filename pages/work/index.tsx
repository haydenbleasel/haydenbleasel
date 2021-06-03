import Layout from "../../components/layout";
import Section from "../../components/section";
import Role from "../../components/role";
import Title from "../../components/title";
import Outlink from "../../components/outlink";
import { queryAt } from "../../utils/prismic";

type IWork = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    action_cta: string;
    action_link: PrismicLink;
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

const Work = ({ data, roles, settings }: IWork) => (
  <Layout
    title={data.title}
    description={data.description}
    settings={settings}
  >
    <Title title={data.hero_title} />

    <Section>
      {roles.sort(sortRoles).map((role, index) => (
        <Role
          key={role.uid}
          caption={role.data.date}
          title={role.data.title}
          subtitle={role.data.description}
          id={role.uid}
          image={role.data.image}
          priority={!index}
        >
          {role.data.content}
        </Role>
      ))}

      <Outlink
        link={data.action_link}
        text={data.action_cta}
      />
    </Section>
  </Layout>
);

export async function getStaticProps() {
  const { data } = await queryAt('document.type', 'work');
  const roles = await queryAt('document.type', 'role');
  const { data: settings } = await queryAt('document.type', 'settings');

  console.log(data, 'data')

  return {
    props: {
      data,
      roles,
      settings,
    },
  };
}

export default Work;
