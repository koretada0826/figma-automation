// 営業重複管理ツール — 改修UI 画面遷移フロー（全画面 After ＋ 矢印）
// ログイン → 運営管理（ハブ）→ 代理店管理 / 提案一覧 / 企業登録 の分岐を矢印で表現。
import { clear, frame, text, arrow, svg, exportPng, zoomFit } from './fig.mjs';
import { sidebar, table, pill, button, input, icon, avatar } from './components.mjs';
import { c, ramp, font, jp, shadow } from './tokens.mjs';

const V = ramp.violet[600], VD = ramp.violet[700], NAV = ramp.gray[900];
const grad = { gradient: 'linear', angle: 135, stops: [{ color: V, pos: 0 }, { color: VD, pos: 1 }] };

await clear();
const BW = 3100, BH = 1720;
const root = await frame({ name: '改修UI-フロー', x: 0, y: 0, width: BW, height: BH, fills: ramp.gray[100], clip: true });
await text({ parentId: root, x: 60, y: 48, characters: '営業重複管理ツール — 改修UI 画面遷移フロー', fontName: font('Bold'), fontSize: 32, fills: c.ink });
await text({ parentId: root, x: 60, y: 92, characters: 'ログイン → 運営管理（ハブ）→ 代理店アカウント管理 / 提案予定一覧 / 企業登録', fontName: jp('Medium'), fontSize: 16, fills: c.sub });

// 画面ラベル
async function screenLabel(x, y, t) { await text({ parentId: root, x, y: y - 26, characters: t, fontName: jp('Bold'), fontSize: 15, fills: V }); }

// 管理画面の共通シェル（サイドバー＋トップバー）。content領域の起点を返す
async function adminShell(x, y, w, h, active, title, sub) {
  const s = await frame({ name: 'screen-' + title, parentId: root, x, y, width: w, height: h, cornerRadius: 16, fills: ramp.gray[50], strokes: ramp.gray[200], strokeWeight: 1, clip: true, effects: shadow.lg });
  await sidebar({ parentId: s, x: 0, y: 0, width: 88, height: h, navFill: NAV, accent: V, logo: 'T',
    items: [{ label: '企業', icon: 'building' }, { label: '代理店', icon: 'users' }, { label: '提案', icon: 'calendar' }, { label: '登録', icon: 'plus' }, { label: '設定', icon: 'settings' }], active });
  const mx = 112;
  await text({ parentId: s, x: mx, y: 26, characters: title, fontName: font('Bold'), fontSize: 20, fills: c.ink });
  if (sub) await text({ parentId: s, x: mx, y: 54, characters: sub, fontName: jp('Regular'), fontSize: 12, fills: c.sub });
  await avatar({ parentId: s, x: w - 60, y: 24, size: 36, label: 'A', fills: V, ink: c.white });
  await frame({ parentId: s, x: mx, y: 78, width: w - mx - 24, height: 1, fills: c.line });
  return { s, mx };
}

