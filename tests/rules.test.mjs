// The hard rules of AGENT_PROMPT.md, one test each, against the pure functions of rules.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adviceFor, checksFor, grievanceFor, requestText, RULES, CHECKS, GRIEVANCE, STAGES, SITUATIONS, AGE70 } from '../rules.js';

const ALL = STAGES.flatMap((stage) => SITUATIONS.flatMap((situation) => AGE70.map((age70) => ({ stage, situation, age70 }))));
const where = (pred) => ALL.filter(pred);
const ids = (list) => list.map((x) => x.id);
const flat = (s) => s.replace(/\s+/g, ' ');
const hasMenu = (checks, id, item) => checks.some((c) => c.id === id && c.menu.includes(item));

test('there are 3 stages, 7 situations and 3 age answers', () => {
  assert.deepEqual(STAGES, ['before', 'admitted', 'discharged']);
  assert.deepEqual(SITUATIONS, ['not_sure', 'no_card', 'not_empanelled', 'card_not_working', 'asked_to_pay', 'refused_admission', 'paid_after_discharge']);
  assert.deepEqual(AGE70, ['yes', 'no', 'unsure']);
});

test('every input gives >= 2 rules, >= 1 check, >= 1 grievance route, no duplicates', () => {
  for (const input of ALL) {
    const a = adviceFor(input);
    const k = JSON.stringify(input);
    assert.ok(a.rules.length >= 2, k);
    assert.ok(a.checks.length >= 1, k);
    assert.ok(a.grievance.length >= 1, k);
    for (const list of [a.rules, ids(a.checks), ids(a.grievance), a.carry]) assert.equal(new Set(list).size, list.length, k);
    for (const r of a.rules) assert.ok(RULES[r], `${k}: unknown rule ${r}`);
    assert.equal(typeof a.sayAtDesk, 'string');
    assert.equal(typeof a.urgent, 'boolean');
  }
});

