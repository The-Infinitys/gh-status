import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import * as readline from "readline/promises";

// 外部モジュールとして公開する設定インターフェース
export interface Config {
  username: string;
  theme: string;
  languageChartType?: "bar" | "pie";
  cacheDuration?: number;
  cacheUnit?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
}

const CONFIG_FILE_PATH = "config/gh.yaml";

/**
 * config/gh.yaml ファイルから設定を読み込みます。
 * 読み込み失敗時はエラーをログに出力し、nullを返します。
 * @returns 読み込まれたConfigオブジェクトの一部、またはnull
 */
async function loadConfig(): Promise<Partial<Config> | null> {
  const fullPath = path.resolve(process.cwd(), CONFIG_FILE_PATH);

  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`Config file not found at: ${fullPath}`);
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const loadedObject = yaml.load(fileContents) as any;

    // ロードされたオブジェクトから有効なConfigの項目を抽出
    const partialConfig: Partial<Config> = {};

    if (loadedObject && typeof loadedObject === "object") {
      if (typeof loadedObject.username === "string") {
        partialConfig.username = loadedObject.username;
      }
      if (typeof loadedObject.theme === "string") {
        partialConfig.theme = loadedObject.theme;
      }
      if (
        typeof loadedObject.languageChartType === "string" &&
        (loadedObject.languageChartType === "bar" || loadedObject.languageChartType === "pie")
      ) {
        partialConfig.languageChartType = loadedObject.languageChartType;
      }
      if (typeof loadedObject.cacheDuration === "number") {
        partialConfig.cacheDuration = loadedObject.cacheDuration;
      }
      const validCacheUnits = ["seconds", "minutes", "hours", "days", "weeks", "months", "years"];
      if (
        typeof loadedObject.cacheUnit === "string" &&
        validCacheUnits.includes(loadedObject.cacheUnit)
      ) {
        partialConfig.cacheUnit = loadedObject.cacheUnit as any;
      }
    }

    // 有効な設定項目が一つでもあれば返す
    if (Object.keys(partialConfig).length > 0) {
      return partialConfig;
    }

    console.warn(
      "Loaded YAML file did not contain any valid configuration fields (username or theme).",
    );
    return null;
  } catch (error) {
    console.error(`Error loading or parsing config file: ${error}`);
    return null;
  }
}

/**
 * 標準入力 (stdin) から指定されたプロンプトで文字列を非同期で読み込みます。
 * @param prompt 表示するプロンプト文字列
 * @returns 読み取った文字列（トリミング済み）、またはエラーの場合は空文字列
 */
async function readValueFromStdin(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = await rl.question(`${prompt}: `);
    return answer.trim();
  } catch (error) {
    console.warn(`Could not read from standard input (stdin) for ${prompt}.`, error);
    return "";
  } finally {
    rl.close();
  }
}

/**
 * 設定項目ごとに優先順位（ファイル > 環境変数 > 標準入力）で値を取得します。
 * * @returns 完全に設定された Config オブジェクト
 */
export async function config(): Promise<Config> {
  // 1. デフォルト値の定義
  const finalConfig: Config = {
    username: "",
    theme: "default",
    languageChartType: "bar",
    cacheDuration: 1, // デフォルト値
    cacheUnit: "hours", // デフォルト値
  };

  const loadedConfig = await loadConfig();
  if (loadedConfig) {
    if (loadedConfig.username) {
      finalConfig.username = loadedConfig.username;
    }
    if (loadedConfig.theme) {
      finalConfig.theme = loadedConfig.theme;
    }
    if (loadedConfig.languageChartType) {
      finalConfig.languageChartType = loadedConfig.languageChartType;
    }
    if (loadedConfig.cacheDuration) {
      finalConfig.cacheDuration = loadedConfig.cacheDuration;
    }
    if (loadedConfig.cacheUnit) {
      finalConfig.cacheUnit = loadedConfig.cacheUnit;
    }
  }

  const envUsername = process.env.GITHUB_REPOSITORY_OWNER;
  if (envUsername) {
    console.log(`Using username from environment variable GITHUB_REPOSITORY_OWNER: ${envUsername}`);
    finalConfig.username = envUsername;
  }

  const envTheme = process.env.GH_THEME;
  if (envTheme) {
    console.log(`Using theme from environment variable GH_THEME: ${envTheme}`);
    finalConfig.theme = envTheme;
  }

  const envLanguageChartType = process.env.GH_LANGUAGE_CHART_TYPE;
  if (envLanguageChartType && (envLanguageChartType === "bar" || envLanguageChartType === "pie")) {
    console.log(
      `Using languageChartType from environment variable GH_LANGUAGE_CHART_TYPE: ${envLanguageChartType}`,
    );
    finalConfig.languageChartType = envLanguageChartType;
  }

  const envCacheDuration = process.env.GH_CACHE_DURATION;
  if (envCacheDuration && !isNaN(Number(envCacheDuration))) {
    console.log(
      `Using cacheDuration from environment variable GH_CACHE_DURATION: ${envCacheDuration}`,
    );
    finalConfig.cacheDuration = Number(envCacheDuration);
  }

  const envCacheUnit = process.env.GH_CACHE_UNIT;
  const validCacheUnits = ["seconds", "minutes", "hours", "days", "weeks", "months", "years"];
  if (envCacheUnit && validCacheUnits.includes(envCacheUnit)) {
    console.log(`Using cacheUnit from environment variable GH_CACHE_UNIT: ${envCacheUnit}`);
    finalConfig.cacheUnit = envCacheUnit as any;
  }

  // 4. 不足している値を標準入力から取得

  // usernameがまだ設定されていない場合
  if (!finalConfig.username) {
    console.log("Username not found in config file or environment variable.");
    const inputUsername = await readValueFromStdin("Enter username");
    finalConfig.username = inputUsername;
  }

  // themeがまだ設定されていない場合 (現在はデフォルト値があるため基本的にここには来ないが、テーマを必須にする場合に備えて)
  if (!finalConfig.theme) {
    console.log("Theme not found in config file or environment variable.");
    const inputTheme = await readValueFromStdin("Enter theme (e.g., default, dark)");
    finalConfig.theme = inputTheme || "default"; // 入力が空の場合に備えて再度デフォルトを設定
  }

  return finalConfig;
}
