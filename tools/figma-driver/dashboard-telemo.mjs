// TELEMO ダッシュボードを after-dash.png（紫テーマ）に寄せてネイティブ再現するデモ。
// 画像から読み取った配色・構造を、全て編集可能なレイヤーで再構築する。
import { clear, frame, text, exportPng, zoomFit } from './fig.mjs';
import { sidebar, statCard, actionBar, button, table, sectionHeader, avatar } from './components.mjs';
import { c, ramp } from './tokens.mjs';

const V = ramp.violet[600];      // #7c3aed ブランド（紫）
const VD = ramp.violet[700];     // 濃い紫（グラデ終点）
const NAV = '#1e1b4b';           // ダーク藍のサイドバー地色

const W = 1040, H = 700, mainX = 128;
await clear();

const root = await frame({ name: 'TELEMO-Dashboard', x: 0, y: 0, width: W, height: H, fills: c.bg, clip: true });

// サイドバー（藍地・紫アクティブ）
await sidebar({ parentId: root, x: 0, y: 0, height: H, navFill: NAV, accent: V, logo: 'T',
  items: ['ホーム', 'チェック', '企業', '予定'], active: 0 });

// トップバー
await text({ parentId: root, x: mainX, y: 30, characters: 'ダッシュボード', fontName: { family: 'Inter', style: 'Bold' }, fontSize: 22, fills: c.ink });
await text({ parentId: root, x: 872, y: 34, width: 96, align: 'RIGHT', characters: '代理店A', fontName: { family: 'Noto Sans JP', style: 'Medium' }, fontSize: 13, fills: c.sub });
await avatar({ parentId: root, x: 980, y: 28, size: 36, label: 'A', fills: V, ink: c.white });

// 挨拶
await text({ parentId: root, x: mainX, y: 78, characters: 'こんにちは、代理店Aさん', fontName: { family: 'Noto Sans JP', style: 'Bold' }, fontSize: 16, fills: c.ink });
await text({ parentId: root, x: mainX, y: 104, characters: '営業の前に、まず重複チェックをしましょう。', fontName: { family: 'Noto Sans JP', style: 'Regular' }, fontSize: 13, fills: c.sub });

// KPI 3枚（数字を色分け・スパークラインなしのミニマル）
const kY = 140;
await statCard({ parentId: root, x: mainX,       y: kY, width: 280, label: '登録企業', value: '3', valueColor: ramp.blue[600],  numberFirst: true, spark: false });
await statCard({ parentId: root, x: mainX + 296, y: kY, width: 280, label: '成約',     value: '1', valueColor: ramp.green[600], numberFirst: true, spark: false });
await statCard({ parentId: root, x: mainX + 592, y: kY, width: 280, label: '提案予定', value: '2', valueColor: ramp.red[600],   numberFirst: true, spark: false });

// アクション（紫グラデの実行導線＋白枠のサブ操作）
const aY = 268;
await actionBar({ parentId: root, x: mainX, y: aY, width: 540, variant: 'solid', accent: V,
  gradient: { gradient: 'linear', angle: 135, stops: [{ color: V, pos: 0 }, { color: VD, pos: 1 }] },
  title: '重複チェック', sub: '他社と被っていないか確認' });
await button({ parentId: root, x: mainX + 556, y: aY + 8, width: 300, height: 72, label: '＋ 商談を登録', variant: 'secondary' });

// 登録企業テーブル（白カード・全幅）
const tY = 372;
const tCard = await frame({ name: 'card', parentId: root, x: mainX, y: tY, width: 872, height: 288, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, layoutMode: 'VERTICAL', itemSpacing: 16, padding: 24 });
await sectionHeader({ parentId: tCard, title: '登録企業', link: 'すべて見る' });
await table({
  parentId: tCard,
  columns: [
    { key: 'name', label: '企業名',   w: 320, align: 'LEFT' },
    { key: 'date', label: '商談日',   w: 260, align: 'LEFT' },
    { key: 'stat', label: 'ステータス', w: 220, align: 'LEFT' },
  ],
  rows: [
    { name: 'テレモ',   date: '2026/06/12', stat: { pill: '成約',   tone: 'ok' } },
    { name: 'ウチダ',   date: '2026/05/30', stat: { pill: '商談',   tone: 'warn' } },
    { name: 'ヤマト',   date: '2026/07/01', stat: { pill: '検討中', tone: 'warn' } },
  ],
});

await zoomFit();
console.log('export:', JSON.stringify(await exportPng(root, 'tmp/dashboard-telemo.png', 2)));
