# 08 ドメイン別プレイブック：マーケティングLP / ランディングページ / ブランドサイト

> コード生成ツールが参照するための、実装できる粒度のデザイン作法集。
> 対象：SaaS/プロダクトのマーケティングLP、キャンペーンLP、ブランドサイトのトップ。
> 原則：**「約束 → 証明 → 行動（Promise → Proof → Action）」** の一本道を、大胆なタイポと大きな余白で構成する。
> 出典は各節末および巻末にURL併記。

---

## 0. 設計の全体原則（コード生成の前提）

LPは「ページ」ではなく「1本の説得のシーケンス」。訪問者を、広告で約束した内容（Promise）から、それが本当だという証拠（Proof）へ、そして行動（Action=CTA）へ、迷わず運ぶ。速く決める人にも、詳細を読んでから決める人にも、両方に対応する順序を組む。

- **1スクロールに主役は1つ**：各画面高さ（viewport）ごとに、支配的なメッセージとCTAをひとつだけ置く。
- **CTAはページ全体で同一の主アクションを繰り返す**：ヒーローから始め、スクロール毎に「待ち構える」よう配置する。
- **社会的証明は前倒し**：ハイパフォーマンスなヒーローは、スクロール前に社会的証明を出す確率が高い（81% vs 41%）。
- **リスク低減の一言をCTA近傍に**：「クレジットカード不要」等はCTA直下に置くと最も効く。

