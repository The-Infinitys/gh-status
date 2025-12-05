# gh-status

`gh-status` は、特定のGitHubユーザーのプロフィール、リポジトリ、言語使用状況、および活動統計情報を取得・集計するためのシンプルなCLIツールです。将来的には、これらの情報を美しいSVGバッジとして視覚化し、GitHubプロフィールやウェブサイトに簡単に埋め込むことを目指しています。

## ✨ Features

-   **GitHub統計の取得**: GitHubユーザーのフォロワー数、フォロー数、公開リポジトリ数などの活動統計を取得します。
-   **リポジトリと言語使用状況の分析**: ユーザーが所有するリポジトリと言語の使用状況を集計し、各言語のバイト数に基づいた統計情報を提供します。
-   **柔軟なAPIアクセス**: `gh` CLIツールが利用可能な場合はそれを優先し、よりセキュアでレートリミットに強いアクセスを提供します。利用できない場合は、Bunの `fetch` APIにフォールバックします。
-   **簡単なユーザー名設定**:
    -   環境変数 `GITHUB_REPOSITORY_OWNER`
    -   `config/gh.yaml` ファイル
    -   標準入力からの対話型入力
    の優先順位でユーザー名を設定できます。
-   **将来的にはSVG表示に対応**: 現在は集計されたJSONデータをコンソールに出力しますが、将来的には[anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) のように、これらの統計情報をSVG形式で表示する機能を追加する予定です。

## 🚀 Installation

まず、プロジェクトのリポジトリをクローンし、依存関係をインストールします。

```bash
git clone https://github.com/your-username/gh-status.git # <--- ここは実際のレポURLに置き換えてください
cd gh-status
bun install
```

## 💡 Usage

### ユーザー名の設定

`gh-status` は、以下のいずれかの方法でGitHubユーザー名を取得します（優先順位順）。

1.  **環境変数 `GITHUB_REPOSITORY_OWNER`**:
    ```bash
    export GITHUB_REPOSITORY_OWNER="your-github-username"
    ```
2.  **`config/gh.yaml` ファイル**:
    プロジェクトのルートに `config/gh.yaml` ファイルを作成し、以下のように記述します。
    ```yaml
    username: your-github-username
    ```
3.  **標準入力**: 上記の設定が見つからない場合、ツールは実行時にユーザー名を入力するよう求めます。

### 実行

設定が完了したら、以下のコマンドでツールを実行できます。

```bash
bun run src/main.ts
```

#### 出力例 (JSON)

現在は以下のようなJSON形式の出力がコンソールに表示されます。

```json
{
  "languagesByRepo": {
    "totalBytes": 1234567,
    "data": [
      {
        "name": "TypeScript",
        "bytes": 500000,
        "percentage": "40.5%"
      },
      {
        "name": "JavaScript",
        "bytes": 300000,
        "percentage": "24.3%"
      }
      // ... 他の言語
    ]
  },
  "languagesByCommits": {
    "totalBytes": 1234567,
    "data": [
      {
        "name": "TypeScript",
        "bytes": 500000,
        "percentage": "40.5%"
      },
      {
        "name": "JavaScript",
        "bytes": 300000,
        "percentage": "24.3%"
      }
      // ... 他の言語
    ]
  },
  "activity": {
    "followers": 100,
    "followings": 50,
    "publicReposCount": 20,
    "currentYearContributions": 1234
  }
}
```

## 💖 Inspired By

このプロジェクトは、GitHubプロフィールに美しい統計カードを追加できる素晴らしいプロジェクト [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) からインスピレーションを得ています。`gh-status` も同様に、ユーザーのGitHub活動を魅力的に視覚化するツールとなることを目指しています。

## 🤝 Contributing

貢献を歓迎します！バグ報告、機能の提案、プルリクエストなど、お気軽にお寄せください。

## 📄 License

このプロジェクトはMITライセンスの下で公開されています。詳細については [`LICENSE`](LICENSE) ファイルを参照してください。