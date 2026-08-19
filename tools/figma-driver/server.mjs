// Design Driver — bridge server（宛先ID/targetルーティング対応）
// Controller --POST /cmd {target}--> [targetごとのqueue] --GET /next?target--> 各Figmaプラグイン
// プラグイン --POST /result|/save {id,target}--> [waiter] --> Controllerへ応答
// ★ target を付けると複数のFigmaファイル（プラグイン）を同時に別々に駆動できる。
//   target 省略時は "default"（＝従来どおり1ファイル運用と完全互換）。
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3055;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../');
const queues = new Map();   // target -> [cmd...]
const pollers = new Map();  // target -> [res...]
const lastSeen = new Map(); // target -> timestamp
const waiters = new Map();  // "target::id" -> res
let seq = 1;

const q = (t) => (queues.has(t) ? queues.get(t) : (queues.set(t, []), queues.get(t)));
const pl = (t) => (pollers.has(t) ? pollers.get(t) : (pollers.set(t, []), pollers.get(t)));
const wkey = (t, id) => t + '::' + id;
function flush(t) { const P = pl(t), Q = q(t); while (P.length && Q.length) json(P.shift(), 200, Q.shift()); }
function json(res, code, obj) { const b = Buffer.from(JSON.stringify(obj)); res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Content-Length': b.length }); res.end(b); }
function readBody(req) { return new Promise((resolve) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch { resolve({}); } }); }); }
function resolveWaiter(t, id, payload) { const k = wkey(t, id); const w = waiters.get(k); if (w) { waiters.delete(k); json(w, 200, payload); } }
const connected = (t) => Date.now() - (lastSeen.get(t) || 0) < 30000;

const srv = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' }); return res.end(); }
  const u = new URL(req.url, 'http://localhost');
  const url = u.pathname;
  const qTarget = u.searchParams.get('target') || 'default';

  if (req.method === 'POST' && url === '/cmd') {
    const body = await readBody(req);
    const target = body._target || 'default';
    const id = body.id != null ? body.id : (seq++);
    waiters.set(wkey(target, id), res);
    q(target).push({ ...body, id }); // コマンドの target(ノード指定)は保持。_target はルーティング用
    flush(target);
    setTimeout(() => { const k = wkey(target, id); if (waiters.has(k)) { waiters.delete(k); json(res, 504, { ok: false, error: 'timeout waiting for plugin (target=' + target + ')' }); } }, 120000);
    return;
  }

  if (req.method === 'GET' && url === '/next') {
    lastSeen.set(qTarget, Date.now());
    const Q = q(qTarget);
    if (Q.length) return json(res, 200, Q.shift());
    const P = pl(qTarget); P.push(res);
    setTimeout(() => { const i = P.indexOf(res); if (i >= 0) { P.splice(i, 1); if (!res.writableEnded) json(res, 204, {}); } }, 25000);
    return;
  }

  if (req.method === 'POST' && url === '/result') {
    const body = await readBody(req);
    resolveWaiter(body._target || 'default', body.id, body);
    return json(res, 200, { ok: true });
  }

  // プラグインが書き出したPNGを保存（export往復）
  if (req.method === 'POST' && url === '/save') {
    const body = await readBody(req);
    try {
      const rel = (body.path || 'tmp/export.png').replace(/^\/+/, '');
      const abs = path.resolve(ROOT, rel);
      if (!abs.startsWith(ROOT)) throw new Error('path outside project');
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, Buffer.from(body.base64, 'base64'));
      resolveWaiter(body._target || 'default', body.id, { ok: true, saved: abs });
      return json(res, 200, { ok: true });
    } catch (e) { resolveWaiter(body._target || 'default', body.id, { ok: false, error: String(e.message || e) }); return json(res, 200, { ok: false }); }
  }

  if (req.method === 'GET' && url === '/health') {
    if (u.searchParams.has('target')) return json(res, 200, { ok: true, target: qTarget, pluginConnected: connected(qTarget), queued: q(qTarget).length });
    const targets = {}; for (const t of lastSeen.keys()) targets[t] = { connected: connected(t), queued: q(t).length };
    return json(res, 200, { ok: true, targets, pluginConnected: [...lastSeen.keys()].some(connected), queued: q('default').length });
  }

  json(res, 404, { ok: false, error: 'not found' });
});

srv.listen(PORT, () => console.log(`[design-driver] bridge on http://localhost:${PORT}  root=${ROOT}  (target routing・既定 default)`));
