// 営業重複管理ツール — UI改修 Before/After ボード（まず「運営管理画面」で品質基準を提示）
import { clear, frame, text, arrow, exportPng, zoomFit } from './fig.mjs';
import { sidebar, table, pill, button, input, icon, avatar } from './components.mjs';
import { c, ramp, font, jp, shadow } from './tokens.mjs';

const V = ramp.violet[600], VD = ramp.violet[700], NAV = ramp.gray[900]; // #0f172a
await clear();

// ボード土台
const BW = 2020, BH = 900;
const root = await frame({ name: 'UI改修-運営管理画面', x: 0, y: 0, width: BW, height: BH, fills: ramp.gray[100], clip: true });
await text({ parentId: root, x: 48, y: 36, characters: '営業重複管理ツール — UI改修', fontName: font('Bold'), fontSize: 28, fills: c.ink });
await text({ parentId: root, x: 48, y: 74, characters: '運営管理画面（/admin）  Before / After', fontName: jp('Medium'), fontSize: 15, fills: c.sub });

/* ================= BEFORE（現行の忠実再現） ================= */
const bx = 48, by = 130, bW = 820, bH = 700;
await text({ parentId: root, x: bx, y: by - 30, characters: 'BEFORE — 現行', fontName: jp('Bold'), fontSize: 14, fills: c.sub });
const before = await frame({ name: 'before', parentId: root, x: bx, y: by, width: bW, height: bH, cornerRadius: 12, fills: '#f8fafc', strokes: ramp.gray[300], strokeWeight: 1, clip: true, effects: shadow.md });
// 紺ヘッダー
const bhd = await frame({ parentId: before, x: 0, y: 0, width: bW, height: 52, fills: '#1e3a5f' });
await text({ parentId: bhd, x: 20, y: 16, characters: '営業重複管理ツール', fontName: jp('Bold'), fontSize: 16, fills: c.white });
await text({ parentId: before, x: bW - 230, y: 18, characters: '運営本部（運営本部）', fontName: jp('Regular'), fontSize: 12, fills: '#cbd5e1' });
await frame({ parentId: before, x: bW - 96, y: 12, width: 76, height: 28, cornerRadius: 6, fills: '#33507a' });
await text({ parentId: before, x: bW - 88, y: 18, characters: 'ログアウト', fontName: jp('Regular'), fontSize: 11, fills: c.white });
// リンク・見出し
await text({ parentId: before, x: 24, y: 74, characters: '代理店アカウント管理 →   提案予定の一覧 →', fontName: jp('Regular'), fontSize: 12, fills: '#2563eb' });
await text({ parentId: before, x: 24, y: 100, characters: '運営管理画面（全133件）', fontName: jp('Bold'), fontSize: 20, fills: '#1e293b' });
await frame({ parentId: before, x: bW - 210, y: 98, width: 186, height: 36, cornerRadius: 6, fills: '#1e3a5f' });
await text({ parentId: before, x: bW - 190, y: 108, characters: '＋ 過去の企業を登録', fontName: jp('Bold'), fontSize: 12, fills: c.white });
// 素のテーブル
const bcols = ['企業名', '電話番号', '代表者', '商談日', 'ステータス', '納品', '担当代理店', '提案', '操作'];
const bcw = [150, 110, 90, 90, 96, 60, 96, 44, 60];
const bthead = await frame({ parentId: before, x: 24, y: 150, width: bW - 48, height: 34, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', fills: [] });
for (let i = 0; i < bcols.length; i++) await text({ parentId: bthead, width: bcw[i], characters: bcols[i], fontName: jp('Bold'), fontSize: 11, fills: '#334155' });
const bdata = [
  ['カブシキガイシャアミックス', '0336762881', '', '2026-08-17', '検討中', '未着手', 'TELEMO直営', 'NG'],
  ['エコライフジャパン', '0864410505', 'シマダ', '2026-08-10', 'トークツリー', '未着手', 'TELEMO直営', 'NG'],
  ['アップデートHD', '', '', '2026-08-10', '検討中', '未着手', 'ラスワン', 'NG'],
  ['カラフルライン', '0120-955-878', '', '2026-08-06', '検討中', '未着手', 'ラスワン', 'NG'],
  ['ヤマガタヤ', '0523313588', 'ヨシダ', '2026-07-30', '失注', '未着手', 'TELEMO直営', 'OK'],
  ['ユトミ', '03-5846-9355', 'トミナガ', '2026-07-26', '成約', '未着手', 'ライト通信', 'NG'],
];
let by2 = 190;
for (const rrow of bdata) {
  await frame({ parentId: before, x: 24, y: by2, width: bW - 48, height: 1, fills: ramp.gray[200] });
  const rr = await frame({ parentId: before, x: 24, y: by2 + 1, width: bW - 48, height: 42, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', fills: [] });
  for (let i = 0; i < 4; i++) await text({ parentId: rr, width: bcw[i], characters: rrow[i] || '—', fontName: jp('Regular'), fontSize: 11, fills: '#334155' });
  // status/納品 as bordered "select" look
  for (let i = 4; i <= 5; i++) { const cell = await frame({ parentId: rr, width: bcw[i], height: 42, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', fills: [] }); await frame({ parentId: cell, width: bcw[i] - 8, height: 26, cornerRadius: 4, fills: c.white, strokes: ramp.gray[300], strokeWeight: 1, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 6 }); }
  await text({ parentId: rr, width: bcw[6], characters: rrow[6], fontName: jp('Regular'), fontSize: 11, fills: '#334155' });
  const pcell = await frame({ parentId: rr, width: bcw[7], height: 42, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', fills: [] });
  await frame({ parentId: pcell, width: 30, height: 20, cornerRadius: 4, fills: rrow[7] === 'OK' ? '#dcfce7' : '#fee2e2', layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
  await text({ parentId: rr, width: bcw[8], characters: '編集 削除', fontName: jp('Regular'), fontSize: 11, fills: '#2563eb' });
  by2 += 43;
}

/* ================= 矢印 ================= */
await arrow({ parentId: root, x: bx + bW + 30, y: by + bH / 2 - 20, length: 90, stroke: V, strokeWeight: 5 });
await text({ parentId: root, x: bx + bW + 34, y: by + bH / 2 - 44, characters: '改修', fontName: jp('Bold'), fontSize: 14, fills: V });

/* ================= AFTER（改修案） ================= */
const ax = bx + bW + 160, ay = 130, aW = 1060, aH = 700;
await text({ parentId: root, x: ax, y: ay - 30, characters: 'AFTER — 改修案', fontName: jp('Bold'), fontSize: 14, fills: V });
const after = await frame({ name: 'after', parentId: root, x: ax, y: ay, width: aW, height: aH, cornerRadius: 16, fills: ramp.gray[50], strokes: ramp.gray[200], strokeWeight: 1, clip: true, effects: shadow.lg });
// サイドバー
await sidebar({ parentId: after, x: 0, y: 0, width: 92, height: aH, navFill: NAV, accent: V, logo: 'T',
  items: [{ label: '企業', icon: 'building' }, { label: '代理店', icon: 'users' }, { label: '提案', icon: 'calendar' }, { label: '登録', icon: 'plus' }, { label: '設定', icon: 'settings' }], active: 0 });
const mx = 108;
// トップバー
await text({ parentId: after, x: mx, y: 26, characters: '運営管理画面', fontName: font('Bold'), fontSize: 20, fills: c.ink });
await text({ parentId: after, x: mx, y: 54, characters: '登録企業 全133件', fontName: jp('Regular'), fontSize: 12, fills: c.sub });
await input({ parentId: after, x: aW - 470, y: 24, width: 210, icon: '🔍', placeholder: '企業名で検索…' });
const addBtn = await frame({ parentId: after, x: aW - 244, y: 24, width: 180, height: 40, cornerRadius: 9, fills: V, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', itemSpacing: 6, effects: shadow.sm });
await icon({ parentId: addBtn, name: 'plus', size: 16, color: c.white });
await text({ parentId: addBtn, characters: '過去の企業を登録', fontName: jp('Bold'), fontSize: 13, fills: c.white });
await frame({ parentId: after, x: mx, y: 78, width: aW - mx - 24, height: 1, fills: c.line });

// ステータス別サマリー（白カード・絶対配置でラベルと数値の左端を厳密に揃える。色ドットは右上）
const sums = [['全件', '133', null], ['提案可能', '38', ramp.green[500]], ['商談中', '52', ramp.blue[500]], ['検討中', '43', ramp.amber[500]]];
const chipW = 150, padX = 18;
let sx = mx;
for (const [lb, vl, dot] of sums) {
  const chip = await frame({ parentId: after, x: sx, y: 96, width: chipW, height: 66, cornerRadius: 12, fills: c.surface, strokes: c.border, strokeWeight: 1 });
  await text({ parentId: chip, x: padX, y: 16, characters: lb, fontName: jp('Medium'), fontSize: 12, fills: c.sub });
  await text({ parentId: chip, x: padX, y: 34, characters: vl, fontName: font('Bold'), fontSize: 22, fills: c.ink });
  if (dot) await frame({ parentId: chip, x: chipW - padX - 8, y: 18, width: 8, height: 8, cornerRadius: 999, fills: dot });
  sx += chipW + 12;
}

// テーブルカード
const tcard = await frame({ parentId: after, x: mx, y: 176, width: aW - mx - 24, height: aH - 200, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 8, padding: 20 });
await table({
  parentId: tcard,
  columns: [
    { key: 'name', label: '企業名', w: 210, align: 'LEFT' },
    { key: 'tel', label: '電話番号', w: 140, align: 'LEFT' },
    { key: 'date', label: '商談日', w: 120, align: 'LEFT' },
    { key: 'stat', label: 'ステータス', w: 130, align: 'LEFT' },
    { key: 'agency', label: '担当代理店', w: 140, align: 'LEFT' },
    { key: 'ok', label: '提案可否', w: 108, align: 'LEFT' },
  ],
  rows: [
    { name: 'アミックス', tel: '03-3676-2881', date: '2026-08-17', stat: { pill: '検討中', tone: 'warn', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'NG', tone: 'ng' } },
    { name: 'エコライフジャパン', tel: '086-441-0505', date: '2026-08-10', stat: { pill: '商談中', tone: 'info', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'NG', tone: 'ng' } },
    { name: 'カラフルライン', tel: '0120-955-878', date: '2026-08-06', stat: { pill: '検討中', tone: 'warn', dot: true, subtle: true }, agency: 'ラスワン', ok: { pill: 'NG', tone: 'ng' } },
    { name: 'ヤマガタヤ', tel: '052-331-3588', date: '2026-07-30', stat: { pill: '失注', tone: 'neutral', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'OK', tone: 'ok' } },
    { name: 'ユトミ', tel: '03-5846-9355', date: '2026-07-26', stat: { pill: '成約', tone: 'ok', dot: true, subtle: true }, agency: 'ライト通信', ok: { pill: 'NG', tone: 'ng' } },
    { name: 'キズナHD', tel: '03-5843-7092', date: '2026-07-27', stat: { pill: '商談中', tone: 'info', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'NG', tone: 'ng' } },
  ],
});

await zoomFit();
console.log('export:', JSON.stringify(await exportPng(root, 'tmp/redesign-board.png', 1)));
