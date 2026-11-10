# Index Tennis

A static Spanish/English site matching the app’s Night Session design. No runtime dependencies, backend or tracking. A small clipboard script runs only on account-deletion pages; email requests work without JavaScript.

Requires Node.js 22 or newer. No package installation is necessary.

```sh
npm run build
npm run check
npm run dev
```

Open `http://127.0.0.1:4173`. `PORT=8080 npm run dev` changes the port. The dev command builds once and serves `dist/`; after editing, run `npm run build` again and refresh. A host that prevents listening on loopback cannot run the preview server; building/checking still works.

Routes:

- `/` — Spanish landing page
- `/en/` — English landing page
- `/support/`, `/privacy/`, `/terms/`, `/delete-account/` — Spanish support and policy pages
- `/en/support/`, `/en/privacy/`, `/en/terms/`, `/en/delete-account/` — English equivalents
- `/privacidad/` — preserved Spanish privacy alias, canonicalised to `/privacy/`
- `/404.html` — Spanish not-found page; configure the host’s 404 fallback to use it

Edit `content/es.json` and `content/en.json` for landing copy, and `content/pages.es.json` / `content/pages.en.json` for support/policy copy. The shell is in `src/page.mjs`, long-text components in `src/information.mjs`, routes/language pairs in `src/routes.mjs`, and styling in `src/styles.css`. Operator, contacts, age, dates and approval state are centralised in `site.config.mjs`. No app repository or Downloads paths are used by the build. Asset provenance is recorded in [docs/assets.md](docs/assets.md).

The default build is a **noindex draft preview**. Information pages show a draft notice, preparation date and unresolved review notes, without claiming an effective date. The operator confirmed the domain, controller, working support/privacy inbox and minimum age; hosting, retention and legal approval remain open. Downloads remain Coming soon.

For production, complete [docs/legal-review.md](docs/legal-review.md) and [docs/launch-checklist.md](docs/launch-checklist.md). Record actual hosting/retention details, approve the bilingual copy and set the actual `approvedPublicationDate`. Only mark completed `legal.reviews` decisions approved. Region/log-retention/history-basis/history-duration fields can be `{ es: '…', en: '…' }` maps; proper names can be shared strings. Then run:

```sh
npm run build:production
```

Production builds include canonical and reciprocal page-specific language links, Open Graph metadata and a sitemap for all ten canonical pages. They fail before modifying output if approvals/date/hosting/retention are incomplete. Optional store URLs must be HTTPS. Serve `dist/` with directory indexes, slash redirects, MIME types, HTTPS and the real 404 fallback. `_headers` includes CSP allowing the local clipboard script; configure equivalent headers if unsupported by the host. Cloudflare Pages is selected. GitHub checks and a branch/context-aware Pages build are prepared; no live project or deployment has been created from this session. Squarespace remains the registrar, and the Zoho records must be preserved.

Checks cover translation parity, twelve HTML outputs, links/anchors/assets, screenshots, page-preserving language switching, deletion email templates, footer navigation, metadata, release guards and contrast. Interaction/request-handler tests cover clipboard success/denial/unsupported fallback, direct paths, slash redirects, script MIME and 404 without opening a socket. They do not replace browser/HTTP verification; this environment blocks the local server and Firefox launcher.


## Cloudflare Pages deployment

The repository contract is `cloudflare-pages.config.mjs`: GitHub repository `poltrujillo/index-landing`, production branch `main`, build command `npm run build:cloudflare`, output `dist`, Node 22. Apply it to a Git-integrated Pages project. Scope `INDEX_DEPLOYMENT_CONTEXT=production` to Production and `preview` to Preview. A mismatch is rejected; `main` always invokes `npm run build:production` after checks, while preview branches use the noindex draft build.

See [Cloudflare setup](docs/cloudflare-pages.md), [logging/transfer research](docs/cloudflare-privacy.md) and [Zoho-preserving domain migration](docs/dns-migration.md). The six owner-supplied Zoho records are recorded in `ops/known-mail-dns.json`; it is deliberately not a complete zone export. No DNS mutation tool is included.

A separate GitHub workflow tests an actual deployed draft URL with Chromium and saves desktop/mobile screenshots. Browser dependencies are isolated in `qa/` and not part of the site build. It has not run in this restricted session; connecting GitHub/Pages and obtaining a real preview URL remain necessary.
