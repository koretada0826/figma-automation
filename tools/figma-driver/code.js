// Design Driver — plugin main（公式Plugin APIを実行）/ 拡張版
figma.showUI(__html__, { width: 320, height: 220 });

const nodes = {}; // localId -> node

/* ---------------- helpers ---------------- */
function hexToRgb(hex) {
  const h = String(hex).replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return { r: parseInt(n.slice(0, 2), 16) / 255, g: parseInt(n.slice(2, 4), 16) / 255, b: parseInt(n.slice(4, 6), 16) / 255 };
}
function color(v) { return typeof v === 'string' ? hexToRgb(v) : v; }
function paint(v) {
  if (v == null) return null;
  if (typeof v === 'string') return { type: 'SOLID', color: hexToRgb(v) };
  if (v.gradient) {
    const type = v.gradient === 'radial' ? 'GRADIENT_RADIAL' : 'GRADIENT_LINEAR';
    const a = ((v.angle == null ? 90 : v.angle) * Math.PI) / 180;
    const transform = [[Math.cos(a), Math.sin(a), 0], [-Math.sin(a), Math.cos(a), 0]];
    return { type, gradientTransform: transform, gradientStops: (v.stops || []).map((s) => ({ position: s.pos, color: Object.assign({ a: s.opacity == null ? 1 : s.opacity }, color(s.color)) })) };
  }
  if (v.color) return { type: 'SOLID', color: color(v.color), opacity: v.opacity };
  return null;
}
function paints(fills) { if (fills == null) return undefined; return (Array.isArray(fills) ? fills : [fills]).map(paint).filter(Boolean); }
function parent(id) { return (id != null && nodes[id]) ? nodes[id] : figma.currentPage; }
function effect(e) {
  const t = e.type || 'DROP_SHADOW';
  if (t === 'LAYER_BLUR' || t === 'BACKGROUND_BLUR') return { type: t, radius: e.radius || 8, visible: true };
  return { type: t, color: Object.assign({ a: e.opacity == null ? 0.15 : e.opacity }, color(e.color || '#000000')), offset: e.offset || { x: 0, y: 2 }, radius: e.radius == null ? 6 : e.radius, spread: e.spread || 0, visible: true, blendMode: 'NORMAL' };
}
function applyCommon(n, cmd) {
  if (cmd.name) n.name = cmd.name;
  if (cmd.x != null) n.x = cmd.x;
  if (cmd.y != null) n.y = cmd.y;
  if (cmd.opacity != null) n.opacity = cmd.opacity;
  if (cmd.rotation != null) n.rotation = cmd.rotation;
  if (cmd.visible != null) n.visible = cmd.visible;
  if (cmd.blendMode) n.blendMode = cmd.blendMode;
  if (cmd.radii && 'topLeftRadius' in n) { n.topLeftRadius = cmd.radii[0]; n.topRightRadius = cmd.radii[1]; n.bottomRightRadius = cmd.radii[2]; n.bottomLeftRadius = cmd.radii[3]; }
  else if (cmd.cornerRadius != null && 'cornerRadius' in n) n.cornerRadius = cmd.cornerRadius;
  if (cmd.fills != null && 'fills' in n) n.fills = paints(cmd.fills);
  if (cmd.strokes != null && 'strokes' in n) { n.strokes = paints(cmd.strokes); if (cmd.strokeWeight) n.strokeWeight = cmd.strokeWeight; if (cmd.strokeAlign) n.strokeAlign = cmd.strokeAlign; }
  if (cmd.effects && 'effects' in n) n.effects = cmd.effects.map(effect);
}
function autoLayout(n, cmd) {
  if (!cmd.layoutMode) return;
  n.layoutMode = cmd.layoutMode;
  if (cmd.itemSpacing != null) n.itemSpacing = cmd.itemSpacing;
  if (cmd.padding != null) { n.paddingTop = n.paddingBottom = n.paddingLeft = n.paddingRight = cmd.padding; }
  if (cmd.paddingV != null) { n.paddingTop = n.paddingBottom = cmd.paddingV; }
  if (cmd.paddingH != null) { n.paddingLeft = n.paddingRight = cmd.paddingH; }
  if (cmd.pad) { const p = cmd.pad; n.paddingTop = p[0]; n.paddingRight = p[1]; n.paddingBottom = p[2]; n.paddingLeft = p[3]; }
  if (cmd.primaryAxisSizing) n.primaryAxisSizingMode = cmd.primaryAxisSizing;
  if (cmd.counterAxisSizing) n.counterAxisSizingMode = cmd.counterAxisSizing;
  if (cmd.primaryAlign) n.primaryAxisAlignItems = cmd.primaryAlign;
  if (cmd.counterAlign) n.counterAxisAlignItems = cmd.counterAlign;
  if (cmd.wrap) n.layoutWrap = 'WRAP';
}
async function loadFont(fontName) {
  const req = fontName || { family: 'Inter', style: 'Regular' };
  const tries = [req, { family: 'Noto Sans JP', style: req.style || 'Regular' }, { family: 'Noto Sans CJK JP', style: 'Regular' }, { family: 'Inter', style: req.style || 'Regular' }, { family: 'Inter', style: 'Regular' }, { family: 'Roboto', style: 'Regular' }];
  for (const f of tries) { try { await figma.loadFontAsync(f); return f; } catch (e) {} }
  return { family: 'Roboto', style: 'Regular' };
}
function recolor(node, hex) { const c = hexToRgb(hex); const walk = (n) => { if ('fills' in n && Array.isArray(n.fills)) { try { n.fills = [{ type: 'SOLID', color: c }]; } catch (e) {} } if ('children' in n) n.children.forEach(walk); }; walk(node); }
function summary(n) { return { nodeId: n.id, type: n.type, name: n.name, x: n.x, y: n.y, w: n.width, h: n.height }; }

