import { loadConfig, getGitHubStats, generateSvgBadge } from "./lib";
import { join } from "path";

async function main() {
  const args = process.argv.slice(2); // node main.js 以外の引数を取得

  let username = "octokit"; // デフォルトユーザー名
  let outputDir = "./out"; // デフォルト出力ディレクトリ
  let configDir = "./config"; // デフォルト設定ディレクトリ

  // コマンドライン引数を解析
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--username" && args[i + 1]) {
      username = args[++i];
    } else if (args[i] === "--output-dir" && args[i + 1]) {
      outputDir = args[++i];
    } else if (args[i] === "--config-dir" && args[i + 1]) {
      configDir = args[++i];
    }
  }

  try {
    console.log(`Loading theme configuration from ${configDir}...`);
    const theme = loadConfig(configDir);
    console.log("Theme configuration loaded successfully.");

    console.log(`Fetching GitHub stats for user: ${username}...`);
    const stats = await getGitHubStats(username);
    console.log("GitHub stats fetched successfully.");
    // console.log(stats); // デバッグ用

    console.log(`Generating SVG badge to ${outputDir}...`);
    generateSvgBadge(stats, theme, join(process.cwd(), outputDir));
    console.log("SVG badge generated successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();
