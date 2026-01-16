# レシピ作成の実例集

このドキュメントは、レシピ作成時に参考にできる豊富な実例を提供します。基本的な情報は [RECIPE_GUIDE.md](./RECIPE_GUIDE.md) を参照してください。

---

## ファイル命名の実例

### パスタ料理

| レシピ名 | ファイル名 | 理由 |
|---------|-----------|------|
| カルボナーラ | `carbonara.md` | 標準的な名称 |
| アラビアータ | `arrabbiata.md` | 標準的な名称 |
| ペペロンチーノ | `aglio-olio-peperoncino.md` | 正式名称 |
| 明太子パスタ | `mentaiko-pasta.md` | 日本料理のローマ字表記 |
| ボンゴレビアンコ | `vongole-bianco.md` | イタリア語表記 |

### カレー・煮込み料理

| レシピ名 | ファイル名 | 理由 |
|---------|-----------|------|
| スープカレー | `spice-soup-curry.md` | 特徴 + 料理名 |
| グリーンカレー | `thai-green-curry.md` | 国名 + 料理名 |
| ビーフシチュー | `beef-stew.md` | 材料 + 料理名 |
| チキンティッカマサラ | `chicken-tikka-masala.md` | 標準的な名称 |

### 主菜

| レシピ名 | ファイル名 | 理由 |
|---------|-----------|------|
| ハンバーグ | `hamburger-steak.md` | 英語表記（曖昧性回避） |
| 鶏の唐揚げ | `chicken-karaage.md` | 料理名のローマ字表記 |
| 豚の角煮 | `braised-pork-belly.md` | 英語で調理法を説明 |
| 鮭のムニエル | `salmon-meuniere.md` | 材料 + 調理法 |

### ソース・調味料

| レシピ名 | ファイル名 | 理由 |
|---------|-----------|------|
| 基本のトマトソース | `basic-tomato-sauce.md` | レベル + 材料名 |
| 自家製マヨネーズ | `homemade-mayonnaise.md` | 修飾語 + 名称 |
| 照り焼きソース | `teriyaki-sauce.md` | 料理名のローマ字表記 |
| バジルペースト | `basil-pesto.md` | 材料 + 調理法 |

### 加工食材

| レシピ名 | ファイル名 | 理由 |
|---------|-----------|------|
| 自家製ベーコン | `easy-smoker-bacon.md` | 調理法 + 食材名 |
| チャーシュー | `chashu-pork.md` | ローマ字表記 + 材料 |
| 塩麹 | `shio-koji.md` | ローマ字表記 |
| 鶏ハム | `chicken-ham.md` | 材料 + 調理法 |

---

## recipeType判断の実例

### dish（料理）の実例

| レシピ名 | recipeType | 理由 |
|---------|-----------|------|
| カルボナーラ | `dish` | そのまま食べられる完成した料理 |
| ミネストローネ | `dish` | そのまま食べられるスープ |
| シーザーサラダ | `dish` | 完成したサラダ |
| オムライス | `dish` | 完成した一品料理 |
| 親子丼 | `dish` | 完成した丼料理 |

### ingredient（加工食材）の実例

| レシピ名 | recipeType | 理由 |
|---------|-----------|------|
| 自家製ベーコン | `ingredient` | 他の料理の材料として使う |
| チャーシュー | `ingredient` | ラーメンやチャーハンの具材 |
| 塩麹 | `ingredient` | 調味料として使う発酵食品 |
| 鶏ハム | `ingredient` | サラダやサンドイッチの具材 |
| 燻製卵 | `ingredient` | そのまま食べるより材料として使う |

### sauce（ソース）の実例

| レシピ名 | recipeType | 理由 |
|---------|-----------|------|
| トマトソース | `sauce` | パスタやピザにかける |
| ミートソース | `sauce` | パスタにかける |
| ホワイトソース | `sauce` | グラタンやドリアに使う |
| 照り焼きソース | `sauce` | 肉や魚にかける |
| タルタルソース | `sauce` | 揚げ物に添える |

### stock（出汁・スープベース）の実例

| レシピ名 | recipeType | 理由 |
|---------|-----------|------|
| 鶏がらスープ | `stock` | 料理のベースとなる液体 |
| 野菜スープ | `stock` | 料理のベース |
| コンソメ | `stock` | 料理のベース |
| だし汁 | `stock` | 和食のベース |
| ラーメンスープ | `stock` | 麺料理のベース |

### condiment（調味料）の実例

| レシピ名 | recipeType | 理由 |
|---------|-----------|------|
| 自家製マヨネーズ | `condiment` | 少量使う調味料 |
| ドレッシング | `condiment` | サラダにかける |
| カレー粉ミックス | `condiment` | 香辛料ミックス |
| ハーブソルト | `condiment` | 調味料 |
| ガーリックオイル | `condiment` | 香り付けオイル |

### preserve（保存食）の実例

| レシピ名 | recipeType | 理由 |
|---------|-----------|------|
| いちごジャム | `preserve` | 長期保存を目的 |
| ピクルス | `preserve` | 酢漬け保存食 |
| コンポート | `preserve` | 果物の砂糖煮保存 |
| 梅干し | `preserve` | 伝統的保存食 |
| マリネ | `preserve` | 酢漬け保存食 |

---

## 分量表記の実例

### 固形物

