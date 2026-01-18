# TESTING.md - テスト開発ガイド

このドキュメントは、レシピサイトのテスト開発に関する詳細ガイドです。基本的な開発ガイドは [AGENTS.md](../../AGENTS.md) を参照してください。

---

## TDD原則

### 基本方針
**テストは仕様。テストファーストで開発する。**

TDD（Test-Driven Development）は以下のサイクルで進めます：

1. **Red（失敗）**: 失敗するテストを書く
   - まだ実装されていない機能のテストを書く
   - テストが失敗することを確認
   - 期待する動作を明確に定義

2. **Green（成功）**: テストを通す最小限の実装
   - テストが通るコードを書く
   - 最小限の実装で素早く通す
   - まずは動くことを優先

3. **Refactor（改善）**: リファクタリング
   - テストが通る状態を維持しながらコードを改善
   - 重複を排除し、読みやすくする
   - テストも同時にリファクタリング

### TDDのメリット

- **仕様の明確化**: テストが仕様書の役割を果たす
- **バグの早期発見**: 実装中に問題を発見できる
- **リファクタリングの安全性**: テストがあるので安心して改善できる
- **ドキュメント**: テストが使い方の例になる

---

## テスト環境セットアップ

### 初回セットアップ

プロジェクト開始時に以下のコマンドでテスト環境を構築します：

```bash
# Vitestとテスト関連パッケージのインストール
npm install -D vitest @vitest/ui

# React Testing Library（必要な場合）
npm install -D @testing-library/react @testing-library/jest-dom

# DOMテスト用環境
npm install -D happy-dom
```

### package.json設定

`package.json`にテスト実行スクリプトを追加：

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

**各コマンドの説明:**
- `npm test`: watchモードでテストを実行（開発中）
- `npm run test:ui`: ブラウザUIでテストを実行（デバッグ用）
- `npm run test:run`: 一度だけ実行して終了（CI/CD用）

### vitest.config.ts作成

プロジェクトルートに`vitest.config.ts`を作成：

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',  // DOM環境をシミュレート
    globals: true,              // describe, test等をグローバルに
  },
});
```

**設定項目の説明:**
- `environment: 'happy-dom'`: ブラウザ環境をNode.jsで再現
- `globals: true`: `describe`, `test`, `expect`等をimportなしで使用可能

### セットアップ確認

テスト環境が正しく動作するか確認：

```bash
# テスト実行（初回は0件でOK）
npm test

# UIで確認
npm run test:ui
```

---

## テスト作成ルール

### ファイル配置

**配置ルール:**
- テストファイルは`src/**/*.test.ts`または`src/**/*.spec.ts`
- テスト対象と同じディレクトリに配置
- ファイル名は対象に`.test`または`.spec`を付ける

**例:**
```
src/
├── utils/
│   ├── format.ts         # 実装
│   └── format.test.ts    # テスト
├── components/
│   ├── RecipeCard.astro  # コンポーネント
│   └── RecipeCard.test.ts # テスト
```

### テストファイルの基本構造

**基本テンプレート:**

```typescript
import { describe, test, expect } from 'vitest';
import { 対象の関数 } from './対象のファイル';

describe('機能名または関数名', () => {
  test('正常系: 期待される動作', () => {
    // Arrange: 準備
    const input = '入力値';

    // Act: 実行
    const result = 対象の関数(input);

    // Assert: 検証
    expect(result).toBe('期待値');
  });

  test('異常系: エラーケース', () => {
    // Arrange
    const invalidInput = null;

    // Act & Assert
    expect(() => 対象の関数(invalidInput)).toThrow('エラーメッセージ');
  });
});
```

### 命名規則

**describe（グループ化）:**
- 機能名または関数名を記述
- 例: `describe('formatCookingTime', () => {...})`

**test（個別テスト）:**
- `正常系:` / `異常系:` の接頭辞を使用
- 期待する動作を明確に記述
- 例: `test('正常系: 60分を1時間に変換', () => {...})`

### AAA（Arrange-Act-Assert）パターン

すべてのテストは3つのフェーズで構成：

**1. Arrange（準備）:**
```typescript
// テストに必要なデータやモックを準備
const input = 60;
const expected = '1時間';
```

**2. Act（実行）:**
```typescript
// テスト対象の関数を実行
const result = formatCookingTime(input);
```

**3. Assert（検証）:**
```typescript
// 結果が期待通りか検証
expect(result).toBe(expected);
```

### アサーション（検証）の種類

**よく使うマッチャー:**

```typescript
// 厳密な等価性
expect(value).toBe(expected);

