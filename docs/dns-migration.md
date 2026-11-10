# Connect the domain while preserving Zoho mail

No DNS changes have been made. Draft testing uses the Pages preview URL, so it requires no custom-domain or mail changes. Domain registration stays at Squarespace; mail stays at Zoho.

## Known owner-supplied records

The supplied `zmail._domainkey` TXT value is stored exactly in `ops/known-mail-dns.json` under its full name `zmail._domainkey.indextennis.com`. It is a public DKIM verification key, not a private signing key. Subsequent owner screenshots supply the three EU MX targets/priorities, SPF and Zoho verification TXT. All six records are protected. The inventory remains explicitly incomplete and is not a zone to import.

| Type / name | Supplied value | Priority / TTL |
| --- | --- | --- |
| MX / apex | `mx.zoho.eu` | 10 / 4 hours |
| MX / apex | `mx2.zoho.eu` | 20 / 4 hours |
| MX / apex | `mx3.zoho.eu` | 50 / 4 hours |
| TXT / apex | `v=spf1 include:zohomail.eu ~all` | 4 hours |
| TXT / apex | `zoho-verification=zb79027011.zmverify.zoho.eu` | 4 hours |
| TXT / `zmail._domainkey` | Full owner-supplied key in the JSON inventory | 4 hours |

The screenshots also show four Squarespace apex A records (`198.185.159.144`, `198.185.159.145`, `198.49.23.144`, `198.49.23.145`), `www` pointing to `ext-sq.squarespace.com`, and `_domainconnect` pointing to `_domainconnect.domains.squarespace.com`. The apex HTTPS record is truncated in the image; its complete value is not invented. Review/remove or replace that website record during cutover so old Squarespace IP hints do not remain. `_domainconnect` is outside the website-record allowance and remains protected in a complete baseline. No DMARC record is visible; that is not proof of absence from live DNS.

Never substitute the generic Zoho `.com` examples for an existing `.eu` or other account-region configuration. Preserve the actual account’s MX targets/priorities, SPF value, all DKIM selectors, DMARC, Zoho verification TXT/CNAME records, mail/autodiscover/SRV records and any other current records. Do not add a second SPF policy or enable Cloudflare Email Routing for this Zoho domain.

## Before changing authoritative DNS

1. Export the **complete current zone** from its actual DNS provider, including records still being verified. Save the original export and current nameserver/DNSSEC information privately for rollback. Public DNS queries cannot enumerate every verification record or selector, so a few lookups are not a complete backup.
2. Confirm Zoho domain verification, MX, SPF and DKIM status in the actual Admin Console. The provided selector is `zmail`; account values, not examples, are authoritative.
3. For the desired apex `indextennis.com`, [Pages requires the zone in the Cloudflare account and Cloudflare nameservers](https://developers.cloudflare.com/pages/configuration/custom-domains/). Create/import the zone **before** changing delegation, and reconcile every record against the full export. Cloudflare’s automatic scan is not proof that all mail/verification records were imported.
4. Only the intended website A/AAAA/CNAME/HTTPS records at the apex and `www` may change for Pages. Keep mail and verification hostnames **DNS-only**, preserving their targets and MX priorities. Preserve unrelated subdomains and CAA records; review any certificate restriction separately rather than silently deleting it.
5. Review DNSSEC/DS at the registrar with Cloudflare’s migration instructions before switching nameservers. A stale DS/delegation can break the whole zone. Preserve rollback details; nameserver propagation means rollback is not instantaneous.

## Read-only record comparison

Normalise the reviewed full inventories into JSON objects with `inventoryComplete: true` and a `records` array. Each record needs its fully qualified `name`, `type`, `content`, and MX `priority` where applicable; include Cloudflare `proxied` status. Cloudflare API `result` arrays are accepted inside such a reviewed inventory, but fetch **all pages** before declaring it complete. Keep native exports too; the tool is not a BIND/CSV parser.

```sh
node scripts/compare-dns.mjs /private/path/before.json /private/path/cloudflare-import.json
```

The comparison refuses incomplete inventories or changed/missing owner-supplied mail records. It checks all protected record values and MX priorities, detects additions/duplicates such as a second SPF, and rejects proxied non-web records. Only apex/`www` A/AAAA/CNAME/HTTPS changes and provider-controlled apex NS/SOA are excluded. It does **not** change DNS, prove inventory completeness, compare TTLs, verify DNSSEC or test email delivery. Preserve/review TTLs and remaining record metadata separately.

The sandbox blocked public DNS socket access, so no live baseline was captured. Do not treat the fictional records in unit tests as a proposed real zone.

## Connect only the approved production site

After legal approval, a successful `npm run build:production` and a verified Pages production release, add `indextennis.com` through **Pages → Custom domains**. Use only the real project’s returned Pages target. Reconcile the full zone, verify its responses at the new authoritative servers, then change nameservers at Squarespace using the confirmed Cloudflare assignment. Do not attach the apex to the draft branch.

After propagation, recheck authoritative/public MX, SPF, `zmail._domainkey`, all other DKIM selectors, DMARC, verification records and DNSSEC. Verify Zoho’s status and real sending/receiving/authentication using the operator’s mail client. Check site TLS and all support/legal routes. If anything differs, stop and restore the recorded values; do not “fix” mail by replacing it with Cloudflare’s mail service.

## Official references

- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare email DNS troubleshooting](https://developers.cloudflare.com/dns/troubleshooting/email-issues/)
- [Cloudflare DNS-only use cases](https://developers.cloudflare.com/dns/proxy-status/use-cases/)
- [Zoho’s Cloudflare DNS instructions](https://www.zoho.com/mail/help/adminconsole/cloudflare.html)
