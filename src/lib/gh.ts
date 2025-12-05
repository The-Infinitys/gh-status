import type { Config } from "./config";
import { fetch } from "bun"; // Bunランタイムのfetchを使用
import {
  type GitHubStatus,
  LanguagesUsages, // LanguagesUsagesクラス
  type ActivityStatus,
  type LanguageUsageData,
  type GitHubUserApi,
  type GitHubReposApi,
  type GitHubRepo, // リポジトリ言語APIの取得に使用される
} from "./gh/interfaces";

// 外部に公開したい型を再エクスポート
export { type GitHubStatus, LanguagesUsages }; 

/**
 * 言語別のバイト数データを保持し、合計や特定の言語の割合を計算するクラス
 * * 注意: このコメントは元のファイルに含まれていますが、
 * LanguagesUsagesクラス自体は './gh/interfaces.ts' に定義されています。
 */

/**
 * ユーザー名に基づき、GitHubのステータス（活動統計と言語使用状況）を取得します。
 * @param config ユーザー名を含む設定オブジェクト
 * @returns ユーザーのGitHubStatusオブジェクト
 */
export async function githubStatus(config: Config): Promise<GitHubStatus> {
  const GITHUB_API_BASE = "https://api.github.com";
  const username = config.username;
  
  // 1. ユーザープロフィール情報とリポジトリ一覧を並行して取得
  const [userResponse, reposResponse] = await Promise.all([
    fetch(`${GITHUB_API_BASE}/users/${username}`),
    // 公開リポジトリ一覧を取得 (一度に最大100件まで)
    fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&type=owner`),
  ]);

  if (!userResponse.ok || !reposResponse.ok) {
    throw new Error(
      `Failed to fetch basic GitHub data: User Status ${userResponse.status}, Repos Status ${reposResponse.status}`
    );
  }

  // APIレスポンスを定義した型にキャスト
  const userData = (await userResponse.json()) as GitHubUserApi;
  const reposData = (await reposResponse.json()) as GitHubReposApi;

  // 2. 言語データの集計
  // GitHubReposApi (GitHubRepoの配列) の要素を明示的にGitHubRepo型として扱います
  const repos: GitHubRepo[] = reposData as GitHubRepo[];

  let repoLanguageData: Array<LanguageUsageData> = [];

  // 各リポジトリの言語使用量を取得するPromiseを作成
  const languagePromises = repos.map((repo) =>
    fetch(repo.languages_url).then((res) => {
      if (!res.ok) {
        // 言語データが取得できないリポジトリはスキップするため、エラーをログに出すか、空のオブジェクトを返す
        console.error(`Failed to fetch languages for repo ${repo.name}: ${res.status}`);
        return {}; 
      }
      return res.json();
    })
  );

  // 全てのリポジトリの言語データを並行して取得
  const allLanguagesData: Array<{ [key: string]: number }> = await Promise.all(languagePromises);

  // リポジトリごとの言語データを統合して LanguagesUsages の初期データを作成
  const aggregatedLangMap = new Map<string, number>();

  allLanguagesData.forEach((langData) => {
    // langDataは { "LanguageName": bytes } の形式
    for (const [name, bytes] of Object.entries(langData)) {
      const currentBytes = aggregatedLangMap.get(name) || 0;
      aggregatedLangMap.set(name, currentBytes + bytes);
    }
  });

  repoLanguageData = Array.from(aggregatedLangMap, ([name, bytes]) => ({
    name,
    bytes,
  }));

  // 3. GitHubStatusオブジェクトの構築

  const activity: ActivityStatus = {
    // ユーザーAPIから取得
    followers: userData.followers,
    followings: userData.following,
    publicReposCount: userData.public_repos,
    // (真のコントリビューションデータ取得は複雑なため、単純化のため0を代入)
    currentYearContributions: 0,
  };

  const languagesUsages = new LanguagesUsages(repoLanguageData);

  return {
    languagesByRepo: languagesUsages,
    // コミットデータは取得しないため、リポジトリ言語データを代用
    languagesByCommits: languagesUsages,
    activity: activity,
  };
}
