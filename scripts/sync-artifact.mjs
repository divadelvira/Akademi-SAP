// Split a saved Claude artifact HTML into the Astro app's css / shell / js.
// Usage: npm run sync -- <path/to/artifact.html>
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const src = process.argv[2];
if (!src) { console.error('Usage: npm run sync -- <artifact.html>'); process.exit(1); }
const html = readFileSync(src, 'utf8');

const between = (open, close, from = 0) => {
  const a = html.indexOf(open, from);
  const b = close === '</script>' ? html.lastIndexOf(close) : html.indexOf(close, a);
  assert(a >= 0 && b > a, `missing ${open}…${close}`);
  return [html.slice(a + open.length, b).trim() + '\n', a];
};

const [css] = between('<style>', '</style>');
const body = html.indexOf('<body>');
const [shell] = between('<body>', '<script>', body);
const [js] = between('<script>', '</script>', body);

assert(css.includes(':root'), 'css looks wrong');
assert(shell.includes('id="view"'), 'shell looks wrong');
assert(js.includes('hashchange'), 'js looks wrong');

writeFileSync('src/styles/app.css', css);
writeFileSync('src/shell.html', shell);
writeFileSync('public/app.js', js);
console.log(`synced: css ${css.length}B, shell ${shell.length}B, js ${js.length}B`);