/* ============ 1) ログイン（紫スプリット） ============ */
const LGx = 60, LGy = 170, LGw = 760, LGh = 460;
await screenLabel(LGx, LGy, '① ログイン');
const login = await frame({ name: 'screen-login', parentId: root, x: LGx, y: LGy, width: LGw, height: LGh, cornerRadius: 16, fills: c.surface, clip: true, effects: shadow.lg });
const Lp = await frame({ parentId: login, x: 0, y: 0, width: 380, height: LGh, fills: grad });
const Llogo = await frame({ parentId: Lp, x: 36, y: 40, width: 40, height: 40, cornerRadius: 10, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', fills: c.white });
await text({ parentId: Llogo, width: 40, align: 'CENTER', characters: 'T', fontName: font('Bold'), fontSize: 18, fills: V });
await text({ parentId: Lp, x: 86, y: 50, characters: '営業重複管理ツール', fontName: jp('Bold'), fontSize: 14, fills: c.white });
await text({ parentId: Lp, x: 36, y: 150, width: 300, characters: '二重営業を、\nワンチェックで防ぐ。', fontName: jp('Bold'), fontSize: 26, lineHeight: 36, fills: c.white });
await text({ parentId: Lp, x: 36, y: 250, width: 300, characters: '営業前に、他社と重複していないかを即チェック。', fontName: jp('Regular'), fontSize: 13, lineHeight: 20, fills: { color: '#ffffff', opacity: 0.85 } });
// 右フォーム
await text({ parentId: login, x: 416, y: 56, characters: 'おかえりなさい', fontName: jp('Bold'), fontSize: 22, fills: c.ink });
await text({ parentId: login, x: 416, y: 90, characters: 'アカウントにログイン', fontName: jp('Regular'), fontSize: 13, fills: c.sub });
async function loginField(y, label, val) {
  await text({ parentId: login, x: 416, y, characters: label, fontName: jp('Medium'), fontSize: 12, fills: c.body });
  const b = await frame({ parentId: login, x: 416, y: y + 22, width: 300, height: 44, cornerRadius: 9, fills: c.bg, strokes: c.border, strokeWeight: 1, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 14 });
  await text({ parentId: b, characters: val, fontName: jp('Regular'), fontSize: 14, fills: c.ink });
}
await loginField(132, 'ログインID', 'admin');
await loginField(212, 'パスワード', '••••••');
const Lbtn = await frame({ parentId: login, x: 416, y: 300, width: 300, height: 48, cornerRadius: 9, fills: grad, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', effects: shadow.md });
await text({ parentId: Lbtn, width: 300, align: 'CENTER', characters: 'ログイン →', fontName: jp('Bold'), fontSize: 15, fills: c.white });

/* ============ 2) 運営管理（ハブ） ============ */
const AMx = 1000, AMy = 170, AMw = 1120, AMh = 600;
await screenLabel(AMx, AMy, '② 運営管理画面（ハブ）');
const { s: am, mx: amx } = await adminShell(AMx, AMy, AMw, AMh, 0, '運営管理画面', '登録企業 全133件');
await input({ parentId: am, x: AMw - 470, y: 24, width: 210, icon: '🔍', placeholder: '企業名で検索…' });
const amAdd = await frame({ parentId: am, x: AMw - 244, y: 24, width: 180, height: 40, cornerRadius: 9, fills: V, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', itemSpacing: 6, effects: shadow.sm });
await icon({ parentId: amAdd, name: 'plus', size: 16, color: c.white });
await text({ parentId: amAdd, characters: '過去の企業を登録', fontName: jp('Bold'), fontSize: 13, fills: c.white });
// サマリー（整列済み・白カード＋右上ドット）
const sums = [['全件', '133', null], ['提案可能', '38', ramp.green[500]], ['商談中', '52', ramp.blue[500]], ['検討中', '43', ramp.amber[500]]];
let sx = amx;
for (const [lb, vl, dot] of sums) {
  const chip = await frame({ parentId: am, x: sx, y: 96, width: 150, height: 66, cornerRadius: 12, fills: c.surface, strokes: c.border, strokeWeight: 1 });
  await text({ parentId: chip, x: 18, y: 16, characters: lb, fontName: jp('Medium'), fontSize: 12, fills: c.sub });
  await text({ parentId: chip, x: 18, y: 34, characters: vl, fontName: font('Bold'), fontSize: 22, fills: c.ink });
  if (dot) await frame({ parentId: chip, x: 150 - 18 - 8, y: 18, width: 8, height: 8, cornerRadius: 999, fills: dot });
  sx += 162;
}
const amCard = await frame({ parentId: am, x: amx, y: 178, width: AMw - amx - 24, height: AMh - 202, cornerRadius: 16, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 8, padding: 20 });
await table({
  parentId: amCard,
  columns: [
    { key: 'name', label: '企業名', w: 220, align: 'LEFT' }, { key: 'tel', label: '電話番号', w: 150, align: 'LEFT' },
    { key: 'date', label: '商談日', w: 120, align: 'LEFT' }, { key: 'stat', label: 'ステータス', w: 140, align: 'LEFT' },
    { key: 'agency', label: '担当代理店', w: 150, align: 'LEFT' }, { key: 'ok', label: '提案可否', w: 110, align: 'LEFT' },
  ],
  rows: [
    { name: 'アミックス', tel: '03-3676-2881', date: '2026-08-17', stat: { pill: '検討中', tone: 'warn', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'NG', tone: 'ng' } },
    { name: 'エコライフジャパン', tel: '086-441-0505', date: '2026-08-10', stat: { pill: '商談中', tone: 'info', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'NG', tone: 'ng' } },
    { name: 'ヤマガタヤ', tel: '052-331-3588', date: '2026-07-30', stat: { pill: '失注', tone: 'neutral', dot: true, subtle: true }, agency: 'TELEMO直営', ok: { pill: 'OK', tone: 'ok' } },
    { name: 'ユトミ', tel: '03-5846-9355', date: '2026-07-26', stat: { pill: '成約', tone: 'ok', dot: true, subtle: true }, agency: 'ライト通信', ok: { pill: 'NG', tone: 'ng' } },
  ],
});

/* ============ 3) 代理店アカウント管理 ============ */
const AGx = 60, AGy = 900, AGw = 900, AGh = 640;
await screenLabel(AGx, AGy, '③ 代理店アカウント管理');
const { s: ag, mx: agx } = await adminShell(AGx, AGy, AGw, AGh, 1, '代理店アカウント管理', '全12件');
// 追加フォームカード
const agForm = await frame({ parentId: ag, x: agx, y: 96, width: AGw - agx - 24, height: 132, cornerRadius: 14, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
await text({ parentId: agForm, x: 20, y: 16, characters: 'アカウントを追加', fontName: jp('Bold'), fontSize: 14, fills: c.ink });
async function agField(x, w, label, ph) {
  await text({ parentId: agForm, x, y: 44, characters: label, fontName: jp('Medium'), fontSize: 11, fills: c.sub });
  const b = await frame({ parentId: agForm, x, y: 62, width: w, height: 38, cornerRadius: 8, fills: c.bg, strokes: c.border, strokeWeight: 1, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 12 });
  await text({ parentId: b, characters: ph, fontName: jp('Regular'), fontSize: 13, fills: c.faint });
}
await agField(20, 180, '名前', '株式会社◯◯代理店');
await agField(216, 150, 'ログインID', 'agency13');
await agField(382, 150, '初期パスワード', '8文字以上');
await agField(548, 120, '権限', '販売代理店');
const agBtn = await frame({ parentId: agForm, x: 684, y: 62, width: 90, height: 38, cornerRadius: 8, fills: V, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER' });
await text({ parentId: agBtn, width: 90, align: 'CENTER', characters: '＋ 追加', fontName: jp('Bold'), fontSize: 12, fills: c.white });
// 一覧
const agCard = await frame({ parentId: ag, x: agx, y: 244, width: AGw - agx - 24, height: AGh - 268, cornerRadius: 14, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 8, padding: 20 });
await table({
  parentId: agCard,
  columns: [
    { key: 'name', label: '名前', w: 220, align: 'LEFT' }, { key: 'id', label: 'ログインID', w: 180, align: 'LEFT' },
    { key: 'role', label: '権限', w: 150, align: 'LEFT' }, { key: 'op', label: '操作', w: 160, align: 'LEFT' },
  ],
  rows: [
    { name: '運営本部', id: 'admin', role: { pill: '運営本部', tone: 'brand' }, op: 'パスワード再設定' },
    { name: 'サンプル代理店A', id: 'agency01', role: { pill: '販売代理店', tone: 'neutral', subtle: true }, op: 'パスワード再設定' },
    { name: '株式会社ライト通信', id: 'light-tsushin', role: { pill: '販売代理店', tone: 'neutral', subtle: true }, op: 'パスワード再設定' },
    { name: 'ラスワン', id: 'rasuwan', role: { pill: '販売代理店', tone: 'neutral', subtle: true }, op: 'パスワード再設定' },
  ],
});

/* ============ 4) 提案予定の一覧 ============ */
const PLx = 1020, PLy = 900, PLw = 900, PLh = 640;
await screenLabel(PLx, PLy, '④ 提案予定の一覧');
const { s: pl, mx: plx } = await adminShell(PLx, PLy, PLw, PLh, 2, '提案予定の一覧', '全215件（営業権は発生しません）');
const plCard = await frame({ parentId: pl, x: plx, y: 96, width: PLw - plx - 24, height: PLh - 120, cornerRadius: 14, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: 'VERTICAL', itemSpacing: 8, padding: 20 });
await table({
  parentId: plCard,
  columns: [
    { key: 'name', label: '企業名', w: 300, align: 'LEFT' }, { key: 'tel', label: '電話番号', w: 160, align: 'LEFT' },
    { key: 'agency', label: '登録した代理店', w: 160, align: 'LEFT' }, { key: 'date', label: '登録日', w: 130, align: 'LEFT' },
  ],
  rows: [
    { name: 'ジャパンプロパティリンク', tel: '011-522-6439', agency: 'TELEMO直営', date: '2026-08-19' },
    { name: 'エーワイオートチタテモノ', tel: '035-797-7061', agency: 'TELEMO直営', date: '2026-08-18' },
    { name: 'ゴエン', tel: '029-879-5683', agency: 'TELEMO直営', date: '2026-08-18' },
    { name: 'ギンカフェグループ', tel: '—', agency: 'TELEMO直営', date: '2026-08-17' },
    { name: 'エネコ', tel: '034-455-5326', agency: 'ラスワン', date: '2026-08-11' },
  ],
});

/* ============ 5) 企業を登録 ============ */
const RGx = 1980, RGy = 900, RGw = 900, RGh = 640;
await screenLabel(RGx, RGy, '⑤ 企業を登録');
const { s: rg, mx: rgx } = await adminShell(RGx, RGy, RGw, RGh, 3, '企業を登録', '登録先の代理店名義でバックフィル登録');
const rgCard = await frame({ parentId: rg, x: rgx, y: 96, width: RGw - rgx - 24, height: RGh - 120, cornerRadius: 14, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
async function rgField(x, y, w, label, ph, req) {
  await text({ parentId: rgCard, x, y, characters: label + (req ? ' *' : ''), fontName: jp('Medium'), fontSize: 12, fills: req ? c.ink : c.body });
  const b = await frame({ parentId: rgCard, x, y: y + 22, width: w, height: 42, cornerRadius: 9, fills: c.bg, strokes: c.border, strokeWeight: 1, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 14 });
  await text({ parentId: b, characters: ph, fontName: jp('Regular'), fontSize: 13, fills: c.faint });
}
await rgField(24, 24, RGw - rgx - 72, '登録先の代理店', '— 代理店を選んでください —', true);
await rgField(24, 96, 340, '企業名（カタカナ）', '例：テレモ', true);
await rgField(388, 96, 340, '代表電話番号', '03-1234-5678');
await rgField(24, 168, 340, '代表者名（カタカナ）', '例：ヤマダタロウ');
await rgField(388, 168, 340, '商談日', '2026-08-19', true);
await rgField(24, 240, 704, '住所（丁目まで）', '例：東京都豊島区池袋1丁目');
const rgBtn = await frame({ parentId: rgCard, x: 24, y: 320, width: 200, height: 46, cornerRadius: 9, fills: V, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', effects: shadow.sm });
await text({ parentId: rgBtn, width: 200, align: 'CENTER', characters: 'この内容で登録', fontName: jp('Bold'), fontSize: 14, fills: c.white });

/* ============ 遷移矢印 ============ */
// ログイン → 運営管理（横）
await arrow({ parentId: root, x: LGx + LGw + 20, y: LGy + 200, length: 160, stroke: V, strokeWeight: 6 });
await text({ parentId: root, x: LGx + LGw + 60, y: LGy + 170, characters: 'ログイン', fontName: jp('Bold'), fontSize: 13, fills: V });
// 運営管理 → 代理店 / 提案 / 登録（下向きSVG矢印。mock/本物Figma両対応）
const dTop = AMy + AMh + 16, dLen = AGy - dTop - 8;
async function downArrow(cx, label) {
  const s = `<svg viewBox="0 0 40 ${dLen}" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="2" x2="20" y2="${dLen - 14}" stroke="${V}" stroke-width="6" stroke-linecap="round"/><path d="M8 ${dLen - 18} L20 ${dLen - 3} L32 ${dLen - 18}" fill="none" stroke="${V}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  await svg({ parentId: root, x: cx - 20, y: dTop, width: 40, height: dLen, svg: s });
  await text({ parentId: root, x: cx + 16, y: dTop + dLen / 2 - 8, characters: label, fontName: jp('Bold'), fontSize: 12, fills: V });
}
await downArrow(AGx + AGw / 2, '代理店管理');
await downArrow(PLx + PLw / 2, '提案一覧');
await downArrow(RGx + RGw / 2, '企業登録');

await zoomFit();
console.log('export:', JSON.stringify(await exportPng(root, 'tmp/flow-board.png', 1)));
