// Design Driver — デザイントークン（承認済みBtoB SaaSと一致）
export const c = {
  brand: '#2563eb', brandHover: '#1d4ed8', brand050: '#eff6ff', brand100: '#dbeafe',
  bg: '#f8fafc', surface: '#ffffff', border: '#e5e7eb',
  ink: '#111827', sub: '#6b7280', faint: '#9ca3af',
  ok: '#16a34a', warn: '#ea580c', ng: '#dc2626',
  nav: '#0f172a', navSub: '#94a3b8', white: '#ffffff',
};
// 8pxグリッド
export const sp = (n) => n * 8;
// 角丸
export const r = { card: 16, panel: 14, btn: 9, inp: 9, pill: 999 };
// タイポ（family/style/size）
export const font = (style) => ({ family: 'Inter', style });
export const jp = (style = 'Regular') => ({ family: 'Noto Sans JP', style });
export const type = {
  h1: { fontSize: 34, weight: 'Bold' }, h2: { fontSize: 24, weight: 'Bold' },
  h3: { fontSize: 18, weight: 'Bold' }, body: { fontSize: 14, weight: 'Regular' },
  small: { fontSize: 12, weight: 'Regular' }, kpi: { fontSize: 34, weight: 'Bold' },
};
// 影（弱め：1pxボーダー＋淡い影の思想）
export const shadow = { sm: [{ type: 'DROP_SHADOW', color: '#111827', opacity: 0.04, offset: { x: 0, y: 1 }, radius: 2 }], md: [{ type: 'DROP_SHADOW', color: '#0f172a', opacity: 0.06, offset: { x: 0, y: 8 }, radius: 24 }] };
