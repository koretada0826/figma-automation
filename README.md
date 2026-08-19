# figma-automation — 「Figma版Playwright」自作ツール

AIが外部からコマンドを送って **Figma を駆動し、編集可能なネイティブレイヤーを自動生成** するツール。
公式の Figma Plugin API を正規の入口として使う（座標クリックに頼らないので壊れない）。

- 生成物は **画像ではなく本物のレイヤー**（文字・色・サイズすべて編集可能）。
- 同じコマンド＝毎回同じ結果（再現性）。デザイントークン／部品に厳密準拠。
- 本体・詳細は [`tools/figma-driver/README.md`](tools/figma-driver/README.md) を参照。

## クイックスタート（検証モード）

```bash
npm install && npx playwright install chromium   # 初回のみ
npm run bridge   # :3055 ブリッジ
npm run img      # :8123 画像サーバ（別ターミナル）
npm run mock     # 偽Figma（別ターミナル）
npm run smoke    # 疎通テスト → tmp/dd-smoke.png
```

## 本番モード（本物Figmaに描く）

1. `npm run bridge`（mockは起動しない）
2. Figmaデスクトップ → Plugins → Development → Import plugin from manifest → `tools/figma-driver/manifest.json`
3. プラグイン「Design Driver」を実行 → 緑「接続済み」
4. `node tools/figma-driver/dashboard.mjs` 等で本物キャンバスにネイティブ生成

## 構成

| ファイル | 役割 |
|---|---|
| `tools/figma-driver/server.mjs` | HTTPブリッジ（long-poll） |
| `tools/figma-driver/code.js` | Figmaプラグイン本体（公式API実行・23コマンド） |
| `tools/figma-driver/ui.html` | プラグインUI（/next をポーリング） |
| `tools/figma-driver/fig.mjs` | コントローラSDK（send/frame/text/... ） |
| `tools/figma-driver/tokens.mjs` | デザイントークン |
| `tools/figma-driver/components.mjs` | UI部品（sidebar/statCard/table/donut/...） |
| `tools/figma-driver/dashboard.mjs` | ダッシュボードのネイティブ再構築デモ |
| `tools/figma-driver/mock-figma.mjs` | 検証用の偽プラグイン（Playwrightで実PNG化） |
| `tools/figma-driver/smoke.mjs` | 疎通テスト |
