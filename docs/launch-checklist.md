# Website release checklist

The operator authorized publication on 11 November 2026. Spanish and English Support, Privacy, Terms and Delete Account contain approved public copy. The effective policy date is 11 November 2026. Production uses `npm run build:production`, with canonical URLs at `https://indextennis.com`.

## Completed source and content review

- [x] Confirm individual operator Pol Trujillo Albert, Spain, brand Index Tennis, minimum age 14 and working support/privacy inbox `support@indextennis.com`.
- [x] Incorporate the completed staging deletion report, including both deletion paths, session refusal, photo-folder cleanup and participant-only retained results.
- [x] Replace the old one-month completion promise with the rights-response deadline measured from receipt.
- [x] Describe current retained-history necessity criteria and legitimate-interest basis, with erasure/objection rights and the disabled automatic-expiry limitation. Keep candidate 30/45/90-day settings out of public promises.
- [x] Document provider roles, processing-location and retention limits, including Cloudflare’s published transfer terms and account-level unknowns.
- [x] Remove draft banners and review notes from the approved policy output. Preserve bilingual navigation, accessible deletion mail links and copy-address feedback.
- [x] Prepare the Git-integrated Pages build, Node 22, `dist`, and separate production/preview contexts.
- [x] Run repository checks and `npm run build:production` successfully.
- [x] Prepare the DNS change set, including the active Squarespace DNSSEC DS record and preservation of all six known Zoho records.

## Deployment and final domain

- [ ] Verify the release on the Pages preview, then publish the reviewed commit through `main` and confirm the native Pages production deployment.
- [ ] Run production browser verification on the real production hostname, including all ten canonical pages, counterpart links, mail templates, keyboard controls, clipboard denial, no-JS deletion, metadata, robots, sitemap and 404.
- [ ] Obtain authenticated Cloudflare and Squarespace access and the full current zone export. No credentials or supported authenticated account connection are available in this session.
- [ ] Reconcile the complete imported zone, confirm the assigned Cloudflare nameserver pair and follow the DNSSEC sequence in [DNS migration](dns-migration.md).
- [ ] Add apex and `www` through Pages Custom domains, replace only the intended website records, confirm certificates and redirect `www` to the apex while preserving path/query.
- [ ] Verify public and authoritative Zoho MX/SPF/DKIM/verification records after cutover, plus final website routes and HTTPS. The operator already confirmed current mail delivery.

The obsolete Workers build connection is separate cleanup. The correct Pages deployment is the release authority.

## Separate app/backend follow-ups

The basic deletion rehearsal and operator tooling are completed. Remaining work concerns Apple grants, continuous worker availability, older-backup recovery and activation of finite retention. The old backend privacy HTML and mobile contact/links still need migration to the published domain. See [review evidence](legal-review.md) for the current scope and exact limitations.

## Verification limits

There are no lint/typecheck scripts or TypeScript toolchain in this repository. `npm run check` covers translation parity, generated routes, links, original assets, metadata, release guards, contrast, request-handler and clipboard behavior. Chromium in GitHub Actions checks four widths and saves screenshots. Additional manual accessibility/zoom and device review can extend that coverage.
