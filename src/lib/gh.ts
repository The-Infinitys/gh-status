import type { Config } from "./config";
import { fetch, spawn, file } from "bun";
import { readCache, writeCache } from "./cache"; // キャッシュヘルパーをインポート
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

let GH_CLI_AVAILABLE: boolean | null = null;

async function checkGhCliAvailability(): Promise<boolean> {
  try {
    const proc = spawn(["gh", "auth", "status"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const exitCode = await proc.exited;
    GH_CLI_AVAILABLE = exitCode === 0;
    return GH_CLI_AVAILABLE;
  } catch (e) {
    GH_CLI_AVAILABLE = false;
    return false;
  }
}

async function callApi<T>(path: string, config: Config): Promise<T> {
  // config パラメータを追加
  const GITHUB_API_BASE = "https://api.github.com";

  // キャッシュをチェック
  const cachedData = readCache<T>(path, config);
  if (cachedData) {
    return cachedData;
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const DELAY_MS = 1000;
  await wait(DELAY_MS);

  if (GH_CLI_AVAILABLE === null) {
    await checkGhCliAvailability();
  }

  if (GH_CLI_AVAILABLE) {
    try {
      const proc = spawn(["gh", "api", "--method", "GET", path], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const output = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;

      if (exitCode === 0 && output) {
        console.log(`fetched via gh cli: ${GITHUB_API_BASE}${path}`);
        const data = JSON.parse(output) as T;
        writeCache(path, data); // キャッシュに書き込み
        return data;
      } else {
        const error = await new Response(proc.stderr).text();
        console.warn(
          `gh api failed for ${path} (Exit Code: ${exitCode}). Falling back to fetch. Error: ${error}`,
        );
      }
    } catch (e) {
      console.warn(`Error running gh api command for ${path}. Falling back to fetch.`, e);
    }
  }
  console.warn("gh api unavailable, falling back to bun fetch");

  const url = `${GITHUB_API_BASE}${path}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${url}: Status ${res.status}. Body: ${errorText}`);
  }

  const data = (await res.json()) as T;
  writeCache(path, data); // キャッシュに書き込み
  return data;
}

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
