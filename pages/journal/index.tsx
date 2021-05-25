import { Fade } from "react-awesome-reveal";
import Layout from "../../components/layout";
import Post from "../../components/post";

import styles from "./Journal.module.css";
import Section from "../../components/section";
import Title from "../../components/title";
import { getDevPosts, getMediumPosts } from '../../utils/journal';
import Divider from "../../components/divider";

type IPost = {
  title: string;
  id: string;
  date: string;
  summary: string;
  image: string;
  link: string;
}

type IJournal = {
  mediumPosts: IPost[];
  devPosts: IPost[];
};

const Journal = ({ mediumPosts, devPosts }: IJournal) => (
  <Layout
    title="Thoughts, stories and ideas"
    description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
  >
    <Title sans="Thoughts" serif="&amp; Ideas" />

    <Section>
      <div className={styles.design}>
        <Divider text="Design and everything else" />

        <div className={styles.posts}>
          {mediumPosts.map((post, index) => (
            <div className={styles.post} key={post.title}>
              <Fade triggerOnce delay={800}>
                <Post {...post} featured={index === 0} />
              </Fade>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.technical}>
        <Divider text="Technical" />

        {devPosts.map((post) => (
          <div className={styles.post} key={post.title}>
            <Fade triggerOnce delay={800}>
              <Post {...post} compact />
            </Fade>
          </div>
        ))}
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
