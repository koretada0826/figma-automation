# 04 — UIコンポーネントの作法：角丸・影・ボーダー・状態・寸法規範

> コード生成ツールが参照するための「デザイン教科書」。全ジャンル共通の正規化された寸法・状態設計を、**そのままCSS/トークンに落とせる粒度**でまとめる。数値は公開の正規ソース（Material 3 / Apple HIG / Shopify Polaris / IBM Carbon / Refactoring UI）から蒸留し、実装現場の慣習に合わせて整理した。

出典（全体）:
- Material Design 3 — Elevation: https://m3.material.io/styles/elevation
- Material Design 3 — Elevation tokens: https://m3.material.io/styles/elevation/tokens
- Material Design (M2) — States: https://m2.material.io/design/interaction/states.html
- Apple Human Interface Guidelines — Buttons / Layout: https://developer.apple.com/design/human-interface-guidelines/buttons
- Shopify Polaris — Depth / Shadow tokens: https://polaris.shopify.com/design/depth
- IBM Carbon — Button: https://carbondesignsystem.com/components/button/style/
- IBM Carbon — Text input: https://carbondesignsystem.com/components/text-input/usage/
- IBM Carbon — Spacing: https://carbondesignsystem.com/elements/spacing/overview/
- Refactoring UI（Steve Schoger / Adam Wathan）— Creating depth の公開要約: https://www.refactoringui.com/

---

## 0. 設計の原則（要約）

1. **深さ（depth）は「1pxボーダー＋淡い多層シャドウ＋わずかな地色差」で作る。** 濃く大きい単一シャドウはアマチュアの証。光源は常に「真上やや手前」＝影は必ず**下方向（y＋）**へ落ちる。
2. **角丸は"サイズと役割"で段階化する。** 要素が大きいほど角丸も大きく。ネスト時は内側 = 外側 − パディング。
3. **状態（state）は「色の差」より先に「面（state layer）の重ね」で表現する。** hover/focus/pressed は半透明オーバーレイの不透明度で段階化すると、どの背景色でも破綻しない。
4. **フォーカスは"必ず見える"。** キーボード可視のフォーカスリングは 2〜3px、要素から 2px 離す。`:focus-visible` を使う。
5. **寸法はタップ/クリックの最小ターゲットから逆算する。** 触れる要素は実寸で最低 44×44pt（Apple HIG）/ 48×48dp（Material）。

---

## 1. Elevation（影）の設計

### 1.1 二つのモデル

| モデル | 深さの出し方 | 主な採用 | 使いどころ |
|---|---|---|---|
| **Shadow elevation** | 影を落として浮かせる | Material 2 / Apple / Web一般 | 一時的に浮く要素（メニュー・ダイアログ・ドラッグ中） |
| **Tonal elevation** | 地色に primary を微量ブレンドして明度を上げる | Material 3 | 常設の面（カード・バー）。ダーク UI で特に有効 |

実務では**両方を併用**する。「常設カードはボーダー＋わずかな地色差」「浮く要素は多層シャドウ」を基本にすると破綻しにくい。

### 1.2 Material 3 のレベル別トークン

出典: https://m3.material.io/styles/elevation/tokens

| Level | 距離 | Surface tint（primary 重ね率） | 代表コンポーネント |
|---|---|---|---|
| 0 | 0dp | 0% | 背景面・フラットなボタン |
| 1 | 1dp | 5% | カード（rest）、Navigation rail |
| 2 | 3dp | 8% | スクロール時の Top app bar、Chip |
| 3 | 6dp | 11% | FAB、検索バー、Menu |
| 4 | 8dp | 12% | Navigation drawer |
| 5 | 12dp | 14% | Dialog、Bottom sheet、Modal |

M3公式ガイダンス：**まず tonal を使い、影は"より注目させたい／背景と溶けるのを防ぎたい"要素にだけ足す。**

### 1.3 薄い影の作り方（Refactoring UI 流・実装値）

