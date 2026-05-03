import { typefully } from "@haydenbleasel/typefully";
import type { components } from "@haydenbleasel/typefully";

const socialSetId = Number(process.env.TYPEFULLY_SOCIAL_SET_ID);

export type Draft = components["schemas"]["DraftListResponse"];

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
