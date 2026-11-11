import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import config from '../site.config.mjs';
import deployment from '../cloudflare-pages.config.mjs';

export const recordedTarget = JSON.parse(await readFile(new URL('./preview-target.json', import.meta.url), 'utf8'));
const environment = process.env.SITE_ENV || 'preview';
assert.ok(['preview', 'production'].includes(environment), 'Unknown website environment');
export const production = environment === 'production';
const target = new URL(process.env.PREVIEW_URL || recordedTarget.url);
assert.equal(target.protocol, 'https:', 'Website verification requires HTTPS');
assert.ok(!target.username && !target.password && target.pathname === '/' && !target.search && !target.hash, 'Supply only the website origin');
if (production) {
  assert.ok([config.productionOrigin, `https://${deployment.pagesSubdomain}.pages.dev`].includes(target.origin), 'Use the configured production domain or Pages production hostname');
} else {
  assert.ok(/^[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev$/.test(target.hostname), 'Use a Pages branch or immutable preview');
  assert.ok(target.hostname.endsWith(`.${deployment.pagesSubdomain}.pages.dev`), 'Preview must belong to this Pages project');
}
export const origin = target.origin;
export const legalDraft = !config.legal.approvedPublicationDate || !Object.values(config.legal.reviews).every(Boolean);
