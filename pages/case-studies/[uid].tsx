import type { GetStaticProps, GetStaticPaths } from 'next';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Layout from "../../components/layout";
import Form from "../../components/form";
import Section from "../../components/section";
import Title from '../../components/title';
import { queryAt, richtext } from "../../utils/prismic";
import styles from './caseStudy.module.css';

type ICaseStudy = {
  uid: string;
  data: {
    title: string;
    description: string;
    content: PrismicRichText
  } & any;
  settings: PrismicSettings;
};

async function fetchPrismicData({ uid }) {
  const { data } = await queryAt('my.case_study.uid', uid);

  return data;
}

const CaseStudy = ({ uid, settings }: ICaseStudy) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  async function authenticate(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/passphrase", {
        method: "post",
        body: JSON.stringify({ uid, passphrase }),
      });

      const body = await response.json();

      if (!body.success) {
        throw new Error();
      }

      const newData = await fetchPrismicData({ uid });

      setData(newData);
      setAuthenticated(true);
    } catch (error: any) {
      window.alert("Sorry, wrong password.");
    } finally {
      setLoading(false);
    }
  }

  return authenticated ? (
    <Layout
      title={data.title}
      description={data.description}
      settings={settings}
    >
      <Title title={data.title} />
      
      <Section>
        <div style={{ gridColumn: '1 / 13' }} dangerouslySetInnerHTML={{ __html: richtext(data.content) }} />
      </Section>
    </Layout>
  ) : (
    <Layout title="Enter passphrase" description="Enter a passphrase" settings={settings}>
      <Section style={{ minHeight: '50vh', alignItems: 'center' }}>
        <Form
          name="passphrase"
          label="Passphrase"
          placeholder="Enter passphrase"
          type="text"
          value={passphrase}
          onChangeText={setPassphrase}
          loading={loading}
          onSubmit={authenticate}
        />
      </Section>
    </Layout>
  );
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { uid } = params!;
  const { data: settings } = await queryAt('document.type', 'settings');

  return {
    props: {
      uid,
      settings,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const caseStudies = await queryAt('document.type', 'case_study');
  const paths = caseStudies.map(({ uid }) => (
    { params: { uid } }
  ));

  return {
    paths,
    fallback: false,
  }
}

export default CaseStudy;
