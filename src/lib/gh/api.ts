import type { Config } from "../config";
import { readCache, writeCache } from "./cache";
import { fetch, spawn, type HeadersInit } from "bun"; // spawnを再度インポート

// GH CLIの可用性ステータスを保持
let GH_CLI_AVAILABLE: boolean | null = null;
const GITHUB_API_BASE = "https://api.github.com";

/**
 * gh auth statusを実行し、GH CLIが認証済みで利用可能かを確認する
 */
async function checkGhCliAvailability(): Promise<boolean> {
  // 環境変数 GH_TOKEN が設定されているかどうかを確認
  if (!process.env.GH_TOKEN) {
    GH_CLI_AVAILABLE = false;
    return false;
  }
  
  try {
    // gh auth status を実行
    const proc = spawn(["gh", "auth", "status"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const exitCode = await proc.exited;
    // 終了コードが0であれば利用可能と判断
    GH_CLI_AVAILABLE = exitCode === 0;
    return GH_CLI_AVAILABLE;
  } catch (e) {
    // コマンド実行自体に失敗した場合
    GH_CLI_AVAILABLE = false;
    return false;
  }
}

export async function callApi<T>(path: string, config: Config): Promise<T> {
  // 環境変数からGH_TOKENを取得 (fetchフォールバック用)
  const githubToken = process.env.GH_TOKEN;

  // キャッシュをチェック
  const cachedData = readCache<T>(path, config);
  if (cachedData) {
    console.log(`Cache hit for ${GITHUB_API_BASE}${path}`);
    return cachedData;
  }

  // APIへの過度な負荷を避けるための遅延
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const DELAY_MS = 100;
  await wait(DELAY_MS);

  // 1. GH CLI の可用性を確認 (初回のみ)
  if (githubToken && GH_CLI_AVAILABLE === null) {
    // GH_TOKENがある場合のみチェックを試みる
    await checkGhCliAvailability();
  }

  // 2. GH CLI が利用可能な場合は、最優先で使用する
  if (GH_CLI_AVAILABLE) {
    try {
      const proc = spawn(["gh", "api", "--method", "GET", path], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const output = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;

      if (exitCode === 0 && output) {
        console.log(`✅ Fetched via gh cli: ${GITHUB_API_BASE}${path}`);
        const data = JSON.parse(output) as T;
        writeCache(path, data); // キャッシュに書き込み
        return data;
      } else {
        const error = await new Response(proc.stderr).text();
        console.warn(
          `⚠️ gh api failed for ${path} (Exit Code: ${exitCode}). Falling back to fetch. Error: ${error}`
        );
      }
    } catch (e) {
      console.warn(
        `❌ Error running gh api command for ${path}. Falling back to fetch.`,
        e
      );
    }
  }
  
  // 3. GH CLI が利用できない、または失敗した場合、Bunの fetch にフォールバック

  console.warn("🔻 Falling back to bun fetch.");

  const url = `${GITHUB_API_BASE}${path}`;
  
  // 認証ヘッダーの設定 (GH_TOKENが存在すれば使用)
  const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
  };

  if (githubToken) {
      // GH_TOKENが存在する場合、Authorizationヘッダーを追加
      headers['Authorization'] = `token ${githubToken}`;
      headers['User-Agent'] = 'Bun-Build-Script-GitHub-Deploy';
  } else {
      console.warn("⚠️ GH_TOKEN is not set. Using unauthenticated fetch.");
  }

  const res = await fetch(url, {
      headers: headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    const rateLimit = res.headers.get('x-ratelimit-remaining');
    throw new Error(
      `Failed to fetch ${url}: Status ${res.status}. Rate Limit Remaining: ${rateLimit}. Body: ${errorText}`
    );
  }

  const data = (await res.json()) as T;
  
  if (githubToken) {
      const rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
      console.log(`✅ API fetch successful (Authenticated). Rate limit remaining: ${rateLimitRemaining}`);
  }

  writeCache(path, data); // キャッシュに書き込み
  return data;
}