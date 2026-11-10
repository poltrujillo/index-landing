export const pageNames = ['home', 'support', 'privacy', 'terms', 'delete-account'];
export const languages = ['es', 'en'];
export function pagePath(page, lang) {
  if (!pageNames.includes(page) || !languages.includes(lang)) throw new Error('Unknown page or language');
  return `${lang === 'en' ? '/en' : ''}/${page === 'home' ? '' : page + '/'}`;
}
export const routes = languages.flatMap((lang) => pageNames.map((page) => ({ lang, page, path: pagePath(page, lang) })));
export const aliases = [{ lang: 'es', page: 'privacy', path: '/privacidad/' }];