```yaml
# 重量表記
- name: "豚バラブロック"
  amount: "500g"

# 個数表記
- name: "玉ねぎ"
  amount: "1個（中サイズ）"
- name: "卵"
  amount: "2個"

# 本数・枚数表記
- name: "にんじん"
  amount: "1本"
- name: "ベーコン"
  amount: "3枚"

# 片・かけら表記
- name: "にんにく"
  amount: "2片"
- name: "生姜"
  amount: "1かけ"
```

### 液体・粉末

```yaml
# 体積表記
- name: "水"
  amount: "500ml"
- name: "牛乳"
  amount: "200cc"

# 計量スプーン表記
- name: "塩"
  amount: "大さじ1"
- name: "砂糖"
  amount: "小さじ2"

# カップ表記
- name: "米"
  amount: "2合"
- name: "小麦粉"
  amount: "1カップ"
```

### 曖昧な表記

```yaml
# 適量表記
- name: "塩"
  amount: "適量"
- name: "コショウ"
  amount: "お好み"

# 少量表記
- name: "タイム"
  amount: "少々"
- name: "塩"
  amount: "ひとつまみ"

# 範囲表記
- name: "セージ"
  amount: "2～3枚"
- name: "バジル"
  amount: "10～15枚"
```

---

## グループ分けの実例

### スープカレー（材料30個以上）

```yaml
ingredients:
  - name: "鶏がらスープ"
    amount: "800ml"
    group: "スープベース"
  - name: "オリーブ油"
    amount: "60cc"
    group: "スープベース"
  - name: "にんにく"
    amount: "3片"
    group: "スープベース"

  - name: "バジル"
    amount: "大さじ2"
    group: "スパイス"
  - name: "クミン"
    amount: "大さじ2"
    group: "スパイス"

  - name: "パルメザンチーズ"
    amount: "30g"
    group: "仕上げ"
  - name: "生クリーム"
    amount: "50cc"
    group: "仕上げ"

  - name: "季節の野菜"
    amount: "適量"
    group: "トッピング"
  - name: "目玉焼き"
    amount: "お好み"
    group: "トッピング"
```

### ベーコン（材料10個程度）

```yaml
ingredients:
  - name: "豚バラブロック"
    amount: "500g"
    group: "メイン"

  - name: "塩"
    amount: "小さじ2"
    group: "調味料"
  - name: "砂糖"
    amount: "小さじ2"
    group: "調味料"

  - name: "胡椒粒（白）"
    amount: "2粒"
    group: "スパイス"
  - name: "胡椒粒（黒）"
    amount: "2粒"
    group: "スパイス"

  - name: "セージ"
    amount: "2～3枚"
    group: "ハーブ"
  - name: "ローレル"
    amount: "1枚"
    group: "ハーブ"
```

---

## yield表記の実例

### 単一値（正確な量）

```yaml
# ソース類（液体、正確に測定可能）
yield:
  amount: 500
  unit: "ml"

# 個数表記（正確にカウント可能）
yield:
  amount: 12
  unit: "個"

# 重量表記（正確に測定可能）
yield:
  amount: 300
  unit: "g"
```

### レンジ表記（量が変動）

```yaml
# 脱水により減少（ベーコン、チャーシュー等）
yield:
  min: 375
  max: 425
  unit: "g"

# 蒸発により減少（煮詰める系）
yield:
  min: 800
  max: 900
  unit: "ml"

# 膨張により増加（パン、ケーキ等）
yield:
  min: 450
  max: 500
  unit: "g"
```

### 省略（量が測定困難）

```yaml
# yieldフィールド自体を省略
# recipeType: "ingredient"でも任意なので問題なし
```

---

## Markdown本文のテンプレート

### dish（料理）のテンプレート

```markdown
## レシピのポイント

[レシピの概要を1-2文で説明]

### コツ

- **[重要なポイント1]**: [説明]
- **[重要なポイント2]**: [説明]
- **[重要なポイント3]**: [説明]

### アレンジ

- [バリエーション1]
- [バリエーション2]
- [バリエーション3]

## 栄養情報（1人分・概算）

- カロリー: 約XXXkcal
- タンパク質: 約XXg
- 炭水化物: 約XXg
- 脂質: 約XXg
```

### ingredient（加工食材）のテンプレート

```markdown
## レシピのポイント

[加工食材の特徴を1-2文で説明]

### コツ

- **[重要なポイント1]**: [説明]
- **[重要なポイント2]**: [説明]

### 保存方法

- 冷蔵保存: X-X日
- 冷凍保存: Xヶ月（[保存方法の詳細]）

### 使い方

- [使い方1]: [詳細]
- [使い方2]: [詳細]
- [使い方3]: [詳細]

## 注意事項

- [安全上の注意1]
- [安全上の注意2]
```

### sauce（ソース）のテンプレート

```markdown
## レシピのポイント

[ソースの特徴を1-2文で説明]

### コツ

- **[重要なポイント1]**: [説明]
- **[重要なポイント2]**: [説明]

### 保存方法

- 冷蔵保存: X-X日
- 冷凍保存: Xヶ月（[保存方法の詳細]）

### 使い方

- [料理1]に使う: [詳細]
- [料理2]に使う: [詳細]
- [料理3]に使う: [詳細]
```

---

## 参考

- [RECIPE_GUIDE.md](./RECIPE_GUIDE.md) - 基本的なレシピ作成手順
- [RECIPE_WRITING_TIPS.md](./RECIPE_WRITING_TIPS.md) - 詳細な作成ガイド
- [SCHEMA.md](./SCHEMA.md) - スキーマの詳細仕様
- [src/content/recipes/](./src/content/recipes/) - 実際のレシピファイル例
