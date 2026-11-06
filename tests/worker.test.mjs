import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { Counter } from '../worker.js';

class FakeStorage {
  constructor() { this.m = new Map(); }
  async get(k) { return this.m.get(k); }
  async put(k, v) { this.m.set(k, v); }
  async list() { return new Map(this.m); }
}
const counter = () => new Counter({ storage: new FakeStorage() });
const post = (body, path = '/api/event') => new Request(`https://x${path}`, { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) });
const stats = async (c) => (await (await c.fetch(new Request('https://x/api/stats'))).json()).counts;
const today = () => new Date().toISOString().slice(0, 10);

test('a result is counted in total, per language, per day and per situation', async () => {
  const c = counter();
  for (let n = 0; n < 2; n++) assert.equal((await c.fetch(post({ event: 'result', lang: 'hi', situation: 'asked_to_pay' }))).status, 204);
  const s = await stats(c);
  assert.equal(s['total:result'], 2);
  assert.equal(s['lang:hi:result'], 2);
  assert.equal(s[`day:${today()}:result`], 2);
  assert.equal(s['situation:asked_to_pay'], 2);
});

test('copy, share and the three "Did it work?" answers are counted', async () => {
  const c = counter();
  const EVENTS = ['copy', 'share', 'worked_yes', 'worked_no', 'worked_notyet'];
  for (const event of EVENTS) assert.equal((await c.fetch(post({ event, lang: 'en' }))).status, 204, event);
  const s = await stats(c);
  for (const event of EVENTS) assert.equal(s[`total:${event}`], 1);
});

test('bad events are rejected with 400 and nothing is stored', async () => {
  const c = counter();
  const bad = [
    { event: 'name', lang: 'en' },
    { event: 'copy', lang: 'xx' },
    { event: 'result', lang: 'en' },
    { event: 'result', lang: 'en', situation: 'aadhaar_123' },
    { event: 'result', lang: 'en', situation: 'toString' },
    { event: 'copy', lang: 'en', situation: 'asked_to_pay' },
    '{not json',
  ];
  for (const b of bad) assert.equal((await c.fetch(post(b))).status, 400, JSON.stringify(b));
  assert.deepEqual(await stats(c), {});
});

test('only event, language, day and situation are stored, never stage, age or extra fields', async () => {
  const c = counter();
  await c.fetch(post({ event: 'result', lang: 'en', situation: 'no_card', stage: 'admitted', age70: 'yes', aadhaar: 'x' }));
  const keys = Object.keys(await stats(c)).sort();
  assert.deepEqual(keys, [`day:${today()}:result`, 'lang:en:result', 'situation:no_card', 'total:result']);
});

test('the worker routes /api/event (POST) and /api/stats (GET); wrong method 405, unknown /api 404, rest is static', async () => {
  const seen = [];
  const env = {
    ASSETS: { fetch: async (r) => { seen.push(new URL(r.url).pathname); return new Response('asset'); } },
    COUNTER: { idFromName: (n) => n, get: () => counter() },
  };
  assert.equal(await (await worker.fetch(new Request('https://x/'), env)).text(), 'asset');
  assert.equal(await (await worker.fetch(new Request('https://x/stats'), env)).text(), 'asset');
  assert.equal((await worker.fetch(new Request('https://x/api/stats'), env)).status, 200);
  assert.equal((await worker.fetch(post({ event: 'share', lang: 'en' }), env)).status, 204);
  assert.equal((await worker.fetch(new Request('https://x/api/event'), env)).status, 405);
  assert.equal((await worker.fetch(post({}, '/api/stats'), env)).status, 405);
  assert.equal((await worker.fetch(new Request('https://x/api/other'), env)).status, 404);
  assert.deepEqual(seen, ['/', '/stats']);
});
