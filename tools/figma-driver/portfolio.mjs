// 営業重複管理ツール — UI Redesign ポートフォリオ（表紙 + 全画面Before/After + 改善ノート + 遷移フロー）
import { clear, frame, text, arrow, svg, exportPng, zoomFit } from './fig.mjs';
import { sidebar, table, input, icon, avatar, statRow } from './components.mjs';
import { c, ramp, font, jp, shadow } from './tokens.mjs';

const V = ramp.violet[600], VD = ramp.violet[700], NAV = ramp.gray[900];
const grad = { gradient: 'linear', angle: 135, stops: [{ color: V, pos: 0 }, { color: VD, pos: 1 }] };
const navyOld = '#1e3a5f';

await clear();
const BW = 2560, BH = 4980;
const root = await frame({ name: 'Portfolio-営業重複管理ツール', x: 0, y: 0, width: BW, height: BH, fills: ramp.gray[100], clip: true });

/* ===================== 表紙（カバー） ===================== */
const cover = await frame({ name: 'cover', parentId: root, x: 0, y: 0, width: BW, height: 380, fills: grad });
await text({ parentId: cover, x: 80, y: 90, characters: '営業重複管理ツール', fontName: jp('Bold'), fontSize: 22, fills: { color: '#ffffff', opacity: 0.85 } });
await text({ parentId: cover, x: 80, y: 128, characters: 'UI Redesign — Before / After', fontName: font('Bold'), fontSize: 52, fills: c.white });
await text({ parentId: cover, x: 80, y: 210, width: 1200, characters: '機能はするが古い管理画面を、情報階層・整列・ステータス可視化・一貫性の観点で再設計。', fontName: jp('Regular'), fontSize: 18, lineHeight: 28, fills: { color: '#ffffff', opacity: 0.9 } });
// 改善ポイントのチップ
const points = ['情報階層を明確化', '要素を厳密に整列', 'ステータスを可視化', 'デザインを一貫', '色数を最小化'];
let px = 80;
for (const p of points) {
  const chip = await frame({ parentId: cover, x: px, y: 280, height: 40, cornerRadius: 999, fills: { color: '#ffffff', opacity: 0.16 }, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 18, primaryAxisSizing: 'AUTO', counterAxisSizing: 'FIXED' });
  await text({ parentId: chip, characters: p, fontName: jp('Medium'), fontSize: 14, fills: c.white });
  px += p.length * 15 + 60;
}

