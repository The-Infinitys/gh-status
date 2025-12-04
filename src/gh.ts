import { Octokit } from "@octokit/rest";

// GitHubの統計情報を格納するインターフェース
export interface GitHubStats {
  username: string;
  totalPublicRepos: number;
  totalStars: number;
  languageStats: { [key: string]: number }; // 言語ごとのバイト数
  languagePercentages: { [key: string]: number }; // 言語ごとの使用率（パーセンテージ）
}

/**
 * 指定されたGitHubユーザーの統計情報を取得します。
 * @param username GitHubユーザー名
 * @returns GitHubStatsオブジェクト
 */
export async function getGitHubStats(username: string): Promise<GitHubStats> {
  const octokit = new Octokit(); // トークンなしで公開リポジトリ情報にアクセス

  let totalPublicRepos = 0;
  let totalStars = 0;
  const languageStats: { [key: string]: number } = {};
  let totalBytes = 0;

  // ユーザーのリポジトリ一覧を取得
  // デフォルトで最初の30件を取得。より多くのリポジトリを考慮する場合はページネーションが必要
  const reposResponse = await octokit.rest.repos.listForUser({
    username,
    type: "owner", // Forkされたリポジトリを除外
    per_page: 100, // 1ページあたりの取得数を増やす
  });

  totalPublicRepos = reposResponse.data.length;

  for (const repo of reposResponse.data) {
    totalStars += repo.stargazers_count || 0;

    // 各リポジトリの言語データを取得
    try {
      const languagesResponse = await octokit.rest.repos.listLanguages({
        owner: username,
        repo: repo.name,
      });

      for (const lang in languagesResponse.data) {
        const bytes = languagesResponse.data[lang] || 0;
        languageStats[lang] = (languageStats[lang] || 0) + bytes;
        totalBytes += bytes;
      }
    } catch (error) {
      console.warn(`Could not get languages for repo ${repo.name}:`, error);
    }
  }

  // 言語ごとのパーセンテージを計算
  const languagePercentages: { [key: string]: number } = {};
  if (totalBytes > 0) {
    for (const lang in languageStats) {
      languagePercentages[lang] = (languageStats[lang] / totalBytes) * 100;
    }
  }

  return {
    username,
    totalPublicRepos,
    totalStars,
    languageStats,
    languagePercentages,
  };
}

// 簡単なテスト（開発用）
/*
(async () => {
  try {
    const stats = await getGitHubStats('octokit');
    console.log(stats);
  } catch (error) {
    console.error('Failed to get GitHub stats:', error);
  }
})();
*/
