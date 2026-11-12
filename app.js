import { adviceFor, requestText, RULES, STAGES, SITUATIONS, AGE70 } from './rules.js';
import { STRINGS } from './i18n.js';
const $ = (id) => document.getElementById(id);
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const LANGS = ['en', 'hi'];
const qLang = new URLSearchParams(location.search).get('lang');
let lang = LANGS.includes(qLang) ? qLang : localStorage.getItem('as-lang') || (navigator.language?.startsWith('hi') ? 'hi' : 'en');
const t = (key) => STRINGS[lang][key];
// Anonymous usage count for the impact data: event name, language and, on result, the situation id only.
// ?nostats keeps our own tests and demo recordings out of the public impact numbers.
const NOSTATS = new URLSearchParams(location.search).has('nostats');
const count = (event, situation) => NOSTATS || navigator.sendBeacon?.('/api/event', JSON.stringify(situation ? { event, lang, situation } : { event, lang }));
const ICON = {
  before: '🏠', admitted: '🛏️', discharged: '🚪',
  not_sure: '❓', no_card: '🪪', not_empanelled: '🏥', card_not_working: '🚫', asked_to_pay: '💸', refused_admission: '⛔', paid_after_discharge: '🧾',
  yes: '👵', no: '➖', unsure: '🤔',
};
const QUESTIONS = [
  { id: 'stage', opts: STAGES, label: (o) => `o_${o}` },
  { id: 'situation', opts: SITUATIONS, label: (o) => `o_${o}` },
  { id: 'age70', opts: AGE70, label: (o) => `age_${o}` },
];
let view = 'intro';
let answers = {};
let index = 0;
let advice = null;
let letterLang = null;
let worked = false;

function el(tag, props = {}, ...kids) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids.flat().filter((k) => k !== null && k !== undefined && k !== false));
  return e;
}
const link = (href, text) => el('a', href.startsWith('http') ? { href, target: '_blank', rel: 'noopener', textContent: text } : { href, textContent: text });

function show(id) {
  view = id;
  for (const s of ['intro', 'quiz', 'result']) $(s).hidden = s !== id;
  render();
  $(id).querySelector('[tabindex="-1"]')?.focus();
}

function render() {
  document.documentElement.lang = lang;
  document.title = `${t('title')} · ${t('tagline')}`;
  for (const e of document.querySelectorAll('[data-t]')) e.textContent = t(e.dataset.t);
  for (const b of document.querySelectorAll('[data-lang]')) b.setAttribute('aria-pressed', b.dataset.lang === lang);
  if (view === 'quiz') renderQuestion();
  if (view === 'result') renderResult();
}

function renderQuestion() {
  const q = QUESTIONS[index];
  $('step').textContent = fill(t('step'), { n: index + 1, total: QUESTIONS.length });
  $('bar').style.width = `${(index / QUESTIONS.length) * 100}%`;
  $('question').textContent = t(`q_${q.id}`);
  $('answers').replaceChildren(...q.opts.map((opt) => {
    const hint = t(`h_${opt}`);
    return el('button', { type: 'button', className: answers[q.id] === opt ? 'opt chosen' : 'opt', onclick: () => answer(q.id, opt) },
      el('span', { className: 'ico', ariaHidden: 'true', textContent: ICON[opt] }),
      el('span', {}, el('span', { className: 'lbl', textContent: t(q.label(opt)) }), hint && el('small', { textContent: hint })));
  }));
}

function answer(id, value) {
  answers[id] = value;
  if (++index < QUESTIONS.length) { renderQuestion(); $('question').focus(); return; }
  advice = adviceFor(answers);
  letterLang = null;
  worked = false;
  show('result');
  count('result', answers.situation);
}

const voiceFor = (l) => {
  const vs = globalThis.speechSynthesis?.getVoices() || [];
  const norm = (v) => v.lang.replace('_', '-').toLowerCase();
  return l === 'hi' ? vs.find((v) => norm(v).startsWith('hi')) : vs.find((v) => norm(v) === 'en-in') || vs.find((v) => norm(v).startsWith('en'));
};