コツは3つ:「**多層で重ねる**」「**大きい影ほど y と blur を大きく、opacity は上げすぎない**」「**必ず 1px ボーダー（または内側 hairline）を併用**して縁を締める」。光源は真上なので x は原則 0。

そのままコピーして使える 6 段階トークン（light テーマ、`--shadow-color: 220 3% 15%` 相当の黒に近い寒色）:

```css
:root {
  /* xs: 押し込み感のある1pxライン＋極薄 */
  --shadow-xs: 0 1px 2px 0 rgba(16,24,40,.05);
  /* sm: ボタン/インプットのrest。ボーダー併用前提 */
  --shadow-sm: 0 1px 3px 0 rgba(16,24,40,.10),
               0 1px 2px 0 rgba(16,24,40,.06);
  /* md: カードのhover、Dropdownの縁 */
  --shadow-md: 0 4px 8px -2px rgba(16,24,40,.10),
               0 2px 4px -2px rgba(16,24,40,.06);
  /* lg: Popover / Menu */
  --shadow-lg: 0 12px 16px -4px rgba(16,24,40,.08),
               0 4px 6px -2px rgba(16,24,40,.03);
  /* xl: Dialog / Modal */
  --shadow-xl: 0 20px 24px -4px rgba(16,24,40,.08),
               0 8px 8px -4px rgba(16,24,40,.03);
  /* 2xl: 画面全体を覆うシート */
  --shadow-2xl: 0 24px 48px -12px rgba(16,24,40,.18);
}
```

**多層の役割分担**：1層目 = ぼやけた広い影（ambient / 環境光）、2層目 = 短くシャープな影（key / 直接光）。負の spread（`-2px`）で影を要素より内側に絞ると、"貼り付いた"感じが消えて自然になる。

Polaris の shadow トークン（出典: https://polaris.shopify.com/design/depth）も同じ思想で `100`〜`600` の階段を持ち、bevel（内側ハイライト）を足して立体感を補強している。

### 1.4 ボーダー vs 影の使い分け

| 状況 | 推奨 |
|---|---|
| 常設のカード・パネル・入力欄の"枠" | **1px ボーダー**（`rgba(0,0,0,.08〜.12)`）。軽く速い |
| 一時的に浮く（メニュー・トースト・ドラッグ） | **影**。ボーダーは省くか極薄に |
| 明るい背景でカードが溶ける | ボーダー + `--shadow-sm` の**併用** |
| ダーク UI | 影は効きにくい → **地色差（tonal）＋ 1px の明るいボーダー** |

---

## 2. 角丸（border-radius）の使い分け

### 2.1 スケール

| トークン | 値 | 使いどころ |
|---|---|---|
| `radius-none` | 0 | テーブル、全幅バー、データ密度重視の業務 UI |
| `radius-xs` | 2–4px | チェックボックス、極小バッジ、タグ |
| `radius-sm` | 4px | 小ボタン、入力欄、セレクト（引き締まった印象） |
| `radius-md` | 8px | **標準ボタン・入力欄・カード**（最も汎用） |
| `radius-lg` | 12px | 大きめカード、モーダル、パネル |
| `radius-xl` | 16px | ヒーローカード、ボトムシート、モバイル大面 |
| `radius-full` | 9999px | ピル型ボタン、チップ、アバター、トグル |

### 2.2 Apple HIG のサイズ連動則

出典: HIG。要素の大きさに角丸を比例させる。

| 要素サイズ | 推奨 border-radius |
|---|---|
| 44×44pt 以上 | 8px |
| 25–43px | 4px |
| 24px 以下 | 2px |

### 2.3 ネスト時の同心円ルール

内側の角丸 = **外側の角丸 − パディング**。守らないと角が"ズレて"見える。

```
外カード radius 16px / padding 12px  →  内要素 radius = 16 − 12 = 4px
```

**よくある失敗**：外も内も 8px にしてしまい、角の隙間が歪む。→ 内側は必ず引き算する。

---

## 3. ボタン

### 3.1 サイズ（高さ・padding）