/* ===================== 共通ヘルパー ===================== */
// セクション見出し
async function sectionTitle(x, y, num, name, note) {
  await text({ parentId: root, x, y, characters: num, fontName: font('Bold'), fontSize: 15, fills: V });
  await text({ parentId: root, x: x + 44, y: y - 4, characters: name, fontName: jp('Bold'), fontSize: 22, fills: c.ink });
  if (note) await text({ parentId: root, x: x + 44, y: y + 26, width: 900, characters: '改善: ' + note, fontName: jp('Regular'), fontSize: 14, fills: c.sub });
}
async function tag(parent, x, y, label, dark) {
  const t = await frame({ parentId: parent, x, y, height: 26, cornerRadius: 6, fills: dark ? ramp.gray[700] : ramp.gray[200], layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 10, primaryAxisSizing: 'AUTO', counterAxisSizing: 'FIXED' });
  await text({ parentId: t, characters: label, fontName: jp('Bold'), fontSize: 12, fills: dark ? c.white : c.body });
}
// Before: 紺ヘッダーの素画面
async function beforeShell(x, y, w, h, title, links, btn) {
  const s = await frame({ name: 'before', parentId: root, x, y, width: w, height: h, cornerRadius: 12, fills: '#f8fafc', strokes: ramp.gray[300], strokeWeight: 1, clip: true, effects: shadow.md });
  const hd = await frame({ parentId: s, x: 0, y: 0, width: w, height: 46, fills: navyOld });
  await text({ parentId: hd, x: 18, y: 14, characters: '営業重複管理ツール', fontName: jp('Bold'), fontSize: 14, fills: c.white });
  await text({ parentId: s, x: w - 90, y: 15, characters: 'ログアウト', fontName: jp('Regular'), fontSize: 11, fills: '#cbd5e1' });
  let cy = 64;
  if (links) { await text({ parentId: s, x: 20, y: cy, characters: links, fontName: jp('Regular'), fontSize: 11, fills: '#2563eb' }); cy += 24; }
  await text({ parentId: s, x: 20, y: cy, characters: title, fontName: jp('Bold'), fontSize: 18, fills: '#1e293b' });
  if (btn) { await frame({ parentId: s, x: w - 180, y: cy - 4, width: 160, height: 32, cornerRadius: 6, fills: navyOld }); await text({ parentId: s, x: w - 165, y: cy + 4, characters: btn, fontName: jp('Bold'), fontSize: 11, fills: c.white }); }
  return { s, top: cy + 34 };
}
const ADMIN_NAV = [{ label: '企業', icon: 'building' }, { label: '代理店', icon: 'users' }, { label: '提案', icon: 'calendar' }, { label: '登録', icon: 'plus' }, { label: '設定', icon: 'settings' }];
const AGENCY_NAV = [{ label: 'ホーム', icon: 'home' }, { label: 'チェック', icon: 'search' }, { label: '企業', icon: 'building' }, { label: '予定', icon: 'calendar' }, { label: '設定', icon: 'settings' }];
// After: サイドバー付きシェル
async function afterShell(x, y, w, h, active, title, sub, navItems) {
  const s = await frame({ name: 'after', parentId: root, x, y, width: w, height: h, cornerRadius: 16, fills: ramp.gray[50], strokes: ramp.gray[200], strokeWeight: 1, clip: true, effects: shadow.lg });
  await sidebar({ parentId: s, x: 0, y: 0, width: 84, height: h, navFill: NAV, accent: V, logo: 'T', items: navItems || ADMIN_NAV, active });
  const mx = 104;
  await text({ parentId: s, x: mx, y: 22, characters: title, fontName: font('Bold'), fontSize: 18, fills: c.ink });
  if (sub) await text({ parentId: s, x: mx, y: 48, characters: sub, fontName: jp('Regular'), fontSize: 11, fills: c.sub });
  await avatar({ parentId: s, x: w - 52, y: 20, size: 32, label: 'A', fills: V, ink: c.white });
  await frame({ parentId: s, x: mx, y: 70, width: w - mx - 20, height: 1, fills: c.line });
  return { s, mx };
}
// 素テーブル（Before用）
async function plainTable(parent, x, y, w, cols, cw, rows) {
  const hd = await frame({ parentId: parent, x, y, width: w, height: 30, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', fills: [] });
  for (let i = 0; i < cols.length; i++) await text({ parentId: hd, width: cw[i], characters: cols[i], fontName: jp('Bold'), fontSize: 11, fills: '#334155' });
  let ry = y + 32;
  for (const row of rows) {
    await frame({ parentId: parent, x, y: ry, width: w, height: 1, fills: ramp.gray[200] });
    const rr = await frame({ parentId: parent, x, y: ry + 1, width: w, height: 38, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', fills: [] });
    for (let i = 0; i < cols.length; i++) await text({ parentId: rr, width: cw[i], characters: row[i] || '—', fontName: jp('Regular'), fontSize: 11, fills: '#334155' });
    ry += 39;
  }
}
// After用テーブル
async function afterTable(parent, x, y, w, h, cols, rows) {
  const card = await frame({ parentId: parent, x, y, width: w, height: h, cornerRadius: 14, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 8, padding: 18 });
  await table({ parentId: card, columns: cols, rows });
}
// フォーム項目（After）
async function field(parent, x, y, w, label, ph, req) {
  await text({ parentId: parent, x, y, characters: label + (req ? ' *' : ''), fontName: jp('Medium'), fontSize: 11, fills: req ? c.ink : c.body });
  const b = await frame({ parentId: parent, x, y: y + 20, width: w, height: 40, cornerRadius: 9, fills: c.bg, strokes: c.border, strokeWeight: 1, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 12 });
  await text({ parentId: b, characters: ph, fontName: jp('Regular'), fontSize: 13, fills: c.faint });
}
// Before/After間の矢印
async function baArrow(x, y) {
  await arrow({ parentId: root, x, y, length: 70, stroke: V, strokeWeight: 6 });
  await text({ parentId: root, x: x + 14, y: y - 26, characters: '改善', fontName: jp('Bold'), fontSize: 13, fills: V });
}

/* ===================== 01 ログイン ===================== */
let Y = 470;
await sectionTitle(80, Y, '01', 'ログイン', '価値提案を伝える左パネルを追加。入力欄の余白と階層を整理。');
Y += 70;
// Before
{ const bw = 640, bh = 380;
  await tag(root, 80, Y - 4, 'BEFORE', false);
  const s = await frame({ parentId: root, x: 80, y: Y + 30, width: bw, height: bh, cornerRadius: 12, fills: '#f8fafc', strokes: ramp.gray[300], strokeWeight: 1, clip: true, effects: shadow.md });
  await frame({ parentId: s, x: 0, y: 0, width: bw, height: 46, fills: navyOld });
  await text({ parentId: s, x: 18, y: 14, characters: '営業重複管理ツール', fontName: jp('Bold'), fontSize: 14, fills: c.white });
  const card = await frame({ parentId: s, x: 120, y: 96, width: 400, height: 230, cornerRadius: 12, fills: c.white, strokes: ramp.gray[200], strokeWeight: 1, effects: shadow.sm });
  await text({ parentId: card, x: 28, y: 26, characters: 'ログイン', fontName: jp('Bold'), fontSize: 22, fills: '#1e3a5f' });
  await frame({ parentId: card, x: 28, y: 78, width: 344, height: 40, cornerRadius: 8, fills: c.bg, strokes: ramp.gray[300], strokeWeight: 1 });
  await frame({ parentId: card, x: 28, y: 128, width: 344, height: 40, cornerRadius: 8, fills: c.bg, strokes: ramp.gray[300], strokeWeight: 1 });
  await frame({ parentId: card, x: 28, y: 182, width: 344, height: 40, cornerRadius: 8, fills: navyOld });
}
await baArrow(760, Y + 220);
// After
{ const aw = 720, ah = 380;
  await tag(root, 900, Y - 4, 'AFTER', true);
  const s = await frame({ parentId: root, x: 900, y: Y + 30, width: aw, height: ah, cornerRadius: 16, fills: c.surface, clip: true, effects: shadow.lg });
  const lp = await frame({ parentId: s, x: 0, y: 0, width: 340, height: ah, fills: grad });
  const lg = await frame({ parentId: lp, x: 32, y: 34, width: 38, height: 38, cornerRadius: 10, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', fills: c.white });
  await text({ parentId: lg, width: 38, align: 'CENTER', characters: 'T', fontName: font('Bold'), fontSize: 17, fills: V });
  await text({ parentId: lp, x: 32, y: 120, width: 280, characters: '二重営業を、\nワンチェックで防ぐ。', fontName: jp('Bold'), fontSize: 24, lineHeight: 34, fills: c.white });
  await text({ parentId: lp, x: 32, y: 220, width: 270, characters: '営業前に、他社との重複を即チェック。', fontName: jp('Regular'), fontSize: 13, fills: { color: '#ffffff', opacity: 0.85 } });
  await text({ parentId: s, x: 380, y: 54, characters: 'おかえりなさい', fontName: jp('Bold'), fontSize: 20, fills: c.ink });
  await field(s, 380, 118, 280, 'ログインID', 'admin', false);
  await field(s, 380, 190, 280, 'パスワード', '••••••', false);
  const bt = await frame({ parentId: s, x: 380, y: 274, width: 280, height: 46, cornerRadius: 9, fills: grad, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', effects: shadow.md });
  await text({ parentId: bt, width: 280, align: 'CENTER', characters: 'ログイン →', fontName: jp('Bold'), fontSize: 15, fills: c.white });
}

/* ===================== 02 運営管理画面（ハブ） ===================== */
Y += 470;
await sectionTitle(80, Y, '02', '運営管理画面（ハブ）', 'サイドバー導入・KPIサマリー・ステータスをピル化して一覧性を向上。');
Y += 70;
{ const bw = 760, bh = 420;
  await tag(root, 80, Y - 4, 'BEFORE', false);
  const { s, top } = await beforeShell(80, Y + 30, bw, bh, '運営管理画面（全133件）', '代理店アカウント管理 →  提案予定の一覧 →', '＋ 過去の企業を登録');
  await plainTable(s, 20, top, bw - 40, ['企業名', '電話番号', '商談日', 'ステータス', '担当代理店', '提案'], [150, 110, 90, 110, 110, 50],
    [['アミックス', '0336762881', '2026-08-17', '検討中', 'TELEMO直営', 'NG'], ['エコライフジャパン', '0864410505', '2026-08-10', '商談', 'TELEMO直営', 'NG'], ['ヤマガタヤ', '0523313588', '2026-07-30', '失注', 'TELEMO直営', 'OK'], ['ユトミ', '03-5846-9355', '2026-07-26', '成約', 'ライト通信', 'NG']]);
}
await baArrow(880, Y + 240);
{ const aw = 1000, ah = 420;
  await tag(root, 1020, Y - 4, 'AFTER', true);
  const { s, mx } = await afterShell(1020, Y + 30, aw, ah, 0, '運営管理画面', '登録企業 全133件');
  const addb = await frame({ parentId: s, x: aw - 200, y: 20, width: 172, height: 38, cornerRadius: 9, fills: V, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', itemSpacing: 6 });
  await icon({ parentId: addb, name: 'plus', size: 15, color: c.white });
  await text({ parentId: addb, characters: '過去の企業を登録', fontName: jp('Bold'), fontSize: 12, fills: c.white });
  await statRow({ parentId: s, x: mx, y: 86, w: 148, gap: 14, items: [
    { label: '全件', value: '133' }, { label: '提案可能', value: '38', dot: ramp.green[500] },
    { label: '商談中', value: '52', dot: ramp.blue[500] }, { label: '検討中', value: '43', dot: ramp.amber[500] }] });
  await afterTable(s, mx, 168, aw - mx - 20, ah - 188, [
    { key: 'name', label: '企業名', w: 200, align: 'LEFT' }, { key: 'tel', label: '電話番号', w: 140, align: 'LEFT' },
    { key: 'date', label: '商談日', w: 110, align: 'LEFT' }, { key: 'stat', label: 'ステータス', w: 130, align: 'LEFT' },
    { key: 'agency', label: '担当代理店', w: 130, align: 'LEFT' }, { key: 'ok', label: '提案可否', w: 100, align: 'LEFT' }],
    [{ name: 'アミックス', tel: '03-3676-2881', date: '2026-08-17', stat: { pill: '検討中', tone: 'warn', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'NG', tone: 'ng' } },
     { name: 'エコライフジャパン', tel: '086-441-0505', date: '2026-08-10', stat: { pill: '商談中', tone: 'info', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'NG', tone: 'ng' } },
     { name: 'ヤマガタヤ', tel: '052-331-3588', date: '2026-07-30', stat: { pill: '失注', tone: 'neutral', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'OK', tone: 'ok' } }]);
}

/* ===================== 03 代理店アカウント管理 ===================== */
Y += 490;
await sectionTitle(80, Y, '03', '代理店アカウント管理', '追加フォームをカード化し、権限をピルで表現。');
Y += 70;
{ const bw = 760, bh = 400;
  await tag(root, 80, Y - 4, 'BEFORE', false);
  const { s, top } = await beforeShell(80, Y + 30, bw, bh, '代理店アカウント管理（全12件）', '← 企業一覧へ戻る');
  await frame({ parentId: s, x: 20, y: top, width: bw - 40, height: 70, cornerRadius: 8, fills: c.white, strokes: ramp.gray[300], strokeWeight: 1 });
  await text({ parentId: s, x: 32, y: top + 12, characters: '名前 / ログインID / 初期パスワード / 権限  ［アカウントを追加］', fontName: jp('Regular'), fontSize: 12, fills: '#64748b' });
  await plainTable(s, 20, top + 90, bw - 40, ['名前', 'ログインID', '権限', '操作'], [200, 170, 130, 160],
    [['運営本部', 'admin', '運営本部', 'パスワード再設定'], ['サンプル代理店A', 'agency01', '販売代理店', 'パスワード再設定'], ['株式会社ライト通信', 'light-tsushin', '販売代理店', 'パスワード再設定']]);
}
await baArrow(880, Y + 230);
{ const aw = 1000, ah = 400;
  await tag(root, 1020, Y - 4, 'AFTER', true);
  const { s, mx } = await afterShell(1020, Y + 30, aw, ah, 1, '代理店アカウント管理', '全12件');
  const fc = await frame({ parentId: s, x: mx, y: 86, width: aw - mx - 20, height: 92, cornerRadius: 12, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
  await field(fc, 20, 16, 220, '名前', '株式会社◯◯代理店');
  await field(fc, 256, 16, 160, 'ログインID', 'agency13');
  await field(fc, 432, 16, 160, '初期パスワード', '8文字以上');
  const abt = await frame({ parentId: fc, x: 610, y: 36, width: 100, height: 40, cornerRadius: 9, fills: V, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
  await text({ parentId: abt, width: 100, align: 'CENTER', characters: '＋ 追加', fontName: jp('Bold'), fontSize: 12, fills: c.white });
  await afterTable(s, mx, 192, aw - mx - 20, ah - 212, [
    { key: 'name', label: '名前', w: 240, align: 'LEFT' }, { key: 'id', label: 'ログインID', w: 200, align: 'LEFT' },
    { key: 'role', label: '権限', w: 170, align: 'LEFT' }, { key: 'op', label: '操作', w: 180, align: 'LEFT' }],
    [{ name: '運営本部', id: 'admin', role: { pill: '運営本部', tone: 'brand' }, op: 'パスワード再設定' },
     { name: 'サンプル代理店A', id: 'agency01', role: { pill: '販売代理店', tone: 'neutral', subtle: true }, op: 'パスワード再設定' },
     { name: '株式会社ライト通信', id: 'light-tsushin', role: { pill: '販売代理店', tone: 'neutral', subtle: true }, op: 'パスワード再設定' }]);
}

/* ===================== 04 提案予定の一覧 ===================== */
Y += 470;
await sectionTitle(80, Y, '04', '提案予定の一覧', '余白と行間を整え、視認性の高い一覧に。');
Y += 70;
{ const bw = 760, bh = 380;
  await tag(root, 80, Y - 4, 'BEFORE', false);
  const { s, top } = await beforeShell(80, Y + 30, bw, bh, '提案予定の一覧（全215件）', '← 運営管理画面へ戻る  代理店アカウント管理 →');
  await plainTable(s, 20, top, bw - 40, ['企業名', '電話番号', '登録した代理店', '登録日'], [260, 150, 150, 110],
    [['ジャパンプロパティリンク', '0115226439', 'TELEMO直営', '2026-08-19'], ['エーワイオートチタテモノ', '0357977061', 'TELEMO直営', '2026-08-18'], ['ゴエン', '0298795683', 'TELEMO直営', '2026-08-18'], ['ギンカフェグループ', '—', 'TELEMO直営', '2026-08-17']]);
}
await baArrow(880, Y + 210);
{ const aw = 1000, ah = 380;
  await tag(root, 1020, Y - 4, 'AFTER', true);
  const { s, mx } = await afterShell(1020, Y + 30, aw, ah, 2, '提案予定の一覧', '全215件（営業権は発生しません）');
  await afterTable(s, mx, 86, aw - mx - 20, ah - 106, [
    { key: 'name', label: '企業名', w: 300, align: 'LEFT' }, { key: 'tel', label: '電話番号', w: 160, align: 'LEFT' },
    { key: 'agency', label: '登録した代理店', w: 170, align: 'LEFT' }, { key: 'date', label: '登録日', w: 130, align: 'LEFT' }],
    [{ name: 'ジャパンプロパティリンク', tel: '011-522-6439', agency: 'TELEMO直営', date: '2026-08-19' },
     { name: 'エーワイオートチタテモノ', tel: '035-797-7061', agency: 'TELEMO直営', date: '2026-08-18' },
     { name: 'ゴエン', tel: '029-879-5683', agency: 'TELEMO直営', date: '2026-08-18' },
     { name: 'ギンカフェグループ', tel: '—', agency: 'TELEMO直営', date: '2026-08-17' }]);
}

/* ===================== 05 企業を登録 ===================== */
Y += 450;
await sectionTitle(80, Y, '05', '企業を登録', '2カラム化で縦長を解消。必須を明示し入力しやすく。');
Y += 70;
{ const bw = 760, bh = 400;
  await tag(root, 80, Y - 4, 'BEFORE', false);
  const { s, top } = await beforeShell(80, Y + 30, bw, bh, '企業を登録');
  let fy = top;
  for (const lb of ['登録先の代理店（必須）', '企業名（必須・カタカナ）', '代表電話番号', '代表者名', '住所（丁目まで）']) {
    await text({ parentId: s, x: 20, y: fy, characters: lb, fontName: jp('Regular'), fontSize: 11, fills: '#334155' });
    await frame({ parentId: s, x: 20, y: fy + 18, width: bw - 40, height: 34, cornerRadius: 6, fills: c.bg, strokes: ramp.gray[300], strokeWeight: 1 });
    fy += 62;
  }
}
await baArrow(880, Y + 230);
{ const aw = 1000, ah = 400;
  await tag(root, 1020, Y - 4, 'AFTER', true);
  const { s, mx } = await afterShell(1020, Y + 30, aw, ah, 3, '企業を登録', '登録先の代理店名義でバックフィル登録');
  const fc = await frame({ parentId: s, x: mx, y: 86, width: aw - mx - 20, height: ah - 106, cornerRadius: 14, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
  await field(fc, 24, 22, 760, '登録先の代理店', '— 代理店を選んでください —', true);
  await field(fc, 24, 90, 366, '企業名（カタカナ）', '例：テレモ', true);
  await field(fc, 414, 90, 366, '代表電話番号', '03-1234-5678');
  await field(fc, 24, 158, 366, '代表者名（カタカナ）', '例：ヤマダタロウ');
  await field(fc, 414, 158, 366, '商談日', '2026-08-19', true);
  const sbt = await frame({ parentId: fc, x: 24, y: 232, width: 200, height: 46, cornerRadius: 9, fills: V, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', effects: shadow.sm });
  await text({ parentId: sbt, width: 200, align: 'CENTER', characters: 'この内容で登録', fontName: jp('Bold'), fontSize: 14, fills: c.white });
}

/* ===================== 代理店（ユーザー）側 ===================== */
Y += 470;
await frame({ parentId: root, x: 80, y: Y, width: BW - 160, height: 2, fills: ramp.gray[300] });
await text({ parentId: root, x: 80, y: Y + 22, characters: '代理店（ユーザー）側', fontName: jp('Bold'), fontSize: 26, fills: c.ink });
await text({ parentId: root, x: 340, y: Y + 30, characters: '営業担当が日々使う画面', fontName: jp('Regular'), fontSize: 14, fills: c.sub });
Y += 96;

/* 06 代理店ダッシュボード */
await sectionTitle(80, Y, '06', '代理店ダッシュボード', 'KPI・重複チェック導線・登録企業テーブルで営業前の状況を一目に。');
Y += 70;
{ const bw = 760, bh = 500;
  await tag(root, 80, Y - 4, 'BEFORE', false);
  const { s, top } = await beforeShell(80, Y + 30, bw, bh, 'ダッシュボード', 'まずはここから！営業前に重複チェック');
  const b1 = await frame({ parentId: s, x: 20, y: top, width: 360, height: 108, cornerRadius: 8, fills: navyOld });
  await text({ parentId: b1, x: 20, y: 22, characters: '重複チェック', fontName: jp('Bold'), fontSize: 15, fills: c.white });
  await text({ parentId: b1, x: 20, y: 50, width: 320, characters: '他の代理店と重複していないか確認', fontName: jp('Regular'), fontSize: 11, fills: '#cbd5e1' });
  const b2 = await frame({ parentId: s, x: 396, y: top, width: 344, height: 108, cornerRadius: 8, fills: c.white, strokes: ramp.gray[300], strokeWeight: 1 });
  await text({ parentId: b2, x: 20, y: 22, characters: '＋ 商談済み企業を登録', fontName: jp('Bold'), fontSize: 15, fills: '#1e293b' });
  await text({ parentId: s, x: 20, y: top + 128, characters: '登録した商談済み企業（0件）', fontName: jp('Bold'), fontSize: 14, fills: '#1e293b' });
  await text({ parentId: s, x: 20, y: top + 154, characters: 'まだ登録した企業はありません。', fontName: jp('Regular'), fontSize: 12, fills: c.faint });
}
await baArrow(880, Y + 280);
{ const aw = 1000, ah = 500;
  await tag(root, 1020, Y - 4, 'AFTER', true);
  const { s, mx } = await afterShell(1020, Y + 30, aw, ah, 0, 'ダッシュボード', 'こんにちは、代理店Aさん', AGENCY_NAV);
  await statRow({ parentId: s, x: mx, y: 86, w: 150, gap: 14, items: [
    { label: '登録企業', value: '3', valueColor: ramp.blue[600] }, { label: '成約', value: '1', valueColor: ramp.green[600] }, { label: '提案予定', value: '2', valueColor: ramp.red[600] }] });
  const ab = await frame({ parentId: s, x: mx, y: 172, width: aw - mx - 20, height: 64, cornerRadius: 12, fills: grad, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 18, itemSpacing: 14, effects: shadow.md });
  const ic = await frame({ parentId: ab, width: 36, height: 36, cornerRadius: 9, fills: c.white, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
  await icon({ parentId: ic, name: 'search', size: 20, color: V });
  const tw = await frame({ parentId: ab, layoutMode: 'VERTICAL', itemSpacing: 2, fills: [] });
  await text({ parentId: tw, characters: '重複チェックを実行', fontName: jp('Bold'), fontSize: 14, fills: c.white });
  await text({ parentId: tw, characters: '企業名を入力して、他社と重複していないか即チェック', fontName: jp('Regular'), fontSize: 11, fills: { color: '#ffffff', opacity: 0.85 } });
  await afterTable(s, mx, 252, aw - mx - 20, ah - 272, [
    { key: 'name', label: '企業名', w: 220, align: 'LEFT' }, { key: 'date', label: '商談日', w: 140, align: 'LEFT' }, { key: 'stat', label: 'ステータス', w: 260, align: 'LEFT' }],
    [{ name: 'テレビ東京', date: '2026-06-12', stat: { pill: '成約', tone: 'ok', dot: true, subtle: true } },
     { name: 'ウチダ商事', date: '2026-05-30', stat: { pill: '商談中', tone: 'info', dot: true, subtle: true } },
     { name: 'ヤマト物流', date: '2026-07-01', stat: { pill: '検討中', tone: 'warn', dot: true, subtle: true } }]);
}

/* 07 重複チェック */
Y += 580;
await sectionTitle(80, Y, '07', '重複チェック', '検索→信号機で即判定。競合情報は出さず結果だけ返す設計を明示。');
Y += 70;
{ const bw = 760, bh = 360;
  await tag(root, 80, Y - 4, 'BEFORE', false);
  const { s, top } = await beforeShell(80, Y + 30, bw, bh, '重複チェック');
  await text({ parentId: s, x: 20, y: top, characters: '代表電話番号', fontName: jp('Regular'), fontSize: 11, fills: '#334155' });
  await frame({ parentId: s, x: 20, y: top + 18, width: 340, height: 36, cornerRadius: 6, fills: c.bg, strokes: ramp.gray[300], strokeWeight: 1 });
  await text({ parentId: s, x: 380, y: top, characters: '企業名（カナ）', fontName: jp('Regular'), fontSize: 11, fills: '#334155' });
  await frame({ parentId: s, x: 380, y: top + 18, width: 340, height: 36, cornerRadius: 6, fills: c.bg, strokes: ramp.gray[300], strokeWeight: 1 });
  await frame({ parentId: s, x: 20, y: top + 72, width: 700, height: 38, cornerRadius: 6, fills: navyOld });
  await text({ parentId: s, x: 320, y: top + 82, characters: '検索して判定する', fontName: jp('Bold'), fontSize: 12, fills: c.white });
}
await baArrow(880, Y + 210);
{ const aw = 1000, ah = 360;
  await tag(root, 1020, Y - 4, 'AFTER', true);
  const { s, mx } = await afterShell(1020, Y + 30, aw, ah, 1, '重複チェック', '企業名から営業可否を即判定', AGENCY_NAV);
  const sc = await frame({ parentId: s, x: mx, y: 86, width: aw - mx - 20, height: 96, cornerRadius: 14, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
  await field(sc, 20, 16, 300, '代表電話番号', '03-1234-5678');
  await field(sc, 340, 16, 300, '企業名（カナ）', 'テレモ');
  const sbt = await frame({ parentId: sc, x: 664, y: 36, width: 150, height: 40, cornerRadius: 9, fills: grad, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
  await text({ parentId: sbt, width: 150, align: 'CENTER', characters: '検索して判定', fontName: jp('Bold'), fontSize: 13, fills: c.white });
  const rc = await frame({ parentId: s, x: mx, y: 196, width: aw - mx - 20, height: 118, cornerRadius: 14, fills: ramp.red[50], strokes: ramp.red[200], strokeWeight: 1 });
  const ng = await frame({ parentId: rc, x: 24, y: 22, height: 26, cornerRadius: 999, fills: ramp.red[600], layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 12, primaryAxisSizing: 'AUTO', counterAxisSizing: 'FIXED' });
  await text({ parentId: ng, characters: 'NG — 提案不可', fontName: jp('Bold'), fontSize: 12, fills: c.white });
  await text({ parentId: rc, x: 24, y: 58, characters: 'この企業には今アプローチできません', fontName: jp('Bold'), fontSize: 16, fills: ramp.red[700] });
  await text({ parentId: rc, x: 24, y: 86, characters: 'すでに他の代理店が商談を進めています。二重営業を避けるため、運営にご確認ください。', fontName: jp('Regular'), fontSize: 12, fills: ramp.red[700] });
}

/* ===================== 遷移フロー（フッター） ===================== */
Y += 460;
await sectionTitle(80, Y, '⇢', '画面遷移フロー', '運営: ログイン→運営管理→各画面 ／ 代理店: ログイン→ダッシュボード→重複チェック');
Y += 60;
const NW = 200, NH = 76;
async function flowNode(x, y, label, icn, active) {
  const n = await frame({ parentId: root, x, y, width: NW, height: NH, cornerRadius: 14, fills: active ? V : c.surface, strokes: active ? null : c.border, strokeWeight: 1, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 18, itemSpacing: 12, effects: shadow.sm });
  await icon({ parentId: n, name: icn, size: 22, color: active ? c.white : V });
  await text({ parentId: n, characters: label, fontName: jp('Bold'), fontSize: 14, fills: active ? c.white : c.ink });
}
function vline(x, y1, y2) { return frame({ parentId: root, x, y: y1, width: 3, height: y2 - y1, fills: V }); }
function hline(x1, x2, y) { return frame({ parentId: root, x: x1, y, width: x2 - x1, height: 3, fills: V }); }
// 位置：ログイン → 運営管理(中央) → 3分岐(縦積み)
const midY = Y + 130, midC = midY + NH / 2;      // ハブの中心
const ys = [Y + 30, Y + 130, Y + 230];           // 分岐3ノードのy
const bx = 760;                                   // 分岐ノードのx
await flowNode(80, midY, 'ログイン', 'users', false);
await arrow({ parentId: root, x: 286, y: midC - 4, length: 46, stroke: V, strokeWeight: 5 });
await flowNode(346, midY, '運営管理', 'building', true);
// フォーク：ハブ右→縦バー→各ノード
await hline(546, 660, midC - 1);
await vline(660, ys[0] + NH / 2, ys[2] + NH / 2);
const branches = [['代理店管理', 'users'], ['提案予定一覧', 'calendar'], ['企業登録', 'plus']];
for (let i = 0; i < 3; i++) {
  await arrow({ parentId: root, x: 660, y: ys[i] + NH / 2 - 4, length: 92, stroke: V, strokeWeight: 5 });
  await flowNode(bx, ys[i], branches[i][0], branches[i][1], false);
}

await zoomFit();
console.log('export:', JSON.stringify(await exportPng(root, 'tmp/portfolio.png', 1)));