// オブジェクト・配列の等価性
expect(object).toEqual(expectedObject);

// 真偽値
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// 例外のスロー
expect(() => func()).toThrow('エラーメッセージ');
expect(() => func()).toThrow(ErrorClass);

// 配列・文字列の包含
expect(array).toContain(item);
expect(string).toContain('部分文字列');

// 数値の比較
expect(number).toBeGreaterThan(10);
expect(number).toBeLessThan(100);
expect(number).toBeCloseTo(3.14, 2);  // 小数点の比較
```

---

## テストケース例

### ユーティリティ関数のテスト

**対象: 調理時間フォーマット関数**

```typescript
// src/utils/format.ts
export function formatCookingTime(minutes: number): string {
  if (minutes < 0) {
    throw new Error('調理時間は0以上である必要があります');
  }
  if (minutes === 0) {
    return '0分';
  }
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${remainingMinutes}分`;
}
```

**テスト:**

```typescript
// src/utils/format.test.ts
import { describe, test, expect } from 'vitest';
import { formatCookingTime } from './format';

describe('formatCookingTime', () => {
  test('正常系: 0分の場合', () => {
    expect(formatCookingTime(0)).toBe('0分');
  });

  test('正常系: 60分未満の場合', () => {
    expect(formatCookingTime(30)).toBe('30分');
    expect(formatCookingTime(45)).toBe('45分');
  });

  test('正常系: ちょうど60分の場合', () => {
    expect(formatCookingTime(60)).toBe('1時間');
  });

  test('正常系: 60分を超える場合', () => {
    expect(formatCookingTime(90)).toBe('1時間30分');
    expect(formatCookingTime(150)).toBe('2時間30分');
  });

  test('異常系: 負の値の場合はエラー', () => {
    expect(() => formatCookingTime(-1)).toThrow('調理時間は0以上である必要があります');
  });
});
```

### データ変換のテスト

**対象: レシピデータ変換**

```typescript
// src/utils/recipe.test.ts
import { describe, test, expect } from 'vitest';
import { convertRecipeToDisplay } from './recipe';

describe('convertRecipeToDisplay', () => {
  test('正常系: 完全なレシピデータを変換', () => {
    const input = {
      title: 'カルボナーラ',
      prepTime: 10,
      cookTime: 15,
      servings: 2,
    };

    const result = convertRecipeToDisplay(input);

    expect(result).toEqual({
      title: 'カルボナーラ',
      totalTime: '25分',
      servings: '2人分',
    });
  });

  test('正常系: 調理時間が60分以上', () => {
    const input = {
      title: 'ビーフシチュー',
      prepTime: 30,
      cookTime: 120,
      servings: 4,
    };

    const result = convertRecipeToDisplay(input);

    expect(result.totalTime).toBe('2時間30分');
  });

  test('異常系: 必須フィールドが欠けている場合', () => {
    const input = {
      title: 'カルボナーラ',
      // prepTimeとcookTimeが欠けている
      servings: 2,
    };

    expect(() => convertRecipeToDisplay(input)).toThrow();
  });
});
```

---

## テスト修正の原則

テストの修正は、テストが「仕様」であるという認識が重要です。テストの変更は仕様変更を意味します。

### 確認不要（自動的に修正可能）

以下の変更はリファクタリングの一部として自動的に修正できます：

**1. import/requireパスの変更**
```typescript
// ファイル移動に伴うパス変更
// 変更前
import { formatCookingTime } from './utils/format';

// 変更後
import { formatCookingTime } from '@/utils/format';
```

**2. リネームリファクタに伴う変更**
```typescript
// 関数名変更
// 変更前
test('正常系: formatTime関数', () => {
  expect(formatTime(60)).toBe('1時間');
});

// 変更後
test('正常系: formatCookingTime関数', () => {
  expect(formatCookingTime(60)).toBe('1時間');
});
```

### 確認必須（必ず事前確認）

以下の変更は仕様変更を伴うため、必ず事前に確認が必要です：

**1. アサーションの期待値変更**
```typescript
// ❌ NG: 確認なしで変更
expect(formatCookingTime(60)).toBe('60分');  // 元は '1時間'

// ✅ OK: 仕様変更を確認してから変更
// 理由: フォーマット方針が変更され、常に「分」表記に統一
expect(formatCookingTime(60)).toBe('60分');
```

**2. テストケースの追加・削除**
```typescript
// ❌ NG: テストが邪魔だからと削除
// test('異常系: 負の値の場合はエラー', () => { ... });

// ✅ OK: 仕様変更により負の値を許容するようになった場合のみ削除
```

**3. モック/スタブの振る舞い変更**
```typescript
// ❌ NG: テストを通すためにモックを変更
vi.mock('./api', () => ({
  fetchRecipe: () => Promise.resolve({ /* 変更後のデータ */ })
}));

// ✅ OK: APIの仕様変更に伴うモック更新
```

---

## テスト失敗時の対処法

### 1. エラーメッセージを読む

Vitestは詳細なエラーメッセージを表示します：

```
FAIL src/utils/format.test.ts > formatCookingTime > 正常系: 60分を1時間に変換
AssertionError: expected '60分' to be '1時間'

Expected: "1時間"
Received: "60分"
```

**確認事項:**
- Expected（期待値）とReceived（実際の値）を比較
- テストの意図と実装の動作が一致しているか
- どちらが正しいか判断

### 2. 原因の特定

**A. テストが間違っている場合:**
- テストの期待値が間違っている
- テストケースが不適切

**B. 実装が間違っている場合:**
- ロジックのバグ
- エッジケースの考慮漏れ

**C. 仕様変更の場合:**
- 仕様が変更されたため、テストを更新する必要がある

### 3. 修正方法

**パターン1: 実装のバグを修正**
```typescript
// テストは正しい、実装が間違っている場合
// テスト:
test('正常系: 60分を1時間に変換', () => {
  expect(formatCookingTime(60)).toBe('1時間');
});

// 実装を修正:
export function formatCookingTime(minutes: number): string {
  // 60分の場合の処理を追加
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}時間`;
  }
  return `${minutes}分`;
}
```

**パターン2: テストを修正（仕様変更の場合）**
```typescript
// 仕様: 常に「分」表記に統一することに変更
// テストを更新:
test('正常系: 60分はそのまま60分と表示', () => {
  expect(formatCookingTime(60)).toBe('60分');
});
```

### 4. デバッグテクニック

**console.logでデバッグ:**
```typescript
test('デバッグ中', () => {
  const input = 60;
  const result = formatCookingTime(input);
  console.log('input:', input);
  console.log('result:', result);
  expect(result).toBe('1時間');
});
```

**UIモードでデバッグ:**
```bash
npm run test:ui
```
- ブラウザでテスト結果を確認
- 各テストの詳細を見やすく表示

---

## よくあるテストエラー

### 1. "TypeError: Cannot read property 'xxx' of undefined"

**原因:**
- オブジェクトがundefinedまたはnull
- プロパティアクセスが間違っている

**解決:**
```typescript
// ❌ エラー例
const recipe = getRecipe();
expect(recipe.title).toBe('カルボナーラ');  // recipeがundefined

