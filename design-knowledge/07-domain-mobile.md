# 07 ドメイン・プレイブック：モバイルアプリ UI（iOS / Android）

コード生成ツールが参照するための「ジャンル別プレイブック」。Apple Human Interface Guidelines（HIG）と Material Design 3（M3）の公開仕様を、実装できる粒度の具体数値に蒸留したもの。単位は iOS が **pt（ポイント）**、Android が **dp（密度非依存ピクセル）**。1pt ≈ 1dp と考えてよく、CSS の論理ピクセル（`px`）にほぼ一致する（@1x）。以下、断りなく「px」と書いた場合は論理ピクセル＝pt/dp を指す。

---

## 0. 2大流儀の要点（最初に読む）

| 観点 | iOS（HIG） | Android（Material 3） |
|---|---|---|
| ベース単位 | pt。8/4pt グリッド推奨 | dp。**8dp ベースライン**グリッド、テキストは 4dp |
| 最小タッチターゲット | **44 × 44 pt** | **48 × 48 dp**（最低 24dp） |
| 標準フォント | SF Pro / SF Pro Text | Roboto（M3 は可変フォント） |
| 本文サイズ | 17pt（Body） | 16sp（Body Large） |
| 標準マージン | 16pt（左右）／広い画面 20pt | 16dp（画面端） |
| 角丸の作法 | 連続角丸（superellipse）、控えめ〜中 | 明示的な角丸トークン（4/8/12/16/28dp） |
| 影／立体表現 | 影は控えめ、境界線と余白で階層化 | **Elevation**（0〜5、色の重なり＋影） |
| 主ナビ | 下部 **Tab Bar**（3〜5） | 下部 **Navigation Bar**（3〜5） |
| 主要アクション | ツールバー／ナビバー右上ボタン | **FAB**（右下、浮遊） |
| 色の思想 | システムカラー＋セマンティック | **Dynamic Color / トーナルパレット** |

> 実装原則：**どちらのプラットフォームでも「安全領域を尊重」「タッチターゲットを確保」「8の倍数で余白を刻む」の3点は共通の絶対ルール。** 流儀の差（影・角丸・ナビ配置）はプラットフォーム判定で切り替える。

出典: [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) / [M3 Foundations: Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)

---

## 1. 画面サイズと安全領域（Safe Area）

### 1.1 iPhone 論理サイズの基準（pt, @1x）

| 機種クラス | 論理サイズ (W×H) | スケール | 実ピクセル |
|---|---|---|---|
| iPhone SE (第2/3世代) | 375 × 667 | @2x | 750 × 1334 |
| iPhone 12/13/14/15/16 標準 | **390 × 844** | @3x | 1170 × 2532 |
| iPhone 14/15/16 Pro | 393 × 852 | @3x | 1179 × 2556 |
| iPhone 15/16 Plus・Pro Max | 430 × 932 | @3x | 1290 × 2796 |
| iPhone 17 Pro Max（最新の最大） | 440 × 956 | @3x | — |

**デザインの基準フレームは 390 × 844 pt**（最も普及）。@3x 書き出しが現行の基本。

### 1.2 セーフエリア・インセット（390×844 標準機の目安, pt）

| 領域 | 値 | 説明 |
|---|---|---|
| ステータスバー（上部インセット） | **47〜48 pt** | ノッチ機。Dynamic Island 機は上 54pt 相当＋下 5pt |
| ホームインジケータ（下部インセット） | **34 pt** | 全画面。タブバーがある画面は 21pt 相当が慣例 |
| 左右セーフエリア（縦持ち） | 0 pt | 横持ちでノッチ側 44pt など |

- **`safeAreaInsets` / `safeAreaLayoutGuide` を使い、ステータスバー高さを直接ハードコードしない**（機種差があるため）。
- ホームインジケータの帯（下部 21〜34pt）には**タップ要素を置かない**。カスタムの下端ジェスチャも避ける。

### 1.3 Android のシステムバー（dp 目安）

| 領域 | 値 | 説明 |
|---|---|---|
| ステータスバー | 24 dp（ノッチ機で可変） | `WindowInsets.statusBars` で取得 |
| ナビゲーションバー（3ボタン） | 48 dp | ジェスチャナビ時は 24dp 前後のハンドル帯 |
| ディスプレイカットアウト | 機種依存 | `WindowInsets.displayCutout` |

