// 営業重複管理ツール — ダッシュボード（紫テーマ・構成バランス改善版）
// 下段を「テーブル(左) + ステータス構成ドーナツ(右)」の2カラムにして空白を解消。
import { clear, frame, text, exportPng, zoomFit } from './fig.mjs';
import { sidebar, actionBar, button, table, sectionHeader, avatar, input, icon, donutChart, legendItem } from './components.mjs';
import { c, ramp, font, jp, shadow } from './tokens.mjs';

const V = ramp.violet[600], VD = ramp.violet[700], NAV = '#1e1b4b';
const W = 1200, H = 812, mainX = 120, contentR = W - 40; // 右端
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
await input({ parentId: root, x: contentR - 400, y: 26, width: 240, icon: '🔍', placeholder: '企業名で検索…' });
const bell = await frame({ parentId: root, x: contentR - 144, y: 26, width: 40, height: 40, cornerRadius: 10, fills: c.surface, strokes: c.border, strokeWeight: 1, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
await icon({ parentId: bell, name: 'bell', size: 20, color: c.sub });
await avatar({ parentId: root, x: contentR - 88, y: 26, size: 40, label: 'A', fills: V, ink: c.white });
await text({ parentId: root, x: contentR - 44, y: 36, characters: '代理店A', fontName: jp('Medium'), fontSize: 13, fills: c.body });
await frame({ parentId: root, x: mainX, y: 84, width: contentR - mainX, height: 1, fills: c.line });

// 挨拶
await text({ parentId: root, x: mainX, y: 104, characters: 'こんにちは、代理店Aさん', fontName: jp('Bold'), fontSize: 17, fills: c.ink });
await text({ parentId: root, x: mainX, y: 132, characters: '営業の前に、まず重複チェックをしましょう。', fontName: jp('Regular'), fontSize: 13, fills: c.sub });

// KPIカード（アイコンチップ＋色分け数値＋増減）
const kY = 172, kW = 336, kGap = 16;
async function kpi(x, o) {
  const card = await frame({ name: 'kpi', parentId: root, x, y: kY, width: kW, height: 124, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
  const chip = await frame({ parentId: card, x: kW - 24 - 44, y: 22, width: 44, height: 44, cornerRadius: 12, fills: o.chipBg, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
  await icon({ parentId: chip, name: o.icon, size: 22, color: o.chipFg });
  await text({ parentId: card, x: 24, y: 26, characters: o.label, fontName: jp('Medium'), fontSize: 13, fills: c.sub });
  await text({ parentId: card, x: 24, y: 46, characters: String(o.value), fontName: font('Bold'), fontSize: 36, fills: o.valueColor });
  await text({ parentId: card, x: 24, y: 94, characters: o.delta, fontName: jp('Medium'), fontSize: 12, fills: o.down ? c.ng : c.ok });
  return card;
}
await kpi(mainX,               { label: '登録企業', value: 3, valueColor: ramp.blue[600],  icon: 'building', chipBg: c.brand050, chipFg: ramp.blue[600],  delta: '▲ +12% 先月比' });
await kpi(mainX + (kW + kGap), { label: '成約',     value: 1, valueColor: ramp.green[600], icon: 'check',    chipBg: c.okBg,     chipFg: ramp.green[600], delta: '±0 先月比' });
await kpi(mainX + 2 * (kW + kGap), { label: '提案予定', value: 2, valueColor: ramp.red[600], icon: 'calendar', chipBg: c.ngBg, chipFg: ramp.red[600], delta: '▲ +2 今週' });

// アクション（紫グラデCTA＋白枠サブ）
const aY = 320;
await actionBar({ parentId: root, x: mainX, y: aY, width: 704, height: 76, variant: 'solid', accent: V,
  gradient: { gradient: 'linear', angle: 135, stops: [{ color: V, pos: 0 }, { color: VD, pos: 1 }] },
  iconName: 'search', title: '重複チェックを実行', sub: '企業名を入力して、他社と重複していないか即チェック' });
await button({ parentId: root, x: mainX + 720, y: aY + 14, width: 320, height: 48, label: '＋ 商談を登録', variant: 'secondary' });

// ===== 下段：テーブル(左) + ステータス構成(右) の2カラム =====
const bY = 420, bH = 360, tW = 680, gap = 24, pW = contentR - mainX - tW - gap; // 右パネル幅

// 左：登録企業テーブル
const tCard = await frame({ name: 'tableCard', parentId: root, x: mainX, y: bY, width: tW, height: bH, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 16, padding: 24 });
await sectionHeader({ parentId: tCard, title: '登録企業', link: 'すべて見る →' });
await table({
  parentId: tCard,
  columns: [
    { key: 'name', label: '企業名',     w: 210, align: 'LEFT' },
    { key: 'date', label: '最終接触',   w: 160, align: 'LEFT' },
    { key: 'stat', label: 'ステータス', w: 262, align: 'LEFT' },
  ],
  rows: [
    { name: 'テレビ東京', date: '2026/06/12', stat: { pill: '成約',   tone: 'ok',      dot: true } },
    { name: 'ウチダ商事', date: '2026/05/30', stat: { pill: '商談中', tone: 'info',    dot: true } },
    { name: 'ヤマト物流', date: '2026/07/01', stat: { pill: '検討中', tone: 'warn',    dot: true } },
    { name: 'サクラ製菓', date: '2026/07/08', stat: { pill: '未接触', tone: 'neutral', dot: true } },
    { name: 'ミドリ建設', date: '2026/06/25', stat: { pill: '提案済', tone: 'brand',   dot: true } },
  ],
});

// 右：ステータス構成（ドーナツ＋凡例）
const pCard = await frame({ name: 'statusCard', parentId: root, x: mainX + tW + gap, y: bY, width: pW, height: bH, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 20, padding: 24, counterAlign: 'CENTER' });
await text({ parentId: pCard, width: pW - 48, characters: 'ステータス構成', fontName: jp('Bold'), fontSize: 15, fills: c.ink });
await donutChart({ parentId: pCard, size: 150, thickness: 24, value: '5', caption: '登録企業',
  segments: [
    { value: 1, color: ramp.green[500] }, { value: 1, color: ramp.blue[500] },
    { value: 1, color: ramp.amber[500] }, { value: 1, color: ramp.gray[300] },
    { value: 1, color: ramp.violet[500] },
  ] });
const legend = await frame({ parentId: pCard, layoutMode: 'VERTICAL', itemSpacing: 10, fills: [] });
await legendItem({ parentId: legend, color: ramp.green[500],  label: '成約　　1' });
await legendItem({ parentId: legend, color: ramp.blue[500],   label: '商談中　1' });
await legendItem({ parentId: legend, color: ramp.amber[500],  label: '検討中　1' });
await legendItem({ parentId: legend, color: ramp.gray[300],   label: '未接触　1' });
await legendItem({ parentId: legend, color: ramp.violet[500], label: '提案済　1' });

await zoomFit();
console.log('export:', JSON.stringify(await exportPng(root, 'tmp/dashboard-eigyo.png', 2)));
