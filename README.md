# GreenGetaway

A sustainable tourist guide to Copenhagen, built with React Native and Expo. Find the greenest attractions on a map, see how each one scores and why, and log the places you visit with a date and a photo.

GreenGetaway started in 2023 as a group project for the ITU course Programming Mobile Applications. In 2026 Jonathan Kjær audited it and redesigned it, and built a browser version so the 2023 and 2026 apps can be compared side by side.

**Try it:** https://methblaze.github.io/greengetaway/

| Page | What it is |
| --- | --- |
| [`/`](https://methblaze.github.io/greengetaway/) | Showcase page with the compare toggle |
| [`/compare.html`](https://methblaze.github.io/greengetaway/compare.html) | One phone frame with a 2023 and 2026 toggle, made to be embedded |
| [`/app/`](https://methblaze.github.io/greengetaway/app/) | The 2026 redesign |
| [`/2023/`](https://methblaze.github.io/greengetaway/2023/) | The 2023 app, frozen as it was built |

In the browser, sign-in is a demo: any email and password work, and nothing is stored.

## What changed in 2026

- **Eco score bands with a legend.** 80 to 100 is low impact, 40 to 79 medium, below 40 high. The band is always shown as colour, number and label, and a "How eco score works" sheet explains that every score is an approximation.
- **Map pins show the score**, and tapping one opens a detail sheet with directions and "Log a visit here".
- **Home** shows the greenest places and the score legend instead of a paragraph of copy.
- **Ranking** lists all 13 places, not only the nine green ones, with one tap target per row.
- **Log a visit** saves one record per visit: an attraction chosen from the list, a date and an optional photo. In 2023 each entry overwrote the last.
- **Your visits** shows a summary and the visit history, with Log out at the bottom.
- **Contrast and type.** Every text and colour pair passes WCAG 2.2, from design tokens in `src/theme/tokens.js`, with DM Sans throughout.

The full case, with the audit numbers, is in [`case/greengetaway-case.md`](case/greengetaway-case.md), and the checks run before release are in [`case/verification.md`](case/verification.md).

## How the code is organised

- `src/data/attractions.js` is the one list of the 13 attractions, their scores, bands and the eco score copy. Every screen reads from it.
- `src/theme/tokens.js` holds every colour, spacing step, radius and type style.
- `src/screens/` has the five tabs and sign-in. `src/components/` has the shared pieces, such as the bottom sheet, score badge and form fields.
- `src/services/visits/` holds the visits, and `src/services/toast/` the app-wide confirmation message.
- Files ending in `.web.js` are used only in the browser build. For example, `Map.web.js` draws the map with Leaflet, because react-native-maps has no browser version, and `authentication.context.web.js` replaces Firebase sign-in with the demo login.

## Run the app on a phone

Use Node 22.

```bash
npm install --legacy-peer-deps
```

```bash
npx expo start
```

Native sign-in needs a Firebase project. Put its keys in a `.env` file, with the variable names from `firebaseConfig.js`. The `.env` file is ignored by git and must never be committed.

To work on the browser version with live reload:

```bash
npx expo start --web
```

## Rebuild the web site

```bash
bash scripts/build-web.sh https://github.com/methblaze/greengetaway
```

This exports the app and writes it to `docs/app/`, and copies `web-showcase/index.html` and `web-showcase/compare.html` to `docs/`. It never writes to `docs/2023/`: `scripts/postexport.js` checks that folder before and after, and stops the build if it changed.

Before publishing, check that no Firebase key slipped into the site and that the 2023 baseline still matches the `v2023-web` tag:

```bash
grep -r "AIza" docs/
```

```bash
node scripts/patch-2023-tiles.js --verify
```

The first command should print nothing. The second should report every file identical to the tag except the 2023 bundle, which differs only by its map tiles. CARTO started requiring an API key in 2026, which left the 2023 map blank, so its two tile layers were swapped for keyless ones and nothing else.

GitHub Pages serves the `docs/` folder on `main`. `docs/.nojekyll` must stay, because GitHub Pages hides folders that start with an underscore without it.

## Credits

Map data © OpenStreetMap contributors. Satellite imagery and labels © Esri. Attraction photos belong to their original sources.
