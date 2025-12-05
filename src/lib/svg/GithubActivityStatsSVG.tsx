import React from "react";
import { ActivityStatus } from "../gh/interfaces";
import { type Theme } from "./themes";

interface GithubActivityStatsSVGProps {
  activity: ActivityStatus;
  theme: Theme;
}

export const GithubActivityStatsSVG: React.FC<GithubActivityStatsSVGProps> = ({
  activity,
  theme,
}) => {
  const width = 300;
  const height = 150;
  const cardPaddingX = 15;
  const cardPaddingY = 20;
  const itemSpacing = 20;

  const stats = [
    { label: "Followers", value: activity.followers },
    { label: "Following", value: activity.followings },
    { label: "Public Repos", value: activity.publicReposCount },
    { label: "Contributions (Year)", value: activity.currentYearContributions },
  ];

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
          .card-bg {
            animation: fadeInAnimation 0.5s ease-out forwards;
          }
          .stat-item {
            animation: fadeInAnimation 0.8s ease-out forwards;
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
        className="stat-item"
        style={{ "--delay": "0.1s" } as React.CSSProperties}
      >
        GitHub Activity
      </text>

      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <text
            x={cardPaddingX} // 左揃え
            y={cardPaddingY + 30 + index * itemSpacing}
            fontSize="12"
            fill={`#${theme.textColor}`}
            className="stat-item"
            style={{ "--delay": `${0.2 + index * 0.1}s` } as React.CSSProperties}
          >
            {stat.label}:
          </text>
          <text
            x={width - cardPaddingX} // 右揃え
            y={cardPaddingY + 30 + index * itemSpacing}
            fontSize="12"
            fontWeight="bold"
            fill={`#${theme.iconColor}`}
            textAnchor="end" // 右揃え
            className="stat-item"
            style={{ "--delay": `${0.2 + index * 0.1}s` } as React.CSSProperties}
          >
            {stat.value}
          </text>
        </React.Fragment>
      ))}
    </svg>
  );
};
