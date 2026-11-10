import { pagePath } from './routes.mjs';

export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export function plain(text, config, c) {
  const localized = (value) => typeof value === 'object' && value !== null ? value[c.lang] : value;
  const values = { operator: config.operator.name, country: c.information.country, support: config.contacts.support, privacy: config.contacts.privacy, minimumAge: config.legal.minimumAge, responseMonths: config.legal.rightsResponseMonths,
    websiteHost: localized(config.legal.website.host) || c.information.unconfirmed,
    websiteRegion: localized(config.legal.website.processingRegion) || c.information.unconfirmed,
    websiteLogRetention: localized(config.legal.website.logRetention) || c.information.unconfirmed,
    historyBasis: localized(config.legal.retainedHistory.legalBasis) || c.information.historyBasisReview,
    historyDuration: localized(config.legal.retainedHistory.duration) || c.information.historyDurationReview,
  };
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unknown content token: ${key}`);
    return String(values[key]);
  });
}

export function informationContent(c, config, page) {
  const data = c.pages[page];
  const text = (value) => escape(plain(value, config, c));
  const isSupport = page === 'support';
  const draft = isSupport
    ? !config.supportApproved
    : !config.legal.approvedPublicationDate || !Object.values(config.legal.reviews).every(Boolean);
  const date = draft ? config.legal.draftPreparedOn : config.legal.approvedPublicationDate;
  const dateLabel = date && new Intl.DateTimeFormat(c.lang === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
  const related = Object.keys(c.pages).filter((key) => key !== page).map((key) => `<a href="${pagePath(key, c.lang)}">${escape(c.pages[key].nav)}</a>`).join('');
  const sections = data.sections.map((section) => {
    const listTag = section.ordered ? 'ol' : 'ul';
    const contact = section.contact ? `<p class="contact-address"><a href="mailto:${escape(config.contacts[section.contact])}">${escape(config.contacts[section.contact])}</a></p>` : '';
    const request = section.deletionRequest ? deletionRequest(c, config) : '';
    const table = section.table ? `<div class="policy-table-wrap" role="region" aria-label="${text(section.title)}" tabindex="0"><table><caption class="sr-only">${text(section.title)}</caption><thead><tr>${section.table.headers.map((header) => `<th scope="col">${text(header)}</th>`).join('')}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${text(cell)}</th>` : `<td>${text(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
    const faq = section.faqs ? `<div class="faq-list information-faq">${section.faqs.map((item) => `<details><summary>${text(item.q)}<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>${text(item.a)}</p></div></details>`).join('')}</div>` : '';
    return `<section class="policy-section" id="${section.id}" aria-labelledby="${section.id}-title"><h2 id="${section.id}-title">${text(section.title)}</h2>${section.paragraphs.map((p) => `<p>${text(p)}</p>`).join('')}${section.items?.length ? `<${listTag}>${section.items.map((item) => `<li>${text(item)}</li>`).join('')}</${listTag}>` : ''}${contact}${request}${table}${faq}${section.links?.length ? `<div class="policy-links">${section.links.map((link) => `<a href="${link.url ? escape(link.url) : pagePath(link.page, c.lang)}">${text(link.label)}</a>`).join('')}</div>` : ''}${draft && section.reviewNote ? `<aside class="review-note"><strong>${escape(c.information.reviewLabel)}</strong> ${text(section.reviewNote)}</aside>` : ''}</section>`;
  }).join('');
  const dateMarkup = isSupport && !draft ? '' : `<p class="policy-date">${escape(draft ? c.information.draftDate : c.information.effectiveDate)} <time datetime="${date}">${escape(dateLabel)}</time></p>`;
  return `<main id="main" class="container policy-page"><header class="policy-header"><p class="eyebrow">INDEX TENNIS / ${escape(data.nav)}</p><h1>${escape(data.heading)}</h1><p class="policy-intro">${text(data.intro)}</p>${page === 'delete-account' ? `<a class="button button-primary policy-quick-action" href="#delete-by-email">${escape(c.deletionRequest.emailAction)}</a>` : ''}${dateMarkup}${draft ? `<aside class="draft-banner"><strong>${escape(c.information.draftTitle)}</strong><p>${escape(c.information.draftBody)}</p></aside>` : ''}</header><div class="policy-layout"><nav class="policy-toc" aria-label="${escape(c.information.toc)}"><p class="eyebrow">${escape(c.information.toc)}</p>${data.sections.map((section) => `<a href="#${section.id}">${text(section.title)}</a>`).join('')}</nav><article class="policy-content" aria-label="${escape(data.heading)}">${sections}<nav class="related-pages" aria-label="${escape(c.information.related)}"><p class="eyebrow">${escape(c.information.related)}</p>${related}</nav></article></div></main>`;
}

function deletionRequest(c, config) {
  const d = c.deletionRequest;
  const email = config.contacts.privacy;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;
  return `<div class="deletion-request"><p><a class="selectable-address" id="deletion-address" tabindex="-1" href="mailto:${escape(email)}">${escape(email)}</a></p><p>${escape(d.instruction)}</p><div class="deletion-actions"><a class="button button-primary" href="${escape(mailto)}">${escape(d.emailAction)}</a><button class="button button-secondary" type="button" data-copy-address="${escape(email)}" data-copy-success="${escape(d.copySuccess)}" data-copy-failure="${escape(d.copyFailure)}" aria-describedby="copy-feedback" hidden>${escape(d.copyAction)}</button></div><p class="copy-feedback" id="copy-feedback" role="status" aria-live="polite" aria-atomic="true"></p><details class="suggested-request"><summary>${escape(d.suggestion)}<span class="faq-icon" aria-hidden="true"></span></summary><p class="request-subject">${escape(d.subject)}</p><pre>${escape(d.body)}</pre></details></div>`;
}
