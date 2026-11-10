# Launch checklist

The site has complete local Spanish/English Support, Privacy, Terms and Delete Account drafts. Default builds are noindex. A draft is deployed and browser-tested; production has not been published. See `docs/preview-review.md`.

Current review scope: Support is with the owner for review. Keep Privacy, Terms and Delete Account as drafts until retention and the deletion-request workflow are resolved; no approval or publication date has been recorded.

## Confirmed on 10 November 2026

- Operator/controller: Pol Trujillo Albert, individual in Spain, without a registered company. No postal address supplied for publication.
- Working support/privacy address: `support@indextennis.com`. Zoho email, with DNS verification finishing.
- Domain: `https://indextennis.com`, bought through Squarespace. Cloudflare Pages is now selected as host; Zoho mail stays in place. Six supplied mail records are recorded in `ops/known-mail-dns.json`.
- Minimum age: 14; no parental-consent feature.
- One-month rights-response deadline and normal target for verified deletion, with lawful extensions explained. Not a guarantee of instant external cleanup.
- Existing logo, six language-matched screenshots and Coming soon downloads remain.

## Before publication

- [ ] Review and approve the complete bilingual copy, including retained records and public-read photo URLs. See [legal-review.md](legal-review.md).
- [ ] Resolve legally required operator/service-address disclosures without inventing or publishing a private address without instruction.
- [x] Select Cloudflare Pages and prepare the GitHub build/preview workflow with `dist` output.
- [x] Connect GitHub and Pages and run the deployed-preview browser workflow: 40 route/viewport combinations passed.
- [ ] Complete the account-level Cloudflare logging, cookie/analytics configuration and transfer review; passing anonymous browser checks does not verify provider-internal settings. See `docs/cloudflare-privacy.md`.
- [ ] Verify production app-provider regions, signed processor contracts, subprocessors/transfer safeguards, Zoho region and diagnostic settings. EU staging is not proof of all processing locations.
- [ ] Approve and implement retention/minimisation for de-identified match/rating history, remaining player/club/request data, private match statuses, deletion queues, logs, backups, errors and correspondence. No fixed history cutoff is currently enforced.
- [ ] Establish the verified-email deletion fulfilment workflow/tooling and retry monitoring. The mailto route requests deletion; the static website does not perform it.
- [ ] Review valid incorporation/acceptance of Terms. Publishing a page does not prove existing users accepted it.
- [x] Complete automated Chromium route/layout checks at 320, 390, 768 and 1440px, keyboard skip/FAQ controls, clipboard denial/success, no-JS deletion and rendered assets.
- [ ] Finish manual visual/accessibility review, including 200% zoom and any additional browser/device coverage.
- [ ] Set the actual approved publication date, then mark only completed decisions in `legal.reviews`. Run `npm run check` and `npm run build:production`.
- [ ] Publish the approved `main` branch through the Pages dispatcher, which must run `npm run build:production`. Connect the domain using `docs/dns-migration.md`, preserving all Zoho and unrelated DNS records. Verify HTTPS, redirects, MIME types, security headers, indexes and the real 404; no SPA fallback.
- [ ] Verify stable URLs directly without login/app installation, language counterparts, email delivery, sitemap and robots on the deployed host. Preserve `/privacidad/` as an alias.
- [ ] Update separate app/backend privacy texts, contacts, settings links, store listings and any required terms-acceptance flow.

## Verification in this workspace

`npm run build` and `npm run check` pass. Checks cover generated routes/content/links/metadata and request-handler/clipboard behavior without a socket. JavaScript syntax and generated HTML nesting are checked during implementation. No lint/typecheck scripts or TypeScript toolchain are configured.

Actual HTTP preview was retried, but binding `127.0.0.1:4173` failed with `EPERM`. Firefox's Snap launcher also cannot start. GitHub-hosted Chromium subsequently passed live draft checks, including layouts, keyboard/clipboard and no-JS deletion. Local browser restrictions remain; manual visual/zoom review and Lighthouse measurements are still separate. See `docs/preview-review.md`.

`npm run build:production` intentionally rejects the real draft configuration and reports the pending decisions. Temporary synthetic fixtures test approved production output without approving or publishing these drafts.
