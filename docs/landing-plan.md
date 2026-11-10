# Index Tennis landing page: proposal and asset audit

Inspected: 9 November 2026. This is the requested inspection and implementation proposal; no website has been published.

Implementation update: the local static site is now built from this proposal. The initial Spanish screenshots were replaced on 10 November with six new iPhone captures: Spanish and English Home, ranking and player-profile pairs, each served on its matching language page. The developer confirmed use of the existing contact while the policy is prepared. See `docs/assets.md` and `docs/launch-checklist.md` for the current inventory, remaining inputs and verification limits. Support, Privacy, Terms and Delete Account now also have complete bilingual drafts; see `docs/legal-review.md` for confirmations and publication review. The initial audit below is preserved as the record of the proposal stage.

## Direction

Build a small, static, bilingual site in this repository. Spanish lives at `/`, English at `/en/`. Both pages render fully without JavaScript. Follow the app's Night Session design rather than creating a separate marketing identity.

The page should explain one sequence immediately: play a singles match, record its score, have the opponent confirm it, and follow the resulting level. Geographic rankings are views of that same level.

## Sources inspected

All paths below are relative to `/home/poltrujillo/projects/club-utr/`.

| Source | Finding |
| --- | --- |
| `mobile/src/ui/tokens.ts` | Exact colors, Barlow Condensed 600/700, system body font, 4px spacing grid, 3–4px radii, minimum 48px touch targets. |
| `docs/design/ui-rework.md` | Night-match scoreboard character; large condensed numbers; no gradients, shadows, decorative animation or pill-shaped controls; one primary neon control per screen. |
| `docs/adr/012-index-brand.md` | Public name Index Tennis; tagline in both languages; original logo colors preserved; planned domain does not establish ownership or DNS configuration. |
| `mobile/assets/brand/README.md` and supplied artwork | Original SVG master, transparent square and landscape PNG exports, and opaque app icon are present. SVG and square PNG inspected. |
| `docs/adr/009-one-national-level.md` | One level per player; club, province, autonomous community and Spain rankings. Changing club preserves the level. |
| `docs/adr/011-provisional-players-in-all-ladders.md` | Provisional players appear in every ranking, visibly labelled. |
| `docs/specs/01-rating-engine.md` | Level scale 1.00–10.00; provisional with fewer than five rated matches OR uncertainty above the threshold. Five matches do not guarantee settled status. |
| `e2e/out/*.png` | Six real Android captures exist, but are ignored by Git. Home after a match, score entry and rankings visually inspected. These are dated 8 November and precede current branding and ranking changes. |
| `mobile/src/settings/contact.ts` | Existing public contact is `poltrujialb@gmail.com`. |
| `backend/src/main/resources/privacy/es.html` and store-listing documentation | Existing policy still describes ClubRating and levels/visibility by club. The documented policy URL is on staging. Store listing is a draft; no public store links found. |

The landing directory currently contains no application source or package manifest. Its mounted `.git` directory does not currently resolve as a working Git repository. Implementation can proceed locally; source control configuration needs checking before a commit/push workflow is added.

## Proposed page structure and copy

### Navigation

Supplied Index mark with a Barlow Condensed Index Tennis wordmark, links to how it works and FAQs, and a normal ES/EN language link. Keep the header compact and avoid a mobile menu dependency by using a short wrapping navigation.

### 1. Hero

Desktop: short text on the left, one genuine current Home capture on the right. Mobile: text first, then the screenshot. Keep the image upright and readable, without perspective effects or fabricated device chrome.

Spanish:

> TU TENIS. TU NIVEL.
>
> Registra tus partidos individuales, tu rival confirma el resultado y tu nivel se actualiza. Sigue tu evolución y tu puesto, desde tu club hasta toda España.

English:

> YOUR TENNIS. YOUR LEVEL.
>
> Record your singles matches, your opponent confirms the score, and your level updates. Follow your progress and your ranking, from your club to all of Spain.

Primary action before release: `CÓMO FUNCIONA` / `HOW IT WORKS`, linking to the next section. Availability is plain `Próximamente` / `Coming soon` text. Once a real download destination exists, update the primary action to point to the download section.

