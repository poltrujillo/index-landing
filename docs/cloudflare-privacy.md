# Cloudflare hosting, logs and transfers

Reviewed on 11 November 2026 for the Git-integrated Cloudflare Pages project `index-landing-3yn`. The evidence covers its public preview and the provider’s published product and contract terms. The account plan, enabled datasets, export destinations, localisation settings and agreement accepted for this account require authenticated access.

## Observed public preview behavior

On 10 November 2026, [GitHub Actions run 42903346596](https://github.com/poltrujillo/index-landing/actions/runs/42903346596) checked https://draft-preview.index-landing-3yn.pages.dev, after a successful native Pages deployment for draft commit `0e49d0ebdc718cfb28a0ea13b912e01d1ab5ba1d`.

- All ten canonical pages and the Spanish privacy alias returned HTTPS 200 with trusted certificate verification, Cloudflare edge headers and `X-Robots-Tag: noindex, nofollow`. Nine non-home addresses without a trailing slash redirected to their canonical slash route.
- The configured CSP, `nosniff`, framing restriction, referrer policy and camera/microphone/geolocation restrictions were present. A real missing route returned 404 with these headers. `robots.txt` disallowed crawling and no production sitemap was exposed.
- No known analytics beacon was injected into the inspected HTML. Chromium observed no external HTTP resources, no cookies and no local/session-storage entries while loading all ten pages. These are observations of this run, not proof that Cloudflare collects no technical logs or that account analytics/security controls can never change them.
- Privacy, Terms and Delete Account retained their visible draft notices. No publication date or approval flag changed.

The artifact includes `settings-audit.json` with per-route headers and non-sensitive observations, alongside the existing forty route/viewport browser checks. Account dashboards, Logpush, retention, contracts and regional controls were not accessible to this audit.

The audit was repeated after removing the draft banner from approved Support in both languages. The browser and header checks passed again, including 40 route and screen-size combinations, 11 HTML responses and nine redirects. The browser observed zero cookies, external HTTP resource requests and storage keys. [11 November audit](https://github.com/poltrujillo/index-landing/actions/runs/42919735556)

## Documented facts and limits

| Dataset or feature | Published behavior and retention | Evidence for Index Tennis |
| --- | --- | --- |
| Cloudflare edge and internal service data | Cloudflare describes end-user IP addresses, traffic data, and logs. Its own privacy policy ties retention to purposes and legal obligations. It gives no fixed Pages-wide schedule. [Privacy policy, sections 2 and 11](https://www.cloudflare.com/privacypolicy/) | Trusted HTTPS and Cloudflare edge headers were observed. Internal log fields, regions, and deletion schedules for this deployment are unconfirmed. |
| Zone Security Events | Records security actions and can be sampled. Cloudflare publishes 31 days of dataset history, with query windows of 30 days on Free, Pro and Business and 31 on Enterprise. [Security Events limits](https://developers.cloudflare.com/waf/analytics/security-events/#limits) | These are zone dashboard limits. The tests used a Pages preview hostname. The dataset and plan for the intended custom domain are unconfirmed. |
| Zone Security Analytics | Covers HTTP traffic and uses sampled logs by default. Cloudflare lists 31 days of dataset history on Free, Pro and Business and 90 on Enterprise. The maximum query window is 30 days on Free and Pro and 31 on Business and Enterprise. [Security Analytics limits](https://developers.cloudflare.com/waf/analytics/security-analytics/#limits) | The published history and query limits apply to that dataset. Cloudflare directs customers to query their own zone or account dataset settings for exact limits. [Analytics update](https://developers.cloudflare.com/changelog/post/2026-10-02-30-days-analytics-on-every-plan/) |
| Raw requests and exports | Log Explorer can ingest enabled datasets and stores them in R2. Logpush sends entitled datasets to configured destinations. Fields and dataset availability depend on the account, and exported copies follow the destination’s retention settings. [Log Explorer FAQ](https://developers.cloudflare.com/observability/logs/log-explorer/faq/) · [Logpush](https://developers.cloudflare.com/logs/logpush/) | Enabled datasets, export jobs, destinations, regions, access and deletion schedules are unconfirmed. |
| Browser analytics and security cookies | Pages Web Analytics can inject a beacon. Cloudflare security and access features can set cookies depending on configuration. [Pages Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/) · [Cloudflare cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/) | No analytics beacon, cookies, external resource requests or storage keys were observed in the tested browser. Dashboard settings and behavior under challenges or on the custom domain remain unconfirmed. |

The static repository has no Pages Functions or application request logging. Pages build logs record deployments. The 25-hour retention statement for Cloudflare’s 1.1.1.1 resolver concerns that product.

## Transfer terms

Cloudflare’s published Self-Serve Subscription Agreement incorporates the DPA in §6.1. The published DPA is version 6.4, effective 3 April 2026. It identifies Cloudflare, Inc. as the processor or subprocessor for processing covered by the DPA, describes subprocessors in §4 and sets transfer terms in §6. For EEA data transferred from Index Tennis as controller, Module Two of the EU Standard Contractual Clauses applies to restricted transfers under §6.2. Section 6.4 provides for transfers covered by the Data Privacy Framework and switches to §6.2 if certification lapses. The account’s accepted agreement and version were unavailable. [Self-Serve Agreement](https://www.cloudflare.com/terms/) · [Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) · [Cloudflare subprocessors](https://www.cloudflare.com/gdpr/subprocessors/)

Cloudflare documents separate Regional Services and Customer Metadata Boundary controls for Pages. The enabled controls and actual request and log processing locations for Index Tennis are unconfirmed. [Pages localisation](https://developers.cloudflare.com/data-localization/how-to/pages/)

## What to inspect in the actual account

1. In Pages project settings, record Web Analytics and any access controls. In the custom-domain zone, record Zaraz and any bot, challenge and security features when the zone exists.
2. In the zone’s Analytics and Events views or the GraphQL dataset settings, record the enabled request/security datasets and exact history and query windows. In Log Explorer and Logpush, record enabled datasets, fields and jobs. For each export, record the destination, region, access and deletion schedule.
3. Record the account plan, accepted agreement and DPA version, and any Regional Services or Customer Metadata Boundary settings. If Cloudflare cannot supply an account-specific internal Pages log schedule, document that limit and use its published retention criteria in the policy.

The operator approved publication of wording that describes the documented hosting and transfer terms and these evidence limits. The review flags record that wording approval. Account-specific settings above remain unverified. Zoho and the app providers have their own processing terms and retention schedules.
