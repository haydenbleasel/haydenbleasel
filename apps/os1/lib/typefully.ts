import { typefully } from "@haydenbleasel/typefully";
import type { components } from "@haydenbleasel/typefully";

type AnalyticsPost = components["schemas"]["SocialSetAnalyticsPostResponse"];

export interface TypefullyPostWithAnalytics {
  id: number;
  preview: string | null;
  published_at: string | null;
  x_published_url: string | null;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
}

const getSocialSetId = async (): Promise<number | null> => {
  const { data } = await typefully.GET("/v2/social-sets");

  return data?.results[0]?.id ?? null;
};

const getAnalytics = (socialSetId: number): Promise<AnalyticsPost[]> => {
  const [endDate] = new Date().toISOString().split("T");
  const [startDate] = new Date(Date.now() - 90 * 86_400_000)
    .toISOString()
    .split("T");

  const limit = 100;

  const fetchPage = async (offset: number): Promise<AnalyticsPost[]> => {
    const { data } = await typefully.GET(
      "/v2/social-sets/{social_set_id}/analytics/{platform}/posts",
      {
        params: {
          path: { platform: "x", social_set_id: socialSetId },
          query: { end_date: endDate, limit, offset, start_date: startDate },
        },
      }
    );

    if (!data?.results) {
      return [];
    }

    if (!data.next) {
      return data.results;
    }

    return [...data.results, ...(await fetchPage(offset + limit))];
  };

  return fetchPage(0);
};

export const getPublishedPosts = async (): Promise<
  TypefullyPostWithAnalytics[]
> => {
  const socialSetId = await getSocialSetId();

  if (!socialSetId) {
    return [];
  }

  const [draftsResponse, analytics] = await Promise.all([
    typefully.GET("/v2/social-sets/{social_set_id}/drafts", {
      params: {
        path: { social_set_id: socialSetId },
        query: { limit: 25, order_by: "-published_at", status: "published" },
      },
    }),
    getAnalytics(socialSetId),
  ]);

  const drafts = draftsResponse.data?.results ?? [];

  const analyticsMap = new Map(
    analytics
      .filter(
        (a): a is AnalyticsPost & { draft_id: number } =>
          a.draft_id !== null && a.draft_id !== undefined
      )
      .map((a) => [a.draft_id, a] as const)
  );

  return drafts.map((draft) => {
    const stats = analyticsMap.get(draft.id);
    return {
      id: draft.id,
      impressions: stats?.metrics.impressions ?? 0,
      likes: stats?.metrics.engagement.likes ?? 0,
      preview: draft.preview ?? null,
      published_at: draft.published_at ?? null,
      replies: stats?.metrics.engagement.comments ?? 0,
      retweets: stats?.metrics.engagement.shares ?? 0,
      x_published_url: draft.x_published_url ?? null,
    };
  });
};