function sources(list) {
  const seen = new Map(list.map((s) => [s.url, s.name]));
  return el('p', { className: 'src' }, `${t('source_label')}: `, [...seen].flatMap(([url, name], j) => [j ? ' · ' : '', link(url, name)]));
}

const menuLine = (menu) => menu.length > 0 && el('p', { className: 'menu' }, `${t('menu_label')}: `, menu.map((m) => `"${m}"`).join(' · '));

function letterBlock() {
  const l = letterLang || lang;
  const text = requestText(answers, l);
  const other = l === 'en' ? 'hi' : 'en';
  const voice = voiceFor(l);
  const copyBtn = el('button', { type: 'button', className: 'link', textContent: t('copy') });
  copyBtn.onclick = async () => {
    try { await navigator.clipboard.writeText(text); } catch { /* old browsers: the text stays selectable on screen */ }
    copyBtn.textContent = t('copied');
    count('copy');
  };
  const readBtn = voice && el('button', { type: 'button', className: 'link', textContent: t('read_aloud') });
  if (readBtn) {
    readBtn.onclick = () => {
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); readBtn.textContent = t('read_aloud'); return; }
      const u = Object.assign(new SpeechSynthesisUtterance(text.replace(/_{3,}/g, ' ')), { voice, lang: voice.lang });
      u.onend = () => { readBtn.textContent = t('read_aloud'); };
      speechSynthesis.speak(u);
      readBtn.textContent = t('stop_reading');
    };
  }
  return el('section', { className: 'letter' },
    el('h2', { textContent: t('sec_letter') }),
    el('p', { className: 'hint', textContent: t('letter_hint') }),
    el('pre', { lang: l, textContent: text }),
    el('div', { className: 'actions' },
      el('a', { className: 'btn primary', href: `https://wa.me/?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noopener', textContent: t('share_wa'), onclick: () => count('share') }),
      copyBtn,
      readBtn,
      el('button', { type: 'button', className: 'link', lang: other, textContent: STRINGS[l].other_lang, onclick: () => { letterLang = other; renderResult(); } })));
}

function renderResult() {
  $('urgent').hidden = !advice.urgent;
  $('rules').replaceChildren(...advice.rules.map((id) => el('li', {}, el('p', { textContent: t(`r_${id}`) }), sources(RULES[id].sources))));
  $('checks').replaceChildren(...advice.checks.map((c) => el('li', {},
    c.url ? link(c.url, t(`check_${c.id}`)) : el('b', { textContent: t(`check_${c.id}`) }),
    menuLine(c.menu),
    el('p', { className: 'hint', textContent: `${t('needs_label')}: ${t(c.needs)}` }))));
  $('say').textContent = t(advice.sayAtDesk);
  $('carry').replaceChildren(...advice.carry.map((k) => el('li', { textContent: t(k) })));
  $('griev').replaceChildren(...advice.grievance.filter((g) => g.id !== 'helpline').map((g) => el('li', {},
    g.url ? link(g.url, t(`g_${g.id}`)) : el('b', { textContent: t(`g_${g.id}`) }),
    menuLine(g.menu))));
  $('letter').replaceChildren(letterBlock());
  $('worked-btns').hidden = worked;
  $('worked-thanks').hidden = !worked;
}

$('start').onclick = () => { answers = {}; index = 0; show('quiz'); };
$('back').onclick = () => { if (index > 0) { index--; renderQuestion(); } else show('intro'); };
$('restart').onclick = () => show('intro');
for (const b of document.querySelectorAll('[data-worked]')) {
  b.onclick = () => { worked = true; count(`worked_${b.dataset.worked}`); renderResult(); };
}
for (const b of document.querySelectorAll('[data-lang]')) {
  b.onclick = () => { lang = b.dataset.lang; localStorage.setItem('as-lang', lang); render(); };
}
globalThis.speechSynthesis?.addEventListener?.('voiceschanged', () => view === 'result' && renderResult());
render();

// Opens offline after the first visit (sw.js): the questions, the rules and the request need no network.
navigator.serviceWorker?.register('sw.js').catch(() => {});
