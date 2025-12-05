import type { Config } from "./config";
import { callApi } from "./gh/api";
import {
  type GitHubStatus,
  LanguagesUsages,
  type ActivityStatus,
  type LanguageUsageData,
  type GitHubUserApi,
  type GitHubReposApi,
  type GitHubRepo,
} from "./gh/interfaces";

export { type GitHubStatus, LanguagesUsages };
export async function githubStatus(config: Config): Promise<GitHubStatus> {
  const username = config.username;

  const [userData, reposData] = await Promise.all([
    callApi<GitHubUserApi>(`/users/${username}`, config), // config を渡す
    callApi<GitHubReposApi>(`/users/${username}/repos?per_page=100&type=owner`, config), // config を渡す
  ]);

  const repos: GitHubRepo[] = reposData as GitHubRepo[];
  const aggregatedLangMap = new Map<string, number>();

  for (const repo of repos) {
    const languagesPath = repo.languages_url.replace(/https:\/\/api.github.com/i, "");

    let langData: { [key: string]: number };
    try {
      langData = await callApi<{ [key: string]: number }>(languagesPath, config); // config を渡す
    } catch (e) {
      console.error(`Failed to fetch languages for repo ${repo.name}:`, e);
      continue;
    }

    for (const [name, bytes] of Object.entries(langData)) {
      const currentBytes = aggregatedLangMap.get(name) || 0;
      aggregatedLangMap.set(name, currentBytes + bytes);
    }
  }

  const repoLanguageData: Array<LanguageUsageData> = Array.from(
    aggregatedLangMap,
    ([name, bytes]) => ({
      name,
      bytes,
    }),
  );

  const activity: ActivityStatus = {
    followers: userData.followers,
    followings: userData.following,
    publicReposCount: userData.public_repos,
    currentYearContributions: 0,
  };

  const languagesUsages = new LanguagesUsages(repoLanguageData);

  return {
    languagesByRepo: languagesUsages,
    languagesByCommits: languagesUsages,
    activity: activity,
  };
}
