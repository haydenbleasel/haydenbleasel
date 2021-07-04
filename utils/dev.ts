import { parseISO, format } from "date-fns";

export async function getDevPosts() {
  const response = await fetch(
    "https://dev.to/api/articles?username=haydenbleasel"
  );
  const items: IDevPost[] = await response.json();

  const posts = items.map(
    ({ id, title, description, published_timestamp, social_image, url }) => ({
      id,
      title,
      description,
      caption: format(parseISO(published_timestamp), "MMMM d, yyyy"),
      image: { url: social_image },
      link: { link_type: "Web", url },
      date: published_timestamp,
    })
  );

  return posts;
}