Material（40dp）、Carbon（32/40/48）、Apple（44pt タップ）を統合した実務テーブル。padding は左右（水平）。

| サイズ | 高さ | 水平padding | フォント | アイコン間隔 | 用途 |
|---|---|---|---|---|---|
| **sm** | 32px | 12px | 13–14px | 6px | ツールバー、テーブル内、密度重視 |
| **md（標準）** | 40px | 16px | 14–15px | 8px | フォーム、汎用 |
| **lg** | 44–48px | 20–24px | 15–16px | 8px | 主要 CTA、モバイル（44pt 確保） |

補足規範：
- **最小タップ領域 44×44pt / 48×48dp** は視覚高さと別に確保（`min-height` か透明な当たり判定で）。
- アイコンのみボタンは正方（sm 32 / md 40 / lg 44–48）、アイコン 20px 前後。
- ラベルは水平中央、上下は行の中央。テキストは 1 行・切らない。

### 3.2 種別（variant）と配色トークン

| Variant | 背景 | 文字 | ボーダー | 影 | 使う場面 |
|---|---|---|---|---|---|
| **Primary** | brand solid | on-brand（白） | なし | `--shadow-xs` | 画面で最も重要な 1 アクション |
| **Secondary** | surface | brand or text | 1px `border-subtle` | なし | 副次アクション |
| **Tertiary / Ghost** | 透明 | brand or text | なし | なし | 目立たせたくない・並列多数 |
| **Danger** | red solid（primary系）/ 透明+red文字（ghost系） | 白 / red | — | — | 破壊的操作（削除など） |
| **Link** | 透明 | brand・下線 | なし | なし | インライン誘導 |

原則：**1 画面に primary は 1 つ。** 迷ったら secondary/ghost に落とす。

### 3.3 ボタンの状態（色と影の具体手法）

state layer 方式（M2/M3）＝ 前景色を半透明で重ねる。`brand` の上に白 or 黒を重ねて実現。

| 状態 | 手法（Primary の例） | 具体値 |
|---|---|---|
| default | brand solid | opacity 1 |
| **hover** | 上に state layer を重ねる（暗く） | 黒 8%（`rgba(0,0,0,.08)`）オーバーレイ。または brand を 8% 暗く |
| **focus(-visible)** | フォーカスリング | `outline: 2px solid brand; outline-offset: 2px;`（M3 は 3px 相当の可視リング） |
| **active/pressed** | state layer を強める | 黒 12%（`rgba(0,0,0,.12)`）。影は 1 段下げる or 消す |
| **disabled** | 前景・背景ともトーンダウン | 文字 opacity 38%、背景 opacity 12%（M3 標準）。`cursor: not-allowed`、影なし |
| **loading** | ラベルを維持 or 隠しスピナー | 幅は固定（レイアウトシフト防止）、`aria-busy="true"`、クリック無効 |

state layer 不透明度の正規値（Material）：**hover 8% / focus 10–12% / pressed 12% / dragged 16%**。この 3–4 段だけ覚えれば全コンポーネントに流用できる。

---

## 4. 入力欄（Text field / Select / Textarea）

### 4.1 寸法

Carbon（32/40/48）を基準化。

| サイズ | 高さ | 内側padding(左右) | フォント |
|---|---|---|---|
| sm | 32px | 12px | 14px |
| md（標準） | 40px | 12–16px | 14–16px |
| lg | 48px | 16px | 16px（iOS はズーム回避に 16px 必須） |

- ボーダー 1px `border-strong`、角丸 `radius-sm`(4px) 〜 `radius-md`(8px)。
- Textarea は `min-height` 80px 前後＋`padding` 上下 8–12px、`resize: vertical`。

### 4.2 ラベル・プレースホルダ・ヘルプ

| 要素 | 規範 |
|---|---|
| **ラベル** | 入力欄の**上**に常時表示（12–14px, medium）。フィールドとの間隔 4–6px。プレースホルダをラベル代わりにしない |
| **プレースホルダ** | 補助例のみ。色は `text-placeholder`（本文より薄い）。必須情報を入れない |
| **ヘルプテキスト** | 下に 12–13px、`text-subtle`。間隔 4px |
| **必須マーク** | ラベル横に `*` か "(必須)"。色だけに頼らない |