// ✅ 修正
const recipe = getRecipe();
expect(recipe).toBeDefined();  // まず存在を確認
expect(recipe?.title).toBe('カルボナーラ');
```

### 2. "AssertionError: expected 'X' to be 'Y'"

**原因:**
- 期待値と実際の値が一致しない
- 型が違う（数値と文字列など）

**解決:**
```typescript
// ❌ エラー例
expect(formatCookingTime(60)).toBe(60);  // 数値を期待

// ✅ 修正
expect(formatCookingTime(60)).toBe('1時間');  // 文字列を期待
```

### 3. "Error: expect(received).toThrow() が失敗する"

**原因:**
- 関数が例外をスローしていない
- 例外をスローする関数を直接呼び出している

**解決:**
```typescript
// ❌ エラー例
expect(dangerousFunction()).toThrow();  // 即座に実行されてしまう

// ✅ 修正
expect(() => dangerousFunction()).toThrow();  // アロー関数でラップ
```

### 4. "ReferenceError: describe is not defined"

**原因:**
- vitest.config.tsで`globals: true`が設定されていない
- または設定ファイルが読み込まれていない

**解決:**
```typescript
// vitest.config.ts を確認
export default defineConfig({
  test: {
    globals: true,  // これが必要
  },
});
```

---

## 参考

- [AGENTS.md](../../AGENTS.md) - プロジェクト全体の開発ガイド
- [Vitest公式ドキュメント](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
