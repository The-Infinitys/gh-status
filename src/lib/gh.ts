import type { Config } from "./config";
import { fetch, spawn, file } from "bun"; // Bunランタイムのfetchとspawn/fileを使用
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

// gh CLIの利用可能性を保持するフラグ
let GH_CLI_AVAILABLE: boolean | null = null;

// gh CLIがインストールされているかどうかを確認する関数
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
    // コマンドが見つからないなどのエラー
    GH_CLI_AVAILABLE = false;
    return false;
  }
}

/**
 * GitHub APIを呼び出すためのラッパー関数。
 * 最初にgh CLIの利用を試み、失敗した場合にbun fetchにフォールバックします。
 * @param path APIエンドポイントのパス (例: /users/username)
 * @param config 設定（トークンを含む）
 * @returns APIからのJSONデータ
 */
async function callApi<T>(path: string): Promise<T> {
  const GITHUB_API_BASE = "https://api.github.com";

  // GH CLIの利用可能性が未チェックならチェックする
  if (GH_CLI_AVAILABLE === null) {
    await checkGhCliAvailability();
  }

  // ⭐ 1. gh CLI を利用する (推奨)
  if (GH_CLI_AVAILABLE) {
    try {
      // gh api --method GET /path の形式で実行
      const proc = spawn(["gh", "api", "--method", "GET", path], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const output = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;

      if (exitCode === 0 && output) {
        console.log(`fetched: ${GITHUB_API_BASE}${path}`);
        return JSON.parse(output) as T;
      } else {
        // gh apiが失敗した場合、コンソールにエラーを出力し、fetchにフォールバック
        const error = await new Response(proc.stderr).text();
        console.warn(
          `gh api failed for ${path} (Exit Code: ${exitCode}). Falling back to fetch. Error: ${error}`,
        );
      }
    } catch (e) {
      console.warn(`Error running gh api command for ${path}. Falling back to fetch.`, e);
      // 処理を継続するため、catch内でフォールバック
    }
  }
  console.warn("gh api unavailable");
  // ⭐ 2. bun fetch にフォールバック (PAT認証を使用)
  const url = `${GITHUB_API_BASE}${path}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${url}: Status ${res.status}. Body: ${errorText}`);
  }

  return (await res.json()) as T;
}

/**
 * ユーザー名に基づき、GitHubのステータス（活動統計と言語使用状況）を取得します。
 * @param config ユーザー名とトークンを含む設定オブジェクト
 * @returns ユーザーのGitHubStatusオブジェクト
 */
export async function githubStatus(config: Config): Promise<GitHubStatus> {
  const username = config.username;

  // 遅延用のヘルパー関数 (1秒 = 1000ms)
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const DELAY_MS = 1000;

  // 1. ユーザープロフィール情報とリポジトリ一覧を並行して取得
  // callApiを利用するように変更
  const [userData, reposData] = await Promise.all([
    callApi<GitHubUserApi>(`/users/${username}`),
    callApi<GitHubReposApi>(`/users/${username}/repos?per_page=100&type=owner`),
  ]);

  // 2. 言語データの集計（レート制限ありの逐次実行）
  const repos: GitHubRepo[] = reposData as GitHubRepo[];
  const aggregatedLangMap = new Map<string, number>();

  for (const repo of repos) {
    // 1秒待機
    await wait(DELAY_MS);

    // 言語データ取得にも callApi を使用
    // 言語APIのパスは repo オブジェクトから取得する必要があるが、
    // callApiでパスを渡すため、URL全体ではなくパスのみを取得
    const languagesPath = repo.languages_url.replace(/https:\/\/api.github.com/i, "");

    let langData: { [key: string]: number };
    try {
      langData = await callApi<{ [key: string]: number }>(languagesPath);
    } catch (e) {
      console.error(`Failed to fetch languages for repo ${repo.name}:`, e);
      continue;
    }

    // データ集計ロジック
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

  // 3. GitHubStatusオブジェクトの構築
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
