# design-knowledge — デザインの正典（座学ライブラリ）

Design Driver がデザインを生成するときに参照する「教科書」。公開された正規のデザインシステム/ガイドライン
（Material Design 3, Apple HIG, IBM Carbon, Shopify Polaris, Radix, Refactoring UI 公開要約, WCAG ほか）から
**実装できる粒度の数値ルール**に蒸留したもの。各ドキュメントの末尾に出典URLを併記。

## 使い方
- **AI（生成側）**: 画面を作る前にジャンルに応じて該当ドキュメントの数値ルールを適用する。
- **あなた（ディレクター）**: まず [`10-director-guide.md`](10-director-guide.md) と [`09-reference-catalog.md`](09-reference-catalog.md) から。毎日、良質UIを3つ眺めて「なぜ良いか」を言語化する習慣を。

## 目次

### 共通の土台（全ジャンル）
| # | ファイル | 内容 |
|---|---|---|
| 01 | [foundations-layout](01-foundations-layout.md) | 8pxグリッド・余白スケール・近接・視覚的階層・情報密度・グリッド/コンテンツ幅 |
| 02 | [color](02-color.md) | セマンティックカラー・50→900ランプ・WCAGコントラスト・状態色・ダークモード |
| 03 | [typography](03-typography.md) | タイプスケール・ウェイト・行間/字間/行長・和文の作法・階層 |
| 04 | [components-states](04-components-states.md) | 影/elevation・角丸・ボタン/入力/カード/バッジ等の寸法規範・状態(hover等) |
| 05 | [data-visualization](05-data-visualization.md) | チャート選定・ドーナツ/折れ線/棒の作法・KPI・SVG弧の数式・配色 |

### ジャンル別プレイブック
| # | ファイル | 内容 |
|---|---|---|
| 06 | [domain-saas-admin](06-domain-saas-admin.md) | BtoB SaaS管理画面：骨格/ナビ/テーブル/フォーム/ダッシュボード/状態・寸法レシピ |
| 07 | [domain-mobile](07-domain-mobile.md) | モバイルアプリ：安全領域/タッチ44-48/タブ/リスト/iOS流vsMaterial流・寸法レシピ |
| 08 | [domain-marketing-lp](08-domain-marketing-lp.md) | マーケLP：定番セクション構成/ヒーロー/CTA/料金/社会的証明・寸法レシピ |

### あなた（ディレクター）向け
| # | ファイル | 内容 |
|---|---|---|
| 09 | [reference-catalog](09-reference-catalog.md) | 優れたUI実例カタログ73件（リンク＋なぜ良いか＋盗めるポイント） |
| 10 | [director-guide](10-director-guide.md) | 良い指示の出し方・見る観点チェックリスト・「なんか違う」翻訳辞典・用語辞典 |

> このライブラリは `tokens.mjs`（カラーランプ/タイプスケール/多層シャドウ）と `components.mjs`（部品）に反映済み。
