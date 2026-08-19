// Headless mock "Figma plugin" — verify the whole pipeline without real Figma.
import { chromium } from 'playwright';

const BASE = 'http://localhost:3055';
let scene = { nodes: {}, roots: [] };

function resetScene() { scene = { nodes: {}, roots: [] }; }
function addNode(cmd) {
  const node = { id: cmd.id, cmd, children: [] };
  scene.nodes[cmd.id] = node;
  if (cmd.parentId != null && scene.nodes[cmd.parentId]) scene.nodes[cmd.parentId].children.push(node);
  else scene.roots.push(node);
  return { nodeId: 'mock:' + cmd.id, type: cmd.cmd };
}

async function execOne(cmd) {
  switch (cmd.cmd) {
    case 'ping': return { pong: true, editor: 'mock', page: 'MockPage' };
    case 'clearPage': { const n = scene.roots.length; resetScene(); return { cleared: n }; }
    case 'zoomFit': return { ok: true };
    case 'getInfo': return { page: 'MockPage', children: scene.roots.length };
    case 'placeImage': {
      const r = await fetch(cmd.url); const buf = Buffer.from(await r.arrayBuffer());
      cmd._dataUrl = 'data:image/png;base64,' + buf.toString('base64');
      return addNode(cmd);
    }
    case 'batch': { const out = []; for (const cc of (cmd.commands || [])) out.push(await execOne(cc)); return out; }
    case 'deleteNode': { const n = scene.nodes[cmd.target]; if (n) { const ri = scene.roots.indexOf(n); if (ri >= 0) scene.roots.splice(ri, 1); for (const k in scene.nodes) { const ci = scene.nodes[k].children.indexOf(n); if (ci >= 0) scene.nodes[k].children.splice(ci, 1); } delete scene.nodes[cmd.target]; } return { ok: true }; }
    case 'setText': { const n = scene.nodes[cmd.target]; if (n) { n.cmd.characters = cmd.characters; if (cmd.fills != null) n.cmd.fills = cmd.fills; } return { nodeId: 'mock:' + cmd.target }; }
    default: return addNode(cmd);
  }
}

