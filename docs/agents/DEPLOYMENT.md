# デプロイ手順

## 概要

このプロジェクトは Github Actions を使用して Github Pages にデプロイされます。
カスタムドメイン `recipes.ymgch.org` で公開されます。

## 1. Github Pagesの設定

### 1.1 リポジトリ設定

1. リポジトリ https://github.com/unagi/recipes の **Settings** タブに移動
2. 左サイドバーの **Pages** をクリック
3. **Source** を `GitHub Actions` に設定
4. **Custom domain** に `recipes.ymgch.org` を入力
5. **Enforce HTTPS** にチェック（推奨）
6. 保存

## 2. DNS設定

ドメイン `ymgch.org` のDNS設定で以下のレコードを追加します。

### 推奨: CNAME レコード（サブドメイン用）

```
Type:  CNAME
Name:  recipes
Value: unagi.github.io.
TTL:   3600（または適切な値）
```

**注意**: CNAMEレコードの値の末尾にドット（`.`）を付けることを推奨します。

### 代替: A レコード（Github PagesのIPアドレス）

CNAMEが使えない場合は、以下のAレコードを追加します：

```
Type:  A
Name:  recipes
Value: 185.199.108.153
TTL:   3600
```

追加で以下のIPアドレスも設定（冗長性のため）：
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

**注意**: Github PagesのIPアドレスは変更される可能性があるため、CNAMEレコードの使用を推奨します。

### DNS設定の確認

DNSの伝播には最大48時間かかることがありますが、通常は数分～数時間で完了します。

```bash
# CNAMEレコードの確認
dig recipes.ymgch.org CNAME +short

# Aレコードの確認
dig recipes.ymgch.org A +short

# 完全な情報の確認
nslookup recipes.ymgch.org
```

## 3. デプロイフロー

### 自動デプロイ（推奨）

`main` ブランチへのpush時に自動的にデプロイされます。

```bash
git add .
git commit -m "feat: 新機能を追加"
git push origin main
```

### デプロイ状況の確認

1. リポジトリの **Actions** タブを開く
2. 最新のワークフロー実行を確認
3. 各ステップの実行状況・ログを確認

### 手動デプロイ

Github Actions画面から手動でワークフローを実行できます。

1. **Actions** タブ → **Deploy to Github Pages** ワークフローを選択
2. **Run workflow** ボタンをクリック
3. ブランチを選択（通常は `main`）
4. **Run workflow** で実行

## 4. デプロイパイプライン

```
git push origin main
    ↓
Github Actions起動
    ↓
① Checkout コード
    ↓
② Node.js 20 セットアップ
    ↓
③ 依存関係インストール (npm ci)
    ↓
④ テスト実行 (npm run test:run)
    ↓
⑤ Astroビルド (npm run build)
    ↓
⑥ アーティファクトアップロード
    ↓
⑦ Github Pagesへデプロイ
    ↓
✨ https://recipes.ymgch.org で公開
```

## 5. トラブルシューティング

### ビルドが失敗する

- **テスト失敗**: ローカルで `npm run test:run` を実行して確認
- **ビルドエラー**: ローカルで `npm run build` を実行して確認
- **依存関係の問題**: `package-lock.json` の整合性を確認

### カスタムドメインが反映されない

- DNS設定を確認（`dig recipes.ymgch.org`）
- DNS伝播に時間がかかる場合がある（最大48時間）
- Github Pagesの設定で「Custom domain」が正しく設定されているか確認
- `public/CNAME` ファイルが存在し、正しい内容か確認
- ビルド後の `dist/CNAME` ファイルを確認

### HTTPSが有効にならない

- DNSが正しく設定されているか確認
- Github Pagesの設定で「Enforce HTTPS」をチェック
- 証明書の発行に数分～数時間かかる場合がある
- 一度「Enforce HTTPS」のチェックを外し、再度チェックしてみる

### 404エラーが発生する

- `astro.config.mjs` の `base` 設定を確認（カスタムドメイン使用時は不要）
- `site` 設定が正しいか確認（`https://recipes.ymgch.org`）
- ビルドが正常に完了しているか確認

## 6. ローカルでのビルド確認

デプロイ前にローカルでビルドを確認することを推奨します。

```bash
# ビルド
npm run build

# プレビュー
npm run preview
```

プレビューサーバーは `http://localhost:4321` で起動します。

## 7. 参考リンク

- [Github Pages公式ドキュメント](https://docs.github.com/ja/pages)
- [Github Pagesでカスタムドメインを使用する](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Astro - Github Pagesへのデプロイ](https://docs.astro.build/en/guides/deploy/github/)
