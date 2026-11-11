# GitHub → Cloudflare Pages

Prepared 10 November 2026 for `https://github.com/poltrujillo/index-landing.git`. The Git-integrated Pages project is `index-landing-3yn`; `draft-preview` is deployed at https://draft-preview.index-landing-3yn.pages.dev and has passed live Chromium checks. The operator approved the final wording and authorized production publication on 11 November 2026. No DNS migration has been performed. See [preview-review.md](preview-review.md) for deployment evidence and limits.

## Build settings

Create/select a **Pages project with Git integration**, connect the existing GitHub repository through Cloudflare’s GitHub app, and apply:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | Repository root |
| Production branch | `main` |
| Build command | `npm run build:cloudflare` |
| Build output directory | `dist` |
| Node version | `22`, also declared in `.node-version` |
| `INDEX_DEPLOYMENT_CONTEXT` in Production environment | `production` |
| `INDEX_DEPLOYMENT_CONTEXT` in Preview environment | `preview` |
| Preview branch | `draft-preview` (or another non-main branch) |
| Web Analytics / Zaraz | Disabled; no tracking is requested |
| Functions / databases / bindings | None; this is a static site |

These values are recorded in `cloudflare-pages.config.mjs`, including the verified project name. That file is a repository contract, **not** a manifest automatically applied by Cloudflare. Git integration builds at Cloudflare; no Cloudflare deployment token or Wrangler upload job is needed in GitHub Actions.

The dispatcher uses Cloudflare’s supplied `CF_PAGES=1` and `CF_PAGES_BRANCH`, and cross-checks the environment-scoped `INDEX_DEPLOYMENT_CONTEXT`. A mismatch or missing context stops the build; changing the dashboard’s production branch cannot silently publish draft output. It runs `npm run check` first, then:

- `main`: **`npm run build:production`**. There is no fallback to a draft on failure.
- Any other branch uses `npm run build`, with noindex metadata, robots restrictions and `X-Robots-Tag` headers. Approved policy pages keep their final wording on previews.

The approved configuration now passes production checks. Keep `main` as the production branch and the dispatcher as the build command. Unapproved future policy changes must pass their own review before updating publication configuration.

No dependencies are needed for the site build. Browser tooling lives separately in `qa/` and is not installed for Pages production builds.

## GitHub preparation and preview

The owner pushed the initial source to the existing repository. GitHub connector access subsequently became available; preview fixes and QA were committed to `draft-preview` without changing `main`. Earlier access failures are resolved for the connector. Cloudflare’s GitHub installation is independently connected to the repository, as demonstrated by successful native Pages checks. Keep generated `dist/`, `node_modules/` and browser artifacts ignored.

Select the real preview deployment in Pages and record its immutable HTTPS hash URL. Cloudflare also supports moving branch aliases. Do not invent either URL before a deployment returns it. Preview URLs are normally public: `noindex` is not authentication or confidentiality. The legal drafts are visibly marked for review. If private previews are wanted later, configure Cloudflare Access deliberately and account for its authentication cookies; the final support/legal/deletion routes must remain public.

## Browser review of the deployed draft

The **Test deployed website** workflow runs on relevant pushes to `draft-preview` and `main`. Preview checks use the branch alias. Production checks use `https://index-landing-3yn.pages.dev`. The manual workflow accepts the configured custom domain once connected. The QA target allowlist is restricted to this Pages project and the configured canonical origin. Tests wait for both the stylesheet and complete rendered privacy policy to match the checkout.

It installs isolated, version-pinned Playwright QA tooling, launches Chromium and checks all ten canonical routes at 320, 390, 768 and 1440px. Checks include draft headers/metadata, no injected analytics beacon, titles/language, loaded logo/screenshots, page overflow, keyboard skip/FAQ controls, footer and counterpart links, deletion mail templates, clipboard success/denial, no-JS deletion routes and a genuine 404. Desktop/mobile screenshots and a JSON result are saved as a seven-day GitHub artifact. Review the images manually for text layout and zoom; automation is not a complete accessibility audit.

The same test can be run in a browser-capable local environment:

```sh
npm install --prefix qa --package-lock=false --ignore-scripts --no-audit --no-fund
node qa/node_modules/@playwright/test/cli.js install --with-deps chromium
PREVIEW_URL=https://the-actual-hash.the-actual-project.pages.dev npm run check:browser
```

The hostname above illustrates the URL shape; use a real URL from Pages. The package version is pinned in `qa/package.json`; installation and Chromium execution have succeeded in GitHub Actions. The separate public-settings audit runs `node qa/preview-settings.mjs` after browser checks and saves header, redirect, cookie-name and storage observations. It cannot inspect Cloudflare's internal logs or dashboard settings.

## Production publication

The release decisions and account-specific evidence limits are recorded in `docs/legal-review.md`. The approved date and truthful current retention criteria are in `site.config.mjs`. Run `npm run check` and `npm run build:production` before publication. Merge/push the approved source to `main`; the Pages dispatcher reruns checks and the same production command before deployment. No draft output is promoted in its place.

Only after this release should the custom domain be connected using [dns-migration.md](dns-migration.md). Verify the deployed HTTPS site, canonical/language metadata, sitemap, contact and deletion routes, 404, cookies and response headers. Keep preview noindex; do not add a wildcard `pages.dev` redirect that breaks preview review. A redirect of the production Pages hostname to the canonical custom domain can be configured separately after domain activation.

## Official references checked

- [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Build configuration and supplied environment](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Build commands per branch](https://developers.cloudflare.com/pages/how-to/build-commands-branches/)
- [Preview deployments and noindex headers](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Static routing and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Pages Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/): dashboard enablement can inject a beacon, so source inspection alone is insufficient.
