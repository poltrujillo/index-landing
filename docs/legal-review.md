# Published support and policy wording

The operator approved Support in both languages and confirmed that `support@indextennis.com` sends and receives email. On 11 November 2026 the operator instructed this repository to use the completed deletion report, settle the wording and publish Privacy, Terms and Delete Account. `site.config.mjs` records 11 November 2026 as their effective and last-updated date.

## Identity and scope

Index Tennis is the public brand. Pol Trujillo Albert is the individual operator/controller in Spain. There is no registered company or supplied service postal address. The copy uses those confirmed details. Operator/address disclosure requirements remain a legal follow-up for the individual operator, without a fabricated company or address.

The app is free, supports amateur singles matches and has a minimum age of 14. No parental-consent or terms-acceptance feature is asserted. The website remains static. Account-deletion mail links start a request handled by support.

## Completed backend evidence

The evidence is `club-utr/docs/ops/deletion-rehearsal-2026-11-11.md`, checked against the current source. The final fix is commit `94805ec`, with successful staging deployment and 812 Java tests, 510 mobile tests, API drift, image smoke and readiness checks. [Staging CI](https://github.com/poltrujillo/clubrating/actions/runs/42989232278)

| Behavior | Verified scope |
| --- | --- |
| In-app deletion | Deployed DELETE endpoint removes identity and refuses the old API session. |
| Support deletion | Restricted operator command verifies a deletion-specific challenge, binds the original identity and executes the same account lifecycle. Incorrect challenges were refused. Support mailbox delivery was separately confirmed by the operator. |
| Profile and notifications | Profile, search and ranking removal, unnecessary club-context cleanup, removal of registered notification tokens and notifications, expiry of pending matches. |
| Photos | Live tests removed assigned photos, unassigned uploads and an object 80 folders deep. Folder cleanup repeats during the stale-token refusal period and must finish before marker retirement. |
| Opponent results | Remaining participant keeps the same level, rated-match count and status. Retained shared former-player results are participant-only. |
| Auth and sessions | Auth identity deletion and refusal of old access and refresh tokens passed. Staging access-token lifetime was one hour. |
| Checkpoints and recovery | Automated post-erasure PostgreSQL dump/restore preserves saved states, pair context and continued replay while keeping erased rows absent. Recovery from older snapshots requires reapplying deletion records. |

These results replace the former website checklist items describing missing deletion tooling, untested orphan cleanup and a pending basic staging rehearsal.

## Retention wording chosen for publication

The configured automatic retention sweep is **disabled**. The 30-day private-result, 45-day confirmed-result and 90-day closed-case settings remain implementation candidates. The public copy describes the current behavior and does not promise those deadlines.

The chosen basis for limited retained results/history is legitimate interests under GDPR Article 6(1)(f), preserving other participants’ confirmed results and reproducible levels. The purpose is stated alongside erasure, restriction and objection rights. Names, sign-in links and unnecessary club context are cleared. Retained shared results become participant-only. Match context can still identify a former player.

Current retention criteria are necessity for those stated purposes and individual assessment of erasure, restriction and objection requests. Automatic time-based expiry is explicitly described as disabled. A fixed final cutoff requires activation of the reviewed backend process and matching recovery builds. This is a material operating limitation for the operator to address, not an assertion that unlimited retention is required by law.

The preliminary necessity assessment is that removing raw confirmed inputs without the checkpoint process changes opponents’ levels. The checkpoint implementation offers a less intrusive route to later erasure. It is present and tested but the timed sweep is not enabled. The operator should activate a justified finite schedule and maintain a balancing assessment as the next retention release. This website release does not change the backend configuration.

The one-calendar-month wording applies to **responding to rights requests from receipt**. The former promise to normally complete a verified deletion within one month was removed. The two-day Auth refusal marker can remain longer when retries or final photo cleanup are pending.

## Provider wording and evidence limits

Providers are described by their roles. Fly.io processes API traffic, Neon holds application records, Supabase handles Auth and photo storage, Brevo delivers login emails, Expo/APNs/FCM deliver optional notifications, Sentry handles scrubbed diagnostics, Zoho handles correspondence, and Cloudflare Pages serves the website.

The current app environment uses documented EU regions. Global support, account information, security logs, subprocessors and delivery chains can involve other locations. Cloudflare’s published self-service terms incorporate its DPA, including DPF transfers where applicable and SCCs for restricted transfers. Account-specific agreements, exported logs, regional controls and provider backup/log/mail schedules are still unverified. The public wording uses the documented criteria and makes no blanket numeric provider-retention or EU-only claim. Details are in [Cloudflare review](cloudflare-privacy.md).

Publication review flags record operator approval of this wording and its stated limits. They do not certify account settings, signed provider agreements or app-store compliance.

## Separate app and operational follow-ups

- Verify Sign in with Apple grant revocation with the actual integration.
- Resolve the Fly trial shutdowns reported during testing so production cleanup can run reliably. Retrying workers require the backend to be available.
- Rehearse recovery from older snapshots with deletion records reapplied before serving traffic.
- Set and activate justified retention schedules, including cases, correspondence, provider logs and backups. Verify production token lifetime fits the refusal period.
- Replace the old ClubRating/privacy HTML at the backend privacy endpoint or redirect to the published matching language. Mobile `settings/contact.ts` still uses `poltrujialb@gmail.com`, and mobile settings still use the API privacy URL. Update them together with support, privacy, terms and deletion links after the final domain works.
- Review actual terms incorporation, minimum-age enforcement and required operator disclosures. Publishing these pages creates no recorded in-app acceptance.
- Update store support/privacy/deletion URLs and Data safety/App Privacy declarations with the final verified domain.

## Official references

[Google Play deletion guidance](https://support.google.com/googleplay/android-developer/answer/13327111) · [Apple account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/) · [AEPD rights guidance](https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos) · [Spanish information-services law](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758) · [Spanish data-protection law](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673)

## Safety update, 11 November 2026

The operator approved updated Terms (§2 in-app acceptance, §6 in-app reporting and blocking, 24-hour review, name reset, photo removal and suspension, no tolerance for objectionable content or abusive users) and Privacy additions (report/block/moderation data, its legitimate-interest basis, visibility, Brevo report alerts and retention) in both languages. They describe the app's spec 05 behaviour as built in the club-utr repository.