/* ---------------- command table ---------------- */
const H = {
  async ping() { return { pong: true, editor: figma.editorType, page: figma.currentPage.name }; },

  async clearPage() { const k = figma.currentPage.children.slice(); k.forEach((c) => c.remove()); for (const id in nodes) delete nodes[id]; return { cleared: k.length }; },

  async createFrame(cmd) { const f = figma.createFrame(); f.resize(cmd.width || 100, cmd.height || 100); if (!('fills' in cmd)) f.fills = paints('#ffffff'); else if (cmd.fills == null) f.fills = []; applyCommon(f, cmd); if (cmd.clip != null) f.clipsContent = cmd.clip; autoLayout(f, cmd); parent(cmd.parentId).appendChild(f); if (cmd.id != null) nodes[cmd.id] = f; return summary(f); },

  async createRect(cmd) { const r = figma.createRectangle(); r.resize(cmd.width || 100, cmd.height || 100); if (cmd.fills == null) r.fills = paints('#e5e7eb'); applyCommon(r, cmd); parent(cmd.parentId).appendChild(r); if (cmd.id != null) nodes[cmd.id] = r; return summary(r); },

  async createEllipse(cmd) { const e = figma.createEllipse(); e.resize(cmd.width || 40, cmd.height || 40); if (cmd.fills == null) e.fills = paints('#e5e7eb'); applyCommon(e, cmd); parent(cmd.parentId).appendChild(e); if (cmd.id != null) nodes[cmd.id] = e; return summary(e); },

  async createText(cmd) {
    const font = await loadFont(cmd.fontName || { family: 'Inter', style: cmd.weight || 'Regular' });
    const t = figma.createText(); t.fontName = font; t.characters = String(cmd.characters == null ? '' : cmd.characters);
    if (cmd.fontSize) t.fontSize = cmd.fontSize;
    if (cmd.lineHeight) t.lineHeight = { value: cmd.lineHeight, unit: 'PIXELS' };
    if (cmd.letterSpacing != null) t.letterSpacing = { value: cmd.letterSpacing, unit: 'PIXELS' };
    if (cmd.textCase) t.textCase = cmd.textCase;
    if (cmd.decoration) t.textDecoration = cmd.decoration;
    if (cmd.align) t.textAlignHorizontal = cmd.align;
    if (cmd.valign) t.textAlignVertical = cmd.valign;
    t.fills = paints(cmd.fills == null ? '#111827' : cmd.fills);
    if (cmd.width) { t.textAutoResize = cmd.autoResize || 'HEIGHT'; t.resize(cmd.width, t.height); if (cmd.height) { t.textAutoResize = 'NONE'; t.resize(cmd.width, cmd.height); } }
    applyCommon(t, cmd); parent(cmd.parentId).appendChild(t); if (cmd.id != null) nodes[cmd.id] = t; return summary(t);
  },

  async createArrow(cmd) { const ln = figma.createLine(); ln.resize(cmd.length || 100, 0); ln.strokeWeight = cmd.strokeWeight || 3; ln.strokes = paints(cmd.stroke || '#2563eb'); ln.strokeCap = cmd.cap || 'ARROW_LINES'; applyCommon(ln, cmd); parent(cmd.parentId).appendChild(ln); if (cmd.id != null) nodes[cmd.id] = ln; return summary(ln); },

  async createSvg(cmd) { const n = figma.createNodeFromSvg(cmd.svg); if (cmd.width && cmd.height) n.resize(cmd.width, cmd.height); applyCommon(n, cmd); if (cmd.color) recolor(n, cmd.color); parent(cmd.parentId).appendChild(n); if (cmd.id != null) nodes[cmd.id] = n; return summary(n); },

  async placeImageBytes(cmd) { const img = figma.createImage(new Uint8Array(cmd.bytes)); const r = figma.createRectangle(); r.resize(cmd.width || 400, cmd.height || 300); applyCommon(r, cmd); r.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: cmd.scaleMode || 'FILL' }]; parent(cmd.parentId).appendChild(r); if (cmd.id != null) nodes[cmd.id] = r; return summary(r); },

  async group(cmd) { const arr = (cmd.targets || []).map((t) => nodes[t]).filter(Boolean); if (!arr.length) throw new Error('group: no targets'); const g = figma.group(arr, arr[0].parent); if (cmd.name) g.name = cmd.name; if (cmd.id != null) nodes[cmd.id] = g; return summary(g); },

  async frameGroup(cmd) { const arr = (cmd.targets || []).map((t) => nodes[t]).filter(Boolean); const f = figma.createFrame(); f.name = cmd.name || 'Group'; parent(cmd.parentId).appendChild(f); arr.forEach((n) => f.appendChild(n)); if (cmd.id != null) nodes[cmd.id] = f; return summary(f); },

  async clone(cmd) { const n = nodes[cmd.target]; if (!n) throw new Error('clone: no node'); const c = n.clone(); if (cmd.x != null) c.x = cmd.x; if (cmd.y != null) c.y = cmd.y; (n.parent || figma.currentPage).appendChild(c); if (cmd.id != null) nodes[cmd.id] = c; return summary(c); },

  async toComponent(cmd) { const n = nodes[cmd.target]; if (!n) throw new Error('toComponent: no node'); const comp = figma.createComponentFromNode(n); if (cmd.id != null) nodes[cmd.id] = comp; return summary(comp); },

  async instance(cmd) { const comp = nodes[cmd.componentId]; if (!comp || comp.type !== 'COMPONENT') throw new Error('instance: not a component'); const inst = comp.createInstance(); applyCommon(inst, cmd); parent(cmd.parentId).appendChild(inst); if (cmd.id != null) nodes[cmd.id] = inst; return summary(inst); },

  async update(cmd) { const n = nodes[cmd.target]; if (!n) throw new Error('update: no node'); if (cmd.width != null || cmd.height != null) n.resize(cmd.width != null ? cmd.width : n.width, cmd.height != null ? cmd.height : n.height); applyCommon(n, cmd); if (n.type === 'FRAME') autoLayout(n, cmd); return summary(n); },

  async setEffects(cmd) { const n = nodes[cmd.target]; if (!n) throw new Error('setEffects: no node'); n.effects = (cmd.effects || []).map(effect); return summary(n); },

  async appendTo(cmd) { const n = nodes[cmd.target]; const p = parent(cmd.parentId); if (!n) throw new Error('appendTo: no node'); p.appendChild(n); return summary(n); },

  async move(cmd) { const n = nodes[cmd.target]; if (!n) throw new Error('move: no node'); n.x = cmd.x; n.y = cmd.y; return summary(n); },
  async resize(cmd) { const n = nodes[cmd.target]; if (!n) throw new Error('resize: no node'); n.resize(cmd.width, cmd.height); return summary(n); },

  async getInfo(cmd) { const n = cmd.target != null ? nodes[cmd.target] : null; if (n) return summary(n); return { page: figma.currentPage.name, children: figma.currentPage.children.length }; },

  async select(cmd) { const arr = (cmd.targets || []).map((t) => nodes[t]).filter(Boolean); figma.currentPage.selection = arr; if (cmd.zoom) figma.viewport.scrollAndZoomIntoView(arr); return { selected: arr.length }; },

  async createPage(cmd) { const p = figma.createPage(); p.name = cmd.name || 'Page'; if (cmd.setCurrent) figma.currentPage = p; return { name: p.name }; },

  async zoomFit() { figma.viewport.scrollAndZoomIntoView(figma.currentPage.children); return { ok: true }; },

  async deleteNode(cmd) { const n = nodes[cmd.target]; if (!n) throw new Error('deleteNode: no node ' + cmd.target); n.remove(); delete nodes[cmd.target]; return { ok: true }; },

  async setText(cmd) { const n = nodes[cmd.target]; if (!n || n.type !== 'TEXT') throw new Error('setText: not a text node'); await figma.loadFontAsync(n.fontName); n.characters = String(cmd.characters == null ? '' : cmd.characters); if (cmd.fills != null) n.fills = paints(cmd.fills); return summary(n); },

  // 複数コマンドを1往復で逐次実行（画像以外）。フォント読込はcreateText内で担保
  async batch(cmd) { const out = []; for (const cc of (cmd.commands || [])) { const fn = H[cc.cmd]; if (!fn) throw new Error('batch: unknown cmd ' + cc.cmd); out.push(await fn(cc)); } return out; },

  // export はUI経由でファイル保存（下の onmessage 'export' 参照）
};

/* ---------------- bridge ---------------- */
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'exec') {
      const fn = H[msg.command.cmd];
      if (!fn) throw new Error('unknown cmd: ' + msg.command.cmd);
      const result = await fn(msg.command);
      figma.ui.postMessage({ type: 'result', id: msg.id, ok: true, result });
    } else if (msg.type === 'placeImage') {
      const result = await H.placeImageBytes(Object.assign({}, msg.command, { bytes: msg.bytes }));
      figma.ui.postMessage({ type: 'result', id: msg.id, ok: true, result });
    } else if (msg.type === 'export') {
      const n = msg.command.target != null ? nodes[msg.command.target] : figma.currentPage;
      if (!n) throw new Error('export: no node');
      const bytes = await n.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: msg.command.scale || 1 } });
      figma.ui.postMessage({ type: 'exported', id: msg.id, path: msg.command.path, bytes });
    }
  } catch (e) {
    figma.ui.postMessage({ type: 'result', id: msg.id, ok: false, error: String((e && e.message) || e) });
  }
};