- Android 15 以降は**エッジトゥエッジ描画がデフォルト**。`WindowInsets`（`safeDrawing` / `systemBars`）でパディングを当てる。

出典: [HIG Layout（Safe area）](https://developer.apple.com/design/human-interface-guidelines/layout) / [iOS Design Guidelines (learnui.design)](https://www.learnui.design/blog/ios-design-guidelines-templates.html) / [M3 Applying layout](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)

---

## 2. タッチターゲット

| 項目 | iOS | Android (M3) |
|---|---|---|
| 最小サイズ | **44 × 44 pt** | **48 × 48 dp**（絶対最低 24dp） |
| 隣接要素の間隔 | 8pt 以上推奨 | 8dp 以上推奨 |
| 実装のコツ | アイコンが 24pt でも**当たり判定を 44pt に拡張**（hitTest / paddingで） | アイコン 24dp を 48dp の `minTouchTargetSize` でラップ |

**ルール：見た目のアイコンサイズとタップ領域を分離する。** アイコンは 24〜28px でも、包むボタンは iOS 44 / Android 48 を確保。リストの小さな削除ボタンや閉じる「×」も例外にしない。

出典: [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) / [M3 Accessibility (touch target 48dp)](https://m3.material.io/foundations/designing/structure) / [material-components-android #1279](https://github.com/material-components/material-components-android/issues/1279)

---

## 3. ナビゲーション構造

### 3.1 iOS：バー類の寸法

| バー | 高さ（コンテンツ部, pt） | 備考 |
|---|---|---|
| ステータスバー | 47〜48（ノッチ機） | 常時表示（没入時は隠す） |
| ナビゲーションバー（標準） | **44** | Large Title 時は展開で **96pt** 相当（44 + タイトル領域） |
| 検索バー付きナビバー | +52 前後 | |
| ツールバー（下部） | 44 | アクションボタン群 |
| **タブバー** | **49**（＋下部セーフエリア 34 = 実測 83px） | アイコン 25×25、ラベル 10〜11pt |

- タブは **3〜5個**。6個以上は末尾を「More」タブに集約。
- タブバーは**ナビゲーション専用**。アクション（投稿など）ボタンは置かない（中央 FAB 風にしたい場合は例外的にモーダル起動ボタンとして扱う）。
- タブバーはキーボード表示時に隠れる。全オリエンテーションで同じ高さ。
- 戻る：ナビバー左上の「< 戻る」＋左端からのスワイプバック（`interactivePopGesture`）。

### 3.2 Android：Navigation Bar と FAB

| 要素 | 寸法（dp） | 備考 |
|---|---|---|
| Navigation Bar（下部）高さ | **80** | アクティブインジケータ（ピル）付き |
| ナビアイテム | アイコン 24、インジケータ 64×32 | 3〜5個 |
| Top App Bar（小） | **64** | Center/Small/Medium(112)/Large(152) の4種 |
| **FAB（標準）** | **56 × 56**、角丸 16 | 右下、画面端から 16dp |
| Small FAB | 40 × 40 | |
| Large FAB | 96 × 96 | |
| Extended FAB | 高さ 56、横可変、テキスト＋アイコン | |

- FAB は**画面で最も重要な単一アクション**に1つ。スクロール時は縮小・退避してよい。
- 戻る：システムの戻る（3ボタン or エッジスワイプ）＋ Top App Bar のナビゲーションアイコン（← / ハンバーガー）。

出典: [HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) / [iOS Tab Bar dimensions (codershigh mirror)](https://codershigh.github.io/guidelines/ios/human-interface-guidelines/ui-bars/tab-bars/index.html) / [M3 Navigation bar specs](https://m3.material.io/components/navigation-bar/specs) / [M3 FAB](https://m3.material.io/components/floating-action-button/specs)

---

## 4. リスト / セル

| 項目 | iOS | Android (M3) |
|---|---|---|
| 標準行高（1行） | 44 pt | **56 dp**（1行）／72 dp（2行）／88 dp（3行） |
| コンパクト行高 | 44 | 48（密度高） |
| 左右パディング | 16 pt | 16 dp |
| 区切り線（Divider） | 0.5pt、左インセット 16（テキスト先頭に揃える） | 1dp、`outlineVariant` 色 |
| アバター / 先頭アイコン | 29〜40pt 円 | 40dp 円（リーディング） |
| 開示インジケータ | `>`（chevron）右端 | トレーリングアイコン |
| セル内テキスト | タイトル 17 / サブ 15 | Headline 16 / Supporting 14 |

### スワイプアクション
- **iOS**: 右→左スワイプで末尾アクション（削除は赤 `systemRed`）、左→右で先頭アクション。フルスワイプで既定アクション実行。ボタン幅は最低 74pt 目安。
- **Android**: `SwipeToDismiss` パターン。背景に色＋アイコンを表示。マテリアルでは削除はエラーカラー。

**ルール**：区切り線はテキスト先頭（アバター右端）にインセットして揃える。行全体をタップ可能にし、行高で 44/48 を割らない。

出典: [HIG Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables) / [M3 Lists](https://m3.material.io/components/lists/specs)

---

## 5. フォーム / 入力

| 項目 | iOS | Android (M3) |
|---|---|---|
| 入力欄の高さ | 44 pt 以上 | **Filled/Outlined 56 dp** |
| 入力欄の角丸 | 10 pt 前後 | 上部 4dp（Filled）／全周 4dp（Outlined） |
| ラベル | 上部プレースホルダ or 外部ラベル | フローティングラベル（フォーカスで上へ） |
| 左右マージン | 16 pt | 16 dp |
| フィールド間の縦間隔 | 16〜20 pt | 16 dp |
| プライマリボタン | **全幅（画面幅 − 32）× 高さ 50pt** | 全幅 or 右寄せ、高さ 40dp（`Button`） |
| ボタン角丸 | 12〜14 pt | 20dp（フルピル）／`FullyRounded` |

### キーボード考慮（両OS共通の実装ルール）
- 入力フィールドがキーボードに隠れないよう、**フォーカス時にスクロール／画面を持ち上げる**（iOS: `keyboardLayoutGuide` / SwiftUI 自動、Android: `adjustResize` / `imePadding()`）。
- **`keyboardType` / `inputType` を用途別に指定**：メール（email）、電話（phone/number-pad）、URL、数字（decimal）。
- 送信系ボタンはキーボード上部のアクセサリバー or IME アクション（`Done`/`Next`/`Go`）に対応。
- モバイルの主要 CTA は**全幅ボタン**が基本（親指到達性・誤タップ防止）。危険操作は色（iOS `systemRed` / M3 `error`）で区別。

出典: [HIG Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) / [M3 Text fields](https://m3.material.io/components/text-fields/specs) / [M3 Buttons](https://m3.material.io/components/buttons/specs)

---

## 6. カード / ボトムシート / モーダル / トースト / セグメント

### 6.1 カード

| 項目 | iOS 流 | Material 3 |
|---|---|---|
| 角丸 | 12〜16 pt | 12 dp（Medium） |
| 内側パディング | 16 pt | 16 dp |
| 影 | ごく薄い（境界＋余白で分離） | Elevation 1（`surfaceContainerLow`）／Outlined は 1dp 罫線 |
| カード間隔 | 8〜16 pt | 8 dp |

### 6.2 ボトムシート（M3 / iOS Sheet）

| 項目 | 値 |
|---|---|
| ドラッグハンドル | 幅 32dp × 高 4dp（当たり判定 48dp）、上部中央 |
| 上部角丸 | 28 dp（M3）／iOS は上端 10〜16pt |
| 端マージン | 左右 16、上下 8 |
| リスト項目 | 高さ 48〜56、アイコン 24×24 |
| iOS Sheet の停止点 | `.medium()`（半分）/`.large()`（全画面）のディテント |

### 6.3 モーダル / アラート
- **iOS アラート**：中央、幅 270pt 前後、ボタンは縦積み（3個以上）or 横2分割。破壊的操作は赤。
- **フルスクリーンモーダル**：上部に「キャンセル / 完了」。ページシートは上端に余白を残し背後を暗く。
- **M3 Dialog**：角丸 28dp、左右パディング 24dp、アクションは右下寄せ。

### 6.4 トースト / スナックバー
| 項目 | iOS | Android (M3) |
|---|---|---|
| 通例 | 標準トーストは無し（`Toast`風は自作 or バナー） | **Snackbar** 高さ 48dp |
| 位置 | 上部バナー通知 or 画面下 | 画面下（ナビバー/FAB の上に退避） |
| パディング | — | 左右 16（外）/16（内）、アクション左 8 |
| 表示時間 | 2〜4秒 | 短 4秒 / 長 10秒、1アクションまで |

### 6.5 セグメントコントロール / タブ
- **iOS Segmented Control**：高さ 32pt、2〜5セグメント、等幅、選択セグメントが浮き上がる。フィルタ・ビュー切替に使う（ナビゲーションには使わない）。
- **M3 Tabs**：Primary（上部、インジケータ下線）/ Secondary。高さ 48dp。**Segmented Button** は高さ 40dp のトグル群。

出典: [HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) / [M3 Bottom sheets](https://m3.material.io/components/bottom-sheets/guidelines) / [M3 Snackbar specs](https://m3.material.io/components/snackbar/specs) / [HIG Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) / [M3 Cards](https://m3.material.io/components/cards/guidelines)

---

## 7. タイポグラフィ / 余白の目安

### 7.1 タイポ（モバイル本文は 16〜17px）

| 役割 | iOS (SF Pro, pt) | Material 3 (sp) |
|---|---|---|
| 大見出し | Large Title 34 / Title1 28 | Display/Headline Large 32〜57 |
| 画面タイトル | 17 semibold（ナビバー） | Title Large 22 |
| セクション見出し | Headline 17 semibold | Title Medium 16 |
| **本文** | **Body 17 regular** | **Body Large 16** |
| 補助テキスト | Subhead 15 / Footnote 13 | Body Medium 14 |
| キャプション | Caption 12〜11 | Label/Body Small 12 |
| タブラベル | 10〜11 | 12 |
| 行間 | フォント×1.2〜1.4 | Line height はトークン規定（4dp グリッド） |

- iOS は **Dynamic Type**、Android は **フォントスケール**に追従させる（固定 px を避ける）。
- 本文は 16px を下限に。1行あたり文字数を詰め込みすぎない。

### 7.2 余白（8の倍数）

| トークン | 値 | 用途 |
|---|---|---|
| xs | 4 | アイコン⇔ラベル間 |
| s | 8 | 密なグループ内 |
| **m（基準）** | **16** | 画面左右マージン・セクション内 |
| l | 24 | セクション間 |
| xl | 32 | 大区切り・CTA 上下 |

**ルール**：画面端マージン 16、要素間 8/16/24 の3段階を基本に、8の倍数（テキストは4）で刻む。

出典: [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography) / [M3 Typography type scale](https://m3.material.io/styles/typography/type-scale-tokens) / [Android font size guidelines](https://www.learnui.design/blog/android-material-design-font-size-guidelines.html) / [8pt grid](https://medium.com/design-bootcamp/designing-in-the-8pt-grid-system-f3c1183ea6e8)

---

## 8. 代表画面のレイアウト寸法レシピ（基準 390×844 pt / iOS表記, ()内はM3差分）

### 8.1 ログイン
```
[上部セーフエリア 47]
└ 余白 32
  ロゴ 88×88（中央）
  余白 32
  タイトル "ログイン" 28 bold（中央）
  余白 24
  ┌ 入力欄 メール   幅358 × 高44(56)  角丸10(4)
  │ 余白 16
  └ 入力欄 パスワード 幅358 × 高44(56)
  余白 8
  "パスワードを忘れた" 15（右寄せ・リンク色）
  余白 24
  ■ ログイン（全幅ボタン）幅358 × 高50(40)  角丸12(20)  塗り=アクセント
  余白 16
  □ 新規登録（枠線ボタン）幅358 × 高50
[下部セーフエリア 34]
左右マージン=16
```

### 8.2 ホーム（フィード）
```
[ステータスバー 47]
Navigation Bar 44(64)  ← 左:タイトル "ホーム" 34(Large) / 右:アイコン44×44
── スクロール領域 ──
  カード（投稿）: 幅358, 角丸12(12dp)
    ├ ヘッダー: アバター40円 + 名前17 + 時刻13   高さ56
    ├ 本文 17 / 画像 幅358×比率16:9
    └ アクション行: いいね/コメント/共有 各44×44   高さ44
  カード間隔 8〜12
── タブバー 49(＋34) ──  アイコン25 + ラベル11、3〜5タブ
(M3: 下部 Navigation Bar 80 + 右下 FAB 56 で新規投稿)
左右マージン=16
```

### 8.3 詳細（記事 / アイテム）
```
[ステータスバー 47]
Nav Bar 44 : 左"< 戻る" / 右 共有アイコン44
── スクロール ──
  ヒーロー画像 幅390（全幅・端まで）× 高220
  余白 16
  タイトル 28 bold        (左右16)
  余白 8
  メタ行: アバター29 + 著者15 + 日付13
  余白 16
  区切り線 0.5
  余白 16
  本文 17 / 行間 1.4      (左右16)
  段落間 16
[下端] 固定CTA バー：全幅ボタン 高50（保存/購入）+ 下セーフ34
```

### 8.4 プロフィール
```
[ステータスバー 47]
Nav Bar 44 : 右 設定アイコン44
── スクロール ──
  ヘッダーブロック 高さ~180
    アバター 88円（中央）
    余白 12
    表示名 22 semibold（中央）
    ユーザー名/肩書 15 secondary
    余白 16
    ■ プロフィール編集（枠線ボタン）幅326 × 高40
  統計行: 投稿/フォロー/フォロワー を3等分  各高64（数値20 + ラベル13）
  区切り線
  セグメントコントロール 高32(M3 Tabs 48): 投稿 / いいね
  グリッド: 3列, セル (390-16*2-gap*2)/3 ≈ 116角, gap 2〜8
左右マージン=16
```

### 8.5 設定
```
[ステータスバー 47]
Nav Bar 44 : タイトル "設定" 17 semibold（中央）
── グループ化リスト（iOS Inset Grouped） ──
  セクション見出し 13 caps secondary  （上余白 24 / 左16）
  ┌ セル 高44(56): 左アイコン29 + ラベル17 + 右 値15/chevron
  │ 区切り 0.5（左インセット 16+アイコン幅）
  ├ セル … トグル行は右に Switch 51×31
  └ グループ角丸 10、グループ左右マージン 16
  破壊的操作（ログアウト/削除）: 赤文字17、単独グループ
[下部セーフエリア 34]
(M3: フラットな1dp Divider リスト、行高56、トグルは Switch 52×32)
```

出典: [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) / [M3 Layout](https://m3.material.io/foundations/layout) / [iOS Design Guidelines templates](https://www.learnui.design/blog/ios-design-guidelines-templates.html)

---

## 9. コード生成時のチェックリスト（要約）

1. **プラットフォーム判定**で iOS(44pt/Tab Bar/控えめ影) と Android(48dp/Nav Bar+FAB/Elevation) を分岐。
2. すべての対話要素に **iOS 44 / Android 48** の当たり判定を保証（見た目アイコンと分離）。
3. 上下端は **safeAreaInsets / WindowInsets** でパディング。数値ハードコード禁止。
4. 画面端マージン **16**、余白は **8の倍数**（テキストは4）。
5. 本文 **16〜17**、Dynamic Type / フォントスケール対応。
6. 主要ナビは下部（Tab Bar / Navigation Bar）3〜5。主要アクションは iOS ツールバー / Android FAB。
7. リスト行高 iOS44 / Android56、区切り線はテキスト先頭にインセット。
8. モバイル CTA は**全幅ボタン**、キーボード回避スクロール、`keyboardType` 指定。
9. ボトムシート角丸 28dp＋ドラッグハンドル、トーストは Snackbar（下部・自動退避）。
10. 危険操作は赤（`systemRed` / M3 `error`）。

---

### 主要出典（正規ソース）
- Apple Human Interface Guidelines: [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) ・ [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) ・ [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) ・ [Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) ・ [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) ・ [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Material Design 3: [Layout](https://m3.material.io/foundations/layout) ・ [Navigation bar](https://m3.material.io/components/navigation-bar/specs) ・ [FAB](https://m3.material.io/components/floating-action-button/specs) ・ [Lists](https://m3.material.io/components/lists/specs) ・ [Text fields](https://m3.material.io/components/text-fields/specs) ・ [Bottom sheets](https://m3.material.io/components/bottom-sheets/guidelines) ・ [Snackbar](https://m3.material.io/components/snackbar/specs) ・ [Type scale](https://m3.material.io/styles/typography/type-scale-tokens)
- 補助解説: [iOS Design Guidelines & Templates (learnui.design)](https://www.learnui.design/blog/ios-design-guidelines-templates.html) ・ [Android Font Size Guidelines](https://www.learnui.design/blog/android-material-design-font-size-guidelines.html) ・ [iOS Tab Bar 寸法ミラー](https://codershigh.github.io/guidelines/ios/human-interface-guidelines/ui-bars/tab-bars/index.html)
