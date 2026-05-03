interface OkuBook {
  title: string;
  author: string;
  description: string;
  link: string;
  cover: string;
  date: string;
}

const parseItems = (xml: string): OkuBook[] => {
  const items: OkuBook[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;

  let match = itemRegex.exec(xml);
  while (match) {
    const [, content] = match;

    const get = (tag: string) => {
      const tagMatch = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(
        content
      );
      return tagMatch?.[1]?.trim() ?? "";
    };

    const coverMatch = /<oku:cover>([^<]*)<\/oku:cover>/.exec(content);
    const enclosureMatch = /enclosure[^>]+url="([^"]*)"/.exec(content);

    items.push({
      author: get("dc:creator"),
      cover: coverMatch?.[1] ?? enclosureMatch?.[1] ?? "",
      date: get("pubDate"),
      description: get("description"),
      link: get("link"),
      title: get("title"),
    });

    match = itemRegex.exec(xml);
  }

  return items;
};

const fetchCollection = async (collectionId: string): Promise<OkuBook[]> => {
  const response = await fetch(
    `https://oku.club/rss/collection/${collectionId}`,
    {
      next: { revalidate: 60 * 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Oku RSS error: ${response.status}`);
  }

  const xml = await response.text();
  return parseItems(xml);
};

export type { OkuBook };

export const getToRead = () => fetchCollection("jkZoS");
export const getReading = () => fetchCollection("sCsIh");
export const getRead = () => fetchCollection("yOj0E");
