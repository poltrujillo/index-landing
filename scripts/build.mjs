import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import config from '../site.config.mjs';
import { render } from '../src/page.mjs';
import { routes, aliases } from '../src/routes.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export async function loadContent(lang) {
  const [landing, pages] = await Promise.all(['', 'pages.'].map((prefix) => readFile(join(root, `content/${prefix}${lang}.json`), 'utf8').then(JSON.parse)));
  return { ...landing, ...pages };
}
export async function build({ production = false, output = join(root, 'dist'), settings = config } = {}) {
  const complete = (value) => typeof value === 'string' ? Boolean(value.trim()) : value && ['es', 'en'].every((lang) => typeof value[lang] === 'string' && value[lang].trim());
  if (production) {
    const pending = Object.entries(settings.legal.reviews).filter(([, approved]) => approved !== true).map(([key]) => key);
    if (!settings.productionOrigin || !settings.legal.approvedPublicationDate || pending.length || !complete(settings.legal.website.host) || !complete(settings.legal.website.processingRegion) || !complete(settings.legal.website.logRetention) || !complete(settings.legal.retainedHistory.legalBasis) || !complete(settings.legal.retainedHistory.duration)) throw new Error(`Production requires approved publication details and completed legal/operational review in site.config.mjs. Pending: ${pending.join(', ') || 'publication date / hosting / retention details'}. Use npm run build for draft previews.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(settings.legal.approvedPublicationDate) || Number.isNaN(Date.parse(settings.legal.approvedPublicationDate))) throw new Error('Approved publication date must be a valid ISO date.');
    const origin = new URL(settings.productionOrigin);
    if (origin.protocol !== 'https:' || origin.origin !== settings.productionOrigin) throw new Error('productionOrigin must be an HTTPS origin without a trailing slash or path.');
  }
  for (const url of Object.values(settings.downloads).filter(Boolean)) {
    if (new URL(url).protocol !== 'https:') throw new Error('Public download destinations must use HTTPS.');
  }
  await mkdir(output, { recursive: true });
  // Only replace generated assets/pages; never delete an arbitrary caller-supplied directory.
  await rm(join(output, 'assets'), { recursive: true, force: true });
  await cp(join(root, 'public'), output, { recursive: true });
  await cp(join(root, 'src/styles.css'), join(output, 'styles.css'));
  const translations = { es: await loadContent('es'), en: await loadContent('en') };
  for (const route of [...routes, ...aliases.map((route) => ({ ...route, alias: true })), { lang: 'es', page: '404', path: '/404.html' }]) {
    const file = route.path.endsWith('/') ? route.path + 'index.html' : route.path;
    const destination = join(output, file);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, render(translations[route.lang], settings, { production, page: route.page, alias: route.alias }));
  }
  const sitemap = production ? `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${settings.productionOrigin}${route.path}</loc></url>`).join('')}</urlset>\n` : null;
  if (sitemap) await writeFile(join(output, 'sitemap.xml'), sitemap);
  else await rm(join(output, 'sitemap.xml'), { force: true });
  await writeFile(join(output, 'robots.txt'), production ? `User-agent: *\nAllow: /\nSitemap: ${settings.productionOrigin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
  await writeFile(join(output, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Content-Security-Policy: default-src 'none'; img-src 'self'; style-src 'self'; font-src 'self'; script-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: DENY\n${production ? '' : '  X-Robots-Tag: noindex, nofollow\n'}`);
  return output;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    await build({ production: process.argv.includes('--production') });
    console.log(`Built dist/ (${process.argv.includes('--production') ? 'production' : 'noindex preview'}).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