### 4.3 状態

| 状態 | 見た目（具体） |
|---|---|
| default | border `border-strong`、bg surface |
| hover | border をわずかに濃く（`border-strong` → 1 段上）、bg 微変化 |
| **focus** | border を **brand 2px** に、外側に **focus ring**（`box-shadow: 0 0 0 3px rgba(brand,.24)`）。offset で欄と分離 |
| filled | border は default のまま、文字は `text-primary` |
| **error** | border **red 2px** ＋ 下にエラーメッセージ（red, 12–13px）＋ **アイコン**。色のみに頼らずアイコン＋文言を必須（Carbon 準拠） |
| warning | border/アイコンを amber に。メッセージ併記 |
| disabled | bg `surface-disabled`、border 極薄、文字 opacity 38%、`cursor: not-allowed` |
| readonly | border なし or 極薄、bg わずかにグレー、文字は通常色 |

**失敗例**：focus をブラウザ既定の青アウトラインごと消す（`outline: none` のみ）。→ 必ず代替リングを付ける。

---

## 5. カード / パネル

| 項目 | 規範 |
|---|---|
| padding | sm 12px / md 16px / lg 24px（内容密度で選ぶ。モバイルは 16px 基準） |
| 角丸 | `radius-md`(8) 〜 `radius-lg`(12)。モーダル寄りは 12–16 |
| 枠 | **rest はボーダー**（1px `border-subtle`）。hover/選択で `--shadow-md` を足すか、地色差を付ける |
| 影 | 常設カードで濃い影を常時出さない。**ボーダー基調＋hover で軽く浮かす**が上品 |
| セクション間 | 区切りは 1px `divider`。ヘッダ/フッタ padding は本文と揃える |
| 内側同心円 | カード radius − padding = 内側要素 radius（§2.3） |

判断基準：**"常にそこにある面" = ボーダー。"注意を引く/一時的に浮く" = 影。** 両方最大にすると重い。

---

## 6. その他コンポーネントの寸法規範

### 6.1 バッジ / ピル / チップ / タグ

| 要素 | 高さ | 水平padding | 角丸 | フォント | 備考 |
|---|---|---|---|---|---|
| **バッジ（数値/ステータス）** | 16–20px | 6–8px | `radius-full` or 4px | 11–12px, semibold | 通知数はドット or 数字。色 = 意味（success/warning/critical/info） |
| **ピル（ラベル）** | 24px | 10–12px | `radius-full` | 12–13px | 淡い bg（brand 8–12%）＋濃い文字 |
| **チップ（操作可）** | 32px | 12px（削除 x 付きは右 8px） | 8px or full | 13–14px | hover/selected で state layer。selected は border/bg を brand に |
| **タグ（フィルタ）** | 24–28px | 8–10px | 4–6px | 12–13px | 削除アイコン 16px、間隔 4px |

配色は**必ず「bg=色の10%前後＋文字=同系の濃色」**にして、彩度の高い塗り＋白文字の乱用を避ける（可読性・落ち着き）。

### 6.2 テーブル行高

| 密度 | 行高 | セル padding(上下/左右) | 用途 |
|---|---|---|---|
| compact | 32px | 6 / 12–16px | 大量データ、管理画面 |
| default | 40–48px | 10–12 / 16px | 汎用 |
| relaxed | 56px | 16 / 16–24px | 読み物寄り、モバイル |

- ヘッダ行は 40–48px、`text-subtle` の小見出し（12–13px, uppercase 任意）。
- 罫線は横線のみ（1px `divider`）が軽い。zebra は relaxed では不要。
- 行 hover は `surface-hover`（黒 4% 相当）で。選択行は brand 8% bg ＋左端 2–3px アクセントバー。

### 6.3 ツールチップ

