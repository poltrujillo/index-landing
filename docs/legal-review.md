# Support and legal pages: evidence and review

Draft prepared 10 November 2026. Full bilingual drafts are implemented. They are not a declaration of legal compliance or store approval, and no publication/effective date has been asserted.

## Confirmed details and timeframe

The developer confirmed `support@indextennis.com` works for both support/privacy; Pol Trujillo Albert remains the individual operator/controller in Spain, without a registered company; no postal address is to be published for now; minimum age remains 14. The domain is registered through Squarespace and email through Zoho; DNS verification is finishing. The developer subsequently selected Cloudflare Pages and supplied six Zoho EU mail/verification DNS records. These establish the selected host and mail-routing evidence, not universal EU-only processing or verified account retention. See `cloudflare-privacy.md` and `dns-migration.md`.

The developer delegated the proposed timeframe and retention approach. The draft uses one calendar month for rights responses and as the normal target for verified deletion, with lawful complexity/volume extensions explained within the initial month. It does not promise immediate external cleanup or automatically restart deadlines during verification. See [AEPD guidance](https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos).

## Retained history: explicit review needed

Proposed purpose: preserving opponents’ confirmed results and reproducible levels. A possible legal basis is legitimate interests, subject to a documented necessity/balancing assessment, minimisation, reasonable expectations and erasure/objection rights. This is a proposal, not a conclusion that retention is mandatory or justified indefinitely.

The current backend retains confirmed matches, rating history and historical player/club references without a fixed cutoff. Choosing an arbitrary duration would invent an enforced capability. Before publication, inventory retained fields and their re-identification risk, remove unnecessary identifying/context fields, justify the shortest retention duration or defined criteria, and implement the corresponding cleanup/archive process without silently corrupting opponents’ ratings. A periodic necessity review can be an interim control but does not replace justified, enforceable retention criteria.

The legal basis/duration and `retentionAndDeletion` decision deliberately remain unresolved for explicit approval. Set real schedules for private match statuses, support mail, errors, logs and backups too. The old app policy’s blanket 30-day logs/backups statement was not verified and is not copied as a promise.

## Local evidence inspected read-only

Sources are in `/home/poltrujillo/projects/club-utr/`:

| Source | Supported behavior |
| --- | --- |
| `CLAUDE.md`, backend spec §10, mobile spec §14 | National level, four rankings, self-declared home clubs, directory, broader signed-in profile/confirmed-match visibility. |
| Backend spec §10.6 | Unapproved club details are requester/platform-reviewer restricted; this does not make the whole requester profile private. |
| Mobile spec §§2–3, 7–8 | Email/Apple/Google access, optional photos/push, deletion, public-read photo URLs and retry behavior. |
| `backend/.../player/AccountDeletion.java` | Former player name, cleared auth link/photo reference, expired pending matches, removed tokens/pending notifications; retained confirmed matches/rating events. |
| `AuthDeletions.java`, deletion jobs | External retries; deleted auth identifier held until cleanup succeeds plus two days before scheduled removal. Missing credentials/failures can delay completion. |
| Mobile monitoring scrubber and backend `SentryConfig.java` | User/request-context scrubbing; not a guarantee that providers never collect technical connection logs. |
| Staging runbook, ADR-005 | Frankfurt Fly/Neon/Supabase, EU Sentry and Brevo in documented staging; not proof of all production processing locations. |
| Backend privacy HTML | Outdated ClubRating/per-club text, former email, minimum age and older retention assertions. |
| Mobile settings contact and settings route | Still uses `poltrujialb@gmail.com` and `${apiUrl}/privacy`; website changes do not update them. |
| Website source/config | Static local assets, no application cookies/analytics/tracking/contact backend; clipboard enhancement only. Cloudflare Pages deployment contract and preview QA are configured. Edge behavior is checked separately. |

No app/backend files were edited. Their approved policy replacement and dates require the separate approval/update process documented in that repository.

## Current official guidance consulted

