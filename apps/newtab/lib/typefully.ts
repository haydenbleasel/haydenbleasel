import { typefully } from "@haydenbleasel/typefully";
import type { components } from "@haydenbleasel/typefully";
import { format, subMonths } from "date-fns";

const socialSetId = Number(process.env.TYPEFULLY_SOCIAL_SET_ID);

export type Draft = components["schemas"]["DraftListResponse"];

export interface FollowerSeries {
  /** Latest follower count in the returned range. */
  current: number | null;
  /** Daily follower counts ordered ascending by date. */
  data: { date: string; followers: number }[];
}

/**
 * Daily X follower counts for the social set over the last month. The endpoint
 * defaults to 30 days, but the range is passed explicitly to stay anchored to a
 * calendar month. Returns null when the request fails or there aren't enough
 * points to draw a line.
 */
export const getTypefullyFollowers =
  async (): Promise<FollowerSeries | null> => {
    const end = new Date();
    const start = subMonths(end, 1);

    const { data } = await typefully.GET(
      "/v2/social-sets/{social_set_id}/analytics/{platform}/followers",
      {
        params: {
          path: { platform: "x", social_set_id: socialSetId },
          query: {
            end_date: format(end, "yyyy-MM-dd"),
            start_date: format(start, "yyyy-MM-dd"),
          },
        },
      }
    );

    if (!data || data.data.length < 2) {
      return null;
    }

    return {
      current: data.current_followers_count ?? null,
      data: data.data.map((point) => ({
        date: point.date,
        followers: point.followers_count,
      })),
    };
  };

export const getTypefullyDrafts = async () => {
  const { data } = await typefully.GET(
    "/v2/social-sets/{social_set_id}/drafts",
    {
      params: {
        path: { social_set_id: socialSetId },
        query: { limit: 50, status: "scheduled" },
      },
    }
  );

  return data?.results ?? [];
};

export const getTypefullyPublishes = async () => {
  const { data } = await typefully.GET(
    "/v2/social-sets/{social_set_id}/drafts",
    {
      params: {
        path: { social_set_id: socialSetId },
        query: { limit: 50, order_by: "-updated_at", status: "published" },
      },
    }
  );

  return data?.results ?? [];
};
