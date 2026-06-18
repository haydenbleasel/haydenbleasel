export interface RepositoryMetrics {
  forks: number;
  stars: number;
}

export interface RepositorySortInput extends RepositoryMetrics {
  name: string;
  updatedAt: string;
}

export interface RepositoryVisibilityInput {
  archived: boolean;
  fork: boolean;
  name: string;
}

const hiddenCurrentRepositoryNames = new Set(["haydenbleasel"]);

export const filterVisibleCurrentRepositories = <
  Repository extends RepositoryVisibilityInput,
>(
  repositories: Repository[]
) =>
  repositories.filter(
    (repository) =>
      !repository.fork &&
      !repository.archived &&
      !hiddenCurrentRepositoryNames.has(repository.name)
  );

export const sortRepositoriesForDirectory = <
  Repository extends RepositorySortInput,
>(
  repositories: Repository[]
) =>
  repositories.toSorted((a, b) => {
    if (b.stars !== a.stars) {
      return b.stars - a.stars;
    }

    const updatedDifference =
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

    if (updatedDifference !== 0) {
      return updatedDifference;
    }

    return a.name.localeCompare(b.name);
  });

export const getRepositoryTotals = (repositories: RepositoryMetrics[]) => {
  let forks = 0;
  let stars = 0;

  for (const repository of repositories) {
    forks += repository.forks;
    stars += repository.stars;
  }

  return { forks, stars };
};
