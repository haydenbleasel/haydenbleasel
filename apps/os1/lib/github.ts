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

const formerRepos = [
  "shadcnblocks/kibo",
  "KayleeWilliams/joyful",
  "itgalaxy/favicons",
  "gulp-community/gulp-favicons",
  "nitinthewiz/ghost-phantom",
];

// Repositories that no longer resolve via the GitHub API (donated/merged) but
// should still appear in the Former list.
const manualFormerRepositories = [
  {
    description:
      "Create realistic, human-like speech and transcribe audio with a unified API that works with leading AI providers like OpenAI, ElevenLabs and AssemblyAI.",
    forks_count: 0,
    full_name: "haydenbleasel/orate",
    html_url: "https://x.com/haydenbleasel/status/1931033287851675688",
    id: -1,
    language: null as string | null,
    name: "orate",
    stargazers_count: 0,
  },
];

export const getFormerRepositories = async () => {
  const results = await Promise.all(
    formerRepos.map(async (fullName) => {
      const [owner, repo] = fullName.split("/");
      const { data } = await octokit.rest.repos.get({ owner, repo });
      return {
        description: data.description,
        forks_count: data.forks_count,
        full_name: data.full_name,
        html_url: data.html_url,
        id: data.id,
        language: data.language,
        name: data.name,
        stargazers_count: data.stargazers_count,
      };
    })
  );

  return [...results, ...manualFormerRepositories];
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