function measure(node) {
  const c = node.cmd;
  if (c.cmd === 'createText') {
    const fs = c.fontSize || 14;
    const w = c.width || Math.max(20, String(c.characters || '').length * fs * 0.62);
    const h = c.height || Math.round(fs * 1.5);
    node._w = w; node._h = h; return { w, h };
  }
  if (c.cmd === 'createArrow') { node._w = c.length || 100; node._h = Math.max(8, (c.strokeWeight || 3) + 6); return { w: node._w, h: node._h }; }
  if (c.cmd === 'createFrame' && c.layoutMode) {
    const pl = c.paddingH != null ? c.paddingH : (c.pad ? c.pad[3] : (c.padding || 0));
    const pr = c.paddingH != null ? c.paddingH : (c.pad ? c.pad[1] : (c.padding || 0));
    const pt = c.paddingV != null ? c.paddingV : (c.pad ? c.pad[0] : (c.padding || 0));
    const pb = c.paddingV != null ? c.paddingV : (c.pad ? c.pad[2] : (c.padding || 0));
    const gap = c.itemSpacing || 0;
    const sizes = node.children.map(measure);
    let cw = 0, ch = 0;
    if (c.layoutMode === 'HORIZONTAL') { cw = sizes.reduce((a, s) => a + s.w, 0) + gap * Math.max(0, sizes.length - 1); ch = Math.max(0, ...sizes.map((s) => s.h)); }
    else { ch = sizes.reduce((a, s) => a + s.h, 0) + gap * Math.max(0, sizes.length - 1); cw = Math.max(0, ...sizes.map((s) => s.w)); }
    node._w = Math.max(c.width || 0, cw + pl + pr); node._h = Math.max(c.height || 0, ch + pt + pb);
    node._pad = { pl, pr, pt, pb, gap };
    return { w: node._w, h: node._h };
  }
  node._w = c.width || 100; node._h = c.height || (c.cmd === 'createEllipse' ? 40 : 80);
  node.children.forEach(measure); // 非オートレイアウトのフレームでも子を測る（絶対配置対応）
  return { w: node._w, h: node._h };
}
function place(node, x, y) {
  node._x = x; node._y = y;
  const c = node.cmd;
  if (c.cmd === 'createFrame' && c.layoutMode && node._pad) {
    const { pl, pt, pr, pb, gap } = node._pad;
    let cx = x + pl, cy = y + pt;
    const innerW = node._w - pl - pr, innerH = node._h - pt - pb;
    for (const ch of node.children) {
      let ox = cx, oy = cy;
      if (c.layoutMode === 'HORIZONTAL') { if (c.counterAlign === 'CENTER') oy = y + pt + (innerH - ch._h) / 2; }
      else { if (c.counterAlign === 'CENTER') ox = x + pl + (innerW - ch._w) / 2; }
      place(ch, ox, oy);
      if (c.layoutMode === 'HORIZONTAL') cx += ch._w + gap; else cy += ch._h + gap;
    }
  } else {
    for (const ch of node.children) place(ch, x + (ch.cmd.x || 0), y + (ch.cmd.y || 0));
  }
}
function cssFill(fills, fallback) {
  const v = Array.isArray(fills) ? fills[0] : fills;
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (v.gradient) { const stops = (v.stops || []).map((s) => s.color + ' ' + Math.round(s.pos * 100) + '%').join(','); return 'linear-gradient(' + (v.angle || 90) + 'deg, ' + stops + ')'; }
  if (v.color) return typeof v.color === 'string' ? v.color : fallback;
  return fallback;
}
function escapeHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function renderNode(node) {
  const c = node.cmd; const x = node._x, y = node._y, w = node._w, h = node._h;
  const base = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;box-sizing:border-box;';
  const radius = c.radii ? 'border-radius:' + c.radii[0] + 'px ' + c.radii[1] + 'px ' + c.radii[2] + 'px ' + c.radii[3] + 'px;' : (c.cornerRadius ? 'border-radius:' + c.cornerRadius + 'px;' : '');
  const border = c.strokes ? 'border:' + (c.strokeWeight || 1) + 'px solid ' + cssFill(c.strokes, '#e5e7eb') + ';' : '';
  const shadow = c.effects && c.effects.length ? 'box-shadow:0 8px 24px rgba(15,23,42,.10);' : '';
  let html = '';
  if (c.cmd === 'createText') {
    const weight = (c.fontName && c.fontName.style) || c.weight || 'Regular';
    const fw = /Bold/i.test(weight) ? 700 : /Medium|Semi/i.test(weight) ? 600 : 400;
    html = '<div style="' + base + 'color:' + cssFill(c.fills, '#111827') + ';font-size:' + (c.fontSize || 14) + 'px;font-weight:' + fw + ';line-height:' + (c.lineHeight || (c.fontSize || 14) * 1.4) + 'px;display:flex;align-items:center;justify-content:' + (c.align === 'CENTER' ? 'center' : 'flex-start') + ';white-space:pre">' + escapeHtml(c.characters) + '</div>';
  } else if (c.cmd === 'createArrow') {
    html = '<div style="' + base + '"><svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><line x1="1" y1="' + (h / 2) + '" x2="' + (w - 8) + '" y2="' + (h / 2) + '" stroke="' + cssFill(c.stroke, '#2563eb') + '" stroke-width="' + (c.strokeWeight || 3) + '" stroke-linecap="round"/><path d="M ' + (w - 12) + ' ' + (h / 2 - 5) + ' L ' + (w - 2) + ' ' + (h / 2) + ' L ' + (w - 12) + ' ' + (h / 2 + 5) + '" fill="none" stroke="' + cssFill(c.stroke, '#2563eb') + '" stroke-width="' + (c.strokeWeight || 3) + '" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  } else if (c.cmd === 'createSvg') {
    // SVG文字列をそのまま埋め込み（幅高さにフィット）。本物Figmaは createNodeFromSvg で描画。
    const svg = String(c.svg || '').replace(/<svg /, '<svg width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid meet" ');
    html = '<div style="' + base + '">' + svg + '</div>';
  } else if (c.cmd === 'placeImage') {
    html = '<div style="' + base + radius + border + shadow + 'overflow:hidden"><img src="' + c._dataUrl + '" style="width:100%;height:100%;object-fit:cover"/></div>';
  } else {
    // fills が null/空配列のフレームは透明（構造用フレーム）。本物Figmaの createFrame と挙動を一致させる
    const transparent = c.cmd === 'createFrame' && (c.fills == null || (Array.isArray(c.fills) && c.fills.length === 0));
    const bg = transparent ? 'transparent' : cssFill(c.fills, c.cmd === 'createEllipse' ? '#e5e7eb' : '#ffffff');
    const ell = c.cmd === 'createEllipse' ? 'border-radius:50%;' : '';
    html = '<div style="' + base + 'background:' + bg + ';' + radius + ell + border + shadow + '"></div>';
  }
  return html + node.children.map(renderNode).join('');
}

