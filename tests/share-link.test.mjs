// A relative at home can work out the rules and send the same result to whoever is at the hospital counter.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shareUrl, answersFrom, adviceFor, STAGES, SITUATIONS, AGE70 } from '../rules.js';
import { STRINGS } from '../i18n.js';

const O = 'https://x.example';

test('every answer set round-trips through the link and still gives advice', () => {
  for (const stage of STAGES) for (const situation of SITUATIONS) for (const age70 of AGE70) for (const lang of ['en', 'hi']) {
    const url = new URL(shareUrl(O, { stage, situation, age70 }, lang));
    assert.equal(url.searchParams.get('lang'), lang);
    const back = answersFrom(url.search);
    assert.deepEqual(back, { stage, situation, age70 });
    assert.ok(adviceFor(back).rules.length > 0);
  }
});

test('the link carries only the language and the three answers', () => {
  const url = new URL(shareUrl(O, { stage: 'admitted', situation: 'asked_to_pay', age70: 'no', name: 'x' }, 'hi'));
  assert.deepEqual([...url.searchParams.keys()].sort(), ['age70', 'lang', 'situation', 'stage']);
  assert.equal(url.pathname, '/');
});

test('a missing or unknown answer opens the normal first screen', () => {
  for (const s of ['', '?lang=hi', '?stage=admitted&situation=asked_to_pay', '?stage=admitted&situation=<script>&age70=no', '?stage=x&situation=asked_to_pay&age70=no', '?stage=admitted&situation=asked_to_pay&age70=maybe']) {
    assert.equal(answersFrom(s), null, s);
  }
});

test('app.js opens a shared link on the result and offers the link; worker and /stats know the event', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(app, /answersFrom\(location\.search\)/);
  assert.match(app, /shareUrl\(location\.origin, answers, lang\)/);
  assert.match(app, /count\('share_link'\)/);
  for (const f of ['worker.js', 'stats.html']) assert.ok(readFileSync(new URL(`../${f}`, import.meta.url), 'utf8').includes("'share_link'"), f);
  for (const l of ['en', 'hi']) for (const k of ['pass_on', 'pass_text']) assert.ok(STRINGS[l][k], `${l}.${k}`);
});
