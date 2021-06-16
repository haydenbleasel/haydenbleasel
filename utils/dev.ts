import { parseISO, format } from "date-fns";

type IDevPost = {
  type_of: string;
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  slug: string;
  path: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  collection_id?: string;
  published_timestamp: string;
  positive_reactions_count: number;
  cover_image?: string;
  social_image: string;
  canonical_url: string;
  created_at: string;
  edited_at: string;
  crossposted_at?: string;
  published_at: string;
  last_comment_at: string;
  reading_time_minutes: number;
  tag_list: any[];
  tags: string;
  user: any;
};

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
