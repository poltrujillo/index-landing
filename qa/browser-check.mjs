import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium, expect } from '@playwright/test';
import { routes, pagePath } from '../src/routes.mjs';
import { loadContent } from '../scripts/build.mjs';
import config from '../site.config.mjs';
import deployment from '../cloudflare-pages.config.mjs';

const recordedTarget = JSON.parse(await readFile(new URL('./preview-target.json', import.meta.url), 'utf8'));
const target = new URL(process.env.PREVIEW_URL || recordedTarget.url);
assert.equal(target.protocol, 'https:', 'Use an HTTPS Cloudflare draft preview');
assert.ok(/^[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev$/.test(target.hostname), 'Use a hash/branch preview URL, not production or the custom domain');
assert.ok(!target.username && !target.password && target.pathname === '/' && !target.search && !target.hash, 'Supply only the preview origin, without credentials/query/path');
if (deployment.projectName) assert.ok(target.hostname.endsWith('.' + deployment.projectName + '.pages.dev'), 'Preview must belong to the configured project');
const origin = target.origin;
const output = new URL('../artifacts/browser/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const stylesheetHash = createHash('sha256').update(await readFile(new URL('../src/styles.css', import.meta.url))).digest('hex');
const errors = [];
const results = [];
const observedHeaders = {};
let passed = false;
let failure = null;
let observedCookies = [];
try {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  let currentStyles = false;
  for (let attempt = 0; attempt < 24; attempt++) {
    const response = await context.request.get(origin + '/styles.css?qa=' + Date.now());
    if (response.ok() && createHash('sha256').update(await response.body()).digest('hex') === stylesheetHash) { currentStyles = true; break; }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  assert.ok(currentStyles, 'Preview stylesheet does not match this checkout; wait for the matching draft deployment.');
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const c = await loadContent(route.lang);
      const response = await page.goto(origin + route.path, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, route.path);
      observedHeaders[route.path] = { status: response.status(), robots: response.headers()['x-robots-tag'] || null, contentSecurityPolicy: response.headers()['content-security-policy'] || null };
      assert.match(response.headers()['x-robots-tag'] || '', /noindex/i, 'Draft response must forbid indexing');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page).toHaveTitle(route.page === 'home' ? c.title : c.pages[route.page].title);
      await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
      await expect(page.locator('h1')).toHaveCount(1);
      if (route.page !== 'home') await expect(page.locator('.draft-banner')).toBeVisible();
      const html = await page.content();
      assert.ok(!/static\.cloudflareinsights\.com|data-cf-beacon|googletagmanager\.com|google-analytics\.com/i.test(html), 'No analytics beacon may be injected into the draft');
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.locator('.brand-mark').first().evaluate((element) => element.getBBox().width > 0), 'Original logo must render');
      const layout = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, overflowing: [...document.querySelectorAll('body *')].filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 20).map((element) => ({ tag: element.tagName, className: element.getAttribute('class'), width: element.getBoundingClientRect().width, right: element.getBoundingClientRect().right, gridColumns: getComputedStyle(element).gridTemplateColumns, minWidth: getComputedStyle(element).minWidth })) }));
      if (layout.document > layout.viewport + 1) {
        console.error('Overflow diagnostics:', JSON.stringify({ path: route.path, width, ...layout }));
        await page.screenshot({ path: new URL(`overflow-${route.lang}-${route.page}-${width}.png`, output).pathname, fullPage: true });
      }
      assert.ok(layout.document <= layout.viewport + 1, `${route.path} overflows at ${width}px`);
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty('complete', true);
        assert.ok(await image.evaluate((element) => element.naturalWidth > 0), 'Screenshot must load');
      }
      await page.goto(origin + route.path);
      await page.keyboard.press('Tab');
      await expect(page.locator('.skip-link')).toBeFocused();
      for (const key of ['support', 'privacy', 'terms', 'delete-account']) {
        await expect(page.locator('.footer-links a[href="' + pagePath(key, route.lang) + '"]')).toHaveCount(1);
      }
      if (route.page === 'support' || route.page === 'home') {
        const detail = page.locator('details').first();
        await detail.locator('summary').focus();
        await page.keyboard.press('Enter');
        await expect(detail).toHaveAttribute('open', '');
      }
      if (route.page === 'delete-account') {
        const mailLink = await page.locator('a[href^="mailto:"][href*="?subject="]').getAttribute('href');
        const mail = new URL(mailLink);
        assert.equal(mail.pathname, config.contacts.privacy);
        assert.equal(mail.searchParams.get('subject'), c.deletionRequest.subject);
        assert.equal(mail.searchParams.get('body'), c.deletionRequest.body);
        const copy = page.locator('[data-copy-address]');
        await copy.click();
        await expect(page.locator('#copy-feedback')).toHaveText(c.deletionRequest.copySuccess);
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), config.contacts.privacy);
        await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText() { return Promise.reject(new Error('Denied for testing')); } } }));
        await copy.click();
        await expect(page.locator('#copy-feedback')).toHaveText(c.deletionRequest.copyFailure);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      if (width === 390 || width === 1440) await page.screenshot({ path: new URL(`${route.lang}-${route.page}-${width}.png`, output).pathname, fullPage: true });
      const other = route.lang === 'es' ? 'en' : 'es';
      await page.locator('.language-switch').click();
      await expect(page).toHaveURL(origin + pagePath(route.page, other));
      results.push({ path: route.path, width, passed: true });
    }
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  for (const lang of ['es', 'en']) {
    const page = await noJS.newPage();
    await page.goto(origin + pagePath('delete-account', lang));
    await expect(page.locator('#deletion-address')).toHaveText(config.contacts.privacy);
    await expect(page.locator('[data-copy-address]')).toBeHidden();
    await expect(page.locator('a[href^="mailto:"][href*="?subject="]')).toBeVisible();
    await page.close();
  }
  const missing = await context.request.get(origin + '/this-page-must-not-exist-qa');
  assert.equal(missing.status(), 404, 'Unknown paths must not fall back to the landing page');
  assert.deepEqual(errors, [], 'No browser JavaScript errors');
  observedCookies = (await context.cookies()).map(({ name, domain, secure, httpOnly, sameSite }) => ({ name, domain, secure, httpOnly, sameSite }));
  passed = true;
  console.log(`Passed draft preview browser checks: ${results.length} route/viewport combinations, both no-JS deletion paths, language links, clipboard and 404.`);
} catch (error) {
  failure = error.message;
  throw error;
} finally {
  await writeFile(new URL('results.json', output), JSON.stringify({ preview: origin, stylesheetHash, expectedSourceCommit: recordedTarget.url === origin ? recordedTarget.expectedSourceCommit : null, passed, failure, results, errors, observedHeaders, observedCookies, completedCombinations: results.length }, null, 2) + '\n');
  await browser.close();
}
