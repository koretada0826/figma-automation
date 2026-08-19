// 営業重複管理ツール — ログイン画面（after-login.png の紫スプリットをネイティブ再現）
import { clear, frame, text, exportPng, zoomFit } from './fig.mjs';
import { ramp, c } from './tokens.mjs';

const V = ramp.violet[600], VD = ramp.violet[700];
const grad = { gradient: 'linear', angle: 135, stops: [{ color: V, pos: 0 }, { color: VD, pos: 1 }] };
const white = (o) => ({ family: 'Noto Sans JP', style: o });

await clear();
const W = 1000, H = 640;
const root = await frame({ name: '営業重複管理ツール-Login', x: 0, y: 0, width: W, height: H, fills: c.bg, clip: true });

// 中央カード（左=紫パネル / 右=白フォーム）
const CW = 760, CH = 420, CX = (W - CW) / 2, CY = (H - CH) / 2;
const cardEl = await frame({ name: 'authCard', parentId: root, x: CX, y: CY, width: CW, height: CH, cornerRadius: 20, fills: c.surface, effects: [{ type: 'DROP_SHADOW', color: '#0f172a', opacity: 0.12, offset: { x: 0, y: 16 }, radius: 40, spread: -8 }], clip: true });

/* ---- 左：ブランドパネル（紫グラデ・絶対配置） ---- */
const L = await frame({ name: 'brandPanel', parentId: cardEl, x: 0, y: 0, width: 400, height: CH, fills: grad });
const logo = await frame({ parentId: L, x: 40, y: 40, width: 36, height: 36, cornerRadius: 9, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', fills: c.white });
await text({ parentId: logo, width: 36, align: 'CENTER', characters: 'T', fontName: { family: 'Inter', style: 'Bold' }, fontSize: 18, fills: V });
await text({ parentId: L, x: 86, y: 49, characters: '営業重複管理ツール', fontName: white('Bold'), fontSize: 14, fills: c.white });
await text({ parentId: L, x: 40, y: 128, width: 320, characters: '二重営業を、\nワンチェックで防ぐ。', fontName: white('Bold'), fontSize: 25, lineHeight: 34, fills: c.white });
await text({ parentId: L, x: 40, y: 214, width: 320, characters: '検索して数秒。OK / NG / 要確認が信号機で\n即座に分かる営業前チェック。', fontName: white('Regular'), fontSize: 13, lineHeight: 21, fills: { color: '#ffffff', opacity: 0.85 } });
// 特長ピル
async function featPill(x, label) {
  const p = await frame({ parentId: L, x, y: 320, height: 30, cornerRadius: 999, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 12, itemSpacing: 6, primaryAxisSizing: 'AUTO', fills: { color: '#ffffff', opacity: 0.18 } });
  await text({ parentId: p, characters: label, fontName: white('Medium'), fontSize: 12, fills: c.white });
  return p;
}
await featPill(40, '🛡 情報保護対応');
await featPill(170, '⚡ 即時判定');

/* ---- 右：ログインフォーム（白・絶対配置） ---- */
const R = await frame({ name: 'formPanel', parentId: cardEl, x: 400, y: 0, width: 360, height: CH, fills: c.surface });
await text({ parentId: R, x: 40, y: 52, characters: 'おかえりなさい', fontName: white('Bold'), fontSize: 22, fills: c.ink });
await text({ parentId: R, x: 40, y: 86, characters: 'アカウントにログイン', fontName: white('Regular'), fontSize: 13, fills: c.sub });

async function field(y, label, value, dots) {
  await text({ parentId: R, x: 40, y, characters: label, fontName: white('Medium'), fontSize: 12, fills: c.body });
  const box = await frame({ parentId: R, x: 40, y: y + 22, width: 280, height: 44, cornerRadius: 9, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 14, fills: c.bg, strokes: c.border, strokeWeight: 1 });
  await text({ parentId: box, characters: dots ? '••••••••' : value, fontName: white('Regular'), fontSize: 14, fills: dots ? c.body : c.ink });
}
await field(128, 'ログインID', 'agency01', false);
await field(208, 'パスワード', '', true);

// ログインボタン（紫・全幅）
const btn = await frame({ parentId: R, x: 40, y: 306, width: 280, height: 48, cornerRadius: 9, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', fills: grad, effects: [{ type: 'DROP_SHADOW', color: V, opacity: 0.3, offset: { x: 0, y: 6 }, radius: 14, spread: -2 }] });
await text({ parentId: btn, width: 280, align: 'CENTER', characters: 'ログイン →', fontName: white('Bold'), fontSize: 15, fills: c.white });

await zoomFit();
console.log('export:', JSON.stringify(await exportPng(root, 'tmp/login-eigyo.png', 2)));
