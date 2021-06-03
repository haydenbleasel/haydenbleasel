import Layout from "../../components/layout";
import Post from "../../components/post";
import styles from "./journal.module.css";
import Section from "../../components/section";
import Title from "../../components/title";
import { getDevPosts, getMediumPosts } from "../../utils/journal";
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

const Journal = ({ data, settings, mediumPosts, devPosts }: IJournal) => (
  <Layout
    title={data.title}
    description={data.description}
    settings={settings}
  >
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

export async function getStaticProps() {
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
