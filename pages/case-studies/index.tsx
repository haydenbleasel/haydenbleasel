import type { GetStaticProps } from 'next';
import Layout from "../../components/layout";
import Section from "../../components/section";
// import Title from "../../components/title";
import { queryAt } from "../../utils/prismic";
import Link from "next/link";

type ICaseStudies = {
  data: any;
  caseStudies: any;
  settings: PrismicSettings;
};

const CaseStudies = ({ data, caseStudies, settings }: ICaseStudies) => (
  <Layout
    title={data.title}
    description={data.description}
    settings={settings}
  >
    <Section>
      {[caseStudies].map((caseStudy) => (
        <Link key={caseStudy.uid} href={`/case-studies/${caseStudy.uid}`}>{caseStudy.data.title}</Link>
      ))}
    </Section>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await queryAt('document.type', 'journal');
  const caseStudies = await queryAt('document.type', 'case_study');
  const { data: settings } = await queryAt('document.type', 'settings');

  console.log(caseStudies, 'caseStudies');

  return {
    props: {
      data,
      caseStudies,
      settings,
    },
  };
}

export default CaseStudies;
