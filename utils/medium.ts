import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { parseISO, format } from "date-fns";

type IMediumPost = {
  creator: string;
  title: string;
  link: string;
  "content:encoded": string;
  guid: string;
  isoDate: string;
  categories: string[];
};

export async function getMediumPosts() {
  const parser = new Parser();

  const { items } = await parser.parseURL(
    "https://medium.com/feed/@haydenbleasel"
  );

  const posts = (items as IMediumPost[]).map((item) => {
    const content = item["content:encoded"];
    const dom = new JSDOM(content);

    return {
      id: item.guid,
      title: item.title,
      description: dom.window.document.querySelector("h4").textContent,
      caption: format(parseISO(item.isoDate), "MMMM d, yyyy"),
      image: {
        url: dom.window.document
          .querySelector("img")
          .src.replace("max/1024", "max/3840"),
      },
      link: { link_type: "Web", url: item.link },
      date: item.isoDate,
    };
  });

  return posts;
}
