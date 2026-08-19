# Design Driver — 「Figma版Playwright」自作ツール

AI（私）が**外部からコマンドを送ってFigmaを駆動し、ネイティブで編集可能なレイヤーを自動生成する**ツール。
公式の **Figma Plugin API（無料）** を正規の入口として使う。有料の非公式MCP（画像非対応・ベータ）は不採用。

> このリポジトリは `figma_自動化/` として独立させた版（旧: `営業重複管理ツール/tools/figma-driver`）。
> プロジェクトルート = `figma_自動化/`（`tools/figma-driver/` の2つ上）。`server.mjs` の保存先ルートもここ。

## 初回セットアップ（独立版で必須）

mock検証は `playwright` に依存する。独立プロジェクトなので最初に1回だけ：

```bash
cd figma_自動化
npm install                       # playwright を入れる（package.json 済み）
npx playwright install chromium   # 描画用ブラウザ本体
```

npm scripts も用意済み：`npm run bridge` / `npm run img` / `npm run mock` / `npm run smoke` / `npm run health`。

---

## なぜ Playwright ではダメなのか（設計の前提）

- **普通のWeb** … ボタン等が HTML の「部品」として存在 → Playwright が掴んでクリックできる。
- **Figma** … 編集画面は **WebGL（＝1枚の絵）** で描かれ、四角やテキストは「絵の中の模様」。掴む取っ手が無い。
  座標クリックはズーム/スクロールで即崩壊 → **壊れやすくてイライラする作りになる**。
- **正しい入口 = 公式プラグインAPI（"裏口"）**。図形を「絵」ではなく「データ」として作成・編集する正規の命令窓口。
  → このツールはその窓口に外から命令を送るので**壊れない**。

## 生成物は編集できるか？

| 出し方 | Figma上の正体 | 編集 |
|---|---|---|
| `code.js` の部品コマンド（frame/text/rect/arrow/kpiCard/button 等） | **ネイティブ・レイヤー** | ✅ 文字打替・色・移動・サイズ全部OK |
| `placeImage`（スクショ配置） | ただの画像1枚 | ❌ 不可（絵として貼るだけ） |

→ **本命は「画面も画像でなく部品から組む」こと**。そうすれば全部編集可能になる（残TODO参照）。

---

## アーキテクチャ

```
  ┌──────────────┐   POST /cmd        ┌──────────────┐   GET /next (long-poll)   ┌───────────────┐
  │ Controller   │ ───────────────▶   │ server.mjs   │ ◀───────────────────────  │ Figmaプラグイン │
  │ (私 / fig.mjs)│                    │ bridge :3055 │                            │ ui.html+code.js│
  │              │ ◀───────────────   │ [queue]      │ ── POST /result|/save ──▶  │ (公式API実行)  │
  └──────────────┘   結果/PNG保存      └──────────────┘                            └───────────────┘
```

- WebSocket不要（HTTP long-poll）。プラグインが `/next` を長ポーリングして命令を取りに来る。
- **重要**：`server.mjs` はコマンドの `id` をそのまま相関キーに使う（`{...body, id}`。body側idで上書きしない）。過去にここでバグった。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `server.mjs` | HTTPブリッジ（`localhost:3055`）。`/cmd` 投入 / `/next` long-poll / `/result` / `/save`（export保存）/ `/health` |
| `code.js` | **Figmaプラグイン本体**。公式APIを実行。23コマンド（下記一覧） |
| `ui.html` | プラグインUI。`/next` を long-poll → main へ postMessage → 結果を `/result`・`/save` へ返す |
| `fig.mjs` | **コントローラSDK**（私が叩く側）。`send/frame/rect/text/arrow/image/exportPng` 等。id自動採番 |
| `tokens.mjs` | デザイントークン（青 #2563eb、8pxグリッド、radius、type scale、shadow） |
| `components.mjs` | SaaS部品：`sidebar / kpiCard / button / pill / card` |
| `mock-figma.mjs` | **検証用の偽プラグイン**。本物Figma無しで全経路を実行し Playwright で実PNG化。**本物と同時起動しない** |
| `smoke.mjs` | 疎通テスト（ping→図形→グラデ→部品→画像→矢印→export） |
| `manifest.json` | プラグイン定義（`editorType:[figma,figjam]`、`networkAccess:*`） |

