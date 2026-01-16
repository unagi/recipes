# AGENTS.md - レシピサイト開発ガイド

## プロジェクト概要

Astroベースのレシピ共有サイト。
レシピは構造化データで管理し、それを元にサイトを構築する。

**プロジェクト情報:**
- **リポジトリ**: https://github.com/unagi/recipes
- **公開URL**: https://recipes.ymgch.org
- **ホスティング**: Github Pages

**技術スタック:**
- Astro v5（静的サイト生成・SSG）
- TypeScript
- ESModules
- MDX (コンテンツ管理)
- Vitest（テスト）

**デプロイ環境:**
- Github Pages（完全静的サイト）
- カスタムドメイン使用

**アーキテクチャ制約:**
- **SSGのみ**: サーバサイドレンダリング（SSR）は使用不可
- **APIなし**: サーバサイドAPIエンドポイントは使用不可
- **ビルド時生成**: すべてのページとデータはビルド時に生成
- **クライアントサイド処理**: 動的機能はJavaScriptで実装

---

## 開発言語とコミュニケーション

**すべての開発活動は日本語で実施:**
- コミットメッセージ
- PRタイトル・説明
- コードコメント
- ドキュメント
- Issue/議論

**例外:**
- 変数名・関数名・型名は英語
- 技術用語は英語のまま使用可

---

## TDD原則

### 基本方針
**テストは仕様。テストファーストで開発する。**

1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限の実装
3. **Refactor**: リファクタリング

### テスト環境セットアップ

**初回セットアップ時に実施:**

```bash
# Vitestとテスト関連パッケージのインストール
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D happy-dom  # DOMテスト用
```

**package.json に追加:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

**vitest.config.ts を作成:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
```

### テスト作成ルール

1. **配置**: `src/**/*.test.ts` または `src/**/*.spec.ts`
2. **命名**: テスト対象と同じディレクトリに配置
3. **構成**:
   ```typescript
   describe('機能名', () => {
     test('正常系: 期待される動作', () => {
       // Arrange: 準備
       // Act: 実行
       // Assert: 検証
     });

     test('異常系: エラーケース', () => {
       // ...
     });
   });
   ```

### テスト修正の原則

**確認不要（自動的に修正可）:**
- import/requireパスの変更
- リネームリファクタに伴う関数名・変数名変更

**確認必須（必ず事前確認）:**
- アサーションの期待値変更
- テストケースの追加・削除
- モック/スタブの振る舞い変更

---

## レシピデータの構造化

### 原則

**レシピは必ず共通の構造化データで保持する。**

- Markdown/MDXのfrontmatterまたはJSON形式で管理
- Astro Content Collectionsを活用
- スキーマで型安全性を担保

### スキーマ策定時の考慮事項（未策定）

以下の項目を含むスキーマを策定する予定：

**必須項目:**
- タイトル（日本語・英語）
- 説明文
- カテゴリ・タグ
- 調理時間（準備時間・調理時間・合計時間）
- 人数（何人分）

**材料:**
- 材料名
- 分量
- 単位
- グループ化（例: メインの材料、ソース用）

**手順:**
- ステップ番号
- 説明文
- 画像（オプション）
- 所要時間（オプション）

**メタ情報:**
- 難易度
- 栄養情報（オプション: カロリー、タンパク質等）
- アレルギー情報
- 作成日・更新日
- 作成者

**表示用:**
- サムネイル画像
- OGP画像

### スキーマ実装時のルール

1. **型定義を先に作成**: TypeScriptで型を定義してからAstro Schemaに反映
2. **バリデーション**: Zodを使用してバリデーションルールを定義
3. **テスト**: スキーマに対するテストを作成
4. **マイグレーション**: 既存データがある場合は移行スクリプトを用意

```typescript
// 例: src/content/config.ts
import { defineCollection, z } from 'astro:content';

const recipeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    prepTime: z.number(),
    cookTime: z.number(),
    servings: z.number(),
    ingredients: z.array(z.object({
      name: z.string(),
      amount: z.string(),
      unit: z.string(),
    })),
    steps: z.array(z.string()),
    // ... 他のフィールド
  }),
});

