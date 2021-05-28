import Layout from "../../components/layout";
import Post from "../../components/post";
import styles from "./journal.module.css";
import Section from "../../components/section";
import Title from "../../components/title";
import { getDevPosts, getMediumPosts } from "../../utils/journal";
import Divider from "../../components/divider";

type IJournal = {
  mediumPosts: IPost[];
  devPosts: IPost[];
};

const Journal = ({ mediumPosts, devPosts }: IJournal) => (
  <Layout
    title="Thoughts, stories and ideas"
    description="I sometimes write about things I find interesting, tools I’m using and personal news. Here are some variants rants that didn't fit on Twitter."
  >
    <Title sans="Thoughts" serif="&amp; Ideas" />

    <Section>
      <div className={styles.design}>
        <Divider text="Design and everything else" />

        <div className={styles.designPosts}>
          {mediumPosts.map((post, index) => (
            <div className={styles.post} key={post.id}>
              <Post {...post} featured={index === 0} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.technical}>
        <Divider text="Technical" />

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
  const mediumPosts = await getMediumPosts();
  const devPosts = await getDevPosts();

  return {
    props: {
      mediumPosts,
      devPosts,
    },
  };
}

export default Journal;