- [Google Play account deletion](https://support.google.com/googleplay/android-developer/answer/13327111): a prominent working web request route identifying the app, without reinstalling. Email is an allowed request route. Retention needs a legitimate purpose and transparent explanation; the page does not approve indefinite retention.
- [Apple account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/): preserve in-app initiation; ordinary apps should not replace it with a support flow. Review Sign in with Apple token revocation and the limits on retained associated data.
- [AEPD rights](https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos): response deadlines, lawful extensions and accessible exercise routes.
- [Spanish information-services law](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758), particularly operator disclosures, and [Spanish data-protection law](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673): review applicability to this individual operator. No address, company or registration number is fabricated.

## Providers: roles and limits of verification

Providers are described by their actual role rather than all being assigned every dataset. Account-specific contracts/settings remain to verify.

| Provider | Official source and review point |
| --- | --- |
| Fly.io | [Security/compliance](https://fly.io/legal/security-questionnaire/), [subprocessors](https://www.fly.io/legal/sub-processors/): region selection does not establish all-processing EU residency; check logs/support/contract. |
| Neon | [DPA](https://neon.com/pdf/DPA.pdf): database processor/subprocessor/transfer terms; verify project and backup/history/log schedules. |
| Supabase | [Residency/transfers](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq), [DPA](https://supabase.com/legal/customer-resources/data-processing-addendum): regional core Auth/Storage is distinguished from support, telemetry and possible global CDN processing. |
| Brevo | [Storage location](https://help.brevo.com/hc/en-us/articles/360001005510-Data-storage-location): EU database hosting does not replace account/contract/delivery-log verification. |
| Expo / APNs / FCM | [Expo push FAQ](https://docs.expo.dev/push-notifications/faq/): identifiers/content pass along the delivery chain; transient Expo content handling does not prove every provider has no logs. |
| Sentry | [EU-region FAQ](https://www.sentry.help/en/articles/13964378-sentry-s-eu-region-faq): event-region choice does not apply to all account/organisation metadata. Verify region, IP prevention, retention and contract. |
| Zoho | [Privacy policy](https://www.zoho.com/privacy.html): correspondence, technical/account information and transfers require actual account-region/entity/retention checks. No EU region is assumed from the developer’s location. |
| Website host | Cloudflare Pages selected by the developer; global processing, logging criteria and DPA researched in `cloudflare-privacy.md`. Live account settings remain unverified. Squarespace is the registrar. |

## Separate app/backend and operational changes

1. After approval, replace both backend privacy HTML files and real update dates, or redirect the current public endpoint to the matching language page. Preserve public access/language handling and avoid stale cached text.
2. Change `mobile/src/settings/contact.ts` and settings links. Add Support/Terms/Delete Account links where appropriate. If valid terms acceptance requires an explicit flow, implement/version it; no existing acceptance is claimed.
3. Establish an audited operator workflow/tool for verified email deletion requests using the same lifecycle. Self-service `DELETE /me` is not an operator administration endpoint. Do not ask for user codes or bypass photo/auth queues with ad hoc SQL. Track retries and explain outcomes/retained data.
4. Inventory retained player/club/request records and all match statuses, implement approved minimisation/retention and tests, and verify deletion credentials and retry monitoring.
5. Verify Apple token revocation with the actual Supabase integration: deleting a Supabase identity alone does not prove compliance with Apple’s revocation requirements. Preserve the functioning in-app deletion option.
6. Change photo access controls if the intended promise is authenticated-only access; policy text cannot change the public-read bucket.
7. After public deployment/verification, update store support/privacy/deletion links and Data safety/App Privacy disclosures. UGC reporting/moderation requirements may require separate app work; no report/block feature is invented here.

Also review whether the current onboarding adequately implements the confirmed age-14 eligibility policy; the website does not introduce an age-check or parental-consent mechanism into the app.

## Publication state

`site.config.mjs` centralises identity/contact/age, prepared/publication dates and review flags. Draft builds are visibly labelled and noindex. Production builds reject missing approvals or hosting/retention details before touching output. Set an actual approved publication date only at the approved release.

Cloudflare Pages is connected to GitHub and the `draft-preview` deployment has passed live Chromium tests. Cloudflare account-internal settings and legal review remain open; no production release or DNS migration has been performed. See `preview-review.md`.

The owner's current instruction is to keep Privacy, Terms and Delete Account as drafts while the app retention policy and email-deletion fulfilment workflow are resolved. Support is available for the owner's review. No legal approval flags or publication date were changed in response to that instruction.