出典: [Unbounce – Anatomy of a Landing Page](https://unbounce.com/landing-page-articles/the-anatomy-of-a-landing-page/) / [Wix – Anatomy of a landing page](https://www.wix.com/blog/anatomy-of-a-landing-page) / [Web Anatomy – Hero social proof above the fold](https://www.webanatomy.ai/best-landing-pages/ux-best-practice/hero-social-proof-above-the-fold)

---

## 1. 定番セクション構成と順序

LPの黄金順序と各セクションの目的。上から下に「約束→証明→行動」で緊張を高め、最後にCTAで解放する。

| # | セクション | 主目的 | 必須要素 | 目安の縦寸法(PC) |
|---|-----------|--------|----------|-----------------|
| 1 | **ヒーロー(Hero)** | 5秒で「誰の何が良くなるか」を約束 | 見出し / サブコピー / 主CTA / ビジュアル / 小さな社会的証明 | 90–100vh (最低 640px) |
| 2 | **社会的証明(ロゴ壁)** | 「みんな使っている」で不安を消す | 顧客ロゴ 5–8個 / 「〜社が導入」文言 | 120–180px |
| 3 | **課題・共感(Problem)** | 「その痛み、分かる」で自分事化 | 課題の言語化 / Before像 | 400–600px |
| 4 | **ベネフィット/機能(Solution)** | 課題→解決の変換を見せる | 3–6個の価値ブロック / 製品スクショ | 600–1200px |
| 5 | **使い方(How it works)** | 導入の心理的ハードルを下げる | 3ステップ / 番号 / 図解 | 500–700px |
| 6 | **実績・数値/お客様の声** | 定量+定性の二段証明 | 数値カード / 顔写真付き証言 | 500–800px |
| 7 | **料金(Pricing)** | 選択を容易にし決断させる | 3プラン / 推奨強調 / CTA | 700–900px |
| 8 | **FAQ** | 最後の反論処理 | 5–8問 / アコーディオン | 500–700px |
| 9 | **最終CTA(Closing)** | もう一押し | 大見出し / 主CTA / リスク低減文 | 400–600px |
| 10 | **フッター** | 網羅性・信頼・回遊 | ナビ / 会社情報 / 法的リンク | 300–500px |

代替の短縮順序（速い決断者向け）：**Hero → Problem → Solution → Social Proof → Offer → CTA → FAQ → Footer**。

出典: [Unbounce](https://unbounce.com/landing-page-articles/the-anatomy-of-a-landing-page/) / [involve.me – Landing Page Structure](https://www.involve.me/blog/landing-page-structure) / [Wix](https://www.wix.com/blog/anatomy-of-a-landing-page)

---

## 2. ヒーローの作法

ヒーローは「約束の場所」。長い説明ではなく、**成果（outcome）**を短く言い切る。優れたSaaSヒーローの共通形は「短い見出し（5–7語）＋一行説明＋製品スクショ/アニメ＋単一の主CTA」。

### 2.1 構成要素とルール

| 要素 | ルール | 実装値の目安 |
|------|--------|-------------|
| 見出し(H1) | 成果を言い切る。6語前後。機能列挙しない | 48–72px / weight 700–800 / line-height 1.05–1.15 |
| サブコピー | 見出しを1行で補足。誰に何を | 18–22px / 最大60–75文字幅 |
| 主CTA | 動詞＋一人称の成果。1個だけ支配的に | 高さ48–56px / padding 16×32px |
| 補助リンク | 「詳しく見る」等をゴースト/テキストで | 主CTAより明確に弱く |
| リスク低減文 | CTA直下に一言 | 13–14px / muted色 |
| 社会的証明 | ★評価 / 「10,000社が利用」等を上部に | 小さく、視線を邪魔しない |
| ビジュアル | 製品スクショ/短尺アニメ。抽象イラストより実物 | 右半分 or 見出し直下に大きく |

### 2.2 レイアウトパターン

- **左テキスト／右ビジュアル（split）**：テキスト6カラム＋ビジュアル6カラム。最も汎用。
- **中央寄せ＋下に大ビジュアル（centered stack）**：見出し・CTAを中央、その下に幅広の製品スクショ。Linear/Stripe系の重厚な印象。
- **暗背景＋発光する製品UI**：ブランドの先進性を表現。テキストは白、CTAは高彩度。

**余白**：ヒーロー上部（ナビ下）に 64–96px、見出しとサブの間 16–24px、サブとCTAの間 24–32px、CTA下のリスク文まで 12–16px。

> 実例の言い回し：Stripe「Financial infrastructure for the internet」＋"Start now" / Linear「Plan and build products, together」＋"Start building"（3秒の製品アニメ）/ Notion「Write, plan, share. With AI at your side.」＋実ワークスペースのスクショ。

出典: [Primer – Winning Hero Section Formula](https://www.goprimer.com/blog/the-winning-hero-section-formula) / [Web Anatomy – Best Hero Sections](https://www.webanatomy.ai/best-landing-pages/sections/hero) / [Indie Hackers – SaaS landing page patterns](https://www.indiehackers.com/post/common-design-patterns-used-by-successful-saas-landing-pages-3ac5ce41c6)

---

## 3. タイポグラフィのスケール

Webは印刷より大胆に。ヒーローH1は**display級（48–72px、大画面では80px超も可）**。比率（modular scale）で刻むと一貫する。LP/ブランドサイトは大きな比率（Perfect Fifth 1.5 や 1.414）が映える。

### 3.1 推奨タイプスケール（base 16px / ratio ≈ 1.25 Major Third を基本、Displayのみ拡張）

| トークン | 用途 | PC(px) | モバイル(px) | weight | line-height | letter-spacing |
|---------|------|--------|-------------|--------|-------------|----------------|
| Display / H1 | ヒーロー見出し | 56–72 | 34–40 | 700–800 | 1.05–1.15 | -0.02em |
| H2 | セクション見出し | 36–44 | 26–30 | 700 | 1.15 | -0.01em |
| H3 | サブ見出し | 24–28 | 20–22 | 600 | 1.25 | 0 |
| H4 | カード見出し | 18–20 | 17–18 | 600 | 1.3 | 0 |
| Body L | 主要本文/サブコピー | 18–20 | 16–17 | 400 | 1.5–1.6 | 0 |
| Body | 一般本文 | 16 | 15–16 | 400 | 1.6 | 0 |
| Small | キャプション/補足 | 14 | 13–14 | 400 | 1.5 | 0 |
| Tiny | 法的表記/注記 | 12–13 | 12 | 400 | 1.4 | 0 |

### 3.2 運用ルール

- **1ページ2書体まで**（見出し用ディスプレイ＋本文用サンセリフ、等）。3書体以上は避ける。
- **本文の行幅は 60–75文字**（可読性の上限）。大画面ほど`max-width`で抑える。
- **大見出しほどタイトに**：display級は line-height 1.05–1.15、letter-spacing はわずかに詰める（-0.01〜-0.02em）。
- モバイルは`clamp()`で流動タイポ：例 `font-size: clamp(2.125rem, 6vw, 4.5rem);`（34→72px）。

出典: [typescale.org](https://typescale.org/) / [B12 – Typographic scale](https://www.b12.io/glossary-of-web-design-terms/typographic-scale/) / [Blake Crosley – Type scales](https://blakecrosley.com/blog/typography-systems) / [Made Good – Web Typography Guide 2026](https://madegooddesigns.com/web-typography-guide/)

---

## 4. 余白とリズム（グリッド／コンテナ）

大きな余白は「高級・自信」を伝える。セクション間の**大きな縦アキ（80–120px）**が、内容の切れ目を作りリズムを生む。すべての間隔は**8ptグリッド**（8の倍数：8/16/24/32/48/64/80/96/120）に乗せる。

### 4.1 グリッド／コンテナの標準値

| 項目 | 値 | 備考 |
|------|-----|------|
| コンテナ最大幅 | **1200px**（広めは1280–1440px） | 中央寄せ、両端マージンが余白を吸収 |
| カラム数 | **12カラム** | 分割の柔軟性（2/3/4/6分割が容易） |
| ガター(列間) | 24px（広めは32px） | 8ptに一致 |
| 外側マージン(PC) | 24–48px | コンテナ内側パディング |
| 外側マージン(モバイル) | 16–20px | |
| 本文カラム幅(例) | 1200 − 2×24（外余白）= 1152 → (1152 − 11×24)/12 ≈ 74px/列 | 実装の目安 |

### 4.2 縦リズム（セクション上下パディング）

| 場面 | PC | モバイル |
|------|-----|---------|
| 主要セクション上下パディング | 96–120px | 56–72px |
| 標準セクション上下 | 80px | 48–56px |
| セクション見出しと本体の間 | 40–56px | 32px |
| カード間ギャップ | 24–32px | 16–24px |

出典: [GridMaker Pro – 8pt/12-column/baseline](https://gridmakerpro.com/learn/web-design-grid-systems-12-column-baseline-8pt/) / [AllTools – 12-column grid systems](https://alltools.dev/reference/design/12-column-grid-systems/) / [Concept Fusion – Spacing best practices](https://www.conceptfusion.co.uk/post/web-design-spacing-and-sizing-best-practices) / [USWDS – Layout grid](https://designsystem.digital.gov/utilities/layout-grid/)

---

## 5. CTA設計

CTAは「配置・色・文言・繰り返し」の4点で設計する。テストで最も安定して効くのは**文言**、次に**色（＝周囲とのコントラスト）**。

### 5.1 文言（最重要）

- **動詞＋成果**で書く。「Submit」「Sign up」は弱い。→「Start my free trial」「Get my quote」。
- **一人称（my/me）**が多くのページで二人称（your）に勝つ：「Start my trial」＞「Start your trial」。
- **反論処理のマイクロコピーをCTA直下に**：「No credit card required」「Cancel anytime」。Blue Apronは "Cancel anytime" 追加でサインアップ+12%。

### 5.2 色・サイズ

- 原則は**特定の色ではなくコントラスト**。ボタンは画面内で最も明るく・彩度が高い要素にする（周囲が青なら赤ボタンが目立つ、という相対の話）。
- WCAG 2.1：UI部品と隣接色は**3:1以上**のコントラスト、ボタン文字は本文基準（4.5:1）を満たす。
- サイズ：高さ48–56px、横paddingは文字量+32–48px、tap領域はモバイルで最低44×44px。

### 5.3 配置・繰り返し

- **主CTAは単一アクションを全ページで統一**し、ヒーロー→機能後→料金→最終と、**1画面高さごとに1つ**「待ち構える」よう置く。
- 主CTA（塗り・高彩度）と副CTA（アウトライン/ゴースト）は明確に階層差をつける。副は主より必ず弱く。

| バリアント | 見た目 | 用途 |
|-----------|--------|------|
| Primary | 塗り・ブランド高彩度・影あり | 主アクション（唯一） |
| Secondary | アウトライン/淡色塗り | 「詳しく」「デモを見る」 |
| Ghost/Text | 枠なし・下線/矢印 | 補助リンク |

出典: [Woobox – CTA button design & copy](https://woobox.com/articles/cta-button-design-and-copy) / [Atticus Li – CTA button psychology](https://atticusli.com/blog/posts/cta-button-psychology-size-color-copy-research/) / [Heurilens – CTA design 2026](https://heurilens.com/blog/trust-conversion/cta-design-placement-copy-color-converts) / [UXPin – Microcopy that converts](https://www.uxpin.com/studio/blog/microcopy-that-converts/)

---

## 6. 社会的証明

証拠は**「定量（数）→定性（声）→権威（ロゴ）」**を層で重ねる。

### 6.1 3つの型と実装

| 型 | 目的 | 実装レシピ |
|----|------|-----------|
| **ロゴ壁** | 「有名企業が使う」 | グレースケールの顧客ロゴ 5–8個を横一列。高さ揃え28–40px、透過60–80%。上に「〜社に導入」文言 |
| **実績数値** | 規模・信頼を数で | 3–4個の数値カード（例「99.9% 稼働率」「50,000+ ユーザー」）。数字は36–48px太字、ラベルは14px muted |
| **お客様の声** | 具体的成果を人の言葉で | 顔写真（実物）＋実名＋役職・会社。★評価。2–3枚をカード/カルーセル |

- **本物であること**：ストック写真・架空名は避け、実名・実写真を使う。信頼が上がる。
- **配置**：認知ロゴはヒーロー直下（前倒し）、詳しい証言は中盤で信頼を補強。

出典: [Wix – Anatomy](https://www.wix.com/blog/anatomy-of-a-landing-page) / [Web Anatomy – Hero social proof above the fold](https://www.webanatomy.ai/best-landing-pages/ux-best-practice/hero-social-proof-above-the-fold)

---

## 7. 料金表

プラン数は**3（多くて4）**。多すぎると選択麻痺、少なすぎると選択肢不足。推奨プランを1つ視覚的に強調して**意思決定を代行**する。

### 7.1 推奨プランの強調テクニック

- 中央に置く（3列なら真ん中）。
- 枠/背景を**ブランド色でハイライト**、他プランより**わずかに拡大**（scale 1.03–1.05 or 高さ+16–24px）。
- 「Most Popular」「おすすめ」バッジ/リボンを上端に。
- 推奨プランのCTAだけ**塗りPrimaryＣ**、他はアウトライン。
- ドロップシャドウで一段浮かせる。

### 7.2 レイアウト・レシピ（3プラン）

| 項目 | 値 |
|------|-----|
| カラム | 3 × 4カラム（PC）／モバイルは縦積み1列 |
| カード幅 | 320–360px、ギャップ 24–32px |
| カードpadding | 32px |
| 価格表示 | 通貨小さめ＋数字48px太字＋"/月"は14px muted |
| 機能行 | ✓/– のブール、または「5ユーザー」等の数値で差分を最小情報化 |
| CTA | 各カード下部に固定。推奨のみPrimary |
| 年/月トグル | 上部中央にスイッチ。割引訴求（「年払いで2ヶ月無料」） |

### 7.3 3プランのコンテンツ設計

| プラン | 位置づけ | ねらい |
|--------|---------|--------|
| Starter/Free | 入口・お試し | 最初のYesを取る（無料/低価格） |
| **Pro（推奨）** | 主力・利益源 | 大多数をここへ誘導（強調対象） |
| Enterprise/Business | 上限・アンカー | 高価格で相対的にProを割安に見せる |

出典: [Crocoblock – Pricing table best practices](https://crocoblock.com/blog/wordpress-pricing-table-best-practices/) / [UX Planet – Pricing table design](https://uxplanet.org/best-practices-for-pricing-table-design-2d99e46201da) / [WiserNotify – Pricing page best practices](https://wisernotify.com/blog/pricing-page-best-practices-to-increase-conversions/)

---

## 8. ビジュアル / 画像 / グラデ / 影の使い方（ブランド表現）

ブランドの人格は、色・グラデ・影・実物ビジュアルで作る。過剰にせず「差」で見せる。

### 8.1 画像・製品ビジュアル

- **抽象イラストより実物**（製品スクショ、短尺UIアニメ、実ワークスペース）。信頼と具体性が上がる。
- ヒーローは大きな製品UIを主役に。暗背景に発光させると先進感。
- **Bentoグリッド**（Apple/Linear流）で複数機能を圧迫感なく並べる：不揃いサイズのタイルに各機能の実UIスクショ。

### 8.2 グラデーション

- ブランド1–2色から**メッシュ/線形グラデ**を作り、ヒーロー背景・カード・CTAの縁に薄く敷く。
- 角度は15–135°で統一。彩度差は控えめにし、テキストの可読コントラストを死守。
- 「発光」表現：グラデを`radial-gradient`でぼかし、製品UIの後ろに置く。

### 8.3 影（elevation）

段階的な影トークンで「浮き」を表現し、raised要素（カード/ボタン/推奨プラン）に奥行きを与える。

| レベル | 用途 | 例(CSS) |
|--------|------|---------|
| sm | ボタン・小カード | `0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.10)` |
| md | 標準カード | `0 4px 6px rgba(0,0,0,.05), 0 10px 15px rgba(0,0,0,.10)` |
| lg | 推奨プラン・モーダル | `0 10px 20px rgba(0,0,0,.08), 0 20px 40px rgba(0,0,0,.12)` |
| glow | CTA/製品UI | ブランド色の`0 8px 30px rgba(brand,.35)` |

- 影は**光源を上から一貫**させる（drop shadowは背後の要素より浮いて見せる効果）。
- 角丸は統一トークン（例 8/12/16/24px）。カード12–16px、ボタン8–12px、大パネル24px。

出典: [Indie Hackers – SaaS patterns（Bento/暗背景）](https://www.indiehackers.com/post/common-design-patterns-used-by-successful-saas-landing-pages-3ac5ce41c6) / [Wikipedia – Drop shadow](https://en.wikipedia.org/wiki/Drop_shadow) / [Wikipedia – Color gradient](https://en.wikipedia.org/wiki/Color_gradient)

---

## 9. レスポンシブ（ブレークポイントの考え方）

**最低3段（モバイル / タブレット / デスクトップ）**。デバイス固定より「コンテンツが崩れる幅」で足す。単位は`rem`/`%`/`clamp()`優先、固定pxは避ける。

### 9.1 標準ブレークポイント

| 名称 | 幅 | レイアウト方針 |
|------|-----|---------------|
| Mobile | 〜767px | 1カラム。CTAは幅100%。タイポは最小スケール。ロゴ壁は2–3列折返し |
| Tablet | 768–1023px | 2カラムへ。ヒーローは縦積み or 軽いsplit |
| Desktop | 1024–1439px | 多カラム（12グリッド）。ヒーローsplit。コンテナ1200px |
| Large | 1440px〜 | コンテナ1200–1440pxで固定、両脇に余白。フォント/余白を一段大きく、本文65–75文字/行 |

### 9.2 レスポンシブ実装ルール

- **モバイルファースト**でCSSを書き、`min-width`で拡張。
- ヒーロー：PCは`grid-template-columns: 6fr 6fr`、モバイルは1列＋ビジュアルを見出し下へ。
- タイポ：`clamp(最小, ビューポート幅係数, 最大)`で段差なく縮小。
- タップ領域：モバイルのCTA/リンクは最低44×44px。
- 画像：`srcset`で解像度出し分け、製品スクショはモバイルで要点をクロップ。

出典: [Framer – Responsive breakpoints 2026](https://www.framer.com/blog/responsive-breakpoints/) / [Webflow – Responsive breakpoints](https://webflow.com/blog/responsive-breakpoints) / [BrowserStack – Ideal screen sizes](https://www.browserstack.com/guide/ideal-screen-sizes-for-responsive-design)

---

## 10. 代表LPの「セクション別レイアウト寸法レシピ」

コード生成が即使える寸法テンプレート。単位px、PC基準（コンテナ1200 / 12カラム / ガター24 / 8ptグリッド）。モバイルは各節の縮小規則に従う。

### 10.1 グローバル・トークン（共通）

| トークン | 値 |
|---------|-----|
| container.maxWidth | 1200 |
| grid.columns / gutter | 12 / 24 |
| section.padY (PC / SP) | 96 / 56 |
| radius.card / button / panel | 12 / 8 / 24 |
| font.display / h2 / body | 64 / 40 / 16 |
| color.cta | ブランド高彩度（周囲最大コントラスト） |

### 10.2 ヒーロー（split型）レシピ

| 要素 | 配置 | 寸法 |
|------|------|------|
| コンテナ | 中央1200 / 高さ最低640 | padTop 96, padBottom 96 |
| テキスト列 | 左 6カラム | H1 64/1.1、下24でサブ20、下32でCTA |
| ビジュアル列 | 右 6カラム | 製品スクショ幅100%、影lg、角丸16 |
| 主CTA | テキスト列内 | 高52・padding16×32・radius8 |
| リスク文 | CTA下12 | 13px muted |
| 社会的証明 | CTA下40 | ★＋「10,000社が利用」14px |

### 10.3 ロゴ壁レシピ

- 高さ160、上下padding 40。見出し「導入企業」14px muted中央。
- ロゴ6個を横並び（`flex`, gap48）、各ロゴ高32・グレースケール・透過70%。SPは3列×2段折返し。

### 10.4 ベネフィット（3カラム・カード）レシピ

| 要素 | 寸法 |
|------|------|
| セクション | padY96、見出しH2 40中央＋下48で本体 |
| グリッド | 3列（各4カラム）、gap 32 |
| カード | padding32、radius12、影md、上部にアイコン48 |
| カード内 | アイコン下16でH4 20、下12で本文16/1.6 |
| SP | 1列縦積み、gap24 |

### 10.5 使い方（3ステップ）レシピ

- 横3列、各に大番号（48px薄色）＋見出しH3 24＋説明16。
- 列間に矢印/点線（装飾）。SPは縦積み＋左に番号。

### 10.6 お客様の声レシピ

- 2–3カード横並び（gap32）。カードpadding32、radius16、影md。
- 引用20px/1.5 → 下24に「顔写真40円形＋実名14＋会社13muted」＋★。

### 10.7 料金（3プラン）レシピ

| 要素 | 寸法 |
|------|------|
| グリッド | 3列（各4カラム）、gap24、上部中央に月/年トグル |
| カード | 幅340、padding32、radius16、影md |
| 推奨カード | scale1.04＋影lg＋ブランド枠2px＋上端バッジ |
| 価格 | 数字48太字＋"/月"14muted |
| 機能リスト | 各行 high 32、✓/– アイコン20 |
| CTA | カード下部、推奨のみPrimary塗り |

### 10.8 FAQ／最終CTA／フッター レシピ

- **FAQ**：単一列 max幅800中央、アコーディオン各行padding20、区切り線1px。
- **最終CTA**：ブランド色 or グラデ背景の帯、padY96、H2 40中央＋主CTA＋リスク文。角丸24のパネルにするのも可。
- **フッター**：4–5カラムのリンク群（各3カラム幅）、上に細線、下にコピーライト13muted・法的リンク。padY 64。

出典（レシピの根拠）: 第1–9節の各出典を寸法化して統合。特に [GridMaker Pro（8pt/12col）](https://gridmakerpro.com/learn/web-design-grid-systems-12-column-baseline-8pt/) / [Unbounce（構成）](https://unbounce.com/landing-page-articles/the-anatomy-of-a-landing-page/) / [Indie Hackers（SaaS実例）](https://www.indiehackers.com/post/common-design-patterns-used-by-successful-saas-landing-pages-3ac5ce41c6)。

---

## 11. チェックリスト（生成後の自己検証）

- [ ] ヒーローH1は成果を6語前後で言い切り、48px以上か
- [ ] 主CTAは全ページ同一アクションで、1画面ごとに存在するか
- [ ] CTA文言は動詞＋一人称、直下にリスク低減文があるか
- [ ] 社会的証明がヒーロー直下（前倒し）にあるか
- [ ] セクション間の縦アキは80–120px（8ptグリッド）か
- [ ] コンテナ1200 / 12カラム / ガター24に乗っているか
- [ ] 料金は3プラン、推奨が視覚的に1つ強調されているか
- [ ] 本文行幅60–75文字、書体2種以内か
- [ ] モバイル1列・タップ44px・`clamp`タイポが効いているか
- [ ] 影と角丸がトークンで統一されているか

---

## 出典一覧（正規ソース）

**構成・ヒーロー・社会的証明**
- Unbounce – The Anatomy of a Landing Page: https://unbounce.com/landing-page-articles/the-anatomy-of-a-landing-page/
- Wix – The anatomy of a landing page: https://www.wix.com/blog/anatomy-of-a-landing-page
- involve.me – Landing Page Structure: https://www.involve.me/blog/landing-page-structure
- Primer – The Winning Hero Section Formula: https://www.goprimer.com/blog/the-winning-hero-section-formula
- Web Anatomy – Best Hero Section Examples: https://www.webanatomy.ai/best-landing-pages/sections/hero
- Web Anatomy – Hero social proof above the fold: https://www.webanatomy.ai/best-landing-pages/ux-best-practice/hero-social-proof-above-the-fold
- Indie Hackers – Common SaaS landing page patterns: https://www.indiehackers.com/post/common-design-patterns-used-by-successful-saas-landing-pages-3ac5ce41c6

**タイポグラフィ**
- Typescale.org: https://typescale.org/
- B12 – Typographic scale: https://www.b12.io/glossary-of-web-design-terms/typographic-scale/
- Blake Crosley – Type scales: https://blakecrosley.com/blog/typography-systems
- Made Good – Web Typography Guide 2026: https://madegooddesigns.com/web-typography-guide/

**グリッド・余白**
- GridMaker Pro – 8pt/12-column/baseline: https://gridmakerpro.com/learn/web-design-grid-systems-12-column-baseline-8pt/
- AllTools – 12-column grid systems: https://alltools.dev/reference/design/12-column-grid-systems/
- Concept Fusion – Spacing & sizing best practices: https://www.conceptfusion.co.uk/post/web-design-spacing-and-sizing-best-practices
- USWDS – Layout grid: https://designsystem.digital.gov/utilities/layout-grid/

**CTA・マイクロコピー**
- Woobox – CTA Button Design and Copy: https://woobox.com/articles/cta-button-design-and-copy
- Atticus Li – CTA Button Psychology: https://atticusli.com/blog/posts/cta-button-psychology-size-color-copy-research/
- Heurilens – CTA Design 2026: https://heurilens.com/blog/trust-conversion/cta-design-placement-copy-color-converts
- UXPin – Microcopy that converts: https://www.uxpin.com/studio/blog/microcopy-that-converts/

**料金表**
- Crocoblock – Pricing table best practices: https://crocoblock.com/blog/wordpress-pricing-table-best-practices/
- UX Planet – Best practices for pricing table design: https://uxplanet.org/best-practices-for-pricing-table-design-2d99e46201da
- WiserNotify – Pricing page best practices: https://wisernotify.com/blog/pricing-page-best-practices-to-increase-conversions/

**ビジュアル・影・グラデ**
- Wikipedia – Drop shadow: https://en.wikipedia.org/wiki/Drop_shadow
- Wikipedia – Color gradient: https://en.wikipedia.org/wiki/Color_gradient

**レスポンシブ**
- Framer – Responsive breakpoints 2026: https://www.framer.com/blog/responsive-breakpoints/
- Webflow – Responsive breakpoints: https://webflow.com/blog/responsive-breakpoints
- BrowserStack – Ideal screen sizes for responsive design: https://www.browserstack.com/guide/ideal-screen-sizes-for-responsive-design
