# GitHub → Cloudflare Pages

Prepared 10 November 2026 for `https://github.com/poltrujillo/index-landing.git`. The source and checks are ready locally. No push, Pages project, preview URL, account-setting change or DNS migration has been completed from this session.

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

These values are recorded in `cloudflare-pages.config.mjs`. That file is a repository contract, **not** a manifest automatically applied by Cloudflare. Fill `projectName` only once the real project exists. Git integration builds at Cloudflare; no Cloudflare deployment token or Wrangler upload job is needed in GitHub Actions.

The dispatcher uses Cloudflare’s supplied `CF_PAGES=1` and `CF_PAGES_BRANCH`, and cross-checks the environment-scoped `INDEX_DEPLOYMENT_CONTEXT`. A mismatch or missing context stops the build; changing the dashboard’s production branch cannot silently publish draft output. It runs `npm run check` first, then:

- `main`: **`npm run build:production`**. There is no fallback to a draft on failure.
- Any other branch: `npm run build`, a visibly labelled legal draft with noindex metadata, robots restrictions and `X-Robots-Tag` headers.

The current production build must fail because legal/operational approvals remain open. Do not change the Pages production branch to bypass that gate, remove review checks, or point the custom domain at a preview. The first failed `main` build is expected; preview branches can be deployed for review while the production project has no successful release. If automatic production deployment is disabled in the dashboard during review, keep the declared production branch `main` and re-enable it only for the approved release.

No dependencies are needed for the site build. Browser tooling lives separately in `qa/` and is not installed for Pages production builds.

## GitHub preparation and preview

This managed checkout exposes an empty, read-only `.git` mount, so `git status` reports that it is not a repository. The connected GitHub app returns 404 for the supplied repo, and shell GitHub/network access is blocked. These are access limits, not evidence that the owner’s remote is incorrect. Do not initialise over the owner’s existing `.git` or create a replacement public repository.

Once using the owner’s actual checkout/access, commit the prepared source, CI workflows, assets, `qa/` and documentation; leave generated `dist/`, `node_modules/` and browser artifacts ignored. Push to the existing repository, establish the `main` branch, and create/push `draft-preview` from that commit. Cloudflare’s GitHub installation must be granted access to this specific repository, independently of the Codex GitHub connector.

Select the real preview deployment in Pages and record its immutable HTTPS hash URL. Cloudflare also supports moving branch aliases. Do not invent either URL before a deployment returns it. Preview URLs are normally public: `noindex` is not authentication or confidentiality. The legal drafts are visibly marked for review. If private previews are wanted later, configure Cloudflare Access deliberately and account for its authentication cookies; the final support/legal/deletion routes must remain public.

## Browser review of the deployed draft

After the workflow is on the repository’s default branch, run **Actions → Test a Cloudflare draft preview → Run workflow** with the immutable preview URL. The workflow has read-only repository permissions, accepts only HTTPS hash/branch `pages.dev` origins, and does not deploy or touch DNS.

It installs isolated, version-pinned Playwright QA tooling, launches Chromium and checks all ten canonical routes at 320, 390, 768 and 1440px. Checks include draft headers/metadata, no injected analytics beacon, titles/language, loaded logo/screenshots, page overflow, keyboard skip/FAQ controls, footer and counterpart links, deletion mail templates, clipboard success/denial, no-JS deletion routes and a genuine 404. Desktop/mobile screenshots and a JSON result are saved as a seven-day GitHub artifact. Review the images manually for text layout and zoom; automation is not a complete accessibility audit.

The same test can be run in a browser-capable local environment:

```sh
npm install --prefix qa --package-lock=false --ignore-scripts --no-audit --no-fund
node qa/node_modules/@playwright/test/cli.js install --with-deps chromium
PREVIEW_URL=https://the-actual-hash.the-actual-project.pages.dev npm run check:browser
```

The hostname above illustrates the URL shape, not a created deployment. Test a real URL from Pages. The package version is pinned in `qa/package.json`; no browser package/tarball was downloaded or browser test run in this network-restricted session. First CI execution must verify installation and runtime behavior.

## Production publication

Complete factual/legal review in `docs/legal-review.md`, including account-specific hosting/logging/cookie checks. Set real retention details and the approved publication date, and approve only completed review decisions in `site.config.mjs`. `npm run build:production` must succeed. Merge/push the approved source to `main`; the Pages dispatcher reruns checks and the same production command before deployment. No draft output is promoted in its place.

Only after this release should the custom domain be connected using [dns-migration.md](dns-migration.md). Verify the deployed HTTPS site, canonical/language metadata, sitemap, contact and deletion routes, 404, cookies and response headers. Keep preview noindex; do not add a wildcard `pages.dev` redirect that breaks preview review. A redirect of the production Pages hostname to the canonical custom domain can be configured separately after domain activation.

## Official references checked

- [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Build configuration and supplied environment](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Build commands per branch](https://developers.cloudflare.com/pages/how-to/build-commands-branches/)
- [Preview deployments and noindex headers](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Static routing and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Pages Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/): dashboard enablement can inject a beacon, so source inspection alone is insufficient.