### 2. How it works

Four numbered steps, separated by fine borders; horizontal on wide screens, stacked on phones. Use condensed 01–04 numbers, short display labels and system-font explanations.

| Step | Spanish | English |
| --- | --- | --- |
| 01 | JUEGA — Juega un partido individual con otro jugador de Index. | PLAY — Play a singles match with another Index player. |
| 02 | REGISTRA — Introduce el resultado en la app. | RECORD — Enter the score in the app. |
| 03 | CONFIRMA — Tu rival revisa y confirma el resultado. | CONFIRM — Your opponent reviews and confirms the score. |
| 04 | SIGUE TU NIVEL — Consulta cómo cambia tu nivel con los partidos confirmados. | FOLLOW YOUR LEVEL — See how your level changes with confirmed matches. |

Show a genuine score-entry capture alongside this explanation. Do not imply that submitting an unconfirmed result changes a level.

### 3. One level, four rankings

Heading: `UN NIVEL. CUATRO RANKINGS.` / `ONE LEVEL. FOUR RANKINGS.`

Explain that the level is the same in the club, province, autonomous community and Spain rankings, and stays with the player when changing club. Show the four scopes as a simple ordered list or bordered rows beside a genuine current rankings capture. These are explanations, not interactive ranking filters.

Do not claim an official federation ranking, affiliation, adoption by clubs or perfect comparability between disconnected groups of players.

### 4. Provisional means still settling

Use the same restrained, clearly readable `PROVISIONAL` badge as the app. Explain the status next to a screenshot where it is visible.

Spanish:

> Al empezar, tu nivel es provisional. Tus partidos ayudan a ajustarlo. Se necesitan al menos cinco partidos que cuenten para tu nivel, y puede seguir siendo provisional si todavía falta información. La etiqueta también aparece en los rankings.

English:

> Your level starts as provisional. Your matches help refine it. It takes at least five rated matches, and it may remain provisional if more information is needed. The label also appears in the rankings.

Do not promise that the label disappears after exactly five matches, or that every repeated match contributes equally.

### 5. Availability

Heading: `PRÓXIMAMENTE` / `COMING SOON`.

Explain that public download links will appear here when available. Do not show store badges, clickable download controls, release dates, a waitlist or email collection without the corresponding real destination or feature.

Once supplied, show actual App Store and Google Play links. Keep unavailable platforms as plain text rather than fake or disabled buttons.

### 6. FAQs

Use native HTML `details`/`summary` for accessible, keyboard-operable disclosure without client JavaScript. Write both languages in full, covering:

1. What does Index do? Singles scores, opponent confirmation and level tracking.
2. When does my level update? After opponent confirmation; entering a score alone is insufficient.
3. Is my level different in each ranking? No; all four scopes use the same level.
4. What does provisional mean? Still settling, at least five rated matches and enough certainty; included and labelled in rankings.
5. Can I play someone from another club? Yes, another player in the app; one level follows the player.
6. Where can I download it? Coming soon until real links are available.

Avoid adding pricing, release timing, doubles support or other unverified promises.

### 7. Footer and contact

Use the original mark, Index Tennis, contact and privacy links, and the language switch. A small contact section can provide a stable support URL for store listings, with the existing public email unless a working replacement is supplied.

Link to an accurate, approved privacy policy in each language. Do not silently copy or rewrite the outdated policy as though it describes the current product.

## Visual implementation

- Use CSS custom properties matching `#0B0D0C`, `#15191A`, `#1D2224`, `#262B2C`, `#F1F3EF`, `#A3AAA5` and `#DCFF4A` exactly.
- Preserve logo cream `#F4F2EB`, ball `#DFFF18` and seams `#002921`. Use the supplied SVG, without a CSS color filter or redrawing its geometry.
- Self-host Barlow Condensed semibold/bold with its OFL license; use system sans-serif for sentences and explanations. Do not depend on third-party font requests.
- Large condensed tagline, step numbers and short headings; body text at least 17px with comfortable line spacing. Body remains sentence case.
- Use 20px mobile gutters and spacing in multiples of 4px. Increase whitespace on desktop; keep content within a readable maximum width.
- Controls have at least 48px touch targets and 3px radii; grouped surfaces use 4px radii. No shadows, gradients, glass, animation or large rounded cards.
- Reserve neon for the primary action, keeping adjacent secondary links neutral. Screenshots retain their actual app colors.
- Do not reproduce a level as an invented marketing statistic. Actual levels in screenshots are demo app content, clearly captioned as such where appropriate.
- Use no stock photography or generated screenshots. Capture demo accounts rather than exposing real players' private information.

