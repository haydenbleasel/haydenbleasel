import type { GetStaticProps, GetStaticPaths } from 'next';
import Layout from "../../../components/layout";
import Section from "../../../components/section";
// import Title from "../../../components/title";
import { queryAt, richtext } from "../../../utils/prismic";

type ICaseStudy = {
  data: {
    title: string;
    description: string;
    content: PrismicRichText
  } & any;
  settings: PrismicSettings;
};

const CaseStudy = ({ data, settings }: ICaseStudy) => (
  <Layout
    title={data.title}
    description={data.description}
    settings={settings}
  >
    <Section>
      {data.title}

      <div style={{ gridColumn: '1 / 13' }} dangerouslySetInnerHTML={{ __html: richtext(data.content) }} />
    </Section>
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await queryAt('my.case_study.uid', params?.uid as string);
  const { data: settings } = await queryAt('document.type', 'settings');

  return {
    props: {
      data,
      settings,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const caseStudies = await queryAt('document.type', 'case_study');

  const paths = [caseStudies].map(({ uid }) => (
    { params: { uid } }
  ));

  return {
    paths,
    fallback: false,
  }
}

export default CaseStudy;
