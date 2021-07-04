import { BlogJsonLd } from 'next-seo';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from "../../components/layout";
import Post from "../../components/post";
import styles from "./journal.module.css";
import Section from "../../components/section";
import Title from "../../components/title";
import { getMediumPosts } from "../../utils/medium";
import { getDevPosts } from "../../utils/dev";
import Divider from "../../components/divider";
import { queryAt } from "../../utils/prismic";

type IJournal = {
  data: {
    title: string;
    description: string;
    hero_title: PrismicRichText;
    medium_header: string;
    dev_header: string;
  };
  settings: PrismicSettings;
  mediumPosts: IPost[];
  devPosts: IPost[];
};

const Journal: NextPage<IJournal> = ({ data, settings, mediumPosts, devPosts }) => {
  const { asPath } = useRouter();
  const dates = [
    ...mediumPosts.map((post) => post.date),
    ...devPosts.map((post) => post.date),
  ].sort();

  return (
    <Layout
      title={data.title}
      description={data.description}
      settings={settings}
    >

      <BlogJsonLd
        url={`${process.env.NEXT_PUBLIC_SITE_URL}${asPath}`}
        title={data.title}
        images={[
          ...mediumPosts.map((post) => post.image.url),
          ...devPosts.map((post) => post.image.url),
        ]}
        datePublished={new Date(dates[0]).toISOString()}
        dateModified={new Date(dates[dates.length - 1]).toISOString()}
        authorName="Hayden Bleasel"
        description={data.description}
      />

      <Title title={data.hero_title} />

      <Section>
        <div className={styles.design}>
          <Divider text={data.medium_header} />

          <div className={styles.designPosts}>
            {mediumPosts.map((post, index) => (
              <div className={styles.post} key={post.id}>
                <Post {...post} featured={index === 0} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.technical}>
          <Divider text={data.dev_header} />

          <div className={styles.technicalPosts}>
            {devPosts.map((post) => (
              <div className={styles.post} key={post.id}>
                <Post {...post} compact />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await queryAt('document.type', 'journal');
  const { data: settings } = await queryAt('document.type', 'settings');
  const mediumPosts = await getMediumPosts();
  const devPosts = await getDevPosts();

  return {
    props: {
      data,
      settings,
      mediumPosts,
      devPosts,
    },
  };
}

export default Journal;
