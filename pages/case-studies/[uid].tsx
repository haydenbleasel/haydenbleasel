import type { GetStaticProps, GetStaticPaths } from 'next';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import slugify from 'slugify';
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

function filterHeadings({ type }) {
  return type.startsWith('heading');
}

function slugElement({ text }) {
  return slugify(text, { lower: true, strict: true });
}

function createTableElement({ element }) {
  const id = slugElement(element);

  return (
    <div className={`paragraphSans ${styles[element.type]}`}>
      <a href={`#${id}`}>{element.text}</a>
    </div>
  );
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
        throw new Error(body.message);
      }

      const newData = await queryAt('my.case_study.uid', uid);

      setData(newData.data);
      setAuthenticated(true);
    } catch (error: any) {
      window.alert(error.message);
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
        <div className={styles.cover}>
          <Image src={data.cover.url} width={1312} height={600} layout="responsive" alt={`${data.title} Case Study`} />
        </div>
      </Section>
      
      <Section style={{ gridAutoFlow: 'dense' }}>
        <div className={styles.table} dangerouslySetInnerHTML={{ __html: richtext(data.content.filter(filterHeadings), false, {
          heading1: createTableElement,
          heading2: createTableElement,
          heading3: createTableElement,
          heading4: createTableElement,
          heading5: createTableElement,
          heading6: createTableElement,
        })}} />
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: richtext(data.content, false, {
          heading1: ({ children, element }) => <h1 id={slugElement(element)} className="h1Sans" dangerouslySetInnerHTML={{ __html: children.join('')}} />,
          heading2: ({ children, element }) => <h2 id={slugElement(element)} className="h2Sans" dangerouslySetInnerHTML={{ __html: children.join('')}} />,
          heading3: ({ children, element }) => <h3 id={slugElement(element)} className="h3Sans" dangerouslySetInnerHTML={{ __html: children.join('')}} />,
          heading4: ({ children, element }) => <h4 id={slugElement(element)} className="h4Sans" dangerouslySetInnerHTML={{ __html: children.join('')}} />,
          heading5: ({ children, element }) => <h5 id={slugElement(element)} className="h5Sans" dangerouslySetInnerHTML={{ __html: children.join('')}} />,
          heading6: ({ children, element }) => <h6 id={slugElement(element)} className="h6Sans" dangerouslySetInnerHTML={{ __html: children.join('')}} />,
          paragraph: ({ children }) => <p className="paragraphSans" dangerouslySetInnerHTML={{ __html: children.join('')}} />,
        }) }} />
      </Section>
    </Layout>
  ) : (
    <Layout title="Enter passphrase" description="Enter a passphrase" settings={settings}>
      <Section style={{ minHeight: 400, height: '50vh', alignItems: 'center' }}>
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
