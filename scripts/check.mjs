import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { build, root, loadContent } from './build.mjs';
import config from '../site.config.mjs';
import { routes as pageRoutes, aliases, pagePath } from '../src/routes.mjs';

const output = await build();
const routes = [...pageRoutes, ...aliases].map((route) => route.path).concat('/404.html');
const htmlFiles = new Map();
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const fileFor = (path) => join(output, path.endsWith('/') ? path + 'index.html' : path);

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  if (typeof value === 'boolean') return 'boolean';
  assert.equal(typeof value, 'string', 'Translation leaves must be strings or boolean section options');
  assert.ok(value.trim(), 'Translations cannot be empty');
  return 'string';
}
const es = await loadContent('es');
const en = await loadContent('en');
assert.deepEqual(shape(es), shape(en), 'Both translations must contain the same content structure');

for (const path of routes) {
  const html = await readFile(fileFor(path), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${path}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Exactly one h1 in ${path}`);
  assert.ok(html.includes(`<html lang="${path.startsWith('/en/') ? 'en' : 'es'}">`));
  assert.ok(html.includes('content="noindex, nofollow"'), 'Previews must be noindex');
  assert.ok(!/\son\w+=|href="#"|\{\{\w+\}\}/i.test(html), 'No inline handlers, unresolved tokens or placeholder links');
  const scripts = [...html.matchAll(/<script\b[^>]*>/g)];
  assert.equal(scripts.length, path.includes('/delete-account/') ? 1 : 0, 'Only deletion pages load the clipboard enhancement');
  htmlFiles.set(path, html);
}

for (const [path, html] of htmlFiles) {
  for (const match of html.matchAll(/<(?:a|link|img|use|script)\b[^>]*>/g)) {
    const a = attrs(match[0]);
    for (const url of [a.href, a.src, ...(a.srcset ? a.srcset.split(',').map((s) => s.trim().split(' ')[0]) : [])].filter(Boolean)) {
      if (/^(https:|mailto:)/.test(url)) continue;
      const target = new URL(url, 'https://preview.invalid' + path);
      const file = fileFor(target.pathname);
      await access(file).catch(() => assert.fail(`Missing local resource ${url} from ${path}`));
      if (target.hash) {
        const text = await readFile(file, 'utf8');
        assert.ok(text.includes(`id="${target.hash.slice(1)}"`), `Missing anchor ${url} from ${path}`);
      }
    }
    if (match[0].startsWith('<img')) {
      assert.ok(a.alt && a.width && a.height, 'Images need alternatives and explicit dimensions');
      assert.ok(a.srcset && a.sizes, 'Screenshots need responsive sources');
    }
  }
}

for (const path of ['/', '/en/']) {
  const html = htmlFiles.get(path);
  const lang = path === '/' ? 'es' : 'en';
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const image = attrs(tag);
    const sources = [image.src, ...image.srcset.split(',').map((source) => source.trim().split(' ')[0])];
    assert.ok(sources.every((source) => source.startsWith(`/assets/screenshots/${lang}/`)), `Screenshots must match the page language: ${path}`);
  }
  assert.equal((html.match(/<details>/g) || []).length, 6, 'Six usable native FAQs per locale');
  assert.equal((html.match(/<img\b/g) || []).length, 3, 'Three genuine supplied screenshots per locale');
  assert.equal((html.match(/fetchpriority="high"/g) || []).length, 1, 'Only the hero image is prioritized');
  assert.equal((html.match(/loading="lazy"/g) || []).length, 2, 'Lower screenshots load lazily');
  assert.ok(html.includes('mailto:' + config.contacts.support));
}
for (const route of pageRoutes) {
  const html = htmlFiles.get(route.path);
  const other = route.lang === 'es' ? 'en' : 'es';
  const alternate = pagePath(route.page, other);
  assert.ok(html.includes(`href="${alternate}" lang="${other}" hreflang="${other}"`), `Language switching must keep the page: ${route.path}`);
  assert.ok(html.includes(`rel="canonical" href="${config.productionOrigin}${route.path}"`));
  for (const page of ['support', 'privacy', 'terms', 'delete-account']) assert.ok(html.includes(`href="${pagePath(page, route.lang)}"`), 'Shared footer links all information pages');
  assert.ok(html.includes(`hreflang="${other}" href="${config.productionOrigin}${alternate}"`));
  if (route.page !== 'home') {
    const expectedDraft = route.page !== 'support' || !config.supportApproved;
    assert.equal(html.includes('class="draft-banner"'), expectedDraft, `Draft notice must match approval: ${route.path}`);
    assert.ok(!html.includes('Effective / last updated:') && !html.includes('Entrada en vigor / última actualización:'));
  }
  if (route.page === 'delete-account') {
    const c = route.lang === 'es' ? es : en;
    const mail = [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => attrs(tag).href).find((href) => href?.startsWith('mailto:') && href.includes('?subject='));
    const request = new URL(mail.replaceAll('&amp;', '&'));
    assert.equal(request.pathname, config.contacts.privacy);
    assert.equal(request.searchParams.get('subject'), c.deletionRequest.subject);
    assert.equal(request.searchParams.get('body'), c.deletionRequest.body);
    assert.ok(html.includes('aria-live="polite"') && html.includes('data-copy-address='));
    assert.ok(/<button[^>]*\bhidden>/.test(html), 'Copy action progressively enhances a working email route');
    assert.ok(!/<form\b/.test(html), 'No fake account-deletion submission form');
  }
}
assert.ok(htmlFiles.get('/privacidad/').includes(`rel="canonical" href="${config.productionOrigin}/privacy/"`), 'Preserve the old Spanish policy URL with the stable canonical');

// Source hashes guard against accidentally substituting/repainting supplied artwork.
const manifest = JSON.parse(await readFile(join(root, 'docs/assets.json'), 'utf8'));
for (const item of manifest) {
  const file = join(root, item.original || item.output);
  assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'), item.sha256, `Changed original: ${file}`);
}

const scratch = await mkdtemp(join(tmpdir(), 'index-landing-check-'));
try {
  await assert.rejects(() => build({ production: true, output: join(scratch, 'blocked') }), /Production requires/);
  const production = join(scratch, 'production');
  // Synthetic fixture only: this does not approve or publish the real policies.
  const approved = { ...config, productionOrigin: 'https://example.test', legal: { ...config.legal, approvedPublicationDate: '2026-11-10', reviews: Object.fromEntries(Object.keys(config.legal.reviews).map((key) => [key, true])), website: { host: 'Test host', processingRegion: 'Test region', logRetention: 'Test schedule' }, retainedHistory: { legalBasis: 'Test basis', duration: 'Test retention' } }, downloads: { ios: 'https://apps.apple.com/example', android: null } };
  await build({ production: true, output: production, settings: approved });
  const html = await readFile(join(production, 'en/index.html'), 'utf8');
  assert.ok(html.includes('content="index, follow"'));
  assert.ok(html.includes('rel="canonical" href="https://example.test/en/"'));
  for (const locale of ['es', 'en', 'x-default']) assert.ok(html.includes(`hreflang="${locale}"`));
  assert.ok(html.includes('href="/en/privacy/"'));
  assert.ok(html.includes('href="https://apps.apple.com/example"'));
  assert.ok(!(await readFile(join(production, '_headers'), 'utf8')).includes('X-Robots-Tag'));
  assert.ok((await readFile(join(production, 'sitemap.xml'), 'utf8')).includes('https://example.test/en/'));
  assert.ok((await readFile(join(production, 'robots.txt'), 'utf8')).includes('Allow: /'));
  for (const route of pageRoutes) {
    const path = route.path.endsWith('/') ? route.path + 'index.html' : route.path;
    const document = await readFile(join(production, path), 'utf8');
    assert.ok(document.includes('content="index, follow"'));
    assert.ok(document.includes(`rel="canonical" href="https://example.test${route.path}"`));
    assert.ok(!document.includes('class="draft-banner"') && !document.includes('class="review-note"'));
    assert.ok((await readFile(join(production, 'sitemap.xml'), 'utf8')).includes('https://example.test' + route.path));
  }
  const policy = await readFile(join(production, 'privacy/index.html'), 'utf8');
  assert.ok(policy.includes('Test host') && policy.includes('Test retention') && policy.includes('Test basis'));
  assert.ok(!policy.includes('not yet confirmed'));
  for (const key of Object.keys(approved.legal.reviews)) {
    await assert.rejects(() => build({ production: true, output: production, settings: { ...approved, legal: { ...approved.legal, reviews: { ...approved.legal.reviews, [key]: false } } } }), /Production requires/, `Each review decision blocks unapproved release: ${key}`);
  }
  await build({ output: production });
  await assert.rejects(() => access(join(production, 'sitemap.xml')), 'Preview rebuild must remove the production sitemap');
} finally {
  await rm(scratch, { recursive: true, force: true });
}

// Color checks cover the tokens used for body copy and the main action.
const luminance = (hex) => {
  const rgb = hex.match(/[a-f\d]{2}/gi).map((v) => parseInt(v, 16) / 255).map((n) => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};
for (const [text, background] of [['F1F3EF', '0B0D0C'], ['A3AAA5', '0B0D0C'], ['A3AAA5', '15191A'], ['0B0D0C', 'DCFF4A']]) {
  const values = [luminance(text), luminance(background)].sort((a, b) => b - a);
  assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, 'Body text and actions must meet AA contrast');
}
console.log('Passed: translation parity; 12 static pages; navigation/language links; localized screenshots; deletion mail templates; assets and anchors; metadata, draft/publication guards and sitemap; text contrast.');
