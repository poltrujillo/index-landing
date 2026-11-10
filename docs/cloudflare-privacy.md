# Cloudflare hosting, logs and transfers

Verified against published official material on 10 November 2026. Cloudflare Pages is the selected host. Account settings and a live deployment have not been inspected; `websiteHostingAndLogs` remains unapproved.

## Documented facts and limits

- Cloudflare’s [privacy policy](https://www.cloudflare.com/privacypolicy/) describes end-user IP/traffic data, customer logs and network-derived information. Its retention section uses purpose/legal-need criteria; it does not establish one fixed lifetime for every Pages log. Do not copy the 1.1.1.1 resolver’s 25-hour statement into this website policy.
- Its [customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) anticipates restricted international processing and specifies SCC mechanisms and safeguards where applicable. Verify the agreement applying to this account, rather than claiming a separately signed instrument was observed.
- [Pages data localisation](https://developers.cloudflare.com/data-localization/how-to/pages/) requires specific Regional Services / Customer Metadata Boundary setup. Ordinary Pages selection is not evidence of EU-only request processing or log storage. No such controls are assumed enabled here.
- Cloudflare’s [cookie documentation](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/) describes necessary cookies tied to enabled security/access features and cross-border handling. The source adds no cookies, but the edge configuration can change the browser’s actual experience.
- [Web Analytics on Pages](https://developers.cloudflare.com/pages/how-to/web-analytics/) is a dashboard setting that can inject a beacon during deployment. Leave it and Zaraz disabled. No analytics was added in this task.

No Pages Functions or application logging code is added. That does not mean Cloudflare has no access, security, infrastructure or account logs. Provider service logs, customer-visible analytics/log datasets, build logs and any customer-exported logs are distinct; their availability, contents and retention should not be conflated.

## What to inspect in the actual account

1. Record the Pages project/account, plan and applicable contract/DPA/subprocessors. Identify any enabled regional controls without inferring them from the owner’s Spanish address or an EU app database.
2. Confirm Web Analytics and Zaraz are disabled. Inspect the actual HTML/network activity, `Set-Cookie` headers and browser cookie storage. Record enabled bot/challenge/access features and explain any necessary cookies used.
3. Identify available request/security datasets and whether Logpush or other exports are enabled. If exported, identify destination, region, access and deletion schedule. Choose the minimum necessary account logging; do not enable more data collection for this task.
4. Verify any account-specific retention options or contractual commitments with Cloudflare. Until confirmed, the bilingual draft uses Cloudflare’s documented criteria and explicitly avoids a made-up numeric lifetime.
5. Complete the transfer assessment and relevant safeguards, update factual copy as necessary, then approve `websiteHostingAndLogs` and the relevant provider-contract review. Cloudflare’s role does not resolve Zoho or app-provider settings automatically.

The policy/config now name Cloudflare Pages and explain global processing. This replaces the former “unknown website host” gap without falsely marking uninspected account details verified. No production policy/effective date is approved by this documentation.
