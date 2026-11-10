import { pagePath, pageNames } from './routes.mjs';
import { escape, informationContent } from './information.mjs';
const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const pathFor = (lang) => pagePath('home', lang);

function brand(label) {
  return `<a class="brand" href="${pathFor(label.lang)}" aria-label="Index Tennis — ${escape(label.footer.back)}"><svg class="brand-mark" viewBox="180 300 860 640" width="60" height="48" aria-hidden="true"><use href="/assets/brand/index-logo.svg#index-mark"/></svg><span class="wordmark">INDEX<span>TENNIS</span></span></a>`;
}

function screenshot(name, lang, text, caption, eager = false) {
  return `<figure class="app-figure ${eager ? 'hero-figure' : ''}"><div class="screenshot-wrap"><img class="app-screen" src="/assets/screenshots/${lang}/${name}-384.webp" srcset="/assets/screenshots/${lang}/${name}-384.webp 384w, /assets/screenshots/${lang}/${name}-768.webp 768w" sizes="(max-width: 480px) calc(100vw - 64px), 320px" width="1179" height="2556" alt="${escape(text)}" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></div><figcaption>${escape(caption)}</figcaption></figure>`;
}

function footer(c, config, page) {
  const activePage = pageNames.includes(page) ? page : 'home';
  const footerLinks = Object.entries(c.pages).map(([key, data]) => `<a href="${pagePath(key, c.lang)}" ${page === key ? 'aria-current="page"' : ''}>${escape(data.nav)}</a>`).join('');
  return `<footer class="site-footer container" id="contact"><div class="footer-top"><div>${brand(c)}<p>${escape(c.footer.tagline)}</p></div><div class="footer-contact"><span class="eyebrow">${escape(c.footer.contact)}</span><a href="mailto:${escape(config.contacts.support)}" aria-label="${escape(c.footer.emailLabel)}">${escape(config.contacts.support)} ${arrow}</a></div></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} Index Tennis</span><nav class="footer-links" aria-label="${escape(c.information.related)}">${footerLinks}</nav><nav class="language-links" aria-label="${escape(c.footer.languages)}"><a href="${pagePath(activePage, 'es')}" lang="es" hreflang="es" ${c.lang === 'es' ? 'aria-current="page"' : ''}>ESPAÑOL</a><span aria-hidden="true">/</span><a href="${pagePath(activePage, 'en')}" lang="en" hreflang="en" ${c.lang === 'en' ? 'aria-current="page"' : ''}>ENGLISH</a></nav></div></footer>`;
}

export function render(c, config, { production = false, page = 'home', alias = false } = {}) {
  const home = pathFor(c.lang);
  const other = c.lang === 'es' ? 'en' : 'es';
  const regularPage = pageNames.includes(page);
  const path = regularPage ? pagePath(page, c.lang) : '/404.html';
  const data = c.pages[page];
  const title = page === 'home' ? c.title : data ? data.title : c.notFound.title;
  const description = data ? data.description : c.description;
  const indexable = production && regularPage && !alias;
  const origin = config.productionOrigin || config.plannedOrigin;
  const seo = regularPage ? `<link rel="canonical" href="${escape(origin + path)}"><link rel="alternate" hreflang="es" href="${escape(origin + pagePath(page, 'es'))}"><link rel="alternate" hreflang="en" href="${escape(origin + pagePath(page, 'en'))}"><link rel="alternate" hreflang="x-default" href="${escape(origin + pagePath(page, 'es'))}"><meta property="og:url" content="${escape(origin + path)}"><meta property="og:image" content="${escape(origin + '/assets/brand/index-app-icon.png')}"><meta property="og:image:alt" content="Index Tennis"><meta name="twitter:card" content="summary">` : '';
  const nav = `<header class="site-header container">${brand(c)}<nav aria-label="${escape(c.nav.label)}" class="main-nav"><a href="${home}#how-it-works">${escape(c.nav.how)}</a><a class="nav-level" href="${home}#rankings">${escape(c.nav.rankings)}</a><a href="${home}#faq">${escape(c.nav.faq)}</a><a href="${pagePath('support', c.lang)}">${escape(c.pages.support.nav)}</a><a class="language-switch" href="${pagePath(regularPage ? page : 'home', other)}" lang="${other}" hreflang="${other}" aria-label="${escape(c.nav.language)}">${c.nav.other}${arrow}</a></nav></header>`;
  const content = page === 'home' ? homeContent(c, config) : data ? informationContent(c, config, page) : `<main class="container information-page" id="main"><p class="eyebrow">INDEX TENNIS / 404</p><h1>${escape(c.notFound.heading)}</h1><p>${escape(c.notFound.body)}</p><a class="button button-primary" href="${home}">${escape(c.notFound.back)} ${arrow}</a></main>`;
  const script = page === 'delete-account' ? '<script src="/assets/copy-address.js" defer></script>' : '';
  return `<!doctype html>
<html lang="${c.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#0B0D0C"><meta name="color-scheme" content="dark"><meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}"><meta property="og:type" content="website"><meta property="og:site_name" content="Index Tennis"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:locale" content="${c.locale}">${seo}<link rel="icon" type="image/png" href="/favicon.png"><link rel="apple-touch-icon" href="/assets/brand/index-app-icon.png"><link rel="preload" href="/assets/fonts/BarlowCondensed_600SemiBold.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/styles.css">${script}</head><body><a class="skip-link" href="#main">${escape(c.skip)}</a>${nav}${content}${footer(c, config, page)}</body></html>\n`;
}

