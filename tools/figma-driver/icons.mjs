// Design Driver — ラインアイコン（Lucide系・24グリッド・stroke=currentColor想定）
// SVG文字列に色を焼き込んで返す。createSvg で本物Figma/mockどちらでも描画可能。
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V20a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V9.8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  building: '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 21V9h4a1 1 0 0 1 1 1v11"/><path d="M3 21h18"/><path d="M8 8h3M8 12h3M8 16h3"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 12a2 2 0 1 1 0-4 1.6 1.6 0 0 0 1.1-2.7L4 5.2a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 2.6V2a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 15.7 4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21 9.6a2 2 0 1 1 0 4 1.6 1.6 0 0 0-1.6 1.4z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 3 8 3 8H3s3-2 3-8"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 4-6"/>',
  arrowUp: '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
};

// 色・太さを焼き込んだ完成SVG文字列を返す
export function iconSvg(name, color = '#111827', strokeWidth = 2) {
  const inner = P[name] || P.check;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}
export const iconNames = Object.keys(P);
