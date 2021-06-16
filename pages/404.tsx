import type { GetStaticProps } from "next";
import Layout from "../components/layout";
import Title from "../components/title";
import Section from "../components/section";
import { queryAt, richtext } from "../utils/prismic";

type ICustom404 = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    hero_description: PrismicRichText;
  };
  settings: PrismicSettings;
}

const Custom404 = ({ data, settings }: ICustom404) => (
  <Layout title={data.title} description={data.description} settings={settings}>
    <Title title={data.hero_title} />
    <Section style={{ paddingTop: 0 }}>
      <p style={{ gridColumnStart: 1, gridColumnEnd: 13, maxWidth: 700 }} dangerouslySetInnerHTML={{ __html: richtext(data.hero_description, true) }} />
    </Section>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await queryAt('document.type', 'not_found');
  const { data: settings } = await queryAt('document.type', 'settings');

  return {
    props: {
      data,
      settings,
    },
  };
}

export default Custom404;
