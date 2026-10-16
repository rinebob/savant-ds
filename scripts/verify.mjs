/**
 * savant-ds offline verify — stub until the mixin/token surface lands (#1038).
 *
 * Today it asserts the package layout the consumers rely on:
 * styles/_index.scss exists and the directory contains no @import (the
 * dual-sass-version contract). The full sass-compile check — fixture
 * exercising every ds.* mixin and asserting each documented --ds-* token —
 * replaces this stub with the mixin surface.
 *
 * Usage: npm run verify   (from the savant-ds repo root)
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const styles = path.join(root, 'styles');

let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
};

check('styles/_index.scss exists', existsSync(path.join(styles, '_index.scss')));

const partials = existsSync(styles)
  ? readdirSync(styles).filter((f) => f.endsWith('.scss'))
  : [];
check('styles/ is populated', partials.length > 0);
// Strip line comments before scanning — a doc mention of '@import' is fine;
// only a real directive breaks the dual-sass-version contract.
const withImport = partials.filter((f) =>
  /@import\b/.test(readFileSync(path.join(styles, f), 'utf8').replaceAll(/\/\/.*$/gm, '')),
);
check('no @import directive in styles/', withImport.length === 0,
  withImport.length ? withImport.join(', ') : '');

if (failures > 0) {
  console.log(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll checks passed. (stub — full mixin/token surface lands in #1038)');