## Static implementation plan

Use HTML and CSS with a small Node build script using built-in modules. There is no feature here that requires a backend or client framework. Two language data files and one shared template keep the layout and content easy to maintain without duplicating the design.

Proposed layout:

```text
content/es.json
content/en.json
src/page.mjs
src/styles.css
public/assets/brand/
public/assets/screenshots/es/
public/assets/screenshots/en/
public/assets/fonts/
scripts/build.mjs
scripts/check.mjs
docs/landing-plan.md
docs/launch-checklist.md
package.json
dist/                       # generated static output, ignored
```

1. Copy the original brand files into this repository unchanged and record their provenance. Add licensed local font files. Keep the app repository read-only.
2. Implement the shared semantic template and complete Spanish/English content. Build `/index.html` and `/en/index.html`, local CSS and assets with a single `npm run build` command.
3. Add current, genuine app captures with explicit dimensions, responsive WebP variants and PNG originals where useful. Load the hero capture eagerly and lower-page captures lazily. Keep screenshot text readable on phones.
4. Add localized titles/descriptions, `lang`, canonical and reciprocal `hreflang` links, Open Graph metadata, favicon, sitemap and robots configuration. Set the production origin from one configuration value once the domain is confirmed. Avoid ratings/reviews or unsupported app availability metadata.
5. Add contact and policy destinations only from verified inputs. Keep downloads driven by optional real URLs, so Coming soon is the default state. No analytics, cookies, signup form or tracking integrations in this scope.
6. Validate both generated pages, local links, missing assets and translation parity. Review keyboard focus, skip link, heading order, image alternatives, native FAQ interaction, touch targets and contrast. Check 320px mobile, tablet and desktop layouts and 200% zoom. Confirm both pages remain usable with JavaScript disabled.
7. Run a production build and local preview. Use browser accessibility/performance checks where available; target strong Lighthouse scores without promising an unmeasured score. Check image/font transfer sizes and layout shift.
8. Document build/output configuration for ordinary static hosting. Choose and configure the host and production DNS after the launch inputs below are resolved; no hosting account, domain, email or app configuration changes are required to implement the local site.

Prelaunch previews should be marked `noindex`; production robots/canonicals must be checked when the actual domain and publication are configured.

## Inputs to resolve before publication

| Item | Current evidence | Required resolution |
| --- | --- | --- |
| Current screenshots | Real E2E captures exist but show English, old onboarding/club rankings and an ADMIN label; Home lacks current Index branding. | Capture current Spanish Home with provisional status, score entry, confirmation and the geographic ranking controls. Prefer equivalent English captures; otherwise explicitly identify screenshot language. Use demonstration accounts. |
| App Store / Google Play | No public listing URLs found in inspected sources. | Supply actual URLs when released. Until then, publish honest Coming soon copy without store badges or promised dates. This does not block a prelaunch landing page. |
| Public contact | `poltrujialb@gmail.com` is the current published app contact. | It can be reused without inventing an address. If a branded mailbox is desired, provide and verify it before replacing the existing contact. |
| Privacy | Existing approved text still says ClubRating, per-club levels and club-only profile visibility. Documented URL is staging. | Provide an accurate, approved Spanish/English policy and stable public destination covering the current product. Preserve the real controller identity; policy changes are a separate content decision. |
| Domain / hosting | ADR-012 calls `indextennis.com` a branding choice, not proof of registration or DNS. | Verify domain control, select the static host, and configure HTTPS, canonical host and redirects before production publication. No domain availability claim has been made. |

Current screenshots and the privacy destination are the material content gaps. The structure, bilingual copy, local build and visual implementation can proceed while those are being resolved.
