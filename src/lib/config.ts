import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import * as readline from "readline/promises";

export interface Config {
  username: string;
}

const CONFIG_FILE_PATH = "config/gh.yaml";

/**
 * プロジェクトルートの 'config/gh.yaml' を読み取り、
 * Config型と互換性のあるオブジェクトを返します。
 * （... loadConfig関数の実装は省略 ...）
 */
async function loadConfig(): Promise<Config | null> {
  const fullPath = path.resolve(process.cwd(), CONFIG_FILE_PATH);

  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`Config file not found at: ${fullPath}`);
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const loadedObject = yaml.load(fileContents) as any;

    if (
      loadedObject &&
      typeof loadedObject === "object" &&
      typeof loadedObject.username === "string"
    ) {
      return {
        username: loadedObject.username,
      };
    }

    console.error(
      "Loaded YAML does not contain a valid 'username' string field."
    );
    return null;
  } catch (error) {
    console.error(`Error loading or parsing config file: ${error}`);
    return null;
  }
}

/**
 * 標準入力 (stdin) からユーザー名を非同期で読み込みます。
 * @returns 読み取った文字列（トリミング済み）、またはエラーの場合は空文字列
 */
async function readUsernameFromStdin(): Promise<string> {
  // Readline インターフェースを作成
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = await rl.question("username: ");
    return answer.trim();
  } catch (error) {
    console.warn("Could not read from standard input (stdin).", error);
    return "";
  } finally {
    // 重要なステップ: Readline インターフェースを忘れずにクローズする
    rl.close();
  }
}

/**
 * 以下の優先順位でユーザー名を取得します。
 * 1. 環境変数 (GITHUB_REPOSITORY_OWNER)
 * 2. config/gh.yaml ファイル
 * 3. 標準入力（stdin）
 * @returns 取得されたユーザー名を含む Config オブジェクト
 */
export async function config(): Promise<Config> {
  // 1. 環境変数から取得
  const envUsername = process.env.GITHUB_REPOSITORY_OWNER;

  if (envUsername) {
    return { username: envUsername };
  }

  // 2. config/gh.yaml から取得
  const loadedConfig = await loadConfig();

  if (loadedConfig) {
    return loadedConfig;
  }

  const inputUsername = await readUsernameFromStdin();
  return {
    username: inputUsername,
  };
}
