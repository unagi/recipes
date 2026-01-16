# Recipes - 構造化データで管理するレシピサイト

## 📖 プロジェクト概要

構造化データによるレシピ管理を探求する技術実験プロジェクト。

レシピを共通のスキーマで管理し、型安全性とデータの再利用性を重視した実装を行います。Astroの静的サイト生成機能とContent Collectionsを活用し、高速で保守性の高いレシピサイトを構築します。

**デプロイ先:** Github Pages（完全静的サイト）

**対象ユーザー:**
- 自分自身のレシピ管理
- 家族・友人との共有
- 一般公開（将来的に）
- 技術的な参考実装を求める開発者

## ✨ コンセプト

### 構造化データファースト

レシピを単なるテキストではなく、構造化されたデータとして管理します。

**メリット:**
- 🔍 **検索性**: 材料・調理時間・カテゴリなど多軸での検索
- 📊 **データ活用**: 栄養計算、献立提案、買い物リスト生成
- 🔄 **互換性**: Schema.org、JSON-LD準拠でSEO・外部連携に対応
- 🛡️ **型安全**: TypeScript + Zodによる厳密な型チェック
- ♻️ **再利用性**: データとUIの分離により多様な表示形式に対応

### 技術スタック

- **フレームワーク**: Astro v5（静的サイト生成・SSG）
- **言語**: TypeScript（strict mode）
- **コンテンツ管理**: Astro Content Collections + MDX
- **スキーマ定義**: Zod（バリデーション・型推論）
- **テスト**: Vitest（TDD開発）
- **スタイル**: CSS（scoped styles）
- **ホスティング**: Github Pages（静的ファイルのみ）

### アーキテクチャ制約

**静的サイト生成（SSG）のみ:**
- サーバサイドレンダリング（SSR）は使用不可
- APIエンドポイント・サーバレス関数は使用不可
- すべてのデータはビルド時に生成
- クライアントサイドJavaScriptで動的機能を実装

## 🎯 主な機能（予定）

- ✅ レシピの構造化データ管理
- ✅ 材料・手順の明確な定義
- ✅ 調理時間・人数・難易度の管理
- ✅ カテゴリ・タグによる分類
- 🔲 材料検索・フィルタリング（クライアントサイド）
- 🔲 栄養情報の表示
- 🔲 アレルギー情報の明示
- 🔲 レシピのエクスポート（JSON-LD）
- 🔲 RSS/Sitemapによる配信

## 🚀 プロジェクト構造

```text
├── public/              # 静的アセット（画像等）
├── src/
│   ├── components/      # 再利用可能なコンポーネント
│   │   ├── Recipe/     # レシピ表示コンポーネント群
│   │   └── Layout/     # レイアウトコンポーネント
│   ├── content/         # コンテンツコレクション
│   │   ├── config.ts   # スキーマ定義（Zod）
│   │   └── recipes/    # レシピデータ（MDX + frontmatter）
│   ├── layouts/         # ページレイアウト
│   ├── pages/           # ルーティング（.astro/.md）
│   └── utils/           # ユーティリティ関数
├── AGENTS.md            # 開発ガイド
├── astro.config.mjs     # Astro設定
├── package.json
├── tsconfig.json
└── vitest.config.ts     # テスト設定
```

## 🛠️ セットアップ

### 必須要件

- Node.js 18以上
- npm 9以上

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーが `http://localhost:4321` で起動します。

## 📝 開発コマンド

| コマンド                | 説明                                     |
| :---------------------- | :--------------------------------------- |
| `npm install`           | 依存関係のインストール                   |
| `npm run dev`           | 開発サーバー起動（`localhost:4321`）     |
| `npm run build`         | プロダクションビルド（`./dist/`）        |
| `npm run preview`       | ビルドしたサイトのプレビュー             |
| `npm test`              | テスト実行（watch mode）                 |
| `npm run test:run`      | テスト実行（1回のみ）                    |
| `npm run astro ...`     | Astro CLIコマンド実行                    |
| `npm run astro check`   | 型チェック実行                           |

## 🚢 デプロイ

このプロジェクトは Github Actions を使用して自動的にデプロイされます。

**デプロイ先:**
- **URL**: https://recipes.ymgch.org
- **ホスティング**: Github Pages
- **リポジトリ**: https://github.com/unagi/recipes

**自動デプロイ:**
- `main` ブランチへのpush時に自動実行
- テスト → ビルド → デプロイの順に実行

詳細な設定手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

## 📚 開発ガイド

詳細な開発ルール・規約については [AGENTS.md](./AGENTS.md) を参照してください。

**重要なルール:**
- **TDD開発**: テストファーストで実装
- **日本語運用**: コミット・PR・コメントはすべて日本語
- **構造化データ**: レシピは必ず共通スキーマで管理
- **型安全**: TypeScript strict mode、any禁止
- **静的サイト**: SSR/APIエンドポイントは使用不可

## 🧪 テスト

このプロジェクトはTDD（テスト駆動開発）で進めます。

```bash
# テストの実行
npm test

# UIでテスト確認
npm run test:ui

# テスト1回実行
npm run test:run
```

## 📦 レシピデータのスキーマ

レシピは以下の構造化データで管理します（策定中）。

**主な項目:**
- タイトル、説明文
- 材料リスト（名前、分量、単位）
- 調理手順（ステップごと）
- 調理時間（準備・調理・合計）
- 人数、難易度
- カテゴリ、タグ
- 栄養情報、アレルギー情報

詳細は [AGENTS.md - レシピデータの構造化](./AGENTS.md#レシピデータの構造化) を参照。

## 🤝 コントリビューション

Issue・PRは日本語で作成してください。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成（`feature/新機能名`）
3. テストを書いてから実装（TDD）
4. コミット（`feat: 機能の説明`）
5. プッシュしてPR作成

## 📄 ライセンス

MIT

## 🔗 参考リンク

- [Astro公式ドキュメント](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Schema.org - Recipe](https://schema.org/Recipe)
- [Vitest](https://vitest.dev/)