---

## 起動手順

### A) 検証モード（本物Figma不要・すぐ動く）

```bash
cd tools/figma-driver

# 1) ブリッジ起動（ターミナル1）
node server.mjs                       # → [design-driver] bridge on http://localhost:3055

# 2) 画像サーバ起動（ターミナル2）※smokeが localhost:8123 の画像を配置するため
cd ../../ && python3 -m http.server 8123

# 3) 偽プラグイン起動（ターミナル3）
cd tools/figma-driver && node mock-figma.mjs   # → [mock] connected to bridge

# 4) 疎通テスト実行（ターミナル4）
node smoke.mjs                        # → tmp/dd-smoke.png が生成される
open ../../tmp/dd-smoke.png           # 目視で「配管が通っている」ことを確認
```

### B) 本番モード（本物Figmaに描く）※ユーザーしかできない関門

```bash
cd tools/figma-driver && node server.mjs   # ブリッジ起動（mockは起動しない！）
```

Figmaデスクトップアプリで：
1. メニュー `≡` → **Plugins** → **Development** → **Import plugin from manifest…**
2. `tools/figma-driver/manifest.json` を選ぶ
3. `≡` → Plugins → Development → **Design Driver** を実行
4. プラグインUIが「**接続済み（緑）**」になればOK
5. あとは `node smoke.mjs` 等を叩くと**本物のFigmaキャンバスにネイティブレイヤーが生成される**

> ⚠️ mock と本物プラグインは**同時に起動しない**（両方が `/next` を奪い合う）。

---

## コマンド一覧（`code.js`）

`ping / clearPage / createFrame / createRect / createEllipse / createText / createArrow / createSvg /
placeImageBytes / group / frameGroup / clone / toComponent / instance / update / setEffects /
appendTo / move / resize / getInfo / select / createPage / zoomFit / deleteNode / setText / batch`

SDK（`fig.mjs`）の例：
```js
import { ping, clear, frame, text, rect, arrow, image, exportPng } from './fig.mjs';
import { sidebar, kpiCard, button, pill } from './components.mjs';

await ping();
await clear();
const id = await frame({ x:0, y:0, width:960, layoutMode:'VERTICAL', padding:24, itemSpacing:16 });
await text({ parentId:id, characters:'ダッシュボード', fontSize:24, fills:'#111827' });
await kpiCard({ parentId:id, label:'登録企業', value:'3', delta:'▲ +12%' });
await exportPng(undefined, 'tmp/out.png', 2);   // 2倍解像度でPNG保存
```

---

## 現状（2026-08-19）

- ✅ **配管は全経路が動作証明済み**（mock経由：ping→図形→グラデ→オートレイアウト部品→画像配置→矢印→export往復 → `tmp/dd-smoke.png`）。
- ⚠️ **本物Figmaでの実行は未実施**（上記B手順の初回読み込みが唯一の関門・ユーザー操作）。
- ❌ ダッシュボード等の画面は現状「PNG画像を配置」で編集不可。

## 残TODO（引き継ぎ先で続けること）

1. **本物プラグインを1回読み込む**（B手順）→ ネイティブ生成＆編集可能を目視確認。
2. **全コマンドの網羅テスト**を書く（clone/component/instance/update/setText/deleteNode/setEffects を assert）。
3. **本命**：ダッシュボード等を `placeImage` でなく `components.mjs` の部品から**ネイティブ再構築** → 全レイヤー編集可能に。
4. `components.mjs` の部品拡充（表・入力欄・ヘッダー・モーダル等）。

## トラブルシュート

- **`EADDRINUSE :3055`** … 古いサーバが残存 → `lsof -ti tcp:3055 | xargs kill -9`
- **`timeout waiting for plugin`** … プラグイン（or mock）が起動していない/接続が切れている。`curl localhost:3055/health` で `pluginConnected` を確認。
- **`@supabase/...` 等 module not found** … スクリプトはプロジェクト内から実行する（node_modules解決のため）。
- **macOSに `timeout` コマンドは無い** … ラッパーを使わず直接 node を叩く（server側に120秒タイムアウトあり）。
- **"court" が混入して tool call が壊れる**（私の癖）… 無関係。気にしなくてよい。
