import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STRINGS } from '../i18n.js';
import { RULES, CHECKS, GRIEVANCE, STAGES, SITUATIONS, AGE70, adviceFor } from '../rules.js';

test('en and hi have exactly the same keys and no empty string', () => {
  assert.deepEqual(Object.keys(STRINGS.hi).sort(), Object.keys(STRINGS.en).sort());
  for (const lang of ['en', 'hi']) for (const [k, v] of Object.entries(STRINGS[lang])) {
    assert.ok(typeof v === 'string' && v.trim(), `${lang}.${k} is empty`);
  }
});

test('every key the rules and screens refer to exists', () => {
  const carry = new Set();
  const say = new Set();
  for (const stage of STAGES) for (const situation of SITUATIONS) for (const age70 of AGE70) {
    const a = adviceFor({ stage, situation, age70 });
    a.carry.forEach((c) => carry.add(c));
    say.add(a.sayAtDesk);
  }
  const keys = [
    ...[...STAGES, ...SITUATIONS].flatMap((o) => [`o_${o}`]), ...AGE70.map((o) => `age_${o}`),
    ...Object.keys(RULES).map((id) => `r_${id}`),
    ...Object.keys(CHECKS).flatMap((id) => [`check_${id}`, CHECKS[id].needs]),
    ...Object.keys(GRIEVANCE).map((id) => `g_${id}`),
    ...carry, ...say,
  ];
  for (const k of keys) assert.ok(k in STRINGS.en, `missing ${k}`);
});

test('every phone number shown is 14555, 1800-110-770 or +91 72908 23838; never 1800-11-4477 or 14413', () => {
  for (const lang of ['en', 'hi']) for (const [k, v] of Object.entries(STRINGS[lang])) {
    assert.doesNotMatch(v, /1800-?11-?4477|14413/, `${lang}.${k}`);
    for (const p of v.match(/\+?\d[\d -]{4,}\d/g) || []) assert.ok(['14555', '1800-110-770', '+91 72908 23838'].includes(p), `${lang}.${k}: ${p}`);
  }
});

test('no string promises free treatment, a refund or an approved claim', () => {
  for (const lang of ['en', 'hi']) for (const [k, v] of Object.entries(STRINGS[lang])) {
    assert.doesNotMatch(v, /\bfree of cost\b|\bfor free\b|refund|will get|will be approved|guarantee|मुफ्त|मुफ़्त|मिल जाएगा|गारंटी|वापस मिल/i, `${lang}.${k}`);
  }
});
