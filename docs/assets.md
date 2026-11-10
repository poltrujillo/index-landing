# Supplied asset inventory

The developer supplied the logo assets on 9 November 2026 and six replacement screenshots on 10 November. Only the files required by the page are served; the build has no dependency on the Downloads directory or the mobile app repository.

## Logo

`Index_Logo_Vector(1).svg` and `Index_Logo_Vector.svg` are byte-for-byte identical. The selected SVG also matches the app’s ADR-012 vector master. It is copied unchanged to `public/assets/brand/index-logo.svg` and used in the header/footer through its existing `index-mark` group. An outer SVG viewport fits the mark without altering the original file, geometry or colors.

The square transparent, landscape transparent and opaque 1024px exports are copied unchanged into `public/assets/brand/`. The supplied app icon is also used for the touch icon and production Open Graph image. The 64px favicon is a proportional downsample of that icon.

`Neon Tennis Swoosh Logo.png` is an alternate reference. The page uses the approved vector rather than substituting the alternate raster artwork.

Logo colors remain cream `#F4F2EB`, tennis ball `#DFFF18` and seams `#002921`. They intentionally differ from UI chalk and optic tokens.

## Screenshots

| Supplied file | Language | Use | Notes |
| --- | --- | --- | --- |
| `IMG_7161.png` | Spanish | Hero, Home | Current Index mark, level 7,51, recent changes, confirmation action and Registrar partido. |
| `IMG_7162.png` | Spanish | Geographic rankings | Club, Provincia, Comunidad and España scopes; John Doe second in the club. |
| `IMG_7163.png` | Spanish | Player progress | John Doe profile, level 7,51, progress chart and recent results. |
| `IMG_7164.png` | English | Hero, Home | English equivalent of the Spanish Home, including confirmation and Log match. |
| `IMG_7165.png` | English | Geographic rankings | Club, Province, Region and Spain scopes; John Doe second in the club. |
| `IMG_7166.png` | English | Player progress | English equivalent of the Spanish player profile. |

All six were visually inspected and have dimensions 1179 × 2556. Their originals are preserved under `assets/source/screenshots/`. Served files use the paths `public/assets/screenshots/{es,en}/{home,rankings,player}-{384,768}.webp` and are resized proportionally to 384px and 768px wide, encoded as WebP. There is no cropping, text replacement, recoloring or retouching. Hashes and source filenames are recorded in `docs/assets.json`.

The Spanish page serves the Spanish captures and the English page serves their English equivalents. Alternative text and screenshot-language notes match the new captures. These show an established player, so their alternative text does not claim that a Provisional badge is visible; the separate provisional explanation and badge remain on the page.

The older shared screenshots (`IMG_7139.png`, `IMG_7144.png`, `IMG_7140.png`) are retired from the site; their original copies remain archived under `assets/source/screenshots/`. Their old generated WebP files were removed so the build only ships the six current localized captures. The earlier keyboard/search screenshots were never used. The new images replace the floating gear overlay, overlapping labels and older Home branding seen in the first set.

## Fonts

Barlow Condensed 600 and 700 were copied from the app’s installed `@expo-google-fonts/barlow-condensed` package and self-hosted. The SIL Open Font License is preserved as `public/assets/fonts/OFL.txt`. Paragraphs use the system font. No external font service is called.
