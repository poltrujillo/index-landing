// Public-edge observations only. This cannot inspect Cloudflare account options,
// internal log retention, contracts, analytics toggles or transfer safeguards.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium, request } from '@playwright/test';
import { routes, aliases } from '../src/routes.mjs';
import deployment from '../cloudflare-pages.config.mjs';

const recorded = JSON.parse(await readFile(new URL('./preview-target.json', import.meta.url), 'utf8'));
const target = new URL(process.env.PREVIEW_URL || recorded.url);
assert.ok(target.protocol === 'https:' && /^[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev$/.test(target.hostname));
assert.ok(!target.username && !target.password && target.pathname === '/' && !target.search && !target.hash);
assert.ok(target.hostname.endsWith('.' + deployment.projectName + '.pages.dev'));
const origin = target.origin;
const directory = new URL('../artifacts/browser/', import.meta.url);
await mkdir(directory, { recursive: true });
const report = { origin, checkedAt: new Date().toISOString(), passed: false, responses: [], redirects: [], cookieNames: [], externalRequestHosts: [], storageKeys: [], unverified: ['Cloudflare account settings and analytics toggles', 'Internal access/security log retention and exports', 'Contract/DPA acceptance and transfer/regional controls'], failure: null };
const cookieNames = new Set();
const externalHosts = new Set();
const api = await request.newContext({ baseURL: origin, ignoreHTTPSErrors: false });
let browser;

function validateHeaders(headers, label) {
  assert.match(headers['x-robots-tag'] || '', /noindex/i, `${label}: preview indexing header`);
  assert.equal(headers['x-content-type-options'], 'nosniff', `${label}: nosniff`);
  assert.equal(headers['x-frame-options']?.toUpperCase(), 'DENY', `${label}: framing`);
  assert.equal(headers['referrer-policy'], 'strict-origin-when-cross-origin', `${label}: referrer`);
  assert.match(headers.server || '', /cloudflare/i, `${label}: Cloudflare edge`);
  const csp = Object.fromEntries((headers['content-security-policy'] || '').split(';').map((part) => part.trim().split(/\s+/)).filter(([key]) => key).map(([key, ...values]) => [key, values.join(' ')]));
  for (const key of ['default-src', 'base-uri', 'form-action', 'frame-ancestors']) assert.equal(csp[key], "'none'", `${label}: ${key}`);
  for (const key of ['script-src', 'style-src', 'font-src', 'img-src']) assert.equal(csp[key], "'self'", `${label}: ${key}`);
  for (const feature of ['camera', 'microphone', 'geolocation']) assert.ok(headers['permissions-policy']?.includes(feature + '=()'), `${label}: ${feature} permission`);
}

try {
  for (const route of [...routes, ...aliases]) {
    const response = await api.get(route.path);
    assert.equal(response.status(), 200, route.path);
    const headers = response.headers();
    validateHeaders(headers, route.path);
    for (const header of await response.headersArray()) if (header.name.toLowerCase() === 'set-cookie') cookieNames.add(header.value.split('=', 1)[0]);
    const body = await response.text();
    assert.ok(!/static\.cloudflareinsights\.com|data-cf-beacon|googletagmanager\.com|google-analytics\.com/i.test(body), 'No analytics injection');
    if (['privacy', 'terms', 'delete-account'].includes(route.page)) assert.ok(body.includes('class="draft-banner"'), 'Legal pages must remain drafts');
    report.responses.push({ path: route.path, status: response.status(), robots: headers['x-robots-tag'], csp: headers['content-security-policy'], referrerPolicy: headers['referrer-policy'], permissionsPolicy: headers['permissions-policy'], cacheControl: headers['cache-control'] || null, hsts: headers['strict-transport-security'] || null, server: headers.server });
    if (route.page !== 'home') {
      const bare = route.path.slice(0, -1);
      const redirect = await api.get(bare, { maxRedirects: 0 });
      assert.ok([301, 302, 307, 308].includes(redirect.status()), bare + ': slash redirect');
      assert.equal(new URL(redirect.headers().location, origin).href, origin + route.path);
      report.redirects.push({ path: bare, status: redirect.status(), target: route.path });
    }
  }
  const robots = await api.get('/robots.txt');
  assert.equal(robots.status(), 200);
  assert.match(await robots.text(), /Disallow:\s*\/\s*(?:\n|$)/);
  const sitemap = await api.get('/sitemap.xml');
  assert.equal(sitemap.status(), 404, 'A draft must not expose a production sitemap');
  const missing = await api.get('/not-a-real-settings-audit-page');
  assert.equal(missing.status(), 404);
  validateHeaders(missing.headers(), '404');

  browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: false, viewport: { width: 390, height: 900 } });
  context.on('request', (event) => {
    const url = new URL(event.url());
    if (['http:', 'https:'].includes(url.protocol) && url.origin !== origin) externalHosts.add(url.hostname);
  });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(origin + route.path, { waitUntil: 'networkidle' });
    const keys = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));
    assert.deepEqual(keys, { local: [], session: [] }, 'Static pages should not add browser-storage state');
    report.storageKeys.push({ path: route.path, ...keys });
  }
  for (const cookie of await context.cookies()) cookieNames.add(cookie.name);
  report.cookieNames = [...cookieNames].sort();
  report.externalRequestHosts = [...externalHosts].sort();
  assert.deepEqual(report.externalRequestHosts, [], 'Review any unexpected external resource requests');
  report.passed = true;
  console.log('PREVIEW_SETTINGS_SUMMARY ' + JSON.stringify({ origin, passed: true, responses: report.responses.length, slashRedirects: report.redirects.length, noindex: true, csp: true, analyticsBeaconDetected: false, cookieNames: report.cookieNames, externalRequestHosts: report.externalRequestHosts, browserStorageKeys: 0, legalPagesRemainDrafts: true }));
} catch (error) {
  report.failure = error.message;
  throw error;
} finally {
  await writeFile(new URL('settings-audit.json', directory), JSON.stringify(report, null, 2) + '\n');
  await api.dispose();
  if (browser) await browser.close();
}