let browser;
async function renderPng(scale) {
  const roots = scene.roots;
  roots.forEach((n) => measure(n));
  roots.forEach((n) => place(n, n.cmd.x || 0, n.cmd.y || 0));
  if (process.env.DDDEBUG) { const dump = (n, d) => { console.log('  '.repeat(d) + (n.cmd.name || n.cmd.cmd) + (n.cmd.characters ? ' "' + n.cmd.characters + '"' : '') + ' @(' + n._x + ',' + n._y + ') ' + n._w + 'x' + n._h + (n.cmd.layoutMode ? ' [' + n.cmd.layoutMode + ']' : '')); n.children.forEach((c) => dump(c, d + 1)); }; roots.forEach((n) => dump(n, 0)); }
  let maxX = 0, maxY = 0;
  const walk = (n) => { maxX = Math.max(maxX, n._x + n._w); maxY = Math.max(maxY, n._y + n._h); n.children.forEach(walk); };
  roots.forEach(walk);
  const W = Math.ceil(maxX + 24), Hh = Math.ceil(maxY + 24);
  const body = roots.map(renderNode).join('');
  const html = '<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}body{font-family:Inter,\'Noto Sans JP\',system-ui,sans-serif;background:#f8fafc}</style></head><body style="position:relative;width:' + W + 'px;height:' + Hh + 'px">' + body + '</body></html>';
  if (!browser) browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: scale || 1 });
  await page.setViewportSize({ width: W, height: Hh });
  await page.setContent(html, { waitUntil: 'networkidle' });
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: Hh } });
  await page.close();
  return buf.toString('base64');
}

async function post(path, body) { try { await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); } catch (e) {} }
async function loop() {
  console.log('[mock] connected to bridge, waiting for commands');
  while (true) {
    let cmd;
    try { const r = await fetch(BASE + '/next'); if (r.status === 204) continue; cmd = await r.json(); }
    catch (e) { await new Promise((s) => setTimeout(s, 500)); continue; }
    if (!cmd || !cmd.cmd) continue;
    console.log('[mock] recv #' + cmd.id + ' ' + cmd.cmd);
    try {
      if (cmd.cmd === 'export') { const base64 = await renderPng(cmd.scale); await post('/save', { id: cmd.id, path: cmd.path, base64 }); console.log('[mock] export', cmd.path); }
      else { const result = await execOne(cmd); await post('/result', { id: cmd.id, ok: true, result }); }
    } catch (e) { await post('/result', { id: cmd.id, ok: false, error: String(e.message || e) }); console.log('[mock] err', cmd.cmd, e.message); }
  }
}
loop();
