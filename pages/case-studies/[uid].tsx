import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { createElement, useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';
import type { FormEvent } from 'react';
import slugify from 'slugify';
import { trackGoal } from 'fathom-client';
import Layout from "../../components/layout";
import Form from "../../components/form";
import Section from "../../components/section";
import Title from '../../components/title';
import { queryAt, richtext } from "../../utils/prismic";
import styles from './caseStudy.module.css';
import PrismicImage from '../../components/prismicImage';

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

const elements = {
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading5: 'h5',
  heading6: 'h6',
  paragraph: 'p'
};

function createTextElement(children: any, element: any, props: any) {
  return createElement(
    elements[element.type],
    {
      dangerouslySetInnerHTML: { __html: children.join('') },
      ...props,
    },
  );
}

function Slice ({ slice_type, primary }, index) {
  if (slice_type === 'rich_text') {
    return (
      <div key={index} dangerouslySetInnerHTML={{
        __html: richtext(primary.text, false, {
          heading1: ({ children, element }) => createTextElement(children, element, { className: 'h1Sans', id: slugElement(element) }),
          heading2: ({ children, element }) => createTextElement(children, element, { className: 'h2Sans', id: slugElement(element) }),
          heading3: ({ children, element }) => createTextElement(children, element, { className: 'h3Sans', id: slugElement(element) }),
          heading4: ({ children, element }) => createTextElement(children, element, { className: 'h4Sans', id: slugElement(element) }),
          heading5: ({ children, element }) => createTextElement(children, element, { className: 'h5Sans', id: slugElement(element) }),
          heading6: ({ children, element }) => createTextElement(children, element, { className: 'h6Sans', id: slugElement(element) }),
          paragraph: ({ children, element }) => createTextElement(children, element, { className: 'paragraphSans' }),
        })
      }} />
    );
  }

  if (slice_type === 'image_comparison') {
    return (
      <div className={styles.comparison} key={index}>
        <ReactCompareSlider
          itemOne={
            <PrismicImage src={primary.before_image} />
          }
          itemTwo={
            <PrismicImage src={primary.after_image} />
          }
        />
        <div className={styles.comparisonSides}>
          <p className="smallSans grey">Before</p>
          <p className="smallSans">{primary.comparison_text}</p>
          <p className="smallSans grey">After</p>
        </div>
      </div>
    );
  }

  if (slice_type === 'image') {
    return (
      <div className={styles.image}>
        <PrismicImage src={primary.image} />
      </div>
    )
  }
}

const CaseStudy: NextPage<ICaseStudy> = ({ uid, settings }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [table, setTable] = useState<string>('');

  async function authenticate(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/passphrase", {
        method: "post",
        body: JSON.stringify({ uid, passphrase }),
      });

      const body = await response.json();

      if (body.error) {
        throw new Error(body.error);
      }

      const newData = await queryAt('my.case_study.uid', uid);

      setData(newData.data);
      setAuthenticated(true);

      const newTable = newData.data.body.filter(({ slice_type }) => slice_type === 'rich_text').map(({ primary }) => (
        richtext(primary.text.filter(filterHeadings), false, {
          heading1: createTableElement,
          heading2: createTableElement,
          heading3: createTableElement,
          heading4: createTableElement,
          heading5: createTableElement,
          heading6: createTableElement,
        })
      ));

      setTable(newTable.join(''));
      trackGoal(process.env.NEXT_PUBLIC_FATHOM_PROJECT_GOAL!, 0);
    } catch (error: any) {
      window.alert(error.message || 'Something went wrong.');
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
          <PrismicImage src={data.cover} width={1312} height={600} alt={`${data.title} Case Study`} />
        </div>
      </Section>
      
      <Section style={{ gridAutoFlow: 'dense' }}>
        <div className={styles.table} dangerouslySetInnerHTML={{ __html: table }} />
        <div className={styles.content}>
          {data.body.map(Slice)}
        </div>
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
