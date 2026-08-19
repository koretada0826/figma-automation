// Design Driver — デザイントークン（プロ仕様 / 後方互換）
// 設計思想の正典は design-knowledge/ を参照（カラー/タイポ/余白/影）。

/* ---------- カラーランプ（Tailwind/Radix系の 50→900 階調） ---------- */
export const ramp = {
  gray:  { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a' }, // slate
  blue:  { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
  green: { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' },
  red:   { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d' },
  amber: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f' },
  violet:{ 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95' },
};

/* ---------- セマンティックカラー（役割で参照。既存キーは維持） ---------- */
export const c = {
  // ブランド
  brand: ramp.blue[600], brandHover: ramp.blue[700], brandActive: ramp.blue[800],
  brand050: ramp.blue[50], brand100: ramp.blue[100], brand200: ramp.blue[200], brand600: ramp.blue[600], brand700: ramp.blue[700],
  // 背景・面・境界
  bg: ramp.gray[50], bgSubtle: ramp.gray[100], surface: '#ffffff', surfaceAlt: ramp.gray[50],
  border: ramp.gray[200], borderStrong: ramp.gray[300], line: ramp.gray[100],
  // テキスト（ink=最濃 / body / sub=補助 / faint=薄）
  ink: ramp.gray[900], strong: ramp.gray[800], body: ramp.gray[700], sub: ramp.gray[500], faint: ramp.gray[400], onBrand: '#ffffff',
  // 状態色（fg=文字, bg=淡い背景）
  ok: ramp.green[600], okBg: ramp.green[50], okFg: ramp.green[700],
  warn: ramp.amber[600], warnBg: ramp.amber[50], warnFg: ramp.amber[700],
  ng: ramp.red[600], ngBg: ramp.red[50], ngFg: ramp.red[700],
  info: ramp.blue[600], infoBg: ramp.blue[50], infoFg: ramp.blue[700],
  // ナビ（ダークサイドバー）
  nav: ramp.gray[900], navHover: ramp.gray[800], navSub: ramp.gray[400], navText: ramp.gray[200],
  white: '#ffffff', black: '#000000',
};

/* ---------- スペーシング（4pxベース・8pxグリッド） ---------- */
export const space = { 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64, 20:80, 24:96, 32:128 };
export const sp = (n) => n * 8; // 後方互換

/* ---------- 角丸 ---------- */
export const r = { none:0, xs:4, sm:6, md:8, lg:12, xl:16, '2xl':20, card:16, panel:14, btn:9, inp:9, pill:999, full:999 };

/* ---------- タイポグラフィ（モジュラースケール） ---------- */
export const font = (style = 'Regular') => ({ family: 'Inter', style });   // 欧文/数字
export const jp = (style = 'Regular') => ({ family: 'Noto Sans JP', style }); // 和文
export const type = {
  display: { fontSize: 48, lineHeight: 56, weight: 'Bold',    letterSpacing: -0.5 },
  h1:      { fontSize: 34, lineHeight: 42, weight: 'Bold',    letterSpacing: -0.3 },
  h2:      { fontSize: 24, lineHeight: 32, weight: 'Bold',    letterSpacing: -0.2 },
  h3:      { fontSize: 20, lineHeight: 28, weight: 'Bold',    letterSpacing: 0 },
  h4:      { fontSize: 16, lineHeight: 24, weight: 'Bold',    letterSpacing: 0 },
  body:    { fontSize: 14, lineHeight: 22, weight: 'Regular', letterSpacing: 0 },
  bodyLg:  { fontSize: 16, lineHeight: 26, weight: 'Regular', letterSpacing: 0 },
  small:   { fontSize: 12, lineHeight: 18, weight: 'Regular', letterSpacing: 0 },
  caption: { fontSize: 11, lineHeight: 16, weight: 'Medium',  letterSpacing: 0.2 },
  kpi:     { fontSize: 34, lineHeight: 40, weight: 'Bold',    letterSpacing: -0.4 },
};

/* ---------- 影 / elevation（1pxボーダー + 淡い多層シャドウの思想） ---------- */
export const shadow = {
  xs: [{ type:'DROP_SHADOW', color:'#0f172a', opacity:0.05, offset:{x:0,y:1}, radius:2,  spread:0 }],
  sm: [{ type:'DROP_SHADOW', color:'#0f172a', opacity:0.06, offset:{x:0,y:1}, radius:2,  spread:0 },
       { type:'DROP_SHADOW', color:'#0f172a', opacity:0.04, offset:{x:0,y:1}, radius:3,  spread:0 }],
  md: [{ type:'DROP_SHADOW', color:'#0f172a', opacity:0.08, offset:{x:0,y:4}, radius:8,  spread:-1 },
       { type:'DROP_SHADOW', color:'#0f172a', opacity:0.05, offset:{x:0,y:2}, radius:4,  spread:-1 }],
  lg: [{ type:'DROP_SHADOW', color:'#0f172a', opacity:0.10, offset:{x:0,y:12}, radius:24, spread:-6 },
       { type:'DROP_SHADOW', color:'#0f172a', opacity:0.06, offset:{x:0,y:4},  radius:8,  spread:-2 }],
};
