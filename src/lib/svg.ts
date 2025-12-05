import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as fs from "fs";
import * as path from "path";
import { GithubLanguageStatusSVG } from "./svg/GithubLanguageStatus";
import { GithubActivityStatsSVG } from "./svg/GithubActivityStatsSVG"; // 追加
import { GithubCommitStatsSVG } from "./svg/GithubCommitStatsSVG"; // 追加
import type { Config } from "./config";
import type { GitHubStatus } from "./gh";
import { themes, type Theme } from "./svg/themes";

/**
 * SVGを生成し、ファイルに保存するビルド関数
 * @param githubStatus GitHubのステータスデータ
 * @param config 設定情報
 */
export async function build(githubStatus: GitHubStatus, config: Config): Promise<void> {
  const theme: Theme = themes[config.theme] || (themes.default as Theme);

  // outディレクトリが存在しない場合は作成
  const outDir = path.resolve(process.cwd(), "out");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 言語使用状況SVGを生成
  const languageStatusSvgString = renderToStaticMarkup(
    React.createElement(GithubLanguageStatusSVG, {
      languages: githubStatus.languagesByRepo,
      theme: theme,
      chartType: config.languageChartType || "bar", // chartType を追加
    }),
  );
  const languageStatusFilePath = path.join(outDir, "github-language-status.svg");
  fs.writeFileSync(languageStatusFilePath, languageStatusSvgString);
  console.log(`Generated SVG: ${languageStatusFilePath}`);

  // アクティビティ統計SVGを生成
  const activityStatsSvgString = renderToStaticMarkup(
    React.createElement(GithubActivityStatsSVG, {
      activity: githubStatus.activity,
      theme: theme,
    }),
  );
  const activityStatsFilePath = path.join(outDir, "github-activity-stats.svg");
  fs.writeFileSync(activityStatsFilePath, activityStatsSvgString);
  console.log(`Generated SVG: ${activityStatsFilePath}`);

  // コミット統計SVGを生成
  const commitStatsSvgString = renderToStaticMarkup(
    React.createElement(GithubCommitStatsSVG, {
      activity: githubStatus.activity,
      theme: theme,
    }),
  );
  const commitStatsFilePath = path.join(outDir, "github-commit-stats.svg");
  fs.writeFileSync(commitStatsFilePath, commitStatsSvgString);
  console.log(`Generated SVG: ${commitStatsFilePath}`);
}
