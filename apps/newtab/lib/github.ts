export interface GitHubItem {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string;
  type: "issue" | "pull-request";
  createdAt: string;
}

interface GitHubSearchResponse {
  items: {
    id: number;
    number: number;
    title: string;
    html_url: string;
    repository_url: string;
    created_at: string;
    pull_request?: unknown;
  }[];
}

export const getOpenIssuesAndPullRequests = async (): Promise<GitHubItem[]> => {
  const query = encodeURIComponent(
    "user:haydenbleasel is:open is:public archived:false"
  );
  const response = await fetch(
    `https://api.github.com/search/issues?q=${query}&sort=created&order=desc&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as GitHubSearchResponse;

  return data.items.map((item) => ({
    createdAt: item.created_at,
    id: item.id,
    number: item.number,
    repo: item.repository_url.split("/").at(-1) ?? "",
    title: item.title,
    type: item.pull_request ? "pull-request" : "issue",
    url: item.html_url,
  }));
};
