import React from "react";
import { ActivityStatus } from "../gh/interfaces";
import { type Theme } from "./themes";

interface GithubCommitStatsSVGProps {
  activity: ActivityStatus;
  theme: Theme;
}

export const GithubCommitStatsSVG: React.FC<GithubCommitStatsSVGProps> = ({ activity, theme }) => {
  const width = 300;
  const height = 100; // 高さ調整
  const cardPaddingX = 15;
  const cardPaddingY = 20;

  const contributions = activity.currentYearContributions;

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
          @keyframes slideInFromLeft {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .card-bg {
            animation: fadeInAnimation 0.5s ease-out forwards;
          }
          .title-text {
            animation: fadeInAnimation 0.8s ease-out forwards;
            animation-delay: 0.1s;
          }
          .contribution-value {
            animation: slideInFromLeft 1s ease-out forwards;
            animation-delay: 0.3s;
          }
          .contribution-label {
            animation: fadeInAnimation 0.8s ease-out forwards;
            animation-delay: 0.5s;
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
        className="title-text"
      >
        Annual Contributions
      </text>

      <text
        x={width / 2}
        y={height / 2 + 8} // 数値を中央より少し下に
        textAnchor="middle"
        fontSize="36"
        fontWeight="bold"
        fill={`#${theme.iconColor}`}
        className="contribution-value"
      >
        {contributions}
      </text>
      <text
        x={width / 2}
        y={height / 2 + 30} // ラベルを数値の下に
        textAnchor="middle"
        fontSize="10"
        fill={`#${theme.textColor}`}
        className="contribution-label"
      >
        Total Contributions in current year
      </text>
    </svg>
  );
};