export const collections = {
  recipes: recipeCollection,
};
```

---

## Astro固有の開発ルール

### ディレクトリ構成

```
src/
├── components/       # 再利用可能なコンポーネント
│   ├── Recipe/      # レシピ表示用コンポーネント群
│   └── Layout/      # レイアウトコンポーネント
├── content/         # コンテンツコレクション
│   └── recipes/     # レシピデータ（MDX形式）
├── layouts/         # ページレイアウト
├── pages/           # ルーティング対象ページ
└── utils/           # ユーティリティ関数
```

### コンポーネント作成ルール

1. **ファイル名**: PascalCase（例: `RecipeCard.astro`）
2. **Props定義**: TypeScriptで型を明示
   ```astro
   ---
   interface Props {
     title: string;
     description: string;
   }

   const { title, description } = Astro.props;
   ---
   ```

3. **スタイル**: scoped styleを優先
4. **テスト**: コンポーネントロジックはユーティリティ関数に抽出してテスト

### Content Collections

1. **スキーマ定義**: `src/content/config.ts`で必ず型定義
2. **データ取得**: `getCollection()` / `getEntry()`を使用
3. **型安全**: 自動生成される型を活用

### 静的サイト生成（SSG）の制約

**astro.config.mjs設定:**
```javascript
export default defineConfig({
  output: 'static',  // SSGモード（Github Pages用）
  // output: 'server' は使用不可
});
```

**使用できる機能:**
- ✅ 静的ルーティング（`src/pages/*.astro`）
- ✅ 動的ルーティング（`[slug].astro`）でビルド時生成
- ✅ Content Collections（ビルド時にデータ取得）
- ✅ クライアントサイドJavaScript（`client:*`ディレクティブ）

**使用できない機能:**
- ❌ サーバサイドレンダリング（SSR）
- ❌ APIエンドポイント（`src/pages/api/*.ts`）
- ❌ オンデマンドレンダリング
- ❌ サーバサイドデータフェッチ（リクエスト時）

**動的機能の実装方法:**
- 検索・フィルタリング: クライアントサイドJavaScript
- データ取得: ビルド時に全データをJSONとして生成し、クライアントで読み込み
- インタラクション: Vanilla JSまたは軽量ライブラリ（Alpine.js等）

---

## TypeScript/ESModules規約

### TypeScript

- **any禁止**: `unknown`または適切な型を使用
- **型定義**: すべての関数・変数に型を明示
- **strictモード**: `tsconfig.json`でstrict有効化
- **interfaceとtype**:
  - Propsやデータ構造: `interface`
  - Union型や複雑な型: `type`

### ESModules

- **import/export**: CommonJS（require）は使用しない
- **相対パス**: `@/`エイリアスを活用（設定が必要な場合は追加）
- **Named exports優先**: default exportは必要最小限

### 関数型アプローチ

- **副作用の分離**: 純粋関数とI/O処理を分ける
- **イミュータブル**: 既存データの変更より新規作成
- **合成**: 小さな関数を組み合わせる

---

## Git/PR運用

### コミットメッセージ

**形式: Conventional Commits（日本語）**

```
<type>: <概要>

[本文]

[フッター]
```

**type:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: フォーマット（コード動作に影響なし）
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルド・補助ツール関連

**例:**
```
feat: レシピカード一覧コンポーネントを追加

- レシピ一覧を表示するRecipeCardコンポーネントを実装
- グリッドレイアウトでレスポンシブ対応
- サムネイル画像とメタ情報を表示

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### PR運用

**PRタイトル:**
```
[<type>] 変更内容の要約
```

**PR説明テンプレート:**
```markdown
## 概要
変更内容の簡潔な説明

## 変更内容
- 変更点1
- 変更点2

## テスト
- [ ] ユニットテスト追加/更新
- [ ] 手動テスト実施
- [ ] ビルド確認

## 影響範囲
影響を受けるファイル・機能

## 備考
追加の補足情報
```

### ブランチ戦略

- **main**: 本番反映可能な状態
- **feature/xxx**: 機能追加
- **fix/xxx**: バグ修正
- **refactor/xxx**: リファクタリング

---

## 開発フロー

### 新機能追加時

1. **Issue作成**: 機能要件を明確化
2. **ブランチ作成**: `feature/機能名`
3. **テスト作成**: 期待する動作のテストを先に書く
4. **実装**: テストが通る最小限の実装
5. **リファクタリング**: コード品質向上
6. **ビルド確認**: `npm run build`で確認
7. **PR作成**: レビュー依頼
8. **マージ**: mainへマージ

### バグ修正時

1. **再現テスト作成**: バグを再現するテストを追加
2. **修正実装**: テストが通るように修正
3. **回帰テスト**: 既存機能に影響がないか確認
4. **PR作成**: `fix:`プレフィックスで作成

---

## 品質担保

### 必須チェック項目

**コミット前:**
- [ ] テストが全てパス（`npm test`）
- [ ] ビルドが成功（`npm run build`）
- [ ] 型チェックが通る（`npm run astro check`）
- [ ] lintエラーなし

**PR作成前:**
- [ ] 関連するテストを追加・更新
- [ ] ドキュメント更新（必要な場合）
- [ ] スクリーンショット添付（UI変更の場合）

### コードレビュー観点

1. **機能要件**: 要件を満たしているか
2. **テスト**: 適切なテストケースがあるか
3. **型安全性**: any使用なし、型推論が効いているか
4. **パフォーマンス**: 不要な再レンダリング・重い処理がないか
5. **保守性**: 可読性・拡張性が確保されているか

---

## トラブルシューティング

### よくある問題

**ビルドエラー:**
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
```

**型エラー:**
```bash
# Astroの型生成
npm run astro sync
```

**開発サーバーが起動しない:**
```bash
# ポート競合確認
lsof -i :4321
# プロセスをkillして再起動
```

---

## デプロイ

### Github Pagesへのデプロイ

**前提条件:**
- リポジトリがGithubに存在
- Github Pagesが有効化されている

**手動デプロイ:**
```bash
# ビルド
npm run build

# distディレクトリの内容をgh-pagesブランチにプッシュ
```

### Github Actions自動デプロイ（推奨）

`.github/workflows/deploy.yml`を作成:

```yaml
name: Deploy to Github Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**astro.config.mjsの設定:**
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://recipes.ymgch.org',  // カスタムドメイン
  // カスタムドメインのルートで公開するため base は不要
});
```

**public/CNAMEファイル:**
カスタムドメインを使用する場合は、`public/CNAME` ファイルを作成：
```
recipes.ymgch.org
```

**デプロイフロー:**
1. `main`ブランチへのpush
2. Github Actionsが自動実行
3. テスト実行
4. ビルド
5. Github Pagesへデプロイ
6. https://recipes.ymgch.org で公開

**詳細な設定手順:**
- DNS設定、トラブルシューティング等は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照

---

## 参考リンク

### フレームワーク・ツール
- [Astro公式ドキュメント](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Vitest公式ドキュメント](https://vitest.dev/)

### スキーマ・構造化データ
- [Schema.org - Recipe](https://schema.org/Recipe)
- [JSON-LD](https://json-ld.org/)

### Git・デプロイ
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Github Pages](https://docs.github.com/ja/pages)
- [Astro - Deploy to Github Pages](https://docs.astro.build/en/guides/deploy/github/)
