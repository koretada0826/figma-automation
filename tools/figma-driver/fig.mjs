// Design Driver — controller SDK（私がFigmaを駆動する側）
const BASE = 'http://localhost:3055';
let _id = 1;
const nid = () => 'n' + _id++;

// 宛先ID（どのFigmaファイル＝どのプラグインに送るか）。
// 環境変数 FIG_TARGET で指定。既定 "default"（従来どおり1ファイル運用）。
// 複数同時に駆動したいときは: FIG_TARGET=a node smoke.mjs / FIG_TARGET=b node other.mjs
let TARGET = (typeof process !== 'undefined' && process.env && process.env.FIG_TARGET) || 'default';
export const getTarget = () => TARGET;
export const setTarget = (t) => { TARGET = t || 'default'; return TARGET; };

export async function send(cmd) {
  // ルーティングは _target（コマンドのノード指定 target と衝突させない）
  const body = { ...cmd, _target: cmd._target || TARGET };
  const r = await fetch(BASE + '/cmd', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (j && j.ok === false) throw new Error('cmd ' + cmd.cmd + ' failed: ' + j.error);
  return j.result != null ? j.result : j;
}
export async function health(target = TARGET) { return (await fetch(BASE + '/health?target=' + encodeURIComponent(target))).json(); }

// 低レベル：id未指定なら自動採番して返す（parentIdに使える）
async function make(cmd, opts) { const id = opts.id || nid(); await send({ ...cmd, ...opts, id }); return id; }

// 複数コマンドを1往復で実行（各コマンドは {cmd, id?, ...}）
export const batch = (commands) => send({ cmd: 'batch', commands });

export const ping = () => send({ cmd: 'ping' });
export const clear = () => send({ cmd: 'clearPage' });
export const zoomFit = () => send({ cmd: 'zoomFit' });
export const info = (target) => send({ cmd: 'getInfo', target });

export const frame = (o = {}) => make({ cmd: 'createFrame' }, o);
export const rect = (o = {}) => make({ cmd: 'createRect' }, o);
export const ellipse = (o = {}) => make({ cmd: 'createEllipse' }, o);
export const text = (o = {}) => make({ cmd: 'createText' }, o);
export const arrow = (o = {}) => make({ cmd: 'createArrow' }, o);
export const svg = (o = {}) => make({ cmd: 'createSvg' }, o);
export const image = (o = {}) => make({ cmd: 'placeImage' }, o); // o.url 必須
export const instance = (o = {}) => make({ cmd: 'instance' }, o);

export const group = (targets, o = {}) => make({ cmd: 'frameGroup', targets }, o);
export const clone = (target, o = {}) => make({ cmd: 'clone', target }, o);
export const toComponent = (target, o = {}) => make({ cmd: 'toComponent', target }, o);
export const update = (target, o = {}) => send({ cmd: 'update', target, ...o });
export const setEffects = (target, effects) => send({ cmd: 'setEffects', target, effects });
export const del = (target) => send({ cmd: 'deleteNode', target });
export const setText = (target, characters, fills) => send({ cmd: 'setText', target, characters, fills });
export const move = (target, x, y) => send({ cmd: 'move', target, x, y });
export const resize = (target, width, height) => send({ cmd: 'resize', target, width, height });
export const select = (targets, zoom = true) => send({ cmd: 'select', targets, zoom });
export const page = (name, setCurrent = true) => send({ cmd: 'createPage', name, setCurrent });

// export→保存→パス返却（私が Read で目視検証するための往復）
export const exportPng = (target, path, scale = 1) => send({ cmd: 'export', target, path, scale });

// CLI: node fig.mjs '{"cmd":"ping"}'  |  node fig.mjs health
if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv[2];
  if (a === 'health') console.log(JSON.stringify(await health()));
  else if (a) console.log(JSON.stringify(await send(JSON.parse(a))));
  else console.log('usage: node fig.mjs \'{"cmd":"ping"}\' | node fig.mjs health');
}
