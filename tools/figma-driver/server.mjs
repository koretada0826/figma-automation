// Design Driver — bridge server
// Controller(私) --HTTP /cmd--> [queue] --HTTP /next(long-poll)--> Figmaプラグイン
// プラグイン --HTTP /result|/save--> [waiter] --> Controllerへ応答
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3055;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../'); // プロジェクトルート
const queue = [];
const waiters = new Map();
const pollers = [];
let seq = 1;
let lastPluginSeen = 0;

function flushPollers() { while (pollers.length && queue.length) { json(pollers.shift(), 200, queue.shift()); } }
function json(res, code, obj) { const b = Buffer.from(JSON.stringify(obj)); res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Content-Length': b.length }); res.end(b); }
function readBody(req) { return new Promise((resolve) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch { resolve({}); } }); }); }
function resolveWaiter(id, payload) { const w = waiters.get(id); if (w) { waiters.delete(id); json(w, 200, payload); } }

const srv = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' }); return res.end(); }
  const url = req.url.split('?')[0];

  if (req.method === 'POST' && url === '/cmd') {
    const body = await readBody(req);
    const id = body.id != null ? body.id : (seq++);
    waiters.set(id, res);
    queue.push({ ...body, id });
    flushPollers();
    setTimeout(() => { if (waiters.has(id)) { waiters.delete(id); json(res, 504, { ok: false, error: 'timeout waiting for plugin' }); } }, 120000);
    return;
  }

  if (req.method === 'GET' && url === '/next') {
    lastPluginSeen = Date.now();
    if (queue.length) return json(res, 200, queue.shift());
    pollers.push(res);
    setTimeout(() => { const i = pollers.indexOf(res); if (i >= 0) { pollers.splice(i, 1); if (!res.writableEnded) json(res, 204, {}); } }, 25000);
    return;
  }

  if (req.method === 'POST' && url === '/result') {
    const body = await readBody(req);
    resolveWaiter(body.id, body);
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
      resolveWaiter(body.id, { ok: true, saved: abs });
      return json(res, 200, { ok: true });
    } catch (e) { resolveWaiter(body.id, { ok: false, error: String(e.message || e) }); return json(res, 200, { ok: false }); }
  }

  if (req.method === 'GET' && url === '/health') return json(res, 200, { ok: true, pluginConnected: Date.now() - lastPluginSeen < 30000, queued: queue.length });

  json(res, 404, { ok: false, error: 'not found' });
});

srv.listen(PORT, () => console.log(`[design-driver] bridge on http://localhost:${PORT}  root=${ROOT}`));
