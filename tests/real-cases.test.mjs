// Replays real court and Consumer Commission decisions (evidence/real-cases) through the app's rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adviceFor, STAGES, SITUATIONS, AGE70 } from '../rules.js';

const dir = new URL('../evidence/real-cases/', import.meta.url);
const { cases } = JSON.parse(readFileSync(new URL('cases.json', dir), 'utf8'));
const flat = (s) => s.replace(/\s+/g, ' ');

test('there are real cases, ids unique, situations and stages the screens can give', () => {
  assert.ok(cases.length >= 8, String(cases.length));
  assert.equal(new Set(cases.map((c) => c.id)).size, cases.length);
  for (const c of cases) {
    assert.ok(c.situation === null || SITUATIONS.includes(c.situation), c.id);
    assert.ok(c.stage === null || STAGES.includes(c.stage), c.id);
  }
});

for (const c of cases) {
  test(`${c.id}: every quote is word for word in the saved decision`, () => {
    const src = flat(readFileSync(new URL(c.source, dir), 'utf8'));
    assert.ok(c.quotes.length >= 1);
    for (const q of c.quotes) assert.ok(src.includes(flat(q.text)), q.text);
  });

  if (!c.situation) continue;
  test(`${c.id}: the app gives a grievance route and cannot_deny or govt_deemed (${c.situation})`, () => {
    for (const stage of c.stage ? [c.stage] : STAGES) for (const age70 of AGE70) {
      const a = adviceFor({ stage, situation: c.situation, age70 });
      assert.ok(a.grievance.length >= 1, `${stage} ${age70}`);
      assert.ok(a.rules.includes('cannot_deny') || a.rules.includes('govt_deemed'), `${stage} ${age70}`);
    }
  });
}
