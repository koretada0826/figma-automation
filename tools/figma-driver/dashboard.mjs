// ダッシュボードを「画像貼り」でなく全ネイティブ部品で再構築するデモ。
// 骨格は絶対座標＋固定幅（mock/本物Figmaで同じ絵）。部品内部はオートレイアウトで編集容易。
import { clear, frame, text, arrow, exportPng, zoomFit } from './fig.mjs';
import { sidebar, statCard, actionBar, button, table, donut, legendItem, sectionHeader, input, avatar, card } from './components.mjs';
import { c } from './tokens.mjs';

const W = 1180, H = 760;
const mainX = 128;               // サイドバー(96)＋余白
await clear();

// ── ルート（アプリ背景）
const root = await frame({ name: 'Dashboard', x: 0, y: 0, width: W, height: H, fills: c.bg, clip: true });

// ── サイドバー（ネイビー・アクティブ=ホーム）
await sidebar({ parentId: root, x: 0, y: 0, height: H, items: ['ホーム', 'チェック', '企業', '予定', '設定'], active: 0 });

// ── トップバー（左:タイトル／右:検索＋アバター）
await text({ parentId: root, x: mainX, y: 28, characters: 'ダッシュボード', fontName: { family: 'Inter', style: 'Bold' }, fontSize: 22, fills: c.ink });
await text({ parentId: root, x: mainX, y: 58, characters: '2026年8月19日 月曜日', fontName: { family: 'Noto Sans JP', style: 'Regular' }, fontSize: 12, fills: c.faint });
await input({ parentId: root, x: 812, y: 30, width: 240, icon: '🔍', placeholder: '企業名で検索…' });
await avatar({ parentId: root, x: 1076, y: 32, size: 36, label: 'A' });

// ── 挨拶
await text({ parentId: root, x: mainX, y: 96, characters: 'こんにちは、代理店Aさん', fontName: { family: 'Noto Sans JP', style: 'Bold' }, fontSize: 16, fills: c.ink });
await text({ parentId: root, x: mainX, y: 120, characters: '営業前に、まず重複チェックをしましょう。', fontName: { family: 'Noto Sans JP', style: 'Regular' }, fontSize: 13, fills: c.sub });

// ── KPI 3枚（トレンド線付き）
const kpiY = 156;
await statCard({ parentId: root, x: mainX,       y: kpiY, width: 320, label: '登録企業', value: '3', delta: '▲ +12% 先月比', spark: [6, 8, 7, 11, 9, 13, 15] });
await statCard({ parentId: root, x: mainX + 336, y: kpiY, width: 320, label: '成約',     value: '1', delta: '±0 先月比', deltaTone: 'down', spark: [8, 7, 9, 6, 8, 7, 8] });
await statCard({ parentId: root, x: mainX + 672, y: kpiY, width: 320, label: '提案予定', value: '2', delta: '▲ +2 今週', spark: [4, 6, 5, 8, 7, 9, 11] });

// ── アクション導線（強調バー＋サブ操作）
const actY = 330;
await actionBar({ parentId: root, x: mainX, y: actY, width: 640, title: '重複チェックを実行', sub: '企業名を入力して、既存の商談と重複しないか確認' });
await button({ parentId: root, x: mainX + 664, y: actY + 8, width: 160, label: '商談を登録', variant: 'secondary' });

// ── 下段左：登録企業テーブル（白カード）
const botY = 410;
const tCard = await card({ parentId: root, x: mainX, y: botY, width: 640, height: 300, layoutMode: 'VERTICAL', itemSpacing: 14, padding: 20 });
await sectionHeader({ parentId: tCard, title: '登録企業', link: 'すべて見る' });
await table({
  parentId: tCard,
  columns: [
    { key: 'name', label: '企業名',   w: 200, align: 'LEFT' },
    { key: 'date', label: '検討日',   w: 160, align: 'LEFT' },
    { key: 'stat', label: 'ステータス', w: 140, align: 'LEFT' },
  ],
  rows: [
    { name: 'テレビ東京', date: '2026/06/12', stat: { pill: '成約', tone: 'ok' } },
    { name: 'ウチダ商事', date: '2026/05/30', stat: { pill: '商談中', tone: 'brand' } },
    { name: 'ヤマト物流', date: '2026/07/01', stat: { pill: '検討中', tone: 'warn' } },
  ],
});

// ── 下段右：ステータス構成（ドーナツ＋凡例）
const dCard = await card({ parentId: root, x: mainX + 664, y: botY, width: 320, height: 300, layoutMode: 'VERTICAL', itemSpacing: 16, padding: 20 });
await sectionHeader({ parentId: dCard, title: 'ステータス構成' });
const dRow = await frame({ parentId: dCard, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', itemSpacing: 20, fills: null });
await donut({ parentId: dRow, value: '3', ringColor: c.ok });
const legend = await frame({ parentId: dRow, layoutMode: 'VERTICAL', itemSpacing: 10, fills: null });
await legendItem({ parentId: legend, color: c.ok,    label: '成約 1' });
await legendItem({ parentId: legend, color: c.brand, label: '商談中 1' });
await legendItem({ parentId: legend, color: c.warn,  label: '検討中 1' });

await zoomFit();
const res = await exportPng(root, 'tmp/dashboard-native.png', 2);
console.log('export:', JSON.stringify(res));
