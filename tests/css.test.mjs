import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

// Buttons get display:inline-flex, which beats the hidden attribute unless [hidden] is forced.
test('styles.css keeps [hidden] elements hidden', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important;?\s*\}/);
});

test('shipped assets stay under 100 KB', () => {
  const shipped = ['index.html', 'styles.css', 'app.js', 'rules.js', 'i18n.js', 'stats.html'];
  const total = shipped.reduce((s, f) => s + statSync(new URL(`../${f}`, import.meta.url)).size, 0);
  assert.ok(total < 100 * 1024, `${total} bytes`);
});
