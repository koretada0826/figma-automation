// 営業重複管理ツール — ダッシュボード（紫テーマ・作り込み版）
// アイコン・KPIアイコンチップ・情報密度・階層を強化した本命デモ。
import { clear, frame, text, exportPng, zoomFit } from './fig.mjs';
import { sidebar, actionBar, button, table, sectionHeader, avatar, input, icon } from './components.mjs';
import { c, ramp, font, jp, shadow } from './tokens.mjs';

const V = ramp.violet[600], VD = ramp.violet[700], NAV = '#1e1b4b';
const W = 1200, H = 820, mainX = 120;
await clear();
const root = await frame({ name: '営業重複管理ツール-Dashboard', x: 0, y: 0, width: W, height: H, fills: c.bg, clip: true });

// サイドバー（アイコン＋ラベル）
await sidebar({ parentId: root, x: 0, y: 0, width: 88, height: H, navFill: NAV, accent: V, logo: 'T',
  items: [
    { label: 'ホーム', icon: 'home' }, { label: 'チェック', icon: 'search' },
    { label: '企業', icon: 'building' }, { label: '予定', icon: 'calendar' },
    { label: '設定', icon: 'settings' },
  ], active: 0 });

// トップバー
await text({ parentId: root, x: mainX, y: 30, characters: 'ダッシュボード', fontName: font('Bold'), fontSize: 22, fills: c.ink });
await input({ parentId: root, x: 760, y: 26, width: 240, icon: '🔍', placeholder: '企業名で検索…' });
const bell = await frame({ parentId: root, x: 1016, y: 26, width: 40, height: 40, cornerRadius: 10, fills: c.surface, strokes: c.border, strokeWeight: 1, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
await icon({ parentId: bell, name: 'bell', size: 20, color: c.sub });
await avatar({ parentId: root, x: 1072, y: 26, size: 40, label: 'A', fills: V, ink: c.white });
await text({ parentId: root, x: 1116, y: 36, characters: '代理店A', fontName: jp('Medium'), fontSize: 13, fills: c.body });
// 区切り線
await frame({ parentId: root, x: mainX, y: 84, width: W - mainX - 40, height: 1, fills: c.line });

// 挨拶
await text({ parentId: root, x: mainX, y: 104, characters: 'こんにちは、代理店Aさん', fontName: jp('Bold'), fontSize: 17, fills: c.ink });
await text({ parentId: root, x: mainX, y: 132, characters: '営業の前に、まず重複チェックをしましょう。', fontName: jp('Regular'), fontSize: 13, fills: c.sub });

// KPIカード（アイコンチップ＋色分け数値＋増減）
const kY = 172;
async function kpi(x, o) {
  const card = await frame({ name: 'kpi', parentId: root, x, y: kY, width: 336, height: 128, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
  const chip = await frame({ parentId: card, x: 336 - 24 - 44, y: 22, width: 44, height: 44, cornerRadius: 12, fills: o.chipBg, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
  await icon({ parentId: chip, name: o.icon, size: 22, color: o.chipFg });
  await text({ parentId: card, x: 24, y: 26, characters: o.label, fontName: jp('Medium'), fontSize: 13, fills: c.sub });
  await text({ parentId: card, x: 24, y: 48, characters: String(o.value), fontName: font('Bold'), fontSize: 36, fills: o.valueColor });
  await text({ parentId: card, x: 24, y: 96, characters: o.delta, fontName: jp('Medium'), fontSize: 12, fills: o.down ? c.ng : c.ok });
  return card;
}
await kpi(mainX,       { label: '登録企業', value: 3, valueColor: ramp.blue[600],  icon: 'building', chipBg: c.brand050, chipFg: ramp.blue[600],  delta: '▲ +12% 先月比' });
await kpi(mainX + 352, { label: '成約',     value: 1, valueColor: ramp.green[600], icon: 'check',    chipBg: c.okBg,     chipFg: ramp.green[600], delta: '±0 先月比', down: false });
await kpi(mainX + 704, { label: '提案予定', value: 2, valueColor: ramp.red[600],   icon: 'calendar', chipBg: c.ngBg,     chipFg: ramp.red[600],   delta: '▲ +2 今週' });

// アクション（紫グラデCTA＋白枠サブ）
const aY = 324;
await actionBar({ parentId: root, x: mainX, y: aY, width: 704, height: 76, variant: 'solid', accent: V,
  gradient: { gradient: 'linear', angle: 135, stops: [{ color: V, pos: 0 }, { color: VD, pos: 1 }] },
  iconName: 'search', title: '重複チェックを実行', sub: '企業名を入力して、他社と重複していないか即チェック' });
await button({ parentId: root, x: mainX + 720, y: aY + 14, width: 320, height: 48, label: '＋ 商談を登録', variant: 'secondary' });

// 登録企業テーブル（全幅・情報密度アップ）
const tY = 424;
const tCard = await frame({ name: 'card', parentId: root, x: mainX, y: tY, width: 1040, height: 356, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 14, padding: 24 });
await sectionHeader({ parentId: tCard, title: '登録企業', link: 'すべて見る →' });
await table({
  parentId: tCard,
  columns: [
    { key: 'name', label: '企業名',     w: 300, align: 'LEFT' },
    { key: 'ind',  label: '業種',       w: 180, align: 'LEFT' },
    { key: 'date', label: '最終接触',   w: 180, align: 'LEFT' },
    { key: 'rep',  label: '担当',       w: 132, align: 'LEFT' },
    { key: 'stat', label: 'ステータス', w: 200, align: 'LEFT' },
  ],
  rows: [
    { name: 'テレビ東京', ind: 'メディア', date: '2026/06/12', rep: '田中', stat: { pill: '成約',   tone: 'ok',      dot: true } },
    { name: 'ウチダ商事', ind: '商社',     date: '2026/05/30', rep: '佐藤', stat: { pill: '商談中', tone: 'info',    dot: true } },
    { name: 'ヤマト物流', ind: '物流',     date: '2026/07/01', rep: '鈴木', stat: { pill: '検討中', tone: 'warn',    dot: true } },
    { name: 'サクラ製菓', ind: '製造',     date: '2026/07/08', rep: '田中', stat: { pill: '未接触', tone: 'neutral', dot: true } },
    { name: 'ミドリ建設', ind: '建設',     date: '2026/06/25', rep: '高橋', stat: { pill: '提案済', tone: 'brand',   dot: true } },
  ],
});

await zoomFit();
console.log('export:', JSON.stringify(await exportPng(root, 'tmp/dashboard-eigyo.png', 2)));
