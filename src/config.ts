import { readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";

// テーマ設定のインターフェースを定義
export interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  languageColors: {
    [key: string]: string;
  };
  // 他のテーマ関連設定もここに追加可能
}

// 設定ファイルを読み込む関数
export function loadConfig(configDir: string = "./config"): ThemeConfig {
  const themeFilePath = join(process.cwd(), configDir, "theme.yaml"); // process.cwd()を追加
  try {
    const fileContents = readFileSync(themeFilePath, "utf8");
    const config = load(fileContents) as ThemeConfig;
    return config;
  } catch (error) {
    console.error(`Error loading theme config from ${themeFilePath}:`, error);
    // エラー時はデフォルト設定を返すか、エラーをスローするか、要件に応じて変更
    // ここでは単純にエラーを再スローします
    throw error;
  }
}
