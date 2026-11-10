# Deployed draft review — 10 November 2026

The owner supplied `https://deaa5164.index-landing-3yn.pages.dev`, built from the initial commit. Direct search-tool fetching was unavailable, but GitHub access became available and browser testing was executed in GitHub Actions with Chromium.

## Finding and fix

At 320px, screenshots forced a 320px intrinsic grid minimum inside a 280px content area, causing horizontal scrolling. The mobile hero, ranking and progress grids now use `minmax(0, 1fr)` and allow their children to shrink. No body overflow-hiding workaround was used.

The mobile fix is on `draft-preview` at `9f5a7f7`. Public settings QA was added at `0e49d0e`. The owner approved both Support translations, which are deployed on the preview at `f1ebfda`. Privacy, Terms and Delete Account remain labelled drafts during staging deletion testing.

## Verified deployment and run

- Approved bilingual Support preview: https://e7287155.index-landing-3yn.pages.dev/support/ and https://e7287155.index-landing-3yn.pages.dev/en/support/
- Support approval, settings and public DNS audit: https://github.com/poltrujillo/index-landing/actions/runs/42919735556 (all 40 browser combinations passed)
- Successful fixed deployment: https://e7f106ab.index-landing-3yn.pages.dev
- Successful deployment with public-settings audit: https://a7fb50b7.index-landing-3yn.pages.dev
- Moving draft alias: https://draft-preview.index-landing-3yn.pages.dev
- Latest successful browser/settings run: https://github.com/poltrujillo/index-landing/actions/runs/42903346596
- Screenshot/results artifact: https://github.com/poltrujillo/index-landing/actions/runs/42903346596/artifacts/13803378466 (expires 17 November 2026)

The browser run waited for the served stylesheet to match the checkout hash. It passed all ten canonical routes at 320, 390, 768 and 1440px: 40 combinations. Checks cover status, noindex headers/meta, titles/language, rendered logo and screenshots, horizontal overflow, keyboard skip/FAQ behavior, footer/counterpart links, deletion mail templates, clipboard success/denial, both no-JavaScript deletion routes and a real 404. Static repository checks and all ten behavior tests also passed. Desktop/mobile screenshots were captured for further visual review; the automated assertions are not a full manual accessibility audit.

Changing `qa/preview-target.json` on `draft-preview` now triggers browser QA, alongside the existing manual workflow. The recorded target is a moving branch alias and tests verify the stylesheet before proceeding; ordinary source pushes do not silently rerun an old immutable target. The source target, observations and any failure are written to the result artifact. No email requests are actually sent by tests.

The added settings audit passed eleven HTML responses, nine slash redirects, trusted HTTPS, preview noindex/robots, security headers, no production sitemap and real 404 handling. No analytics beacon, external HTTP resources, cookies or browser-storage keys were observed during the run. This does not inspect Cloudflare's internal logs, contracts or dashboard toggles. Details are in `cloudflare-privacy.md` and the artifact's `settings-audit.json`.

## Still open

The old Workers Builds integration reports a failed check saying its Worker does not exist; the correct Cloudflare Pages check is successful. Disconnect the obsolete Workers build connection separately without removing the Pages/GitHub integration.

No DNS records were changed. The production domain remains separate, and legal/account-level logging, retention and publication decisions remain open. Anonymous browser observations do not establish provider internal log retention or contract/transfer settings.