test('every rule has a Verified item and https official sources quoted word for word from sources/', () => {
  for (const [id, r] of Object.entries(RULES)) {
    assert.ok(Number.isInteger(r.item) && r.item >= 1 && r.item <= 12, id);
    assert.ok(r.sources.length >= 1, id);
    for (const s of r.sources) {
      assert.match(s.url, /^https:\/\//, id);
      const text = flat(readFileSync(new URL(`../sources/${s.file}`, import.meta.url), 'utf8'));
      assert.ok(text.startsWith(s.url), `${id}: ${s.file} was not fetched from ${s.url}`);
      assert.ok(text.includes(flat(s.quote)), `${id}: quote not in ${s.file}: ${s.quote}`);
    }
  }
});

test('the 14 rule ids of the prompt, each with the Verified item it relies on', () => {
  assert.deepEqual(Object.fromEntries(Object.entries(RULES).map(([id, r]) => [id, r.item])), {
    cover: 1, cashless: 1, govt_deemed: 1, eligibility: 2, vay_vandana: 2, card_ekyc: 3, arogya_mitra: 3,
    no_cap: 4, pre_existing: 4, pre_post: 4, portability: 5, package_includes: 6, cannot_deny: 6, penalties: 6,
  });
});

test('asked_to_pay, refused_admission, paid_after_discharge, card_not_working: 14555 and CGRMS, cannot_deny', () => {
  for (const input of where((i) => ['asked_to_pay', 'refused_admission', 'paid_after_discharge', 'card_not_working'].includes(i.situation))) {
    const a = adviceFor(input);
    const g = ids(a.grievance);
    assert.ok(g.includes('helpline') && g.includes('cgrms'), JSON.stringify(input));
    assert.ok(a.grievance.some((r) => r.tel === '14555'), JSON.stringify(input));
    assert.ok(a.grievance.some((r) => r.url === 'https://cgrms.pmjay.gov.in'), JSON.stringify(input));
    assert.ok(a.rules.includes('cannot_deny'), JSON.stringify(input));
  }
});

test('asked_to_pay: package_includes first', () => {
  for (const input of where((i) => i.situation === 'asked_to_pay')) assert.equal(adviceFor(input).rules[0], 'package_includes', JSON.stringify(input));
});

test('paid_after_discharge: package_includes and pre_post', () => {
  for (const input of where((i) => i.situation === 'paid_after_discharge')) {
    const { rules } = adviceFor(input);
    assert.ok(rules.includes('package_includes') && rules.includes('pre_post'), JSON.stringify(input));
  }
});

test('not_empanelled: govt_deemed first, App "Locate empanelled hospitals" and Sarathi "Find Nearby Empanelled Hospitals"', () => {
  for (const input of where((i) => i.situation === 'not_empanelled')) {
    const a = adviceFor(input);
    assert.equal(a.rules[0], 'govt_deemed', JSON.stringify(input));
    assert.ok(hasMenu(a.checks, 'app', 'Locate empanelled hospitals'), JSON.stringify(input));
    assert.ok(hasMenu(a.checks, 'sarathi', 'Find Nearby Empanelled Hospitals'), JSON.stringify(input));
  }
});

test('not_sure and no_card: an eligibility check first and eligibility in the rules', () => {
  for (const input of where((i) => ['not_sure', 'no_card'].includes(i.situation))) {
    const a = adviceFor(input);
    const [first] = a.checks;
    assert.ok((first.id === 'app' && first.menu.includes('Verify eligibility')) || (first.id === 'sarathi' && first.menu.includes('Eligibility Check under PM-JAY')), JSON.stringify(input));
    assert.ok(a.rules.includes('eligibility'), JSON.stringify(input));
  }
});

test('card_not_working: card_ekyc, Sarathi "Re-do eKYC" and the Arogya Mitra', () => {
  for (const input of where((i) => i.situation === 'card_not_working')) {
    const a = adviceFor(input);
    assert.ok(a.rules.includes('card_ekyc'), JSON.stringify(input));
    assert.ok(hasMenu(a.checks, 'sarathi', 'Re-do eKYC'), JSON.stringify(input));
    assert.ok(ids(a.checks).includes('arogya_mitra'), JSON.stringify(input));
  }
});

test('age70 yes: vay_vandana in the top 3 and 1800-110-770 in grievance', () => {
  for (const input of where((i) => i.age70 === 'yes')) {
    const a = adviceFor(input);
    assert.ok(a.rules.slice(0, 3).includes('vay_vandana'), JSON.stringify(input));
    assert.ok(a.grievance.some((r) => r.tel === '1800-110-770'), JSON.stringify(input));
  }
});

test('age70 no: never 1800-110-770', () => {
  for (const input of where((i) => i.age70 === 'no')) {
    assert.ok(!JSON.stringify(adviceFor(input)).includes('1800-110-770'), JSON.stringify(input));
    assert.ok(!JSON.stringify(grievanceFor(input)).includes('1800-110-770'), JSON.stringify(input));
  }
});

test('age70 unsure: the 70+ missed call is offered too', () => {
  for (const input of where((i) => i.age70 === 'unsure')) assert.ok(adviceFor(input).grievance.some((r) => r.tel === '1800-110-770'));
});

test('urgent exactly when before/admitted and asked_to_pay/refused_admission', () => {
  for (const input of ALL) {
    const want = ['before', 'admitted'].includes(input.stage) && ['asked_to_pay', 'refused_admission'].includes(input.situation);
    assert.equal(adviceFor(input).urgent, want, JSON.stringify(input));
  }
});

test('portability in every result for stage before', () => {
  for (const input of where((i) => i.stage === 'before')) assert.ok(adviceFor(input).rules.includes('portability'), JSON.stringify(input));
});

test('checks: exact menu words from Verified item 3, https or no url, a needs key, never mera.pmjay or hospitals.pmjay', () => {
  const MENU = {
    app: ['Verify eligibility', 'Download Ayushman e-cards', 'Locate empanelled hospitals', 'Raise grievances'],
    sarathi: ['Eligibility Check under PM-JAY', 'Apply for Ayushman Card', 'Download Ayushman Card', 'Re-do eKYC', 'Find Nearby Empanelled Hospitals', 'Register, Track and Withdraw Grievances'],
  };
  assert.deepEqual(Object.keys(CHECKS).sort(), ['app', 'arogya_mitra', 'beneficiary', 'csc', 'sarathi']);
  assert.equal(CHECKS.beneficiary.url, 'https://beneficiary.nha.gov.in');
  assert.equal(CHECKS.sarathi.url, 'https://wa.me/917290823838?text=Hi');
  for (const input of ALL) for (const c of checksFor(input)) {
    assert.ok(c.url === null || /^https:\/\//.test(c.url), c.id);
    for (const m of c.menu) assert.ok((MENU[c.id] || []).includes(m), `${c.id}: ${m}`);
    assert.match(c.needs, /^needs_/);
    assert.doesNotMatch(JSON.stringify(c), /mera\.pmjay|hospitals\.pmjay/);
  }
});

test('grievance routes: 14555 tel, CGRMS https with no menu path, App and Sarathi menu words, State Health Agency without address', () => {
  assert.equal(GRIEVANCE.helpline.tel, '14555');
  assert.equal(GRIEVANCE.cgrms.url, 'https://cgrms.pmjay.gov.in');
  assert.deepEqual(GRIEVANCE.cgrms.menu, []);
  assert.deepEqual(GRIEVANCE.app.menu, ['Raise grievances']);
  assert.deepEqual(GRIEVANCE.sarathi.menu, ['Register, Track and Withdraw Grievances']);
  assert.equal(GRIEVANCE.sha.url, null);
  assert.equal(GRIEVANCE.vay_missed.tel, '1800-110-770');
  const all = JSON.stringify(GRIEVANCE);
  assert.doesNotMatch(all, /1800-?11-?4477|14413/);
});

// Every function output, for every input and both languages, as one string.
function everything() {
  return JSON.stringify(ALL.map((input) => [adviceFor(input), checksFor(input), grievanceFor(input), requestText(input, 'en'), requestText(input, 'hi')]));
}

test('no rules.js output contains a 12-digit number or 1800-11-4477 (the Sarathi wa.me number is the only long digit run)', () => {
  const out = everything().replaceAll('wa.me/917290823838', 'wa.me/SARATHI');
  assert.doesNotMatch(out, /(?<!\d)\d{12}(?!\d)/);
  assert.doesNotMatch(out, /1800-?11-?4477|14413/);
});

test('every phone number in rules.js output is 14555, 1800-110-770 or +91 72908 23838', () => {
  // URLs carry PIB release ids (7 digits) and tel: links the digits only; the shown numbers are checked.
  const found = everything().replace(/(https:\/\/|tel:)[^"\\]*|(PIB|पीआईबी) \d+/g, '').match(/\+?\d[\d -]{4,}\d/g) || [];
  for (const p of found) assert.ok(['14555', '1800-110-770', '+91 72908 23838'].includes(p), p);
});

const FORBIDDEN = /free|refund|will get|guarantee|मुफ्त|मुफ़्त|मिल जाएगा|गारंटी|वापस|₹|\bRs\b|rupee|रुपये|रुपए|lakh|लाख/i;

test('requestText never says free, refund, will get, guarantee (en or hi), no amount, no 10- or 12-digit number', () => {
  for (const input of ALL) for (const lang of ['en', 'hi']) {
    const text = requestText(input, lang);
    assert.doesNotMatch(text, FORBIDDEN, `${lang} ${JSON.stringify(input)}`);
    assert.doesNotMatch(text, /(?<!\d)(\d{10}|\d{12})(?!\d)/, `${lang} ${JSON.stringify(input)}`);
  }
});

test('requestText keeps the blanks for name, hospital, date and card or PM-JAY ID, filled by hand', () => {
  const LABELS = {
    en: ['Patient name', 'Hospital', 'Date', 'Ayushman card or PM-JAY ID'],
    hi: ['मरीज़ का नाम', 'अस्पताल', 'तारीख', 'आयुष्मान कार्ड या पीएम-जेएवाई आईडी'],
  };
  for (const input of ALL) for (const lang of ['en', 'hi']) {
    const text = requestText(input, lang);
    for (const label of LABELS[lang]) assert.match(text, new RegExp(`${label}: _{6}`), `${lang} ${label} ${JSON.stringify(input)}`);
  }
});

test('requestText cites the scheme rule for the situation and asks for PM-JAY processing or a grievance look', () => {
  for (const input of ALL) {
    const en = requestText(input, 'en');
    const hi = requestText(input, 'hi');
    if (['asked_to_pay', 'paid_after_discharge'].includes(input.situation)) {
      assert.match(en, /after admission all tests, medicines and implants are part of the package/i);
      assert.match(hi, /भर्ती के बाद सभी जांच, दवाइयां और इम्प्लांट पैकेज में शामिल हैं/);
    }
    if (['card_not_working', 'refused_admission', 'asked_to_pay'].includes(input.situation)) {
      assert.match(en, /empanelled hospitals cannot deny treatment to eligible beneficiaries/);
      assert.match(hi, /अस्पताल योजना के पात्र लाभार्थियों को उपचार देने से इनकार नहीं कर सकते/);
    }
    assert.match(en, /process the treatment under PM-JAY|grievance officer to look into/);
    assert.match(hi, /पीएम-जेएवाई के तहत इलाज|शिकायत अधिकारी/);
  }
});
