// 疎通テスト：ping→図形→テキスト→画像→矢印→export までを一気に流す
import { ping, clear, frame, rect, text, arrow, image, exportPng, zoomFit } from './fig.mjs';
import { kpiCard, button, pill, sidebar } from './components.mjs';

console.log('ping:', JSON.stringify(await ping()));
await clear();

await text({ x: 40, y: 32, characters: 'Design Driver — 疎通テスト', fontName: { family: 'Inter', style: 'Bold' }, fontSize: 28, fills: '#111827' });

await rect({ x: 40, y: 90, width: 120, height: 80, cornerRadius: 12, fills: '#2563eb' });
await rect({ x: 180, y: 90, width: 120, height: 80, cornerRadius: 12, fills: { gradient: 'linear', angle: 135, stops: [{ color: '#1e3a8a', pos: 0 }, { color: '#2563eb', pos: 1 }] } });

await sidebar({ x: 40, y: 210, height: 300, items: ['ホーム', 'チェック', '企業', '予定'], active: 1 });
await kpiCard({ x: 160, y: 210, label: '登録企業', value: '3', delta: '▲ +12% 先月比' });
await button({ x: 160, y: 380, label: '重複チェック', variant: 'primary' });
await button({ x: 340, y: 380, label: '商談を登録', variant: 'secondary' });
await pill({ x: 160, y: 440, label: 'OK — 提案可', tone: 'ok' });
await pill({ x: 320, y: 440, label: 'NG — 提案不可', tone: 'ng' });

await image({ x: 500, y: 210, width: 420, height: 280, cornerRadius: 12, url: 'http://localhost:8123/docs/figma-assets/A2-dash.png', strokes: '#e5e7eb', strokeWeight: 1 });

await arrow({ x: 460, y: 350, length: 30, stroke: '#2563eb', strokeWeight: 3 });

await zoomFit();
const r = await exportPng(undefined, 'tmp/dd-smoke.png', 1);
console.log('export:', JSON.stringify(r));
