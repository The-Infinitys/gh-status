import React from "react";
import { LanguagesUsages } from "../gh/interfaces";
import { type Theme } from "./themes";
import { LanguageColors } from "./languages";

interface GithubLanguageStatusSVGProps {
  languages: LanguagesUsages;
  theme: Theme;
  chartType: "bar" | "pie";
}

export const GithubLanguageStatusSVG: React.FC<GithubLanguageStatusSVGProps> = ({
  languages,
  theme,
  chartType,
}) => {
  const totalBytes = languages.total();
  const languageData = languages.getData();

  // 上位5言語とその他を計算
  const sortedLanguages = languageData.sort((a, b) => b.bytes - a.bytes);
  const topLanguages = sortedLanguages.slice(0, 5);
  const otherBytes = sortedLanguages.slice(5).reduce((sum, lang) => sum + lang.bytes, 0);

  const finalLanguages =
    otherBytes > 0 ? [...topLanguages, { name: "Other", bytes: otherBytes }] : topLanguages;

  const width = 300;
  const height = 150;
  const cardPaddingX = 15;
  const cardPaddingY = 20;

  const titleHeight = 20;
  const chartAreaHeight = height - cardPaddingY - titleHeight;

  // 円グラフ用のデータ計算
  let currentAngle = 0;
  const pieRadius = Math.min(chartAreaHeight, width - cardPaddingX * 2) / 2 - 10; // 半径を少し小さく
  const pieCenterX = width / 2;
  const pieCenterY = cardPaddingY + titleHeight + chartAreaHeight / 2;

  const pieChartData = finalLanguages.map((lang) => {
    const percentage = totalBytes > 0 ? lang.bytes / totalBytes : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + percentage * 360;
    currentAngle = endAngle;

    const x1 = pieCenterX + pieRadius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = pieCenterY + pieRadius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = pieCenterX + pieRadius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = pieCenterY + pieRadius * Math.sin((Math.PI * endAngle) / 180);
    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    const pathData = `M ${pieCenterX},${pieCenterY} L ${x1},${y1} A ${pieRadius},${pieRadius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;

    // テキスト位置計算
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const textOffset = pieRadius * 0.7; // テキストは円の内側より少し外側に
    const textX = pieCenterX + (pieRadius + 10) * Math.cos((Math.PI * midAngle) / 180); // 10px外側に配置
    const textY = pieCenterY + (pieRadius + 10) * Math.sin((Math.PI * midAngle) / 180);

    // テキストアンカーの調整
    let textAnchor: "start" | "middle" | "end" = "middle";
    if (midAngle >= 45 && midAngle < 135)
      textAnchor = "start"; // 右上
    else if (midAngle >= 135 && midAngle < 225)
      textAnchor = "end"; // 左上
    else if (midAngle >= 225 && midAngle < 315)
      textAnchor = "end"; // 左下
    else textAnchor = "start"; // 右下

    return {
      ...lang,
      percentage: percentage * 100,
      color: LanguageColors[lang.name] || "#ededed",
      pathData,
      textX,
      textY,
      textAnchor,
    };
  });

  // 棒グラフ用の変数
  const barHeight = 10;
  const barSpacing = 5;
  const barStartY = cardPaddingY + titleHeight + 10;
  let currentBarY = barStartY;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes fadeInAnimation {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes expandWidth {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          @keyframes drawStroke {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 0; }
          }

          .card-bg {
            animation: fadeInAnimation 0.5s ease-out forwards;
          }
          .bar-rect {
            transform-origin: left center;
            animation: expandWidth 0.8s ease-out forwards;
            animation-delay: var(--delay);
          }
          .pie-slice {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawStroke 1s ease-out forwards;
            animation-delay: var(--delay);
          }
          .chart-text {
            animation: fadeInAnimation 0.5s ease-out forwards;
            animation-delay: var(--delay);
          }
        `}
      </style>
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill={`#${theme.bgColor}`}
        rx="4.5"
        stroke={`#${theme.borderColor || theme.bgColor}`}
        strokeOpacity="1"
        className="card-bg"
      />
      <text
        x={cardPaddingX}
        y={cardPaddingY}
        fontSize="14"
        fill={`#${theme.titleColor}`}
        className="chart-text"
        style={{ "--delay": "0.1s" } as React.CSSProperties}
      >
        Top Languages
      </text>

      {chartType === "bar" ? (
        // 棒グラフ
        finalLanguages.map((lang, index) => {
          const percentage = totalBytes > 0 ? (lang.bytes / totalBytes) * 100 : 0;
          const barWidth = (percentage / 100) * (width - cardPaddingX * 2);
          const langColor = LanguageColors[lang.name] || "#ededed";

          const yPos = currentBarY;
          currentBarY += barHeight + barSpacing;

          return (
            <React.Fragment key={lang.name}>
              <rect
                x={cardPaddingX}
                y={yPos}
                width={barWidth}
                height={barHeight}
                fill={langColor}
                rx="2"
                className="bar-rect"
                style={{ "--delay": `${0.2 + index * 0.1}s` } as React.CSSProperties}
              />
              <text
                x={width - cardPaddingX} // 右端に配置
                y={yPos + barHeight / 2 + 3}
                fontSize="10"
                fill={`#${theme.textColor}`}
                textAnchor="end" // 右揃え
                className="chart-text"
                style={{ "--delay": `${0.2 + index * 0.1}s` } as React.CSSProperties}
              >
                {lang.name} ({percentage.toFixed(1)}%)
              </text>
            </React.Fragment>
          );
        })
      ) : (
        // 円グラフ
        <>
          {pieChartData.map((data, index) => (
            <path
              key={data.name}
              d={data.pathData}
              fill={data.color}
              className="pie-slice"
              style={{ "--delay": `${0.2 + index * 0.1}s` } as React.CSSProperties}
            />
          ))}
          {pieChartData.map(
            (data, index) =>
              data.percentage >= 3 && ( // 3%未満の言語はテキストを表示しない
                <text
                  key={`${data.name}-text`}
                  x={data.textX}
                  y={data.textY}
                  textAnchor={data.textAnchor}
                  fontSize="8"
                  fill={`#${theme.textColor}`}
                  className="chart-text"
                  style={{ "--delay": `${0.3 + index * 0.1}s` } as React.CSSProperties}
                >
                  {data.name} ({data.percentage.toFixed(1)}%)
                </text>
              ),
          )}
        </>
      )}
    </svg>
  );
};
