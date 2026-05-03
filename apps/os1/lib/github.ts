import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const username = "haydenbleasel";

export const getRepositories = async () => {
  const { data } = await octokit.rest.repos.listForUser({
    per_page: 100,
    sort: "updated",
    type: "owner",
    username,
  });

  return data;
};

export const getProfile = async () => {
  const { data } = await octokit.rest.users.getByUsername({ username });
  return data;
};

const workRepos = [
  "vercel/streamdown",
  "vercel/ai-elements",
  "vercel/chat",
  "vercel-labs/tersa",
  "vercel-labs/openreview",
  "vercel-labs/vectr",
  "vercel/components.build",
];

export const getWorkRepositories = async () => {
  const results = await Promise.all(
    workRepos.map(async (fullName) => {
      const [owner, repo] = fullName.split("/");
      const { data } = await octokit.rest.repos.get({ owner, repo });
      return data;
    })
  );

  return results;
};

export const getContributions = async () => {
  const data = await octokit.graphql<{
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              contributionCount: number;
              date: string;
            }[];
          }[];
        };
      };
    };
  }>(`
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `);

  return data.user.contributionsCollection.contributionCalendar;
};
