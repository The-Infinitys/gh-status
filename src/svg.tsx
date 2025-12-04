import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, existsSync, mkdirSync } from "fs"; // existsSync と mkdirSync を追加
import { join } from "path";
import type { GitHubStats } from "./gh";
import type { ThemeConfig } from "./config";

interface BadgeProps {
  stats: GitHubStats;
  theme: ThemeConfig;
  width?: number;
  height?: number;
}

const LINE_HEIGHT = 20;
const PADDING = 10;
const BAR_HEIGHT = 10;
const BAR_MARGIN_TOP = 5;

const LanguageBar: React.FC<{ language: string; percentage: number; color: string; y: number }> = ({
  language,
  percentage,
  color,
  y,
}) => {
  const barWidth = 150; // 言語バーの最大幅
  const currentBarWidth = (percentage / 100) * barWidth;

  return (
    <g transform={`translate(0, ${y})`}>
      <rect x={PADDING} y={0} width={barWidth} height={BAR_HEIGHT} fill="#3f4448" rx="2" ry="2" />
      <rect
        x={PADDING}
        y={0}
        width={currentBarWidth}
        height={BAR_HEIGHT}
        fill={color}
        rx="2"
        ry="2"
      />
      <text
        x={PADDING + barWidth + 5}
        y={BAR_HEIGHT / 2 + 3}
        fontSize="10"
        fill="#ffffff"
        dominantBaseline="middle"
      >
        {language} ({percentage.toFixed(1)}%)
      </text>
    </g>
  );
};

const GitHubBadge: React.FC<BadgeProps> = ({ stats, theme, width = 400, height = 150 }) => {
  const { username, totalPublicRepos, totalStars, languagePercentages } = stats;
  const sortedLanguages = Object.entries(languagePercentages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // 上位5言語のみ表示

  let currentY = PADDING;

  // 動的に高さを計算
  const dynamicHeight =
    PADDING * 2 +
    LINE_HEIGHT * 3 +
    BAR_MARGIN_TOP +
    (BAR_HEIGHT + BAR_MARGIN_TOP) * sortedLanguages.length;
  const finalHeight = Math.max(height, dynamicHeight);

  return (
    <svg
      width={width}
      height={finalHeight}
      viewBox={`0 0 ${width} ${finalHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={width} height={finalHeight} fill={theme.backgroundColor} rx="6" ry="6" />

      <text
        x={PADDING}
        y={(currentY += LINE_HEIGHT)}
        fontSize="16"
        fontWeight="bold"
        fill={theme.textColor}
      >
        {username}'s GitHub Stats
      </text>
      <text x={PADDING} y={(currentY += LINE_HEIGHT)} fontSize="12" fill={theme.textColor}>
        Public Repos: {totalPublicRepos}
      </text>
      <text x={PADDING} y={(currentY += LINE_HEIGHT)} fontSize="12" fill={theme.textColor}>
        Total Stars: {totalStars}
      </text>

      <text
        x={PADDING}
        y={(currentY += LINE_HEIGHT + BAR_MARGIN_TOP)}
        fontSize="12"
        fill={theme.textColor}
      >
        Top Languages:
      </text>

      {sortedLanguages.map(([lang, percentage], _index) => {
        const langColor = theme.languageColors[lang] || "#cccccc"; // デフォルト色
        currentY += BAR_HEIGHT + BAR_MARGIN_TOP;
        return (
          <LanguageBar
            key={lang}
            language={lang}
            percentage={percentage}
            color={langColor}
            y={currentY}
          />
        );
      })}
    </svg>
  );
};

/**
 * GitHub統計情報に基づいてSVGバッジを生成し、ファイルに保存します。
 * @param stats GitHub統計情報
 * @param theme テーマ設定
 * @param outputPath 出力ディレクトリ
 * @param filename 出力ファイル名
 */
export function generateSvgBadge(
  stats: GitHubStats,
  theme: ThemeConfig,
  outputPath: string,
  filename: string = "github-stats-badge.svg",
): void {
  const svgString = renderToStaticMarkup(<GitHubBadge stats={stats} theme={theme} />);
  const filePath = join(outputPath, filename);

  // 出力ディレクトリが存在しない場合は作成
  if (!existsSync(outputPath)) {
    // existsSync に変更
    mkdirSync(outputPath, { recursive: true }); // mkdirSync に変更
  }

  writeFileSync(filePath, svgString);
  console.log(`SVG badge generated at ${filePath}`);
}
