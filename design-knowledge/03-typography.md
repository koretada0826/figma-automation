# タイポグラフィ 実装ルールブック

> コード生成ツールが参照する「デザイン教科書」。全ジャンル共通のタイポグラフィ規範を、**そのまま実装できる具体的数値**で示す。値は Material Design 3 / Apple HIG / IBM Carbon / Refactoring UI / デジタル庁デザインシステムなど公開の正規ソースを蒸留したもの。

## 0. この章の使い方（TL;DR）

| 決めること | まず採用する既定値 |
| --- | --- |
| タイプスケール | 12 / 14 / 16 / 20 / 24 / 30 / 36 / 48px（比率 ≈ 1.2〜1.25） |
| 本文サイズ | 16px（モバイルも最低 16px、補足は 14px） |
| 本文行間 | 1.5（和文は 1.6〜1.75 も可） |
| 見出し行間 | 1.1〜1.25 |
| 本文行長 | 45〜75 文字 / 行（約 20〜35em、目安 65） |
| 本文ウェイト | 400 / 見出し 600〜700 |
| 大見出し字間 | -0.5〜-2% で軽く詰める |
| 全大文字ラベル | +5〜+10%（0.05〜0.1em）広げる |

原則: **サイズはスケールから選ぶ。個別に微調整しない。** 隣り合うステップは最低でも約 25% 差をつける（[Refactoring UI](https://www.refactoringui.com/)）。

---

## 1. タイプスケール（モジュラースケール）

### 1.1 汎用 8 ステップ（推奨デフォルト）

比率 1.2〜1.25 の準モジュラースケール。Web / アプリ全般に使える。

| トークン | サイズ(px) | rem | 用途(role) | 既定 line-height | 既定 weight |
| --- | --- | --- | --- | --- | --- |
| `text-xs` | 12 | 0.75 | caption / 注釈 / ラベル小 | 1.5 (16–18px) | 400–500 |
| `text-sm` | 14 | 0.875 | 補足 / secondary body / UIラベル | 1.5 (20px) | 400 |
| `text-base` | 16 | 1.0 | **本文 body（基準）** | 1.5 (24px) | 400 |
| `text-lg` | 20 | 1.25 | リード文 / h4 / large body | 1.4 (28px) | 500–600 |
| `text-xl` | 24 | 1.5 | h3 | 1.3 (32px) | 600 |
| `text-2xl` | 30 | 1.875 | h2 | 1.25 (38px) | 600–700 |
| `text-3xl` | 36 | 2.25 | h1 | 1.2 (44px) | 700 |
| `text-4xl` | 48 | 3.0 | display / hero | 1.1 (52px) | 700 |

補足: さらに大きな見出しが要る場合は 60 / 72px を 1.25 比で継ぎ足す。ステップを足すときも「隣接 ≥ 25% 差」を守る。

### 1.2 スケールの選び方

- **UI（管理画面・SaaS）**: 情報密度優先。比率 1.2 前後で刻みを細かく。
- **マーケ / エディトリアル**: 比率 1.25〜1.333 でコントラストを大きく。
- ツール: [type-scale.com](https://typescale.com/) の考え方＝1つの基準サイズ×比率で全段を算出。手で 1px ずつ足さない。

### 1.3 正規ソースのスケール比較（実値）

| ソース | display/最大 | h1相当 | h2相当 | h3相当 | body | caption/最小 |
| --- | --- | --- | --- | --- | --- | --- |
| Material 3 | Display L **57** | Headline L **32** | Headline M **28** | Title L **22** | Body L **16** | Label S **11** |
| Apple HIG (iOS) | Large Title **34** | Title1 **28** | Title2 **22** | Title3 **20** | Body **17** | Caption2 **11** |
| IBM Carbon | Display **42+** | Heading **32** | Heading **28** | Heading **20** | Body **14–16** | Helper **12** |

出典: [Material Design 3 Type scale](https://m3.material.io/styles/typography/type-scale-tokens)、[Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)、[IBM Carbon Typography](https://carbondesignsystem.com/elements/typography/overview/)

---

## 2. Material Design 3 の完全テーブル（そのまま移植可）

MD3 は 5 カテゴリ × 3 サイズ = 15 スタイル。各スタイルは font / size / line-height / weight / tracking を持つ。

| Role | Size(sp) | Line-height(sp) | Weight | Tracking(letter-spacing) | 主な用途 |
| --- | --- | --- | --- | --- | --- |
| Display Large | 57 | 64 | 400 | -0.25 | ヒーロー / 数字表示 |
| Display Medium | 45 | 52 | 400 | 0 | 大見出し |
| Display Small | 36 | 44 | 400 | 0 | 大見出し |
| Headline Large | 32 | 40 | 400 | 0 | ページ見出し h1 |
| Headline Medium | 28 | 36 | 400 | 0 | h2 |
| Headline Small | 24 | 32 | 400 | 0 | h3 |
| Title Large | 22 | 28 | 400（実務 500–600） | 0 | セクション見出し |
| Title Medium | 16 | 24 | 500 | +0.15 | サブ見出し / 強調 |
| Title Small | 14 | 20 | 500 | +0.1 | 小見出し |
| Body Large | 16 | 24 | 400 | +0.5 | **本文** |
| Body Medium | 14 | 20 | 400 | +0.25 | 密度高い本文 |
| Body Small | 12 | 16 | 400 | +0.4 | 注釈 |
| Label Large | 14 | 20 | 500 | +0.1 | ボタン / タブ |
| Label Medium | 12 | 16 | 500 | +0.5 | チップ / 小ボタン |
| Label Small | 11 | 16 | 500 | +0.5 | 最小ラベル |

読み方: tracking の単位は sp（≒px）。小さい文字ほど tracking を**正方向（広げる）**、大きい表示は**負方向（詰める）**にしている点に注目。出典: [Material Design 3 Type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens)

---

## 3. フォントウェイトの使い分け

| ウェイト | 名称 | 使う場所 | 使わない場所 |
| --- | --- | --- | --- |
| 400 | Regular | 本文、長文、caption、入力値 | 見出しの主役（弱くなる） |
| 500 | Medium | UIラベル、ボタン、タブ、小見出し、テーブルヘッダ | 長い本文（読み疲れ） |
| 600 | Semibold | h2〜h3、強調、カード見出し | 3〜4語より長い本文強調 |
| 700 | Bold | h1、display、数値の強調、アラート見出し | 段落全体（不可） |
| 300 以下 | Light | 大サイズの装飾見出しに限定可 | **小さい文字は禁止**（可読性低下） |

ルール:
- **階層は「サイズ+ウェイト+色」の合わせ技**で作る（→ §7）。太字だけ／サイズだけに頼らない。
- 強調は 1 段だけ上げる（400→600）。400→700 の飛びはうるさい。
- Apple HIG は Light 系を避け Regular / Medium / Semibold / Bold を推奨（[Apple HIG](https://developer.apple.com/design/human-interface-guidelines/typography)）。
- 太字より**濃い色**、細字より**薄い色**で強弱を出す方が上品（Refactoring UI）。

---

## 4. 行間（line-height / leading）

### 4.1 サイズ別の推奨比率

line-height と font-size は**反比例**。小さい文字ほど大きい比率、大きい見出しほど小さい比率にする。

| 対象 | サイズ目安 | line-height 比率 | 例(px) |
| --- | --- | --- | --- |
| caption / 小 UI | 12–14px | 1.4–1.5 | 14px → 20px |
| 本文（欧文） | 16px | **1.5**（1.4–1.6） | 16px → 24px |
| 本文（和文） | 16px | **1.6–1.75** | 16px → 26–28px |
| リード / large body | 20px | 1.4 | 20px → 28px |
| h3 | 24px | 1.3 | 24px → 32px |
| h2 | 30px | 1.25 | 30px → 38px |
| h1 | 36px | 1.2 | 36px → 44px |
| display | 48px+ | 1.1（1.0–1.15） | 48px → 52px |
| ボタン等 1 行要素 | – | 1.0–1.2 | – |

### 4.2 行長で微調整（重要）

行間は**行長にも比例**させる。行が長いほど次行への視線移動が難しくなるため line-height を上げる。

| 行長 | 推奨 line-height |
| --- | --- |
| 狭い（〜45字） | 1.4–1.5 |
| 標準（45–75字） | 1.5–1.6 |
| 広い（75字超・非推奨） | 1.7–2.0 |

出典: [Refactoring UI: Line-height is proportional](https://www.refactoringui.com/)、[デジタル庁デザインシステム: タイポグラフィ](https://design.digital.go.jp/dads/foundations/typography/)（本文は font-size の**最低 1.5 倍**、心理的負荷軽減には 160–175%）

---

## 5. 字間（letter-spacing / tracking）

原則: **本文は基本 0（書体設計者を信頼）**。触るのは以下の限定ケースのみ。

| ケース | 推奨 letter-spacing | 理由 |
| --- | --- | --- |
| 大見出し / display（30px+） | **-0.5% 〜 -2%**（-0.005〜-0.02em） | 大きい字は間延びして見える→軽く詰める |
| 本文（16px前後） | 0 | 設計値のまま |
| 小さい文字（12–14px） | 0 〜 +2%（0〜0.02em） | 密着を防ぎ可読性UP |
| **全大文字（UPPERCASE）ラベル** | **+5% 〜 +10%**（0.05〜0.1em） | 大文字は字面が詰まるため必須で広げる |
| 数字の等幅表示 | 0 | `font-variant-numeric: tabular-nums` を併用 |

補足: MD3 は小さい role ほど tracking を +方向に設定（Label Medium +0.5、Body Large +0.5）、Display Large のみ -0.25。実装の裏付けになる。出典: [Material 3](https://m3.material.io/styles/typography/type-scale-tokens)、[Refactoring UI](https://www.refactoringui.com/)

---

## 6. 行長（measure / line length）

| 種類 | 推奨 |
| --- | --- |
| 本文の理想 | **45–75 文字 / 行**（欧文、スペース込み）。目安 65 |
| em 換算 | 20–35em（`max-width: 65ch` が実装しやすい） |
| 和文 | **35–45 文字 / 行**（全角は情報量が多い） |
| マルチカラム | 40–50 文字と短めに |
| 極端 | 30字未満＝視線が忙しい / 90字超＝行頭を見失う |

実装例:
```css
.prose { max-width: 65ch; }      /* 欧文本文 */
.prose-ja { max-width: 40em; }   /* 和文本文 */
```
出典: [Refactoring UI](https://www.refactoringui.com/)（45–75字 / 20–35em）

---

## 7. 階層（ヒエラルキー）の作り方

**サイズ差だけに頼らない。** 3 つの軸を組み合わせて「情報の重要度」を表現する。

| 軸 | 強める | 弱める |
| --- | --- | --- |
| サイズ | 大きく | 小さく |
| ウェイト | 600–700 | 400 |
| 色 / コントラスト | 濃い（#111） | 薄い（#666, #888） |

実践ルール:
1. **一次見出しはサイズ+太さ、補足はサイズを下げず色を薄く**。小さくしすぎると読めない副次情報は「グレーにする」だけで十分沈む。
2. 見出しと本文の**色を変える**（見出し #111 / 本文 #333 / 補足 #6B7280）。
3. 強調はページに 1〜2 種類まで。強調が多い＝強調なしと同じ。
4. コントラストは WCAG AA を満たす（本文 4.5:1、大きい文字 18px+/14px太字は 3:1）。薄いグレーで沈めても最低限これを死守。

例（カード）:

| 要素 | サイズ | ウェイト | 色 |
| --- | --- | --- | --- |
| タイトル | 20px | 600 | #111827 |
| 本文 | 16px | 400 | #374151 |
| メタ情報 | 14px | 400 | #6B7280 |

---

## 8. 和文特有の注意（Noto Sans JP / 和欧混植）

### 8.1 フォントと構成

- **標準書体**: Noto Sans JP（SIL OFL 1.1、Google Fonts 提供）。UI の事実上の標準。
- 和欧混植: **欧文・数字は欧文フォントを先に指定**して和文を後ろに置く。
```css
font-family: "Inter", "Helvetica Neue", "Noto Sans JP", sans-serif;
```
  → 英数字が Inter、日本語が Noto Sans JP で描画され、和欧のバランスが整う。

### 8.2 サイズ・ウェイト

| 項目 | 推奨値 | 出典 |
| --- | --- | --- |
| 本文サイズ | 16px（補足 14px、**14px 未満は原則不可**） | デジタル庁 |
| 見出し〜本文 | 16–45px | デジタル庁 |
| 本文ウェイト | 400（Regular）〜 500 | – |
| 見出しウェイト | 600–700（Noto は 100–900 の 9 段） | – |

注意: Noto Sans JP は同じ数値でも欧文版 Noto Sans より**字面が大きめ**。欧文と混ぜると和文が大きく見えるので、和文側を欧文比 **90〜95%** に落とす、または欧文を別指定するとバランスが取れる。

### 8.3 行間・字間（和文）

| 項目 | 推奨値 | 備考 |
| --- | --- | --- |
| 本文 line-height | **1.6–1.75**（最低 1.5） | 漢字は字画が密なので欧文より広め |
| 管理画面 line-height | 1.3–1.5 | 情報密度優先 |
| 見出し line-height | 1.4 前後 | – |
| ボタン等 1 行 | 1.0 | – |
| letter-spacing 大サイズ | 0 | – |
| letter-spacing 中サイズ | 0.01em（1%） | – |
| letter-spacing 小/UI | 0.02em（2%） | 潰れ防止 |

出典: [デジタル庁デザインシステム](https://design.digital.go.jp/dads/foundations/typography/)

### 8.4 詰めすぎ注意

- 和文の**ベタ組み（letter-spacing: 0）が基本**。欧文流に強く詰めると、かな・約物が窮屈になり可読性が落ちる。
- 見出しで詰める場合も -0.02em 程度まで。
- 約物（。、）の前後アキは `font-feature-settings: "palt"`（プロポーショナルメトリクス）で自動調整すると自然。ただし本文長文では効かせすぎない。

---

## 9. よくある失敗と修正

| # | 失敗 | 症状 | 修正 |
| --- | --- | --- | --- |
| 1 | サイズを 1px 刻みで手調整 | スケールが崩れ統一感なし | 定義済みスケールから選ぶ。隣接 ≥25% 差 |
| 2 | 本文が 14px 以下 | 読みづらい / モバイルで拡大される | 本文は 16px、補足でも 14px 下限 |
| 3 | 全ウェイトが Bold | 階層が潰れ全部が主役 | 本文 400 / 見出し 600–700 に整理 |
| 4 | line-height 一律 1.0 or 1.5 | 見出しが間延び / 本文が窮屈 | サイズ反比例（見出し 1.1–1.25、本文 1.5+） |
| 5 | 本文行長が画面いっぱい | 次行を見失う | `max-width: 65ch`(和文 40em) |
| 6 | 大見出しが間延び | 文字間がスカスカ | letter-spacing -0.5〜-2% |
| 7 | UPPERCASE ラベルが詰まる | 読みにくい塊 | letter-spacing +5〜10% |
| 8 | 階層をサイズだけで表現 | 差が弱い or 大きすぎ | サイズ+ウェイト+色を併用 |
| 9 | 薄いグレー文字がコントラスト不足 | AA 未達で読めない | 4.5:1（大文字 3:1）を確保 |
| 10 | 和欧を同一フォント同一サイズ | 和文が大きく不揃い | 欧文別指定 or 和文 90–95% |
| 11 | 和文を欧文流に強く詰める | かな・約物が窮屈 | ベタ組み基準、詰めても -0.02em |
| 12 | Light を小さい文字に使用 | かすれて読めない | 小さい文字は 400 以上 |

---

## 10. 実装スニペット（CSS 変数・そのまま利用可）

```css
:root {
  /* スケール */
  --fs-xs: 0.75rem;   /* 12 */
  --fs-sm: 0.875rem;  /* 14 */
  --fs-base: 1rem;    /* 16 */
  --fs-lg: 1.25rem;   /* 20 */
  --fs-xl: 1.5rem;    /* 24 */
  --fs-2xl: 1.875rem; /* 30 */
  --fs-3xl: 2.25rem;  /* 36 */
  --fs-4xl: 3rem;     /* 48 */

  /* 行間 */
  --lh-tight: 1.1;    /* display */
  --lh-heading: 1.2;  /* h1-h2 */
  --lh-snug: 1.3;     /* h3 */
  --lh-body: 1.5;     /* 本文(欧文) */
  --lh-body-ja: 1.7;  /* 本文(和文) */

  /* ウェイト */
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;

  /* 色(階層) */
  --text-strong: #111827;
  --text-body: #374151;
  --text-muted: #6b7280;
}

body {
  font-family: "Inter", "Noto Sans JP", sans-serif;
  font-size: var(--fs-base);
  line-height: var(--lh-body-ja);
  color: var(--text-body);
}
h1 { font-size: var(--fs-3xl); line-height: var(--lh-heading);
     font-weight: var(--fw-bold); letter-spacing: -0.01em; color: var(--text-strong); }
h2 { font-size: var(--fs-2xl); line-height: var(--lh-heading); font-weight: var(--fw-semibold); }
h3 { font-size: var(--fs-xl);  line-height: var(--lh-snug);    font-weight: var(--fw-semibold); }
.caption { font-size: var(--fs-sm); color: var(--text-muted); }
.uppercase-label { text-transform: uppercase; letter-spacing: 0.08em; font-weight: var(--fw-medium); }
.prose { max-width: 65ch; }        /* 欧文本文 45-75字 */
.prose-ja { max-width: 40em; }     /* 和文本文 35-45字 */
```

---

## 出典一覧

- Material Design 3 — Type scale / tokens: https://m3.material.io/styles/typography/type-scale-tokens
- Material Design 3 — Applying type: https://m3.material.io/styles/typography/applying-type
- Apple Human Interface Guidelines — Typography: https://developer.apple.com/design/human-interface-guidelines/typography
- IBM Carbon Design System — Typography: https://carbondesignsystem.com/elements/typography/overview/
- Refactoring UI（タイポグラフィ章の公開要約）: https://www.refactoringui.com/
- type-scale.com（モジュラースケールの考え方）: https://typescale.com/
- デジタル庁デザインシステム — タイポグラフィ: https://design.digital.go.jp/dads/foundations/typography/
- Google Fonts — Noto Sans JP: https://fonts.google.com/noto/specimen/Noto+Sans+JP
