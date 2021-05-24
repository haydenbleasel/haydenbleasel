import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import dayjs from "dayjs";
import slugify from "slugify";
import { Fade } from "react-awesome-reveal";
import Layout from "../../components/Layout";
import Post from "../../components/Post";

import styles from "./Journal.module.css";
import Section from "../../components/Section";

type Post = {
  title: string;
  id: string;
  date: string;
  summary: string;
  image: string;
};

type MediumPost = {
  title: string;
  link: string;
  guid: string;
  isoDate: string;
  categories: string[];
  "content:encoded": string;
};

type BlogProps = {
  posts: Post[];
};

const Journal = ({ posts }: BlogProps) => (
  <Layout
    title="Thoughts, stories and ideas"
    description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
  >
    <Section>
      <h1>
        <span className="titleSans">Thoughts</span>
        <span className="titleSerif"> &amp; Ideas</span>
      </h1>
    </Section>

    <Section>
      {posts.map(({ title, id, date, summary, image }, index) => (
        <div className={styles.post} key={id}>
          <Fade triggerOnce delay={800}>
            <Post
              id={id}
              image={image}
              title={title}
              description={summary}
              caption={dayjs(date).format("MMMM D, YYYY")}
              featured={index === 0}
            />
          </Fade>
        </div>
      ))}
    </Section>
  </Layout>
);

export async function getStaticProps() {
  const parser = new Parser();

  const { items } = await parser.parseURL(
    "https://medium.com/feed/@haydenbleasel"
  );

  const posts = (items as MediumPost[]).map((item) => {
    const content = item["content:encoded"];
    const dom = new JSDOM(content);

    return {
      title: item.title,
      id: slugify(item.title as string, {
        lower: true,
        strict: true,
      }),
      date: item.isoDate,
      summary: dom.window.document.querySelector("h4").textContent,
      image: dom.window.document
        .querySelector("img")
        .src.replace("max/1024", "max/3840"),
      tags: item.categories,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default Journal;
