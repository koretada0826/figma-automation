// Design Driver — UIコンポーネント（トークン準拠・プロ仕様）
// 設計指針は design-knowledge/ を正典とする。
import { frame, rect, text, ellipse, svg } from './fig.mjs';
import { c, r, font, jp, shadow } from './tokens.mjs';
import { iconSvg } from './icons.mjs';

// ラインアイコン（色を焼き込んだSVGをネイティブ配置）
export async function icon(o) {
  const s = o.size || 24;
  return svg({ parentId: o.parentId, x: o.x, y: o.y, width: s, height: s, svg: iconSvg(o.name, o.color || c.ink, o.strokeWidth || 2) });
}

/* ============ SVGチャート・ヘルパー（本物の円弧/折れ線） ============ */
// ドーナツ：セグメントを stroke-dasharray でリング上に並べる（-90°=真上始点）
function donutSvg(size, thickness, segments, track = '#f1f5f9') {
  const R = (size - thickness) / 2, cx = size / 2, cy = size / 2, C = 2 * Math.PI * R;
  const total = (segments || []).reduce((a, s) => a + (s.value || 0), 0) || 1;
  let off = 0, paths = '';
  for (const s of segments || []) {
    const len = (s.value / total) * C;
    paths += `<circle cx="${cx}" cy="${cy}" r="${R.toFixed(2)}" fill="none" stroke="${s.color}" stroke-width="${thickness}" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`;
    off += len;
  }
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${cx}" cy="${cy}" r="${R.toFixed(2)}" fill="none" stroke="${track}" stroke-width="${thickness}"/>${paths}</svg>`;
}
// 折れ線/スパークライン：data配列を正規化してpolyline化。fillでエリア塗り
function sparklineSvg(w, h, data, color, fillArea) {
  const pad = 3, min = Math.min(...data), max = Math.max(...data), range = (max - min) || 1;
  const pts = data.map((v, i) => [pad + i * (w - 2 * pad) / Math.max(1, data.length - 1), h - pad - (v - min) / range * (h - 2 * pad)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = fillArea ? `<path d="${line} L ${pts[pts.length - 1][0].toFixed(1)} ${h} L ${pts[0][0].toFixed(1)} ${h} Z" fill="${fillArea}" opacity="0.5"/>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${area}<path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

// ドーナツチャート（本物のセグメント＋中央合計、数値はネイティブtextで編集可能）
export async function donutChart(o) {
  const size = o.size || 140, th = o.thickness || 22;
  const wrap = await frame({ name: 'donutChart', parentId: o.parentId, x: o.x, y: o.y, width: size, height: size, fills: null });
  await svg({ parentId: wrap, x: 0, y: 0, width: size, height: size, svg: donutSvg(size, th, o.segments || []) });
  if (o.value != null) await text({ parentId: wrap, x: 0, y: Math.round(size / 2 - (o.caption ? 22 : 18)), width: size, align: 'CENTER', characters: String(o.value), fontName: font('Bold'), fontSize: 30, fills: c.ink });
  if (o.caption) await text({ parentId: wrap, x: 0, y: Math.round(size / 2 + 12), width: size, align: 'CENTER', characters: o.caption, fontName: jp('Regular'), fontSize: 11, fills: c.sub });
  return wrap;
}

// スパークライン（折れ線・単体）
export async function sparkline(o) {
  const w = o.width || 120, h = o.height || 32;
  return svg({ parentId: o.parentId, x: o.x, y: o.y, width: w, height: h, svg: sparklineSvg(w, h, o.data || [3, 5, 4, 7, 6, 9, 8], o.color || c.brand, o.fill) });
}

// ボタン（variant: primary/secondary/ghost/danger, size: sm/md/lg）
export async function button(o) {
  const V = {
    primary:   { fill: c.brand,   stroke: null,     sw: 0, ink: c.white, eff: shadow.xs },
    secondary: { fill: c.surface, stroke: c.border, sw: 1, ink: c.body,  eff: shadow.xs },
    ghost:     { fill: null,      stroke: null,     sw: 0, ink: c.body,  eff: null },
    danger:    { fill: c.ng,      stroke: null,     sw: 0, ink: c.white, eff: shadow.xs },
  };
  const st = V[o.variant] || V.primary;
  const H = { sm: 32, md: 40, lg: 44 }[o.size] || 40;
  const b = await frame({ name: 'btn', parentId: o.parentId, x: o.x, y: o.y, width: o.width || 160, height: H, cornerRadius: r.btn, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', itemSpacing: 8, paddingH: 16, fills: st.fill, strokes: st.stroke, strokeWeight: st.sw, effects: st.eff });
  await text({ parentId: b, width: o.width ? o.width - 32 : undefined, align: o.width ? 'CENTER' : undefined, characters: o.label || 'Button', fontName: jp('Bold'), fontSize: 14, fills: st.ink });
  return b;
}

// ステータスピル（役割色 fg/bg ペアで良コントラスト）
export async function pill(o) {
  const map = {
    ok: [c.okFg, c.okBg], ng: [c.ngFg, c.ngBg], warn: [c.warnFg, c.warnBg], info: [c.infoFg, c.infoBg],
    neutral: [c.sub, c.bgSubtle], brand: [c.brand700, c.brand050],
  };
  const [fg, bgc] = map[o.tone || 'neutral'];
  const p = await frame({ name: 'pill', parentId: o.parentId, x: o.x, y: o.y, height: 24, cornerRadius: r.pill, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', paddingH: 11, primaryAxisSizing: 'AUTO', counterAxisSizing: 'FIXED', fills: bgc });
  if (o.dot) await ellipse({ parentId: p, width: 6, height: 6, fills: fg });
  await text({ parentId: p, characters: o.label, fontName: jp('Bold'), fontSize: 12, fills: fg });
  return p;
}

// KPIカード（数字ファースト）
export async function kpiCard(o) {
  const card = await frame({ name: 'kpi', parentId: o.parentId, x: o.x, y: o.y, width: o.width || 300, height: 150, cornerRadius: r.card, layoutMode: 'VERTICAL', itemSpacing: 6, pad: [20, 22, 20, 22], fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
  await text({ parentId: card, characters: o.label, fontName: jp('Medium'), fontSize: 13, fills: c.sub });
  await text({ parentId: card, characters: String(o.value), fontName: font('Bold'), fontSize: 34, fills: c.ink });
  if (o.delta) await text({ parentId: card, characters: o.delta, fontName: jp('Medium'), fontSize: 12, fills: o.deltaTone === 'down' ? c.ng : c.ok });
  return card;
}

// サイドバー（ダーク・アイコン＋ラベル）。items=[{label,icon}] or 文字列
// accent=ブランド色, navFill=地色。アクティブは塗り、非アクティブはicon/textを淡色
export async function sidebar(o) {
  const items = (o.items || []).map((it) => (typeof it === 'string' ? { label: it, icon: 'check' } : it));
  const accent = o.accent || c.brand;
  const navFill = o.navFill || c.nav;
  const bar = await frame({ name: 'sidebar', parentId: o.parentId, x: o.x || 0, y: o.y || 0, width: o.width || 96, height: o.height || 720, layoutMode: 'VERTICAL', itemSpacing: 6, pad: [22, 12, 22, 12], counterAlign: 'CENTER', fills: navFill });
  const lg = await frame({ name: 'logo', parentId: bar, width: 40, height: 40, cornerRadius: 11, layoutMode: 'HORIZONTAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', fills: accent, effects: shadow.sm });
  await text({ parentId: lg, width: 40, align: 'CENTER', characters: o.logo || 'T', fontName: font('Bold'), fontSize: 18, fills: c.white });
  const spacer = await frame({ parentId: bar, width: 4, height: 8, fills: [] });
  for (let i = 0; i < items.length; i++) {
    const on = i === (o.active || 0);
    const it = await frame({ name: 'nav-' + items[i].label, parentId: bar, width: 64, height: 58, cornerRadius: 14, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', itemSpacing: 5, fills: on ? accent : [] });
    await icon({ parentId: it, name: items[i].icon || 'check', size: 22, color: on ? c.white : c.navSub, strokeWidth: on ? 2.2 : 1.8 });
    await text({ parentId: it, width: 64, align: 'CENTER', characters: items[i].label, fontName: jp('Medium'), fontSize: 11, fills: on ? c.white : c.navSub });
  }
  return bar;
}

// セクションカード（白パネル）
export async function card(o) {
  return frame({ name: o.name || 'card', parentId: o.parentId, x: o.x, y: o.y, width: o.width, height: o.height, cornerRadius: r.card, fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm, layoutMode: o.layoutMode, itemSpacing: o.itemSpacing, padding: o.padding, counterAlign: o.counterAlign, primaryAlign: o.primaryAlign });
}

/* ============ 追加部品（表・入力欄・アバター・ドーナツ・アクションバー・見出し） ============ */

// 入力欄（アイコン＋プレースホルダ）
export async function input(o) {
  const box = await frame({ name: 'input', parentId: o.parentId, x: o.x, y: o.y, width: o.width || 280, height: 40, cornerRadius: r.inp, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 12, itemSpacing: 8, fills: c.surface, strokes: c.border, strokeWeight: 1 });
  if (o.icon) await text({ parentId: box, characters: o.icon, fontSize: 14, fills: c.faint });
  await text({ parentId: box, characters: o.value || o.placeholder || '', fontName: jp('Regular'), fontSize: 14, fills: o.value ? c.ink : c.faint });
  return box;
}

// アバター（丸・イニシャル）。mock対策で text は width+align:CENTER で中央寄せ
export async function avatar(o) {
  const s = o.size || 36;
  const a = await frame({ name: 'avatar', parentId: o.parentId, x: o.x, y: o.y, width: s, height: s, cornerRadius: s / 2, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', fills: o.fills || c.brand100 });
  await text({ parentId: a, width: s, align: 'CENTER', characters: o.label || 'A', fontName: font('Bold'), fontSize: 14, fills: o.ink || c.brand });
  return a;
}

// 見出し（タイトル＋任意の淡いサブ/リンク）
export async function sectionHeader(o) {
  const h = await frame({ name: 'header', parentId: o.parentId, x: o.x, y: o.y, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', itemSpacing: 10, fills: null });
  await text({ parentId: h, characters: o.title, fontName: jp('Bold'), fontSize: 15, fills: c.ink });
  if (o.link) await text({ parentId: h, characters: o.link, fontName: jp('Medium'), fontSize: 12, fills: c.brand });
  return h;
}

// KPIカード + 本物のスパークライン（数字ファースト）
// valueColor で数字を色分け / spark:false でスパークライン省略（ミニマル）
export async function statCard(o) {
  const W = o.width || 320;
  const down = o.deltaTone === 'down';
  const hasSpark = o.spark !== false;
  const numberFirst = o.numberFirst; // 数字を上・ラベルを下（after-dash風）
  const card = await frame({ name: 'stat', parentId: o.parentId, x: o.x, y: o.y, width: W, height: hasSpark ? 148 : 104, cornerRadius: r.card, layoutMode: 'VERTICAL', itemSpacing: numberFirst ? 4 : 8, pad: [20, 22, 20, 22], fills: c.surface, strokes: c.border, strokeWeight: 1, effects: shadow.sm });
  const labelNode = () => text({ parentId: card, characters: o.label, fontName: jp('Medium'), fontSize: 13, fills: c.sub });
  const valueNode = () => text({ parentId: card, characters: String(o.value), fontName: font('Bold'), fontSize: 34, fills: o.valueColor || c.ink });
  if (numberFirst) { await valueNode(); await labelNode(); } else { await labelNode(); await valueNode(); }
  if (o.delta) await text({ parentId: card, characters: o.delta, fontName: jp('Medium'), fontSize: 12, fills: down ? c.ng : c.ok });
  if (hasSpark) await sparkline({ parentId: card, width: W - 44, height: 30, data: o.spark || [6, 9, 7, 12, 10, 15, 13], color: down ? c.ng : c.brand, fill: down ? c.ngBg : c.brand050 });
  return card;
}

// アクションバー（実行導線）。variant:'soft'(淡色枠) | 'solid'(グラデ塗り・白文字)
// accent でブランド色、gradient で塗りグラデを指定可能
export async function actionBar(o) {
  const solid = o.variant === 'solid';
  const accent = o.accent || c.brand;
  const h = o.height || 72;
  const barFill = solid ? (o.gradient || { gradient: 'linear', angle: 135, stops: [{ color: accent, pos: 0 }, { color: c.brandActive, pos: 1 }] }) : c.brand050;
  const bar = await frame({ name: 'actionBar', parentId: o.parentId, x: o.x, y: o.y, width: o.width || 620, height: h, cornerRadius: r.lg, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', paddingH: 20, itemSpacing: 14, fills: barFill, strokes: solid ? null : c.brand100, strokeWeight: solid ? 0 : 1, effects: solid ? shadow.md : null });
  const iconBox = await frame({ parentId: bar, width: 40, height: 40, cornerRadius: 10, layoutMode: 'VERTICAL', primaryAlign: 'CENTER', counterAlign: 'CENTER', fills: solid ? c.white : accent });
  if (o.iconName) await icon({ parentId: iconBox, name: o.iconName, size: 22, color: solid ? accent : c.white });
  else await text({ parentId: iconBox, width: 40, align: 'CENTER', characters: o.icon || '✓', fontName: font('Bold'), fontSize: 16, fills: solid ? accent : c.white });
  const txt = await frame({ parentId: bar, layoutMode: 'VERTICAL', itemSpacing: 3, fills: null });
  await text({ parentId: txt, characters: o.title || '重複チェック', fontName: jp('Bold'), fontSize: 15, fills: solid ? c.white : c.ink });
  if (o.sub) await text({ parentId: txt, characters: o.sub, fontName: jp('Regular'), fontSize: 12, fills: solid ? '#ffffffcc' : c.sub });
  return bar;
}

// テーブル（固定列幅・ゼブラ無し・行間ディバイダ）。cell = 文字 or {pill,tone}
export async function table(o) {
  const cols = o.columns;
  const innerW = cols.reduce((a, x) => a + x.w, 0);
  const t = await frame({ name: o.name || 'table', parentId: o.parentId, x: o.x, y: o.y, layoutMode: 'VERTICAL', itemSpacing: 0, fills: null });
  // ヘッダ行
  const hr = await frame({ name: 'thead', parentId: t, width: innerW, height: 34, layoutMode: 'HORIZONTAL', itemSpacing: 0, counterAlign: 'CENTER' });
  for (const col of cols) await text({ parentId: hr, width: col.w, characters: col.label, fontName: jp('Medium'), fontSize: 12, fills: c.faint, align: col.align });
  // データ行
  for (const row of o.rows) {
    await rect({ parentId: t, width: innerW, height: 1, fills: c.border });
    const rr = await frame({ name: 'tr', parentId: t, width: innerW, height: 46, layoutMode: 'HORIZONTAL', itemSpacing: 0, counterAlign: 'CENTER' });
    for (const col of cols) {
      const cell = row[col.key];
      if (cell && cell.pill) {
        const cw = await frame({ parentId: rr, width: col.w, height: 46, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', fills: null });
        await pill({ parentId: cw, label: cell.pill, tone: cell.tone });
      } else {
        await text({ parentId: rr, width: col.w, characters: String(cell && cell.text != null ? cell.text : cell), fontName: jp('Regular'), fontSize: 13, fills: c.ink, align: col.align });
      }
    }
  }
  return t;
}

// ドーナツ（外リング＋中央数値）＋凡例。segmentsは色付き比率の近似
export async function donut(o) {
  const s = o.size || 128;
  const wrap = await frame({ name: 'donut', parentId: o.parentId, x: o.x, y: o.y, width: s, height: s, fills: c.surface });
  await ellipse({ parentId: wrap, x: 0, y: 0, width: s, height: s, fills: o.ringColor || c.ok });
  const inner = Math.round(s * 0.62), off = Math.round((s - inner) / 2);
  await ellipse({ parentId: wrap, x: off, y: off, width: inner, height: inner, fills: c.surface });
  await text({ parentId: wrap, x: 0, y: Math.round(s / 2 - 18), width: s, align: 'CENTER', characters: String(o.value), fontName: font('Bold'), fontSize: 30, fills: c.ink });
  return wrap;
}

// 凡例1項目（色ドット＋ラベル）
export async function legendItem(o) {
  const it = await frame({ name: 'legend', parentId: o.parentId, x: o.x, y: o.y, layoutMode: 'HORIZONTAL', counterAlign: 'CENTER', itemSpacing: 8, fills: null });
  await ellipse({ parentId: it, width: 10, height: 10, fills: o.color });
  await text({ parentId: it, characters: o.label, fontName: jp('Regular'), fontSize: 12, fills: c.sub });
  return it;
}