function homeContent(c, config) {
  const links = Object.entries(config.downloads).filter(([, url]) => url).map(([platform, url]) => `<a class="button button-secondary" href="${escape(url)}">${escape(c.availability[platform])} ${arrow}</a>`).join('');
  return `<main id="main">
<section class="hero container" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">${escape(c.hero.eyebrow)}</p><h1 id="hero-title"><span>${escape(c.hero.line1)}</span><span>${escape(c.hero.line2)}</span></h1><p class="hero-description">${escape(c.hero.body)}</p><div class="hero-actions"><a class="button button-primary" href="#how-it-works">${escape(c.hero.cta)} ${arrow}</a><span class="coming-soon"><span class="status-square" aria-hidden="true"></span>${escape(c.hero.coming)}</span></div><p class="hero-note">${escape(c.hero.note)}</p></div>${screenshot('home', c.lang, c.hero.alt, c.hero.caption, true)}</section>
<section class="how section container" id="how-it-works" aria-labelledby="how-title"><div class="section-heading"><div><p class="eyebrow">${escape(c.how.eyebrow)}</p><h2 id="how-title">${escape(c.how.title)}</h2></div><p>${escape(c.how.intro)}</p></div><ol class="steps">${c.how.steps.map((step, i) => `<li><span class="step-number" aria-hidden="true">0${i + 1}</span><h3>${escape(step.title)}</h3><p>${escape(step.body)}</p></li>`).join('')}</ol></section>
<section class="rankings section container" id="rankings" aria-labelledby="rankings-title"><div class="product-copy"><p class="eyebrow">${escape(c.rankings.eyebrow)}</p><h2 id="rankings-title" class="large-heading"><span>${escape(c.rankings.line1)}</span><span>${escape(c.rankings.line2)}</span></h2><p>${escape(c.rankings.body)}</p><ol class="scopes">${c.rankings.scopes.map((scope, i) => `<li><span class="scope-number" aria-hidden="true">0${i + 1}</span><div><h3>${escape(scope.title)}</h3><p>${escape(scope.body)}</p></div></li>`).join('')}</ol></div>${screenshot('rankings', c.lang, c.rankings.alt, c.rankings.caption)}</section>
<section class="progress section container" aria-labelledby="progress-title">${screenshot('player', c.lang, c.progress.alt, c.progress.caption)}<div class="product-copy"><p class="eyebrow">${escape(c.progress.eyebrow)}</p><h2 id="progress-title" class="large-heading">${escape(c.progress.title)}</h2><p>${escape(c.progress.body)}</p><aside class="provisional" aria-labelledby="provisional-title"><span class="badge">${escape(c.progress.provisional)}</span><h3 id="provisional-title">${escape(c.progress.provisionalTitle)}</h3><p>${escape(c.progress.provisionalBody)}</p><p class="provisional-note">${escape(c.progress.provisionalNote)}</p></aside></div></section>
<p class="screenshots-note container">${escape(c.screenshotsNote)}</p>
<section class="faq section container" id="faq" aria-labelledby="faq-title"><div><p class="eyebrow">${escape(c.faq.eyebrow)}</p><h2 id="faq-title">${escape(c.faq.title)}</h2></div><div class="faq-list">${c.faq.items.map((item) => `<details><summary>${escape(item.q)}<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>${escape(item.a)}</p></div></details>`).join('')}</div></section>
<section class="availability section" id="download" aria-labelledby="availability-title"><div class="container availability-inner"><div><p class="eyebrow">${escape(c.availability.eyebrow)}</p><h2 id="availability-title">${escape(c.availability.title)}</h2><p>${escape(c.availability.body)}</p></div><div class="availability-status">${links || `<span class="display-status">${escape(c.availability.status)}</span>`}</div></div></section>
</main>`;
}
