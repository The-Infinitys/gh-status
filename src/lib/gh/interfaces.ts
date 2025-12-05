export interface ActivityStatus {
  currentYearContributions: number;
  publicReposCount: number;
  followers: number;
  followings: number;
}
export type GitHubReposApi = Array<GitHubRepo>;
export interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: object | null; // ライセンス情報がオブジェクトまたはnullになる
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}
export interface GitHubUserApi {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string; // ISO 8601形式のタイムスタンプ
  updated_at: string; // ISO 8601形式のタイムスタンプ
}
export interface GitHubStatus {
  languagesByRepo: LanguagesUsages;
  languagesByCommits: LanguagesUsages;
  activity: ActivityStatus;
}
export interface LanguageUsageData {
  name: string;
  bytes: number;
}
// LanguagesUsages.ts (または同じファイル内)

export interface LanguageUsageData {
  name: string;
  bytes: number;
}

export class LanguagesUsages {
  private data: Array<LanguageUsageData> = [];
  private totalBytes: number;

  constructor(data: Array<LanguageUsageData>) {
    this.data = data;
    // 総バイト数を事前に計算して保持
    this.totalBytes = this.calculateTotal();
  }

  /**
   * すべての言語の合計バイト数を計算します。
   */
  private calculateTotal(): number {
    return this.data.reduce((sum, item) => sum + item.bytes, 0);
  }

  /**
   * すべての言語の合計バイト数を返します。
   */
  public total(): number {
    return this.totalBytes;
  }

  /**
   * 特定の言語の使用割合（0.0 から 1.0）を返します。
   * @param language 言語名
   * @returns 使用割合、またはデータがない場合は null
   */
  public get(language: string): number | null {
    if (this.totalBytes === 0) {
      return null;
    }

    const item = this.data.find(
      (d) => d.name.toLowerCase() === language.toLowerCase()
    );

    if (item) {
      // 割合を計算して返す
      return item.bytes / this.totalBytes;
    }
    return null;
  }

  /**
   * 生のデータ配列を返します。
   */
  public getData(): Array<LanguageUsageData> {
    return this.data;
  }
}