| 項目 | 値 |
|---|---|
| padding | 上下 6–8px / 左右 8–12px |
| 角丸 | 4–6px |
| フォント | 12–13px |
| 最大幅 | 240–320px |
| 影 | `--shadow-md`〜`lg` |
| 矢印 | 6–8px の三角。無くても可 |
| 遅延 | 表示 300–500ms、非表示は即時 |
| 配色 | ダーク UI 上のダークテキストなら反転（濃い bg＋白文字）が定番 |

ツールチップに**操作要素（リンク/ボタン）を入れない**。必要なら Popover を使う。

### 6.4 モーダル / ダイアログ

| 項目 | 値 |
|---|---|
| 幅 | sm 400px / md 512–560px / lg 720–800px（`max-width` ＋ `width: calc(100% - 32px)`） |
| padding | 24px（モバイル 16px） |
| 角丸 | 12–16px |
| 影 | `--shadow-xl`〜`2xl` |
| オーバーレイ | 黒 40–60%（`rgba(0,0,0,.4〜.6)`）。scrim でフォーカス誘導 |
| ヘッダ/フッタ | タイトル 16–20px semibold。フッタのボタンは**右寄せ、primary が右端**（Windows系）。閉じるは Esc・×・オーバーレイクリック |
| フォーカス | 開いたら内部先頭へ移し、**フォーカストラップ**。閉じたら起動要素へ戻す |
| 高さ | 内容が長ければ本文だけスクロール（ヘッダ/フッタ固定） |

### 6.5 トグル（スイッチ）/ チェックボックス / ラジオ

| 要素 | 寸法 | 状態表現 |
|---|---|---|
| **トグル** | トラック 高36×幅? → 標準 20×36px（つまみ 16px, 余白 2px）。大 24×44px | on = brand bg ＋つまみ右、off = gray bg ＋つまみ左。アニメ 150–200ms。**色だけでなく位置**で on/off が分かる |
| **チェックボックス** | 16–20px 四角、角丸 2–4px、ボーダー 1.5–2px | checked = brand bg ＋白チェック。indeterminate = brand bg ＋横棒。focus リング付与 |
| **ラジオ** | 16–20px 円、ボーダー 1.5–2px | selected = 中央に brand ドット（外周は brand ボーダー） |

いずれも**ラベル全体をクリック可能**にし、実タップ域 44×44 を確保（`padding` か擬似要素で拡張）。

---

## 7. 状態（state）設計の総則

全コンポーネント横断の「状態レシピ」。**色を変える前に state layer を重ねる**のが要点。

| 状態 | 視覚手法（汎用） | 具体値（明背景の目安） |
|---|---|---|
| **default** | 基準 | — |
| **hover** | 表面に暗い/明るい state layer | 黒 4–8% を重ねる。ボタン等塗り面は 8%、行・リストは 4% |
| **focus-visible** | 可視フォーカスリング | `outline: 2px solid brand; outline-offset: 2px;` ＋ 必要なら `box-shadow: 0 0 0 3px rgba(brand,.24)` |
| **active/pressed** | layer を強める＋わずかに沈める | 黒 12% ＋ 影を 1 段下げる or `transform: translateY(1px)` |
| **selected** | brand の薄塗り＋アクセント | bg brand 8–12%、border/左バー brand |
| **disabled** | 全体トーンダウン・操作不可 | 文字 opacity 38% / 面 opacity 12%、影なし、`cursor:not-allowed`、`aria-disabled` |
| **loading** | 進行表示・寸法固定 | スピナー or スケルトン、`aria-busy`、幅固定でシフト防止 |
| **error/invalid** | red border＋アイコン＋文言 | border red 2px、下にメッセージ、色のみに依存しない |

state layer 不透明度の正規スケール（Material）：**hover 8% / focus 10–12% / pressed 12% / dragged 16% / disabled content 38% ・ container 12%**。この 1 セットを CSS 変数化して全コンポーネントで共有する。

```css
:root {
  --state-hover: 0.08;
  --state-focus: 0.12;
  --state-pressed: 0.12;
  --state-dragged: 0.16;
  --disabled-content: 0.38;
  --disabled-container: 0.12;
}
```

---

## 8. よくある失敗と修正

| 失敗 | なぜ悪い | 修正 |
|---|---|---|
| 単一の濃い黒影 `0 4px 8px rgba(0,0,0,.5)` | 汚く・重く見える | 多層＋低 opacity（§1.3）＋ 1px ボーダー |
| `outline: none` でフォーカスを消す | キーボード操作不能・アクセシビリティ違反 | `:focus-visible` に 2–3px リングを付与 |
| 影を全方向（x にも）出す | 光源が不定で不自然 | x=0、y＋方向のみ |
| プレースホルダをラベル代わり | 入力後に文脈が消える | ラベルを上に常時表示 |
| エラーを赤色だけで表現 | 色覚多様性で伝わらない | 赤border＋アイコン＋文言の 3 点セット |
| ネスト角丸を内外同値 | 角がズレて見える | 内 = 外 − padding |
| primary ボタンを複数配置 | 優先度が消える | primary は 1 画面 1 個 |
| 塗りチップ＋白文字を多用 | 画面がうるさい | bg 10%＋濃い文字 |
| タップ域 < 44px | 押しにくい・誤タップ | 視覚サイズと別に 44×44 確保 |
| disabled を色だけ薄く | 押せるのか判別不能 | opacity 38%＋`not-allowed`＋クリック無効 |
| ローディングで幅が変わる | レイアウトシフト | 幅固定＋スピナー差し替え |
| モーダルにフォーカストラップ無し | 背後を操作できてしまう | trap＋Esc＋起動要素へ復帰 |

---

## 9. コピペ用トークン早見表

```css
:root {
  /* radius */
  --radius-xs: 4px; --radius-sm: 6px; --radius-md: 8px;
  --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;

  /* control heights */
  --h-sm: 32px; --h-md: 40px; --h-lg: 48px;
  --tap-min: 44px;               /* 最小タップ域 */

  /* shadows（§1.3参照） */
  --shadow-xs: 0 1px 2px 0 rgba(16,24,40,.05);
  --shadow-sm: 0 1px 3px 0 rgba(16,24,40,.10), 0 1px 2px 0 rgba(16,24,40,.06);
  --shadow-md: 0 4px 8px -2px rgba(16,24,40,.10), 0 2px 4px -2px rgba(16,24,40,.06);
  --shadow-lg: 0 12px 16px -4px rgba(16,24,40,.08), 0 4px 6px -2px rgba(16,24,40,.03);
  --shadow-xl: 0 20px 24px -4px rgba(16,24,40,.08), 0 8px 8px -4px rgba(16,24,40,.03);

  /* borders */
  --border-subtle: rgba(16,24,40,.08);
  --border-strong: rgba(16,24,40,.16);

  /* states */
  --state-hover: .08; --state-focus: .12; --state-pressed: .12;
  --disabled-content: .38; --disabled-container: .12;
  --focus-ring: 0 0 0 3px rgba(59,130,246,.24);
}
```

---

### 出典一覧（再掲）
- Material Design 3 — Elevation / tokens: https://m3.material.io/styles/elevation ・ https://m3.material.io/styles/elevation/tokens
- Material Design (M2) — States（state layer 不透明度）: https://m2.material.io/design/interaction/states.html
- Apple HIG — Buttons / タップ 44pt / 角丸連動: https://developer.apple.com/design/human-interface-guidelines/buttons
- Shopify Polaris — Depth / Shadow tokens: https://polaris.shopify.com/design/depth
- IBM Carbon — Button / Text input / Spacing: https://carbondesignsystem.com/components/button/style/ ・ https://carbondesignsystem.com/components/text-input/usage/ ・ https://carbondesignsystem.com/elements/spacing/overview/
- Refactoring UI（Schoger/Wathan）— Creating depth（多層シャドウ・光源）: https://www.refactoringui.com/
